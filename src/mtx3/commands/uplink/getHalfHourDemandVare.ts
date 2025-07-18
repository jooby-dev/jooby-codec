/**
 * Uplink command to get reactive energy (`A+R-`) in half hours by date.
 *
 * The corresponding downlink command: `getHalfHourDemandVare`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getHalfHourDemandVare from 'jooby-codec/mtx3/commands/uplink/getHalfHourDemandVare.js';
 *
 * // simple response
 * const bytes = [
 *     0x18, 0x03, 0x16, 0x04, 0x57, 0x04, 0xc6, 0x05, 0x35, 0x05, 0xa4, 0x06, 0x13, 0x06, 0x82, 0x06,
 *     0xf1, 0x07, 0x60, 0x07, 0xcf, 0x07, 0xd0, 0x08, 0x3f, 0x08, 0xae, 0x09, 0x1d, 0x09, 0x8c, 0x09,
 *     0xfb, 0x0a, 0x6a, 0x0a, 0xd9, 0x0b, 0x48, 0x0b, 0xb7, 0x0b, 0xb8, 0x0c, 0x27, 0x0c, 0x96, 0x0d,
 *     0x05, 0x0d, 0x74, 0x0d, 0xe3, 0x0e, 0x52, 0x0e, 0xc1, 0x0f, 0x30, 0x0f, 0x9f, 0x0f, 0xa0, 0x10,
 *     0x0f, 0x10, 0x7e, 0x10, 0xed, 0x11, 0x5c, 0x11, 0xcb, 0x12, 0x3a, 0x12, 0xa9, 0x13, 0x18, 0x13,
 *     0x87, 0x13, 0x88, 0x14, 0x66, 0x14, 0xd5, 0xff, 0xff, 0xff, 0xff, 0x16, 0x22, 0x16, 0x91, 0x17,
 *     0x00, 0x17, 0x6f
 * ];
 *
 * // decoded payload
 * const parameters = getHalfHourDemandVare.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
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
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx3/commands/GetHalfHourDemandVare.md#response)
 */

import * as command from '../../../mtx1/utils/command.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {
    MIN_HALF_HOUR_PERIODS,
    MAX_HALF_HOUR_PERIODS,
    MIN_HALF_HOUR_COMMAND_SIZE,
    MAX_HALF_HOUR_COMMAND_SIZE,
    getDate,
    setDate
} from '../../../mtx1/utils/CommandBinaryBuffer.js';
import {READ_ONLY} from '../../../mtx1/constants/accessLevels.js';
import * as types from '../../types.js';
import {
    IGetHalfHourDemandResponseParameters,
    getEnergyPeriods,
    setEnergyPeriods
} from '../../utils/CommandBinaryBuffer.js';
import {getHalfHourDemandVare as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = MIN_HALF_HOUR_COMMAND_SIZE;
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
            0x49, 0x63,
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
            0x49, 0x68,
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
export const fromBytes = ( bytes: types.TBytes ): IGetHalfHourDemandResponseParameters => {
    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);
    const hasDst = bytes.length > MIN_HALF_HOUR_COMMAND_SIZE;
    const date = getDate(buffer);
    const energies = getEnergyPeriods(buffer, hasDst ? MAX_HALF_HOUR_PERIODS : MIN_HALF_HOUR_PERIODS);

    if ( hasDst ) {
        return {
            date,
            energies,
            dstHour: buffer.getUint8()
        };
    }

    return {date, energies};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetHalfHourDemandResponseParameters ): types.TBytes => {
    const size = parameters.energies.length > MIN_HALF_HOUR_PERIODS ? MAX_HALF_HOUR_COMMAND_SIZE : MIN_HALF_HOUR_COMMAND_SIZE;
    const buffer: IBinaryBuffer = new BinaryBuffer(size, false);

    // body
    setDate(buffer, parameters.date);
    setEnergyPeriods(buffer, parameters.energies);

    if ( parameters.dstHour ) {
        buffer.setUint8(parameters.dstHour);
    }

    return command.toBytes(id, buffer.data);
};
