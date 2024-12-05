/**
 * Information about the current channel types on the device.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getChannelsTypes from 'jooby-codec/analog/commands/uplink/getChannelsTypes.js';
 *
 * const bytes = [0x1f, 0x33, 0x03, 0x02, 0x00, 0x01];
 *
 * // decoded payload
 * const parameters = getChannelsTypes.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * [1, 2, 3, 0]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetChannelsTypes.md#response)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import channelNames from '../../constants/channelNames.js';


export const id: types.TCommandId = 0x331f;
export const name: types.TCommandName = 'getChannelsTypes';
export const headerSize = 3;


interface IChannel {
    type: types.TUint8,
    typeName?: string
}

interface IChannels {
    channels: Array<IChannel>
}


export const examples: command.TCommandExamples = {
    'channels: [POWER_CHANNEL (2), BINARY_SENSOR (3), TEMPERATURE_SENSOR (4), IDLE (0)]': {
        id,
        name,
        headerSize,
        parameters: {
            channels: [
                {type: 2, typeName: 'POWER_CHANNEL'},
                {type: 3, typeName: 'BINARY_SENSOR'},
                {type: 4, typeName: 'TEMPERATURE_SENSOR'},
                {type: 0, typeName: 'IDLE'}
            ]
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
export const fromBytes = ( data: types.TBytes ): IChannels => ({
    channels: data.map(type => ({type, typeName: channelNames[type]}))
});


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( {channels}: IChannels ): types.TBytes => (
    command.toBytes(id, channels.map(channel => channel.type))
);
