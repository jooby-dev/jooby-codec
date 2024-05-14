/**
 * Command to receive hour pulse counter's values from device archive.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getArchiveHoursMcEx from 'jooby-codec/analog/commands/uplink/getArchiveHoursMcEx.js';
 *
 * // response to getArchiveHoursMcEx downlink command
 * const bytes = [0x2f, 0x97, 0x0c, 0x02, 0x0f, 0x83, 0x01, 0x0a, 0x08, 0x0a, 0x08, 0x0a, 0x0c, 0x0a];
 *
 * // decoded payload
 * const parameters = getArchiveHoursMcEx.fromBytes(commandBody);
 *
 * console.log(parameters);
 * // output:
 * {
 *     startTime2000: 756648000,
 *     hour: 16,
 *     hours: 1,
 *     channelList: [
 *         {value: 131, diff: [10], index: 1},
 *         {value: 8, diff: [10], index: 2},
 *         {value: 8, diff: [10], index: 3},
 *         {value: 12, diff: [10], index: 4}
 *     ]
 * }
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetArchiveHoursMCEx.md#response)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, IChannelValuesWithHourDiffExtended} from '../../utils/CommandBinaryBuffer.js';


export const id: types.TCommandId = 0x301f;
export const name: types.TCommandName = 'getArchiveHoursMcEx';
export const headerSize = 3;

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
            hour: 12,
            hours: 1,
            channelList: [
                {value: 131, diff: [10], index: 1},
                {value: 8, diff: [10], index: 2},
                {value: 8, diff: [10], index: 3},
                {value: 12, diff: [10], index: 4}
            ]
        },
        bytes: [
            0x1f, 0x30, 0x0e,
            0x2f, 0x97, 0x0c, 0x01, 0x0f, 0x83, 0x01, 0x0a, 0x08, 0x0a, 0x08, 0x0a, 0x0c, 0x0a
        ]
    },
    'empty result at 2023.11.19 00:00:00 GMT': {
        id,
        name,
        headerSize,
        parameters: {
            startTime2000: 752889600,
            hour: 0,
            hours: 0,
            channelList: []
        },
        bytes: [
            0x1f, 0x30, 0x05,
            0x2f, 0x6a, 0x00, 0x00, 0x00
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): IChannelValuesWithHourDiffExtended => {
    if ( data.length > COMMAND_BODY_MAX_SIZE ) {
        throw new Error(`Wrong buffer size: ${data.length}.`);
    }

    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(data);

    return buffer.getChannelsValuesWithHourDiffExtended();
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns encoded bytes
 */
export const toBytes = ( parameters: IChannelValuesWithHourDiffExtended ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);

    buffer.setChannelsValuesWithHourDiffExtended(parameters);

    return command.toBytes(id, buffer.getBytesToOffset());
};
