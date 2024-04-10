/**
 * This command retrieves absolute current measurements from multiple channels.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as exAbsCurrentMc from 'jooby-codec/analog/commands/uplink/exAbsCurrentMc.js';
 *
 * // absolute current value from channel 3
 * const bytes = [0x04, 0x82, 0xd6, 0x02'];
 *
 * // decoded payload
 * const parameters = exAbsCurrentMc.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     channelList: [
 *         {
 *             pulseCoefficient: 100,
 *             index: 3,
 *             value: 342
 *         }
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetExAbsCurrentMC.md#response)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import CommandBinaryBuffer, {IChannelAbsoluteValue, ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';


interface IExAbsCurrentMcParameters {
    channelList: Array<IChannelAbsoluteValue>;
}


export const id: types.TCommandId = 0x0f1f;
export const name: types.TCommandName = 'exAbsCurrentMc';
export const headerSize = 3;

// channelList 3 byte (max channelList: 14)
// 3 + (14 * (1 byte pulse coefficient + 5 bytes of day values))
const COMMAND_BODY_MAX_SIZE = 87;

export const examples: command.TCommandExamples = {
    'absolute current value from channel 3': {
        id,
        name,
        headerSize,
        parameters: {
            channelList: [
                {pulseCoefficient: 100, value: 342, index: 3}
            ]
        },
        bytes: [
            0x1f, 0x0f, 0x04,
            0x04, 0x83, 0xd6, 0x02
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param data - binary data containing command parameters
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): IExAbsCurrentMcParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(data);

    return {channelList: buffer.getChannelsWithAbsoluteValues()};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IExAbsCurrentMcParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);

    buffer.setChannelsWithAbsoluteValues(parameters.channelList);

    return command.toBytes(id, buffer.getBytesToOffset());
};
