/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import Command from './Command.js';
import UnknownCommand from './UnknownCommand.js';
import {requestById, responseById} from './constants/commandRelations.js';
import {IHexFormatOptions} from '../config.js';
import getBytesFromHex from '../utils/getBytesFromHex.js';
import getBytesFromBase64 from '../utils/getBytesFromBase64.js';
import getHexFromBytes from '../utils/getHexFromBytes.js';
import getBase64FromBytes from '../utils/getBase64FromBytes.js';
import mergeUint8Arrays from '../utils/mergeUint8Arrays.js';


interface IMessageCommand {
    bytes: Uint8Array,
    command: Command
}

export interface IMessage {
    commands: Array<IMessageCommand>,
    bytes: Uint8Array
}


const getCommand = ( id: number, data: Uint8Array ): Command => {
    // id is unique for all commands
    const command = requestById.get(id) || responseById.get(id);

    try {
        if ( command ) {
            return command.fromBytes(data) as Command;
        }
    } catch {
        // something wrong with command
    }

    // missing command implementation
    return new UnknownCommand({id, data});
};

export const getCommands = ( message: IMessage ): Array<Command> => message.commands.map(({command}) => command);

export const fromBytes = ( bytes: Uint8Array ) => {
    const commands: Array<IMessageCommand> = [];
    const result: IMessage = {
        commands,
        bytes
    };

    let position = 0;

    do {
        const commandId = bytes[position];
        const commandSize = bytes[position + 1];
        const commandBytes = bytes.slice(position, position + 2 + commandSize);

        position += 2;

        const command = getCommand(commandId, bytes.slice(position, position + commandSize));

        commands.push({
            bytes: commandBytes,
            command
        });

        position += commandSize;
    } while ( position < bytes.length );

    return result;
};

export const fromHex = ( data: string ) => (
    fromBytes(getBytesFromHex(data))
);

export const fromBase64 = ( data: string ) => (
    fromBytes(getBytesFromBase64(data))
);

export const toBytes = ( commands: Array<Command> ): Uint8Array => {
    const commandBytes = commands.map(command => command.toBytes());

    return mergeUint8Arrays(...commandBytes);
};

export const toHex = ( commands: Array<Command>, options: IHexFormatOptions = {} ): string => getHexFromBytes(toBytes(commands), options);

export const toBase64 = ( commands: Array<Command> ): string => getBase64FromBytes(toBytes(commands));
