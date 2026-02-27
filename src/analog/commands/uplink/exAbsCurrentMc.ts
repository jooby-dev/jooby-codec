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
 * const bytes = [0x04, 0x83, 0xd6, 0x02];
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
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import {
    IChannelAbsoluteValue,
    getChannelsWithAbsoluteValues,
    setChannelsWithAbsoluteValues
} from '../../utils/binary/buffer.js';
import {exAbsCurrentMc as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


interface IExAbsCurrentMcResponseParameters {
    channelList: Array<IChannelAbsoluteValue>;
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
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
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IExAbsCurrentMcResponseParameters => {
    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return {channelList: getChannelsWithAbsoluteValues(buffer)};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IExAbsCurrentMcResponseParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(COMMAND_BODY_MAX_SIZE, false);

    setChannelsWithAbsoluteValues(buffer, parameters.channelList);

    return command.toBytes(id, buffer.getBytesToOffset());
};
