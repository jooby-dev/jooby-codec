import Command from '../Command.js';
import * as downlinkCommands from '../commands/downlink/index.js';
import * as uplinkCommands from '../commands/uplink/index.js';

import * as header from './header.js';
import getBytesFromHex from './getBytesFromHex.js';
import getHexFromBytes, {IHexFormatOptions} from './getHexFromBytes.js';


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
        expected: number,
        actual: number
    },
    isValid: boolean
}


export const TYPE_AUTO = 0;
export const TYPE_DOWNLINK = 1;
export const TYPE_UPLINK = 2;

const HEADER_MAX_SIZE = 3;

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
const calculateLrc = ( data: Uint8Array, initialLrc = 0x55 ) => {
    let lrc = initialLrc;

    data.forEach(item => {
        lrc ^= item;
    });

    return lrc;
};

const getCommand = ( id: number, data: Uint8Array, direction = TYPE_AUTO ): Command => {
    // given direction
    if ( direction === TYPE_DOWNLINK || direction === TYPE_UPLINK ) {
        const commandsById = direction === TYPE_DOWNLINK ? downlinkCommandsById : uplinkCommandsById;
        const command = commandsById[id];

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if ( !command ) {
            throw new Error(`Unsupported command with id: ${id}.`);
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return command.fromBytes(data);
    }

    // auto direction
    // try downlink
    try {
        const command = downlinkCommandsById[id];
        // console.log('command downlink:', command);
        // console.log('downlinkCommandsById:', downlinkCommandsById);
        // console.log('id:', id);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return command.fromBytes(data);
    } catch {
        // try uplink
        const command = uplinkCommandsById[id];
        //console.log('command uplink:', command);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return command.fromBytes(data);
    }
};

export const fromBytes = ( data: Uint8Array, direction = TYPE_AUTO ) => {
    const commandsData = data.slice(0, -1);
    const expectedLrc = data.at(-1) ?? 0;
    const actualLrc = calculateLrc(commandsData);
    const commands: Array<IMessageCommand> = [];
    const result: IMessage = {
        commands,
        lrc: {expected: 0, actual: 0},
        isValid: false
    };
    let position = 0;

    do {
        const headerInfo = header.fromBytes(commandsData.slice(position, position + HEADER_MAX_SIZE));
        const headerData = commandsData.slice(position, position + headerInfo.headerSize);
        const bodyData = commandsData.slice(position + headerInfo.headerSize, position + headerInfo.headerSize + headerInfo.commandSize);

        commands.push({
            data: {header: headerData, body: bodyData},
            command: getCommand(headerInfo.commandId, bodyData, direction)
        });

        // shift
        position = position + headerInfo.headerSize + headerInfo.commandSize;
    } while ( position < commandsData.length );

    result.lrc.actual = actualLrc;
    result.lrc.expected = expectedLrc;
    result.isValid = expectedLrc === actualLrc;

    return result;
};

export const fromHex = ( data: string, direction = TYPE_AUTO ) => fromBytes(getBytesFromHex(data), direction);

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
