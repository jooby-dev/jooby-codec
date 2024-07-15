/**
 * Downlink command to get half hours for the selected channel by date.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getHalfHourDemandChannel from 'jooby-codec/mtx3/commands/downlink/getHalfHourDemandChannel.js';
 *
 * const parameters = {
 *     channel: 1,
 *     channelParameter: 16,
 *     date: {
 *         year: 24,
 *         month: 3,
 *         date: 22
 *     }
 * };
 *
 * const bytes = getHalfHourDemandChannel.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [90, 5, 1, 16, 24, 3, 22]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx3/commands/GetHalfHourDemandChannel.md#request)
 */

import * as command from '../../../mtx/utils/command.js';
import {READ_ONLY} from '../../../mtx/constants/accessLevels.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, TChannelParameter, TChannel} from '../../utils/CommandBinaryBuffer.js';
import * as types from '../../types.js';


interface IGetHalfHourDemandChannelRequestParameters {
    channel: TChannel,
    channelParameter: TChannelParameter,
    date: types.IDate
}


export const id: types.TCommandId = 0x5a;
export const name: types.TCommandName = 'getHalfHourDemandChannel';
export const headerSize = 2;
export const maxSize = 5;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'request A-R- energy for phase A on 2024.03.22': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            channel: 1,
            channelParameter: 16,
            date: {
                year: 24,
                month: 3,
                date: 22
            }
        },
        bytes: [
            0x5a, 0x05,
            0x01, // channel
            0x10, // channelParameter
            0x18, 0x03, 0x16 // date
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetHalfHourDemandChannelRequestParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    return {
        channel: buffer.getUint8(),
        channelParameter: buffer.getUint8(),
        date: buffer.getDate()
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetHalfHourDemandChannelRequestParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    // body
    buffer.setUint8(parameters.channel);
    buffer.setUint8(parameters.channelParameter);
    buffer.setDate(parameters.date);

    return command.toBytes(id, buffer.data);
};
