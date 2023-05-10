/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import Command from './Command.js';
import UnknownCommand from './UnknownCommand.js';
import * as downlinkCommands from './commands/downlink/index.js';
import * as uplinkCommands from './commands/uplink/index.js';

import * as directionTypes from './constants/directions.js';
import {AUTO, DOWNLINK, UPLINK} from './constants/directions.js';

import * as header from './header.js';
import getBytesFromHex from '../utils/getBytesFromHex.js';
import getHexFromBytes, {IHexFormatOptions} from '../utils/getHexFromBytes.js';


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
    lrc: {
        expected: number | undefined,
        actual: number
    },
    isValid: boolean
}


const HEADER_MAX_SIZE = 3;

// all allowed types
const directionTypeIds: Set<number> = new Set<number>(Object.values(directionTypes));

// convert export namespace to dictionary {commandId: commandConstructor}
const downlinkCommandsById = Object.fromEntries(
    Object.values(downlinkCommands).map(item => [item.id, item])
);
const uplinkCommandsById = Object.fromEntries(
    Object.values(uplinkCommands).map(item => [item.id, item])
);


/**
 * Calculate LRC
 *
 * @param data - byte array
 *
 * @return LRC
 */
export const calculateLrc = ( data: Uint8Array, initialLrc = 0x55 ) => {
    let lrc = initialLrc;

    data.forEach(item => {
        lrc ^= item;
    });

    return lrc;
};

const getCommand = ( id: number, data: Uint8Array, direction = AUTO, hardwareType?: number ): Command => {
    if ( !directionTypeIds.has(direction) ) {
        throw new Error('wrong direction type');
    }

    const downlinkCommand = downlinkCommandsById[id];
    const uplinkCommand = uplinkCommandsById[id];

    // check command availability
    if (
        (!downlinkCommand && !uplinkCommand)
        || (direction === DOWNLINK && !downlinkCommand)
        || (direction === UPLINK && !uplinkCommand)
    ) {
        // missing command implementation
        return new UnknownCommand({id, data});
    }

    // ths specific direction
    if ( direction === DOWNLINK || direction === UPLINK ) {
        const command = direction === UPLINK ? uplinkCommand : downlinkCommand;

        return command.fromBytes(data, hardwareType) as Command;
    }

    // direction autodetect
    try {
        // uplink should be more often
        return uplinkCommand.fromBytes(data, hardwareType) as Command;
    } catch {
        return downlinkCommand.fromBytes(data) as Command;
    }
};

export const fromBytes = ( data: Uint8Array, direction = AUTO, hardwareType?: number ) => {
    const commandsData = data.slice(0, -1);
    const commands: Array<IMessageCommand> = [];
    const result: IMessage = {
        commands,
        lrc: {expected: undefined, actual: 0},
        isValid: false
    };
    let expectedLrc = data.at(-1);
    let actualLrc = calculateLrc(commandsData);
    let position = 0;

    do {
        const headerInfo = header.fromBytes(commandsData.slice(position, position + HEADER_MAX_SIZE));
        const headerData = commandsData.slice(position, position + headerInfo.headerSize);
        const bodyData = commandsData.slice(position + headerInfo.headerSize, position + headerInfo.headerSize + headerInfo.commandSize);
        let command: Command;

        // shift
        position = position + headerInfo.headerSize + headerInfo.commandSize;

        try {
            command = getCommand(headerInfo.commandId, bodyData, direction, hardwareType);
        } catch ( error ) {
            // the last command in the message
            if ( position >= commandsData.length ) {
                // LRC may be missing so try to add one
                command = getCommand(headerInfo.commandId, new Uint8Array([...bodyData, ...data.slice(-1)]), direction, hardwareType);
                actualLrc = calculateLrc(data);
                expectedLrc = undefined;
            } else {
                throw error;
            }
        }

        commands.push({
            data: {header: headerData, body: bodyData},
            command
        });
    } while ( position < commandsData.length );

    result.lrc.actual = actualLrc;
    result.lrc.expected = expectedLrc;
    result.isValid = expectedLrc === actualLrc;

    return result;
};

export const fromHex = ( data: string, direction = AUTO, hardwareType?: number ) => (
    fromBytes(getBytesFromHex(data), direction, hardwareType)
);

export const toBytes = ( commands: Array<Command> ): Uint8Array => {
    const arrays = commands.map(command => command.toBytes());
    const totalLength = arrays.reduce((accumulator, item) => (accumulator + item.length), 0);

    // 1 additional byte at the end is for LRC
    const result = new Uint8Array(totalLength + 1);
    let offset = 0;

    // fill result with all chunks
    arrays.forEach(item => {
        result.set(item, offset);
        offset += item.length;
    });

    // set last byte to LRC
    result[result.length - 1] = calculateLrc(result.slice(0, result.length - 1));

    return result;
};

export const toHex = ( commands: Array<Command>, options: IHexFormatOptions = {} ): string => getHexFromBytes(toBytes(commands), options);
