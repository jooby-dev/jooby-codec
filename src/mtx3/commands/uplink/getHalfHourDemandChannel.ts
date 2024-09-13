/**
 * Uplink command to get half hours for the selected channel by date.
 *
 * The corresponding downlink command: `getHalfHourDemandChannel`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getHalfHourDemandChannel from 'jooby-codec/mtx3/commands/uplink/getHalfHourDemandChannel.js';
 *
 * // simple response
 * const bytes = [
 *     0x01, 0x10, 0x18, 0x03, 0x16, 0x04, 0x57, 0x04, 0xc6, 0x05, 0x35, 0x05, 0xa4, 0x06, 0x13, 0x06,
 *     0x82, 0x06, 0xf1, 0x07, 0x60, 0x07, 0xcf, 0x07, 0xd0, 0x08, 0x3f, 0x08, 0xae, 0x09, 0x1d, 0x09,
 *     0x8c, 0x09, 0xfb, 0x0a, 0x6a, 0x0a, 0xd9, 0x0b, 0x48, 0x0b, 0xb7, 0x0b, 0xb8, 0x0c, 0x27, 0x0c,
 *     0x96, 0x0d, 0x05, 0x0d, 0x74, 0x0d, 0xe3, 0x0e, 0x52, 0x0e, 0xc1, 0x0f, 0x30, 0x0f, 0x9f, 0x0f,
 *     0xa0, 0x10, 0x0f, 0x10, 0x7e, 0x10, 0xed, 0x11, 0x5c, 0x11, 0xcb, 0x12, 0x3a, 0x12, 0xa9, 0x13,
 *     0x18, 0x13, 0x87, 0x13, 0x88, 0x14, 0x66, 0x14, 0xd5, 0xff, 0xff, 0xff, 0xff, 0x16, 0x22, 0x16,
 *     0x91, 0x17, 0x00, 0x17, 0x6f
 * ];
 *
 * // decoded payload
 * const parameters = getHalfHourDemandChannel.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     channel: 1,
 *     channelParameter: 16,
 *     date: {
 *         year: 24,
 *         month: 3,
 *         date: 22
 *     },
 *     energies: [
 *         1111, 1222, 1333, 1444, 1555, 1666, 1777, 1888, 1999, 2000,
 *         2111, 2222, 2333, 2444, 2555, 2666, 2777, 2888, 2999, 3000,
 *         3111, 3222, 3333, 3444, 3555, 3666, 3777, 3888, 3999, 4000,
 *         4111, 4222, 4333, 4444, 4555, 4666, 4777, 4888, 4999, 5000,
 *         5222, 5333, undefined, undefined, 5666, 5777, 5888, 5999
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx3/commands/GetHalfHourDemandChannel.md#response)
 */

import * as command from '../../../mtx1/utils/command.js';
import {MIN_HALF_HOUR_PERIODS, MAX_HALF_HOUR_PERIODS, MIN_HALF_HOUR_COMMAND_SIZE, MAX_HALF_HOUR_COMMAND_SIZE} from '../../../mtx1/utils/CommandBinaryBuffer.js';
import {READ_ONLY} from '../../../mtx1/constants/accessLevels.js';
import * as types from '../../types.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, IGetHalfHourDemandResponseParameters, TChannelParameter, TChannel} from '../../utils/CommandBinaryBuffer.js';


const MIN_COMMAND_SIZE = MIN_HALF_HOUR_COMMAND_SIZE + 2;
const MAX_COMMAND_SIZE = MAX_HALF_HOUR_COMMAND_SIZE + 2;


interface IGetHalfHourDemandChannelResponseParameters extends IGetHalfHourDemandResponseParameters {
    channel: TChannel,
    channelParameter: TChannelParameter
}


export const id: types.TCommandId = 0x5a;
export const name: types.TCommandName = 'getHalfHourDemandChannel';
export const headerSize = 2;
export const maxSize = MIN_COMMAND_SIZE;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'simple response': {
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
            },
            energies: [
                1111, 1222, 1333, 1444, 1555, 1666, 1777, 1888, 1999, 2000,
                2111, 2222, 2333, 2444, 2555, 2666, 2777, 2888, 2999, 3000,
                3111, 3222, 3333, 3444, 3555, 3666, 3777, 3888, 3999, 4000,
                4111, 4222, 4333, 4444, 4555, 4666, 4777, 4888, 4999, 5000,
                5222, 5333, undefined, undefined, 5666, 5777, 5888, 5999
            ]
        },
        bytes: [
            0x5a, 0x65,
            0x01, // channel
            0x10, // channel parameter
            0x18, 0x03, 0x16, // date
            0x04, 0x57, 0x04, 0xc6, 0x05, 0x35, 0x05, 0xa4, 0x06, 0x13, 0x06, 0x82, 0x06, 0xf1, 0x07, 0x60,
            0x07, 0xcf, 0x07, 0xd0, 0x08, 0x3f, 0x08, 0xae, 0x09, 0x1d, 0x09, 0x8c, 0x09, 0xfb, 0x0a, 0x6a,
            0x0a, 0xd9, 0x0b, 0x48, 0x0b, 0xb7, 0x0b, 0xb8, 0x0c, 0x27, 0x0c, 0x96, 0x0d, 0x05, 0x0d, 0x74,
            0x0d, 0xe3, 0x0e, 0x52, 0x0e, 0xc1, 0x0f, 0x30, 0x0f, 0x9f, 0x0f, 0xa0, 0x10, 0x0f, 0x10, 0x7e,
            0x10, 0xed, 0x11, 0x5c, 0x11, 0xcb, 0x12, 0x3a, 0x12, 0xa9, 0x13, 0x18, 0x13, 0x87, 0x13, 0x88,
            0x14, 0x66, 0x14, 0xd5, 0xff, 0xff, 0xff, 0xff, 0x16, 0x22, 0x16, 0x91, 0x17, 0x00, 0x17, 0x6f
        ]
    },
    'response for day when DST start/end': {
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
                month: 2,
                date: 31
            },
            energies: [
                1111, 1222, 1333, 1444, 1555, 1666, 1777, 1888, 1999, 2000,
                2111, 2222, 2333, 2444, 2555, 2666, 2777, 2888, 2999, 3000,
                3111, 3222, 3333, 3444, 3555, 3666, 3777, 3888, 3999, 4000,
                4111, 4222, 4333, 4444, 4555, 4666, 4777, 4888, 4999, 5000,
                5222, 5333, 5444, 5555, 5666, 5777, 5888, 5999, 6000, 6111
            ],
            dstHour: 3
        },
        bytes: [
            0x5a, 0x6a,
            0x01, // channel
            0x10, // channel parameter
            0x18, 0x02, 0x1f, // date
            0x04, 0x57, 0x04, 0xc6, 0x05, 0x35, 0x05, 0xa4, 0x06, 0x13, 0x06, 0x82, 0x06, 0xf1, 0x07, 0x60,
            0x07, 0xcf, 0x07, 0xd0, 0x08, 0x3f, 0x08, 0xae, 0x09, 0x1d, 0x09, 0x8c, 0x09, 0xfb, 0x0a, 0x6a,
            0x0a, 0xd9, 0x0b, 0x48, 0x0b, 0xb7, 0x0b, 0xb8, 0x0c, 0x27, 0x0c, 0x96, 0x0d, 0x05, 0x0d, 0x74,
            0x0d, 0xe3, 0x0e, 0x52, 0x0e, 0xc1, 0x0f, 0x30, 0x0f, 0x9f, 0x0f, 0xa0, 0x10, 0x0f, 0x10, 0x7e,
            0x10, 0xed, 0x11, 0x5c, 0x11, 0xcb, 0x12, 0x3a, 0x12, 0xa9, 0x13, 0x18, 0x13, 0x87, 0x13, 0x88,
            0x14, 0x66, 0x14, 0xd5, 0x15, 0x44, 0x15, 0xb3, 0x16, 0x22, 0x16, 0x91, 0x17, 0x00, 0x17, 0x6f,
            0x17, 0x70, 0x17, 0xdf,
            0x03 // DST hour
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetHalfHourDemandChannelResponseParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);
    const hasDst = bytes.length > MIN_COMMAND_SIZE;
    const channel = buffer.getUint8();
    const channelParameter = buffer.getUint8();
    const date = buffer.getDate();
    const energies = buffer.getEnergyPeriods(hasDst ? MAX_HALF_HOUR_PERIODS : MIN_HALF_HOUR_PERIODS);

    if ( hasDst ) {
        return {
            channel,
            channelParameter,
            date,
            energies,
            dstHour: buffer.getUint8()
        };
    }

    return {
        channel,
        channelParameter,
        date,
        energies
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetHalfHourDemandChannelResponseParameters ): types.TBytes => {
    const size = parameters.energies.length > MIN_HALF_HOUR_PERIODS ? MAX_COMMAND_SIZE : MIN_COMMAND_SIZE;
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(size);

    // body
    buffer.setUint8(parameters.channel);
    buffer.setUint8(parameters.channelParameter);
    buffer.setDate(parameters.date);
    buffer.setEnergyPeriods(parameters.energies);

    if ( parameters.dstHour ) {
        buffer.setUint8(parameters.dstHour);
    }

    return command.toBytes(id, buffer.data);
};
