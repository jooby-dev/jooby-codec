/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import Command from './Command.js';
import UnknownCommand from './UnknownCommand.js';
import * as downlinkCommands from './commands/downlink/index.js';
import * as uplinkCommands from './commands/uplink/index.js';

import {IHexFormatOptions} from '../config.js';
import getBytesFromHex from '../utils/getBytesFromHex.js';
import getBytesFromBase64 from '../utils/getBytesFromBase64.js';
import getHexFromBytes from '../utils/getHexFromBytes.js';
import getBase64FromBytes from '../utils/getBase64FromBytes.js';


interface IMessageCommand {
    /** command source binary data */
    data: {
        header: Uint8Array,
        body: Uint8Array
    },
    /** specific command instance */
    command: Command
}

interface IMessage {
    commands: Array<IMessageCommand>,
    isValid: boolean
}


const HEADER_SIZE = 1;

// convert export namespace to dictionary {commandId: commandConstructor}
const downlinkCommandsById = Object.fromEntries(
    Object.values(downlinkCommands).map(item => [item.id, item])
);

const uplinkCommandsById = Object.fromEntries(
    Object.values(uplinkCommands).map(item => [item.id, item])
);

const getCommand = ( id: number, data: Uint8Array ): Command => {
    // id is unique for all commands
    const command = downlinkCommandsById[id] || uplinkCommandsById[id];

    if ( command ) {
        return command.fromBytes(data) as Command;
    }

    // missing command implementation
    return new UnknownCommand({id, data});
};

export const fromBytes = ( commandsData: Uint8Array ) => {
    const commands: Array<IMessageCommand> = [];
    const result: IMessage = {
        commands,
        isValid: true
    };

    let position = 0;

    do {
        const headerData = commandsData.slice(position, position + HEADER_SIZE);
        const bodyData = commandsData.slice(position + HEADER_SIZE);

        position += HEADER_SIZE;

        const command = getCommand(headerData[0], bodyData);

        commands.push({
            data: {header: headerData, body: bodyData},
            command
        });

        if ( command instanceof UnknownCommand ) {
            // unknown command, unknown size, can't detect next commands - end analysis
            break;
        } else if ( typeof command.size === 'number' ) {
            position += command.size;
        } else {
            result.isValid = false;
            // unknown size, can't detect next commands - end analysis
            break;
        }
    } while ( position < commandsData.length );

    return result;
};

export const fromHex = ( data: string ) => (
    fromBytes(getBytesFromHex(data))
);

export const fromBase64 = ( data: string ) => (
    fromBytes(getBytesFromBase64(data))
);

export const toBytes = ( commands: Array<Command> ): Uint8Array => {
    const arrays = commands.map(command => command.toBytes());
    const totalLength = arrays.reduce((accumulator, item) => (accumulator + item.length), 0);

    const result = new Uint8Array(totalLength);
    let offset = 0;

    // fill result with all chunks
    arrays.forEach(item => {
        result.set(item, offset);
        offset += item.length;
    });

    return result;
};

export const toHex = ( commands: Array<Command>, options: IHexFormatOptions = {} ): string => getHexFromBytes(toBytes(commands), options);

export const toBase64 = ( commands: Array<Command> ): string => getBase64FromBytes(toBytes(commands));
