/**
 * This command is an extended version of `hourMc`.
 * Command could send up to `256` hours if transport support.
 * To get this uplink need to set param `mqtt data send config` in `parameter types`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as hourMcEx from 'jooby-codec/analog/commands/uplink/hourMcEx.js';
 *
 * // 1 channel at 2023.12.23 12:00:00 GMT
 * const bytes = [0x2f, 0x97, 0x0c, 0x07, 0x01, 0x83, 0x01, 0x0a, 0x0a, 0x0a, 0x0a, 0x0a, 0x0a, 0x0a];
 *
 * // decoded payload
 * const parameters = hourMcEx.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     startTime2000: 756648000,
 *     hour: 12,
 *     hours: 7,
 *     channelList: [
 *         {value: 131, diff: [10, 10, 10, 10, 10, 10, 10], index: 1}
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/uplink/HourMCEx.md)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import CommandBinaryBuffer, {IChannelValuesWithHourDiffExtended, ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';
import {hourMcEx as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 3;

const COMMAND_BODY_MAX_SIZE = 255;

export const examples: command.TCommandExamples = {
    '1 channel at 2023.12.23 12:00:00 GMT': {
        id,
        name,
        headerSize,
        parameters: {
            startTime2000: 756648000,
            hour: 12,
            hours: 7,
            channelList: [
                {value: 131, diff: [10, 10, 10, 10, 10, 10, 10], index: 1}
            ]
        },
        bytes: [
            0x1f, 0x31, 0x0e,
            0x2f, 0x97, 0x0c, 0x07, 0x01, 0x83, 0x01, 0x0a, 0x0a, 0x0a, 0x0a, 0x0a, 0x0a, 0x0a
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IChannelValuesWithHourDiffExtended => {
    if ( bytes.length > COMMAND_BODY_MAX_SIZE ) {
        throw new Error(`Wrong buffer size: ${bytes.length}.`);
    }

    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    return buffer.getChannelsValuesWithHourDiffExtended();
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IChannelValuesWithHourDiffExtended ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);

    buffer.setChannelsValuesWithHourDiffExtended(parameters);

    return command.toBytes(id, buffer.getBytesToOffset());
};
