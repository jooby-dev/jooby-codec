/**
 * Information about the current role of channels on the device.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getChannelsMap from 'jooby-codec/analog/commands/uplink/getChannelsMap.js';
 *
 * const bytes = [0x1f, 0x33, 0x03, 0x02, 0x00, 0x01];
 *
 * // decoded payload
 * const parameters = getChannelsMap.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * [1, 2, 3, 0]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetChannelsMap.md#response)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';


export const id: types.TCommandId = 0x331f;
export const name: types.TCommandName = 'getChannelsMap';
export const headerSize = 3;


interface IChannelsMap {
    channelsMap: Array<types.TUint8>
}


export const examples: command.TCommandExamples = {
    'channels map: [POWER_CHANNEL (2), BINARY_SENSOR (3), TEMPERATURE_SENSOR (4), IDLE (0)]': {
        id,
        name,
        headerSize,
        parameters: {
            channelsMap: [2, 3, 4, 0]
        },
        bytes: [
            0x1f, 0x33, 0x04, 0x02, 0x03, 0x04, 0x00
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): IChannelsMap => ({channelsMap: data});


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( {channelsMap}: IChannelsMap ): types.TBytes => (command.toBytes(id, channelsMap));
