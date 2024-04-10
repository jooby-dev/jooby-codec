/**
 * Command for retrieving hourly consumption (absolute values) of device channels from the archive.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getArchiveHoursMc from 'jooby-codec/analog/commands/uplink/getArchiveHoursMc.js';
 *
 * const bytes = [0x2f, 0x97, 0x2c, 0x0f, 0x83, 0x01, 0x0a, 0x08, 0x0a, 0x08, 0x0a, 0x0c, 0x0a];
 *
 * // decoded payload
 * const command = getArchiveHoursMc.fromBytes(commandBody);
 *
 * console.log(command.parameters);
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
import CommandBinaryBuffer, {ICommandBinaryBuffer, IChannelHours} from '../../utils/CommandBinaryBuffer.js';


interface IGetArchiveHoursMCResponseParameters {
    channelList: Array<IChannelHours>;
    startTime2000: TTime2000;
    hours: number;
}


export const id: types.TCommandId = 0x1a;
export const name: types.TCommandName = 'getArchiveHoursMc';
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
                {index: 1, value: 131, diff: [10]},
                {index: 2, value: 8, diff: [10]},
                {index: 3, value: 8, diff: [10]},
                {index: 4, value: 12, diff: [10]}
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

    buffer.setChannelsValuesWithHourDiff(parameters.hours, parameters.startTime2000, parameters.channelList);

    return command.toBytes(id, buffer.getBytesToOffset());
};
