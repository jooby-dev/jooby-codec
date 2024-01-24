/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import Command from './Command.js';
import UnknownCommand from './UnknownCommand.js';
import {requestById, responseById} from './constants/commandRelations.js';
import {accessLevels} from '../mtx/constants/index.js';

import getBytesFromHex from '../utils/getBytesFromHex.js';
import getBytesFromBase64 from '../utils/getBytesFromBase64.js';
import getHexFromBytes from '../utils/getHexFromBytes.js';
import getBase64FromBytes from '../utils/getBase64FromBytes.js';
import mergeUint8Arrays from '../utils/mergeUint8Arrays.js';
import {IHexFormatOptions} from '../config.js';
import * as directionTypes from '../constants/directions.js';
import {AUTO, DOWNLINK, UPLINK} from '../constants/directions.js';


interface IMessageCommand {
    /** command source binary data */
    data: {
        header: Uint8Array,
        body: Uint8Array
    },
    /** specific command instance */
    command: Command
}

// message structure
export interface IMessage {
    messageId: number,
    accessLevel: number,
    commands?: Array<IMessageCommand>
}

export interface IMessageConfig {
    /** It is highly recommended to use a specific direction. */
    direction?: number,
}

const MESSAGE_HEADER_SIZE = 3;
const COMMAND_HEADER_SIZE = 2;
const PROTOCOL_VERSION = 0x10;


// all allowed types
const directionTypeIds: Set<number> = new Set<number>(Object.values(directionTypes));

const getCommand = ( id: number, data: Uint8Array, direction = AUTO ): Command => {
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
        return UnknownCommand.fromBytes(id, data);
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
 *     commandsData
 *
 * @param bytes - payload to process
 * @param config - additional parameters
 * @returns IMessage
 */
export const fromBytes = ( bytes: Uint8Array, config?: IMessageConfig ): IMessage => {
    const direction = config?.direction ?? AUTO;
    const commands: Array<IMessageCommand> = [];
    const [messageId, accessLevel1, accessLevel2] = bytes;
    const result: IMessage = {
        messageId,
        accessLevel: (accessLevel1 & accessLevels.MASK)
    };

    if ( result.accessLevel !== accessLevels.UNENCRYPTED ) {
        return result;
    }

    if ( accessLevel1 !== accessLevel2 ) {
        throw new Error('wrong access level');
    }

    result.commands = commands;

    const messageBody = bytes.slice(MESSAGE_HEADER_SIZE);
    let position = 0;

    do {
        const commandId = messageBody[position];
        const commandBodySize = messageBody[position + 1];
        const commandSize = COMMAND_HEADER_SIZE + commandBodySize;
        const commandBody = messageBody.slice(
            position + COMMAND_HEADER_SIZE,
            position + commandSize
        );

        // invalid command or padding zeros after decryption
        if ( !commandId ) {
            break;
        }

        const command = getCommand(commandId, commandBody, direction);

        commands.push({
            data: {header: new Uint8Array([commandId]), body: commandBody},
            command
        });

        position += commandSize;
    } while ( position <= messageBody.length );

    return result;
};

export const fromHex = ( data: string, config?: IMessageConfig ) => (
    fromBytes(getBytesFromHex(data), config)
);

export const fromBase64 = ( data: string, config?: IMessageConfig ) => (
    fromBytes(getBytesFromBase64(data), config)
);

export const toBytes = ( messageId: number, accessLevel: number, commands: Array<Command> ): Uint8Array => {
    const commandBytes = commands.map(command => command.toBytes());
    const maskedAccessLevel = accessLevel | PROTOCOL_VERSION;
    const header = new Uint8Array([messageId, maskedAccessLevel, maskedAccessLevel]);

    return mergeUint8Arrays(header, ...commandBytes);
};

export const toHex = ( messageId: number, accessLevel: number, commands: Array<Command>, hexOptions: IHexFormatOptions = {} ): string => (
    getHexFromBytes(toBytes(messageId, accessLevel, commands), hexOptions)
);

export const toBase64 = ( messageId: number, accessLevel: number, commands: Array<Command> ): string => (
    getBase64FromBytes(toBytes(messageId, accessLevel, commands))
);
