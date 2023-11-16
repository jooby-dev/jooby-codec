/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import Command from './Command.js';
import UnknownCommand from './UnknownCommand.js';
import {requestById, responseById} from './constants/commandRelations.js';

import {IHexFormatOptions} from '../config.js';
import calculateLrc from '../utils/calculateLrc.js';
import getBytesFromHex from '../utils/getBytesFromHex.js';
import getBytesFromBase64 from '../utils/getBytesFromBase64.js';
import getHexFromBytes from '../utils/getHexFromBytes.js';
import getBase64FromBytes from '../utils/getBase64FromBytes.js';
import mergeUint8Arrays from '../utils/mergeUint8Arrays.js';
import {aes, arrayStuff, arrayUnstuff, calculateCrcBytes} from './utils/crypto.js';

import {READ_ONLY, MASK} from './constants/accessLevels.js';
import * as accessLevels from './constants/accessLevels.js';
import * as directionTypes from '../constants/directions.js';
import {AUTO, DOWNLINK, UPLINK} from '../constants/directions.js';
import {START_BYTE, STOP_BYTE} from '../constants/frameAttributes.js';
import * as frameTypes from './constants/frameTypes.js';


interface IMessageCommand {
    /** command source binary data */
    data: {
        header: Uint8Array,
        body: Uint8Array
    },
    /** specific command instance */
    command: Command
}

// to build IMessage from bytes
interface IFromBytesOptions {
    direction?: number,
    aesKey?: Uint8Array
}

// to serialize IMessage to bytes
interface IToBytesOptions {
    messageId: number,
    accessLevel?: number,
    aesKey?: Uint8Array
}

// to build IFrame from frame bytes
interface IFromFrameOptions {
    aesKey?: Uint8Array
}

// to serialize IFrame to bytes
interface IToFrameOptions {
    frameType: number,
    source: Uint8Array,
    destination: Uint8Array
}

// message structure
interface IMessage extends IToBytesOptions {
    commands: Array<IMessageCommand>,
    lrc: number
}

// frame structure
interface IFrame extends IMessage, IToFrameOptions {
    crc: Uint8Array
}


const MESSAGE_HEADER_SIZE = 2;
const COMMAND_HEADER_SIZE = 2;
const BLOCK_SIZE = 16;

// should be places at the end of all command bodies
const COMMANDS_END_MARK = new Uint8Array([0]);

// all allowed types
const directionTypeIds: Set<number> = new Set<number>(Object.values(directionTypes));

const getCommand = ( id: number, size: number, data: Uint8Array, direction = AUTO ): Command => {
    if ( !directionTypeIds.has(direction) ) {
        throw new Error('wrong direction type');
    }

    const downlinkCommand = requestById.get(id);
    const uplinkCommand = responseById.get(id);

    // check command availability
    if (
        (!downlinkCommand && !uplinkCommand)
        || (direction === DOWNLINK && !downlinkCommand)
        || (direction === UPLINK && !uplinkCommand)
    ) {
        // missing command implementation
        return new UnknownCommand({id, size, data});
    }

    // the specific direction
    if ( direction === DOWNLINK || direction === UPLINK ) {
        const command = direction === UPLINK ? uplinkCommand : downlinkCommand;

        return command!.fromBytes(data) as Command;
    }

    // direction autodetect
    try {
        // uplink should be more often
        return uplinkCommand!.fromBytes(data) as Command;
    } catch {
        return downlinkCommand!.fromBytes(data) as Command;
    }
};


/**
 * Build commands from binary payload.
 * Message format:
 *     messageId
 *     accessLevel
 *     accessLevel
 *     commandsData
 *
 * @param message - payload to process
 * @param config - additional parameters
 * @returns IMessage
 */
export const fromBytes = ( message: Uint8Array, config?: IFromBytesOptions ): IMessage => {
    const direction = config?.direction ?? AUTO;
    const aesKey = config?.aesKey;
    const commands: Array<IMessageCommand> = [];
    const [messageId, maskedAccessLevel] = message;
    const accessLevel = maskedAccessLevel & MASK;
    const result: IMessage = {
        messageId,
        accessLevel,
        commands,
        lrc: 0
    };
    let messageBody = message.slice(MESSAGE_HEADER_SIZE);

    if ( aesKey && accessLevel !== accessLevels.UNENCRYPTED ) {
        messageBody = aes.decrypt(aesKey, messageBody);
    }

    // take from the end
    const lrc = messageBody[messageBody.length - 1];

    // remove lrc from message
    messageBody = messageBody.slice(0, -1);
    result.lrc = calculateLrc(messageBody);

    if ( lrc !== result.lrc ) {
        throw new Error('Mismatch LRC.');
    }

    const accessLevel2 = messageBody[0] & MASK;
    const commandsData = messageBody.slice(1);

    if ( accessLevel !== accessLevel2 ) {
        throw new Error('Mismatch access levels.');
    }

    let position = 0;

    do {
        const commandId = commandsData[position];
        const commandBodySize = commandsData[position + 1];
        const commandSize = COMMAND_HEADER_SIZE + commandBodySize;
        const commandBody = commandsData.slice(
            position + COMMAND_HEADER_SIZE,
            position + commandSize
        );

        // invalid command or padding zeros after decryption
        if ( !commandId ) {
            break;
        }

        const command = getCommand(commandId, commandBodySize, commandBody, direction);

        commands.push({
            data: {header: new Uint8Array([commandId]), body: commandBody},
            command
        });

        position += commandSize;
    } while ( position <= commandsData.length );

    return result;
};

export const fromFrame = ( frame: Uint8Array, {aesKey}: IFromFrameOptions ): IFrame => {
    let unstuffed = new Uint8Array(arrayUnstuff([...frame]));

    if ( frame[0] === START_BYTE && frame[frame.length - 1] === STOP_BYTE ) {
        unstuffed = new Uint8Array(unstuffed.slice(1, unstuffed.length - 1));
    }

    const frameType = unstuffed[0];
    const destination = unstuffed.slice(1, 3);
    const source = unstuffed.slice(3, 5);
    const messageData = new Uint8Array(unstuffed.slice(5, -2));
    const crc = new Uint8Array(unstuffed.slice(-2));
    const message = fromBytes(messageData, {direction: frameType === frameTypes.DATA_REQUEST ? DOWNLINK : UPLINK, aesKey}) as IFrame;

    message.crc = crc;
    message.source = source;
    message.destination = destination;
    message.frameType = frameType;

    return message;
};

export const fromHex = ( data: string, config?: IFromBytesOptions ) => (
    fromBytes(getBytesFromHex(data), config)
);

export const fromBase64 = ( data: string ) => (
    fromBytes(getBytesFromBase64(data))
);

export const toBytes = ( commands: Array<Command>, {messageId, accessLevel = READ_ONLY, aesKey}: IToBytesOptions ): Uint8Array => {
    const commandBytes = commands.map(command => command.toBytes());
    const maskedAccessLevel = accessLevel | 0x10;

    // always unencrypted header
    const header = new Uint8Array([messageId, maskedAccessLevel]);
    // accessLevel + all commands (can be encrypted) + 0 as commands end mark
    let body = mergeUint8Arrays(new Uint8Array([maskedAccessLevel]), mergeUint8Arrays(...commandBytes), COMMANDS_END_MARK);

    if ( accessLevel !== accessLevels.UNENCRYPTED ) {
        const padding = (body.length + 1) % BLOCK_SIZE;

        if ( padding ) {
            body = mergeUint8Arrays(body, new Uint8Array(BLOCK_SIZE - padding).fill(0));
        }
    }

    body = mergeUint8Arrays(body, new Uint8Array([calculateLrc(body)]));

    if ( aesKey && accessLevel !== accessLevels.UNENCRYPTED ) {
        body = aes.encrypt(aesKey, body);
    }

    return mergeUint8Arrays(header, body);
};

export const toFrame = ( message: Uint8Array, {frameType, source, destination}: IToFrameOptions ): Uint8Array => {
    const unstuffed = new Uint8Array([frameType, ...destination, ...source, ...message]);
    const crc = calculateCrcBytes(unstuffed);
    const stuffed = arrayStuff([...unstuffed, ...crc]);

    // add special marks to both ends
    stuffed.unshift(START_BYTE);
    stuffed.push(STOP_BYTE);

    return new Uint8Array(stuffed);
};


// eslint-disable-next-line arrow-body-style
export const toHex = ( commands: Array<Command>, messageOptions: IToBytesOptions, hexOptions: IHexFormatOptions = {} ): string => {
    return getHexFromBytes(toBytes(commands, messageOptions), hexOptions);
};

export const toBase64 = ( commands: Array<Command>, messageOptions: IToBytesOptions ): string => getBase64FromBytes(toBytes(commands, messageOptions));
