/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import Command from './Command.js';
import UnknownCommand from './UnknownCommand.js';
import {requestById as mtxLoraRequestById, responseById as mtxLoraResponseById} from './constants/commandRelations.js';
import {requestById as mtxRequestById, responseById as mtxResponseById} from '../mtx/constants/commandRelations.js';
import {accessLevels} from '../mtx/constants/index.js';

import getBytesFromHex from '../utils/getBytesFromHex.js';
import getBytesFromBase64 from '../utils/getBytesFromBase64.js';
import getHexFromBytes from '../utils/getHexFromBytes.js';
import getBase64FromBytes from '../utils/getBase64FromBytes.js';
import mergeUint8Arrays from '../utils/mergeUint8Arrays.js';
import {aes} from '../mtx/utils/crypto.js';
import {IHexFormatOptions} from '../config.js';
import * as directionTypes from '../constants/directions.js';
import {AUTO, DOWNLINK, UPLINK} from '../constants/directions.js';
import {UNENCRYPTED} from '../mtx/constants/accessLevels.js';


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
    bytes: Uint8Array,
    commands?: Array<IMessageCommand>
}

export interface IMessageConfig {
    /** It is highly recommended to use a specific direction. */
    direction?: number,
    accessLevel?: number,
    aesKey?: Uint8Array
}

const COMMAND_HEADER_SIZE = 2;
const PROTOCOL_VERSION = 0x10;
const BLOCK_SIZE = 16;


// all allowed types
const directionTypeIds: Set<number> = new Set<number>(Object.values(directionTypes));

const getCommand = ( id: number, data: Uint8Array, direction = AUTO ): Command => {
    if ( !directionTypeIds.has(direction) ) {
        throw new Error('wrong direction type');
    }

    const downlinkCommand = mtxLoraRequestById.get(id) || mtxRequestById.get(id);
    const uplinkCommand = mtxLoraResponseById.get(id) || mtxResponseById.get(id);

    // check command availability
    if (
        (!downlinkCommand && !uplinkCommand)
        || (direction === DOWNLINK && !downlinkCommand)
        || (direction === UPLINK && !uplinkCommand)
    ) {
        return UnknownCommand.fromBytes(id, data);
    }

    try {
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
    } catch {
        // something wrong with command
        return UnknownCommand.fromBytes(id, data);
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
    const aesKey = config?.aesKey;
    const commands: Array<IMessageCommand> = [];
    const [messageId, accessLevel1] = bytes;
    let messageBody = bytes.slice(2);
    const result: IMessage = {
        messageId,
        bytes,
        accessLevel: (accessLevel1 & accessLevels.MASK)
    };

    if ( result.accessLevel !== accessLevels.UNENCRYPTED ) {
        if ( aesKey ) {
            messageBody = aes.decrypt(aesKey, messageBody);
        } else {
            return result;
        }
    }

    const [accessLevel2] = messageBody;
    messageBody = messageBody.slice(1);

    if ( accessLevel1 !== accessLevel2 ) {
        throw new Error('wrong access level');
    }

    result.commands = commands;

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

export const toBytes = ( messageId: number, commands: Array<Command>, config?: IMessageConfig ): Uint8Array => {
    const accessLevel = config?.accessLevel || UNENCRYPTED;
    const aesKey = config?.aesKey;
    const commandBytes = commands.map(command => command.toBytes());
    const maskedAccessLevel = accessLevel | PROTOCOL_VERSION;
    const header = new Uint8Array([messageId, maskedAccessLevel]);

    let body = mergeUint8Arrays(new Uint8Array([maskedAccessLevel]), ...commandBytes);

    if ( accessLevel !== accessLevels.UNENCRYPTED ) {
        const padding = (body.length + 1) % BLOCK_SIZE;

        if ( padding ) {
            body = mergeUint8Arrays(body, new Uint8Array(BLOCK_SIZE - padding).fill(0));
        }

        if ( aesKey ) {
            body = aes.encrypt(aesKey, body);
        }
    }

    return mergeUint8Arrays(header, body);
};

export const toHex = ( messageId: number, commands: Array<Command>, config?: IMessageConfig, hexOptions: IHexFormatOptions = {} ): string => (
    getHexFromBytes(toBytes(messageId, commands, config), hexOptions)
);

export const toBase64 = ( messageId: number, commands: Array<Command>, config?: IMessageConfig ): string => (
    getBase64FromBytes(toBytes(messageId, commands, config))
);
