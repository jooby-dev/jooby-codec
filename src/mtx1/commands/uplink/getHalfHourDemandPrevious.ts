/**
 * Uplink command to get active energy (`A+`) for the previous day.
 *
 * The corresponding downlink command: `getHalfHourDemandPrevious`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getHalfHourDemandPrevious from 'jooby-codec/mtx1/commands/uplink/getHalfHourDemandPrevious.js';
 *
 * // simple response
 * const bytes = [
 *     0x18, 0x03, 0x16, 0x44, 0x57, 0x44, 0xc6, 0x45, 0x35, 0x45, 0xa4, 0x46, 0x13, 0x46, 0x82, 0x46,
 *     0xf1, 0x47, 0x60, 0x47, 0xcf, 0x47, 0xd0, 0x48, 0x3f, 0x48, 0xae, 0x49, 0x1d, 0x49, 0x8c, 0x49,
 *     0xfb, 0x4a, 0x6a, 0x4a, 0xd9, 0x4b, 0x48, 0x4b, 0xb7, 0x4b, 0xb8, 0x4c, 0x27, 0x4c, 0x96, 0x4d,
 *     0x05, 0x4d, 0x74, 0x4d, 0xe3, 0x4e, 0x52, 0x4e, 0xc1, 0x4f, 0x30, 0x4f, 0x9f, 0x4f, 0xa0, 0x50,
 *     0x0f, 0x50, 0x7e, 0x50, 0xed, 0x51, 0x5c, 0x51, 0xcb, 0x52, 0x3a, 0x52, 0xa9, 0x53, 0x18, 0x53,
 *     0x87, 0x53, 0x88, 0x54, 0x66, 0x54, 0xd5, 0x55, 0x44, 0x55, 0xb3, 0x56, 0x22, 0x56, 0x91, 0x57,
 *     0x00, 0x57, 0x6f
 * ];
 *
 * // decoded payload
 * const parameters = getHalfHourDemandPrevious.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     date: {
 *         year: 24,
 *         month: 3,
 *         date: 22
 *     },
 *     periods: [
 *         {tariff: 1, energy: 1111},
 *         {tariff: 1, energy: 1222},
 *         {tariff: 1, energy: 1333},
 *         {tariff: 1, energy: 1444},
 *         {tariff: 1, energy: 1555},
 *         {tariff: 1, energy: 1666},
 *         {tariff: 1, energy: 1777},
 *         {tariff: 1, energy: 1888},
 *         {tariff: 1, energy: 1999},
 *         {tariff: 1, energy: 2000},
 *         {tariff: 1, energy: 2111},
 *         {tariff: 1, energy: 2222},
 *         {tariff: 1, energy: 2333},
 *         {tariff: 1, energy: 2444},
 *         {tariff: 1, energy: 2555},
 *         {tariff: 1, energy: 2666},
 *         {tariff: 1, energy: 2777},
 *         {tariff: 1, energy: 2888},
 *         {tariff: 1, energy: 2999},
 *         {tariff: 1, energy: 3000},
 *         {tariff: 1, energy: 3111},
 *         {tariff: 1, energy: 3222},
 *         {tariff: 1, energy: 3333},
 *         {tariff: 1, energy: 3444},
 *         {tariff: 1, energy: 3555},
 *         {tariff: 1, energy: 3666},
 *         {tariff: 1, energy: 3777},
 *         {tariff: 1, energy: 3888},
 *         {tariff: 1, energy: 3999},
 *         {tariff: 1, energy: 4000},
 *         {tariff: 1, energy: 4111},
 *         {tariff: 1, energy: 4222},
 *         {tariff: 1, energy: 4333},
 *         {tariff: 1, energy: 4444},
 *         {tariff: 1, energy: 4555},
 *         {tariff: 1, energy: 4666},
 *         {tariff: 1, energy: 4777},
 *         {tariff: 1, energy: 4888},
 *         {tariff: 1, energy: 4999},
 *         {tariff: 1, energy: 5000},
 *         {tariff: 1, energy: 5222},
 *         {tariff: 1, energy: 5333},
 *         {tariff: 1, energy: 5444},
 *         {tariff: 1, energy: 5555},
 *         {tariff: 1, energy: 5666},
 *         {tariff: 1, energy: 5777},
 *         {tariff: 1, energy: 5888},
 *         {tariff: 1, energy: 5999}
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetHalfHourDemandPrevious.md#response)
 */

import * as command from '../../utils/command.js';
import CommandBinaryBuffer, {
    ICommandBinaryBuffer,
    IGetHalfHourDemandResponseParameters,
    MIN_HALF_HOUR_PERIODS,
    MAX_HALF_HOUR_PERIODS,
    MIN_HALF_HOUR_COMMAND_SIZE,
    MAX_HALF_HOUR_COMMAND_SIZE
} from '../../utils/CommandBinaryBuffer.js';
import * as types from '../../types.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {getHalfHourDemandPrevious as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = MAX_HALF_HOUR_COMMAND_SIZE;
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
            periods: [
                {tariff: 1, energy: 1111},
                {tariff: 1, energy: 1222},
                {tariff: 1, energy: 1333},
                {tariff: 1, energy: 1444},
                {tariff: 1, energy: 1555},
                {tariff: 1, energy: 1666},
                {tariff: 1, energy: 1777},
                {tariff: 1, energy: 1888},
                {tariff: 1, energy: 1999},
                {tariff: 1, energy: 2000},
                {tariff: 1, energy: 2111},
                {tariff: 1, energy: 2222},
                {tariff: 1, energy: 2333},
                {tariff: 1, energy: 2444},
                {tariff: 1, energy: 2555},
                {tariff: 1, energy: 2666},
                {tariff: 1, energy: 2777},
                {tariff: 1, energy: 2888},
                {tariff: 1, energy: 2999},
                {tariff: 1, energy: 3000},
                {tariff: 1, energy: 3111},
                {tariff: 1, energy: 3222},
                {tariff: 1, energy: 3333},
                {tariff: 1, energy: 3444},
                {tariff: 1, energy: 3555},
                {tariff: 1, energy: 3666},
                {tariff: 1, energy: 3777},
                {tariff: 1, energy: 3888},
                {tariff: 1, energy: 3999},
                {tariff: 1, energy: 4000},
                {tariff: 1, energy: 4111},
                {tariff: 1, energy: 4222},
                {tariff: 1, energy: 4333},
                {tariff: 1, energy: 4444},
                {tariff: 1, energy: 4555},
                {tariff: 1, energy: 4666},
                {tariff: 1, energy: 4777},
                {tariff: 1, energy: 4888},
                {tariff: 1, energy: 4999},
                {tariff: 1, energy: 5000},
                {tariff: 1, energy: 5222},
                {tariff: 1, energy: 5333},
                {tariff: 1, energy: 5444},
                {tariff: 1, energy: 5555},
                {tariff: 1, energy: 5666},
                {tariff: 1, energy: 5777},
                {tariff: 1, energy: 5888},
                {tariff: 1, energy: 5999}
            ]
        },
        bytes: [
            0x4b, 0x63,
            0x18, 0x03, 0x16, 0x44, 0x57, 0x44, 0xc6, 0x45, 0x35, 0x45, 0xa4, 0x46, 0x13, 0x46, 0x82, 0x46,
            0xf1, 0x47, 0x60, 0x47, 0xcf, 0x47, 0xd0, 0x48, 0x3f, 0x48, 0xae, 0x49, 0x1d, 0x49, 0x8c, 0x49,
            0xfb, 0x4a, 0x6a, 0x4a, 0xd9, 0x4b, 0x48, 0x4b, 0xb7, 0x4b, 0xb8, 0x4c, 0x27, 0x4c, 0x96, 0x4d,
            0x05, 0x4d, 0x74, 0x4d, 0xe3, 0x4e, 0x52, 0x4e, 0xc1, 0x4f, 0x30, 0x4f, 0x9f, 0x4f, 0xa0, 0x50,
            0x0f, 0x50, 0x7e, 0x50, 0xed, 0x51, 0x5c, 0x51, 0xcb, 0x52, 0x3a, 0x52, 0xa9, 0x53, 0x18, 0x53,
            0x87, 0x53, 0x88, 0x54, 0x66, 0x54, 0xd5, 0x55, 0x44, 0x55, 0xb3, 0x56, 0x22, 0x56, 0x91, 0x57,
            0x00, 0x57, 0x6f
        ]
    },
    'response with no periods': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            date: {
                year: 22,
                month: 6,
                date: 18
            },
            periods: [
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined},
                {tariff: undefined, energy: undefined}
            ]
        },
        bytes: [
            0x4b, 0x63,
            0x16, 0x06, 0x12, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
            0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
            0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
            0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
            0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
            0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
            0xff, 0xff, 0xff
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
            periods: [
                {tariff: 1, energy: 1111},
                {tariff: 1, energy: 1222},
                {tariff: 1, energy: 1333},
                {tariff: 1, energy: 1444},
                {tariff: 1, energy: 1555},
                {tariff: 1, energy: 1666},
                {tariff: 1, energy: 1777},
                {tariff: 1, energy: 1888},
                {tariff: 1, energy: 1999},
                {tariff: 1, energy: 2000},
                {tariff: 1, energy: 2111},
                {tariff: 1, energy: 2222},
                {tariff: 1, energy: 2333},
                {tariff: 1, energy: 2444},
                {tariff: 1, energy: 2555},
                {tariff: 1, energy: 2666},
                {tariff: 1, energy: 2777},
                {tariff: 1, energy: 2888},
                {tariff: 1, energy: 2999},
                {tariff: 1, energy: 3000},
                {tariff: 1, energy: 3111},
                {tariff: 1, energy: 3222},
                {tariff: 1, energy: 3333},
                {tariff: 1, energy: 3444},
                {tariff: 1, energy: 3555},
                {tariff: 1, energy: 3666},
                {tariff: 1, energy: 3777},
                {tariff: 1, energy: 3888},
                {tariff: 1, energy: 3999},
                {tariff: 1, energy: 4000},
                {tariff: 1, energy: 4111},
                {tariff: 1, energy: 4222},
                {tariff: 1, energy: 4333},
                {tariff: 1, energy: 4444},
                {tariff: 1, energy: 4555},
                {tariff: 1, energy: 4666},
                {tariff: 1, energy: 4777},
                {tariff: 1, energy: 4888},
                {tariff: 1, energy: 4999},
                {tariff: 1, energy: 5000},
                {tariff: 1, energy: 5222},
                {tariff: 1, energy: 5333},
                {tariff: 1, energy: 5444},
                {tariff: 1, energy: 5555},
                {tariff: 1, energy: 5666},
                {tariff: 1, energy: 5777},
                {tariff: 1, energy: 5888},
                {tariff: 1, energy: 5999},
                {tariff: 1, energy: 6000},
                {tariff: 1, energy: 6111}
            ],
            dstHour: 3
        },
        bytes: [
            0x4b, 0x68,
            0x18, 0x02, 0x1f, 0x44, 0x57, 0x44, 0xc6, 0x45, 0x35, 0x45, 0xa4, 0x46, 0x13, 0x46, 0x82, 0x46,
            0xf1, 0x47, 0x60, 0x47, 0xcf, 0x47, 0xd0, 0x48, 0x3f, 0x48, 0xae, 0x49, 0x1d, 0x49, 0x8c, 0x49,
            0xfb, 0x4a, 0x6a, 0x4a, 0xd9, 0x4b, 0x48, 0x4b, 0xb7, 0x4b, 0xb8, 0x4c, 0x27, 0x4c, 0x96, 0x4d,
            0x05, 0x4d, 0x74, 0x4d, 0xe3, 0x4e, 0x52, 0x4e, 0xc1, 0x4f, 0x30, 0x4f, 0x9f, 0x4f, 0xa0, 0x50,
            0x0f, 0x50, 0x7e, 0x50, 0xed, 0x51, 0x5c, 0x51, 0xcb, 0x52, 0x3a, 0x52, 0xa9, 0x53, 0x18, 0x53,
            0x87, 0x53, 0x88, 0x54, 0x66, 0x54, 0xd5, 0x55, 0x44, 0x55, 0xb3, 0x56, 0x22, 0x56, 0x91, 0x57,
            0x00, 0x57, 0x6f, 0x57, 0x70, 0x57, 0xdf, 0x03
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
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);
    const hasDst = bytes.length > MIN_HALF_HOUR_COMMAND_SIZE;
    const date = buffer.getDate();
    const periods = buffer.getEnergyPeriods(hasDst ? MAX_HALF_HOUR_PERIODS : MIN_HALF_HOUR_PERIODS);

    if ( hasDst ) {
        return {
            date,
            periods,
            dstHour: buffer.getUint8()
        };
    }

    return {date, periods};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetHalfHourDemandResponseParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(parameters.periods.length > MIN_HALF_HOUR_PERIODS ? MAX_HALF_HOUR_COMMAND_SIZE : MIN_HALF_HOUR_COMMAND_SIZE);

    // body
    buffer.setDate(parameters.date);
    buffer.setEnergyPeriods(parameters.periods);

    if ( parameters.dstHour ) {
        buffer.setUint8(parameters.dstHour);
    }

    return command.toBytes(id, buffer.data);
};
