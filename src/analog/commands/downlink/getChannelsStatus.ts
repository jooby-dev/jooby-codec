/**
 * Command to get the status of device channels.
 * Optionally, specify channels to get the status of the subsystem assigned to that channels.
 * Without channels, the command returns the status of all channels.
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
import {getChannelsStatus as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 3;


export const examples: command.TCommandExamples = {
    'request the status of all channels': {
        id,
        name,
        headerSize,
        parameters: {},
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

type TGetChannelsStatusParameters = IChannelsMask | command.IEmptyCommandParameters;


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export const fromBytes = ( bytes: types.TBytes ): TGetChannelsStatusParameters => (
    bytes.length === 0 ? {} : getChannelsMaskFromNumber(bytes[0])
);


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: TGetChannelsStatusParameters ): types.TBytes => (
    command.toBytes(
        id,
        Object.keys(parameters).length !== 0 ? [setChannelsMaskToNumber(parameters as IChannelsMask)] : []
    )
);
