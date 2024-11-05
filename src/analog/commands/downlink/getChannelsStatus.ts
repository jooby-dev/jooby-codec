/**
 * Command to get the status of device channels.
 * Optionally, specify a channels to get the status of the subsystem assigned to that channels.
 * Without a channels , the command returns the status of all channels.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getChannelsStatus from 'jooby-codec/analog/commands/downlink/getChannelsStatus.js';
 *
 * const bytes = getChannelsStatus.toBytes();
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [31, 50, 0]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetChannelsStatus.md#request)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import {IChannelsMask, getChannelsMaskFromNumber, setChannelsMaskToNumber} from '../../utils/CommandBinaryBuffer.js';


export const id: types.TCommandId = 0x321f;
export const name: types.TCommandName = 'getChannelsStatus';
export const headerSize = 3;


export const examples: command.TCommandExamples = {
    'request the status of all channels': {
        id,
        name,
        headerSize,
        parameters: null,
        bytes: [
            0x1f, 0x32, 0x00
        ]
    },
    'request the status of the subsystems assigned to channels 0 and 1': {
        id,
        name,
        headerSize,
        parameters: {channel1: true, channel2: true, channel3: false, channel4: false},
        bytes: [
            0x1f, 0x32, 0x01, 0x03
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
 * @returns command payload
 */
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export const fromBytes = ( data: types.TBytes ): IChannelsMask | undefined => (
    data.length === 0 ? null : getChannelsMaskFromNumber(data[0])
);


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( channelsMask?: IChannelsMask ): types.TBytes => (
    command.toBytes(
        id,
        channelsMask ? [setChannelsMaskToNumber(channelsMask)] : []
    )
);
