/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import Command from './Command.js';
import UnknownCommand from './UnknownCommand.js';
import * as downlinkCommands from './commands/downlink/index.js';
import * as uplinkCommands from './commands/uplink/index.js';

import * as directionTypes from './constants/directions.js';
import {AUTO, DOWNLINK, UPLINK} from './constants/directions.js';

import * as header from './header.js';
import {IHexFormatOptions} from '../config.js';
import calculateLrc from '../utils/calculateLrc.js';
import getBytesFromHex from '../utils/getBytesFromHex.js';
import getBytesFromBase64 from '../utils/getBytesFromBase64.js';
import getHexFromBytes from '../utils/getHexFromBytes.js';
import getBase64FromBytes from '../utils/getBase64FromBytes.js';
import mergeUint8Arrays from '../utils/mergeUint8Arrays.js';


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

interface IMessageConfig {
    /** It is highly recommended to use a specific direction. */
    direction?: number,
    hardwareType?: number
}


const HEADER_MAX_SIZE = 3;

// all allowed types
const directionTypeIds: Set<number> = new Set<number>(Object.values(directionTypes));

// convert export namespace to dictionary {commandId: commandConstructor}
export const downlinkCommandsById = Object.fromEntries(
    Object.values(downlinkCommands).map(item => [item.id, item])
);
export const uplinkCommandsById = Object.fromEntries(
    Object.values(uplinkCommands).map(item => [item.id, item])
);


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

    // the specific direction
    if ( direction === DOWNLINK || direction === UPLINK ) {
        const command = direction === UPLINK ? uplinkCommand : downlinkCommand;

        return command.fromBytes(data, {hardwareType}) as Command;
    }

    // direction autodetect
    try {
        // uplink should be more often
        return uplinkCommand.fromBytes(data, {hardwareType}) as Command;
    } catch {
        return downlinkCommand.fromBytes(data) as Command;
    }
};

export const fromBytes = ( data: Uint8Array, config?: IMessageConfig ) => {
    const direction = config?.direction ?? AUTO;
    const hardwareType = config?.hardwareType;
    const commands: Array<IMessageCommand> = [];
    const result: IMessage = {
        commands,
        lrc: {expected: undefined, actual: 0},
        isValid: false
    };
    let processedBytes = 0;
    let expectedLrc;
    let actualLrc;

    // process the data except the last byte
    do {
        const headerInfo = header.fromBytes(data.slice(processedBytes, processedBytes + HEADER_MAX_SIZE));
        const headerData = data.slice(processedBytes, processedBytes + headerInfo.headerSize);
        const bodyData = data.slice(processedBytes + headerInfo.headerSize, processedBytes + headerInfo.headerSize + headerInfo.commandSize);
        let command: Command;

        // shift
        processedBytes = processedBytes + headerInfo.headerSize + headerInfo.commandSize;

        try {
            command = getCommand(headerInfo.commandId, bodyData, direction, hardwareType);
        } catch ( error ) {
            command = UnknownCommand.fromBytes(bodyData, headerInfo.commandId);
        }

        commands.push({
            data: {header: headerData, body: bodyData},
            command
        });
    } while ( processedBytes < data.length - 1 );

    // check the last byte left unprocessed
    if ( data.length - processedBytes === 1 ) {
        // LRC is present
        expectedLrc = data.at(-1);
        actualLrc = calculateLrc(data.slice(0, -1));
    } else {
        // LRC is absent
        actualLrc = calculateLrc(data);
    }

    result.lrc.actual = actualLrc;
    result.lrc.expected = expectedLrc;
    result.isValid = expectedLrc === actualLrc;

    return result;
};

export const fromHex = ( data: string, config?: IMessageConfig ) => (
    fromBytes(getBytesFromHex(data), config)
);

export const fromBase64 = ( data: string ) => (
    fromBytes(getBytesFromBase64(data))
);

export const toBytes = ( commands: Array<Command> ): Uint8Array => {
    const commandBytes = commands.map(command => command.toBytes());
    const body = mergeUint8Arrays(...commandBytes);

    return mergeUint8Arrays(body, new Uint8Array([calculateLrc(body)]));
};

export const toHex = ( commands: Array<Command>, options: IHexFormatOptions = {} ): string => getHexFromBytes(toBytes(commands), options);

export const toBase64 = ( commands: Array<Command> ): string => getBase64FromBytes(toBytes(commands));
