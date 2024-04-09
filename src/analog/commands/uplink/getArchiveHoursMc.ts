/**
 * Command for receiving archive hours data from MC.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getArchiveHoursMc from 'jooby-codec/analog/commands/uplink/getArchiveHoursMc.js';
 *
 * const bytes = [0x2f, 0x97, 0x2c, 0x0f, 0x83, 0x01, 0x0a, 0x08, 0x0a, 0x08, 0x0a, 0x0c, 0x0a];
 *
 * // decoded payload
 * const parameters = getArchiveHoursMc.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     startTime2000: 756648000,
 *     hours: 2,
 *     channelList: [
 *         {index: 1, value: 131, diff: [10]},
 *         {index: 2, value: 8, diff: [10]},
 *         {index: 3, value: 8, diff: [10]},
 *         {index: 4, value: 12, diff: [10]}
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetArchiveHoursMC.md#response)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import {TTime2000} from '../../utils/time.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';


interface IChannelHours {
    index: number;
    value: number;
    diff: Array<number>;
}

interface IGetArchiveHoursMCResponseParameters {
    channelList: Array<IChannelHours>;
    startTime2000: TTime2000;
    hours: number;
}


export const id: types.TCommandId = 0x1a;
export const name: types.TCommandName = 'getArchiveHoursMCResponse';
export const headerSize = 2;

// date 2 bytes, hour 1 byte, channelList - 1 byte, so max channelList = 4
// max hours diff - 7 (3 bit value)
// 4 + (4 channelList * 5 bytes of hour values) + (4 * 5 bytes of diff * 7 max hours diff)
const COMMAND_BODY_MAX_SIZE = 164;

export const examples: command.TCommandExamples = {
    '4 channels at 2023.12.23 12:00:00 GMT': {
        id,
        name,
        headerSize,
        parameters: {
            startTime2000: 756648000,
            hours: 2,
            channelList: [
                {value: 131, diff: [10], index: 1},
                {value: 8, diff: [10], index: 2},
                {value: 8, diff: [10], index: 3},
                {value: 12, diff: [10], index: 4}
            ]
        },
        bytes: [
            0x1a, 0x0d,
            0x2f, 0x97, 0x2c, 0x0f, 0x83, 0x01, 0x0a, 0x08, 0x0a, 0x08, 0x0a, 0x0c, 0x0a
        ]
    },
    'empty result at 2023.11.19 00:00:00 GMT': {
        id,
        name,
        headerSize,
        parameters: {
            startTime2000: 752889600,
            hours: 0,
            channelList: []
        },
        bytes: [
            0x1a, 0x04,
            0x2f, 0x6a, 0x00, 0x00
        ]
    }
};

/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): IGetArchiveHoursMCResponseParameters => {
    if ( data.length > COMMAND_BODY_MAX_SIZE ) {
        throw new Error(`Wrong buffer size: ${data.length}.`);
    }

    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(data);

    return buffer.getChannelsValuesWithHourDiff();
};

/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns encoded bytes
 */
export const toBytes = ( parameters: IGetArchiveHoursMCResponseParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
    const {hours, startTime2000, channelList} = parameters;

    buffer.setChannelsValuesWithHourDiff(hours, startTime2000, channelList);

    return command.toBytes(id, buffer.getBytesToOffset());
};
