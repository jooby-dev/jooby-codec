/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/default-param-last */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */

import {TBytes} from '../../types.js';
import {IMessage, IInvalidMessage} from './types.js';
import {TCommand} from '../utils/command.js';
import {aes, calculateCrcBytes} from '../utils/crypto.js';
import {arrayStuff, arrayUnstuff} from '../../utils/frame.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, frameHeaderSize, IFrameHeader, defaultFrameHeader} from '../utils/CommandBinaryBuffer.js';
import * as accessLevels from '../constants/accessLevels.js';
import {START_BYTE, STOP_BYTE} from '../../constants/frameAttributes.js';
import calculateLrc from '../../utils/calculateLrc.js';


// to serialize IMessage to bytes
export interface IToBytesOptions {
    messageId: number,
    accessLevel?: number,
    aesKey?: TBytes
}

// to build IFrame from frame bytes
export interface IFromFrameOptions {
    aesKey?: TBytes
}

// to build IMessage from bytes
export interface IFromBytesOptions {
    withMtxLora?: boolean,
    aesKey?: TBytes
}

// frame structure
export interface IFrame extends IMessage, IFrameHeader {
    crc: number
}

// bitmask to extract/apply access level
const ACCESS_LEVEL_MASK = 0x03;

const MESSAGE_HEADER_SIZE = 2;
const BLOCK_SIZE = 16;

// should be places at the end of all command bodies
const COMMANDS_END_MARK = [0];

const COMMAND_HEADER_SIZE = 2;


export const getFromBytes = ( fromBytesMap, nameMap ) => ( bytes: TBytes = [], config: IFromBytesOptions ): IMessage | IInvalidMessage => {
    const aesKey = config?.aesKey;
    const commands: Array<TCommand> = [];
    const [messageId, maskedAccessLevel] = bytes;
    const accessLevel = maskedAccessLevel & ACCESS_LEVEL_MASK;
    const message: IMessage = {
        messageId,
        accessLevel,
        commands,
        bytes,
        lrc: {expected: undefined, actual: 0}
    };
    let messageBody = bytes.slice(MESSAGE_HEADER_SIZE);
    let error;

    if ( aesKey && accessLevel !== accessLevels.UNENCRYPTED ) {
        messageBody = [...aes.decrypt(aesKey, messageBody)];
    }

    // take from the end
    const expectedLrc = messageBody[messageBody.length - 1];

    // remove lrc from message
    messageBody = messageBody.slice(0, -1);
    const actualLrc = calculateLrc(messageBody);

    if ( accessLevel !== accessLevels.UNENCRYPTED || expectedLrc !== 0 ) {
        if ( expectedLrc !== actualLrc ) {
            error = 'Mismatch LRC.';
        }
    }

    const accessLevel2 = messageBody[0] & ACCESS_LEVEL_MASK;
    const commandsData = messageBody.slice(1);

    if ( accessLevel !== accessLevel2 ) {
        error = 'Mismatch access levels.';
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
        const command: TCommand = {
            id: commandId,
            name: nameMap[commandId],
            headerSize: COMMAND_HEADER_SIZE,
            bytes: commandsData.slice(position, position + commandSize)
        };

        // invalid command or padding zeros after decryption
        if ( !commandId ) {
            break;
        }

        try {
            command.parameters = fromBytesMap[commandId](commandBody, config);
            commands.push(command);
        } catch ( exception ) {
            commands.push({
                command,
                error: exception.message
            });
        }

        position += commandSize;
    } while ( position <= commandsData.length );

    message.lrc.actual = actualLrc;
    message.lrc.expected = expectedLrc;

    if ( error ) {
        return {
            message,
            error
        };
    }

    return message;
};


export const getToBytes = toBytesMap => ( commands: Array<TCommand>, {messageId, accessLevel = accessLevels.READ_ONLY, aesKey}: IToBytesOptions ): TBytes => {
    const commandBytes = commands.map(command => {
        // valid command
        if ( 'parameters' in command ) {
            return toBytesMap[command.id](command.parameters);
        }

        // invalid command
        if ( 'command' in command ) {
            return command.command.bytes;
        }

        // everything else
        throw new Error('wrong command format');
    });

    const maskedAccessLevel = accessLevel | 0x10;

    // always unencrypted header
    const header = [messageId, maskedAccessLevel];
    // accessLevel + all commands (can be encrypted) + 0 as commands end mark
    let body = [].concat(maskedAccessLevel, ...commandBytes, COMMANDS_END_MARK);

    if ( accessLevel !== accessLevels.UNENCRYPTED ) {
        const padding = (body.length + 1) % BLOCK_SIZE;

        if ( padding ) {
            body = body.concat(new Array(BLOCK_SIZE - padding).fill(0));
        }
    }

    body = body.concat(calculateLrc(body));

    if ( aesKey && accessLevel !== accessLevels.UNENCRYPTED ) {
        body = [...aes.encrypt(aesKey, body)];
    }

    return header.concat(body);
};


export const getToMessage = toBytesMap => ( commands: Array<TCommand> ) => {
    // TODO: add implementation
};

export const getFromFrame = fromBytes => ( bytes: TBytes, {aesKey}: IFromFrameOptions ): IFrame => {
    let unstuffed = arrayUnstuff(bytes);

    if ( bytes[0] === START_BYTE && bytes[bytes.length - 1] === STOP_BYTE ) {
        unstuffed = unstuffed.slice(1, unstuffed.length - 1);
    }

    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(unstuffed);
    const frameHeader = buffer.getFrameHeader();

    const crc: ICommandBinaryBuffer = new CommandBinaryBuffer(unstuffed.slice(-2));
    const messageData = unstuffed.slice(5, -2);
    const message = fromBytes(messageData, {aesKey}) as IFrame;

    return {
        ...frameHeader,
        ...message,
        crc: crc.getUint16(false)
    };
};

export const getToFrame = ( message: TBytes, frameHeader: IFrameHeader = defaultFrameHeader ): TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(frameHeaderSize);
    buffer.setFrameHeader(frameHeader);

    const unstuffed = buffer.data.concat(message);
    const crc = calculateCrcBytes(unstuffed);
    const stuffed = arrayStuff(unstuffed.concat(crc));

    // add special marks to both ends
    stuffed.unshift(START_BYTE);
    stuffed.push(STOP_BYTE);

    return stuffed;
};
