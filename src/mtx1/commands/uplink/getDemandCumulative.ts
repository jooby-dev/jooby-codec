/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

/**
 * Uplink command to read cumulative load graphs.
 *
 * The corresponding downlink command: `getDemandCumulative`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getDemandCumulative from 'jooby-codec/mtx1/commands/uplink/getDemandCumulative.js';
 * import * as demandTypes from 'jooby-codec/mtx1/constants/demandTypes.js';
 *
 * // response to getDemandCumulative downlink command
 * const bytes = [0x31, 0x42, 0xa0, 0x00, 0x19, 0x01, 0x3c, 0x04, 0xff];
 *
 * // decoded payload
 * const parameters = getDemandCumulative.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     date: { year: 24, month: 10, date: 2 },
 *     demandType: demandTypes.VOLTAGE,
 *     firstIndex: 25,
 *     count: 1,
 *     period: 60,
 *     demands: [ { lastSummerHour: 4 } ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetDemandCumulative.md#response)
 */

import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import * as command from '../../utils/command.js';
import {
    IGetDemandParameters,
    getDemand,
    setDemand
} from '../../utils/binary/buffer.js';
import * as demands from '../../utils/demands.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import * as getDemandCommand from '../downlink/getDemand.js';
import * as demandTypes from '../../constants/demandTypes.js';
import {getDemandCumulative as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


type TGetDemandCumulativeValue =
    types.TUint32 | {
        lastSummerHour: number
    } | null;

export interface IGetDemandCumulativeResponseParameters extends IGetDemandParameters {
    /**
     * Cumulative load data.
     */
    demands: Array<TGetDemandCumulativeValue>;
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = getDemandCommand.maxSize + demands.MAX_DEMANDS_COUNT * 4;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'response for A+ (period: 15)': {
        id,
        name,
        headerSize,
        maxSize,
        parameters: {
            date: {
                year: 24,
                month: 10,
                date: 2
            },
            demandType: demandTypes.A_PLUS,
            firstIndex: 0,
            count: 24,
            period: 15,
            demands: [
                177,
                177,
                176,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                178,
                175,
                177,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null
            ]
        },
        bytes: [
            0x77, 0x67,
            0x31, 0x42, 0x01, 0x00, 0x00, 0x18, 0x0f,
            0x00, 0x00, 0x00, 0xb1,
            0x00, 0x00, 0x00, 0xb1,
            0x00, 0x00, 0x00, 0xb0,
            0xff, 0xff, 0xff, 0xff,
            0xff, 0xff, 0xff, 0xff,
            0xff, 0xff, 0xff, 0xff,
            0xff, 0xff, 0xff, 0xff,
            0xff, 0xff, 0xff, 0xff,
            0xff, 0xff, 0xff, 0xff,
            0xff, 0xff, 0xff, 0xff,
            0xff, 0xff, 0xff, 0xff,
            0xff, 0xff, 0xff, 0xff,
            0x00, 0x00, 0x00, 0xb2,
            0x00, 0x00, 0x00, 0xaf,
            0x00, 0x00, 0x00, 0xb1,
            0xff, 0xff, 0xff, 0xff,
            0xff, 0xff, 0xff, 0xff,
            0xff, 0xff, 0xff, 0xff,
            0xff, 0xff, 0xff, 0xff,
            0xff, 0xff, 0xff, 0xff,
            0xff, 0xff, 0xff, 0xff,
            0xff, 0xff, 0xff, 0xff,
            0xff, 0xff, 0xff, 0xff,
            0xff, 0xff, 0xff, 0xff
        ]
    },

    'response for A+ (period: 60)': {
        id,
        name,
        headerSize,
        maxSize,
        parameters: {
            date: {
                year: 24,
                month: 10,
                date: 2
            },
            demandType: demandTypes.A_PLUS,
            firstIndex: 0,
            count: 12,
            period: 60,
            demands: [
                177,
                177,
                176,
                null,
                null,
                null,
                178,
                175,
                177,
                null,
                null,
                null
            ]
        },
        bytes: [
            0x77, 0x37,
            0x31, 0x42, 0x01, 0x00, 0x00, 0x0c, 0x3c,
            0x00, 0x00, 0x00, 0xb1,
            0x00, 0x00, 0x00, 0xb1,
            0x00, 0x00, 0x00, 0xb0,
            0xff, 0xff, 0xff, 0xff,
            0xff, 0xff, 0xff, 0xff,
            0xff, 0xff, 0xff, 0xff,
            0x00, 0x00, 0x00, 0xb2,
            0x00, 0x00, 0x00, 0xaf,
            0x00, 0x00, 0x00, 0xb1,
            0xff, 0xff, 0xff, 0xff,
            0xff, 0xff, 0xff, 0xff,
            0xff, 0xff, 0xff, 0xff
        ]
    },

    'response for A+ (lastSummerHour)': {
        id,
        name,
        headerSize,
        maxSize,
        parameters: {
            date: {
                year: 24,
                month: 10,
                date: 2
            },
            demandType: demandTypes.A_PLUS,
            firstIndex: 23,
            count: 3,
            period: 60,
            demands: [
                0x00000010,
                0x00000020,
                {lastSummerHour: 4}
            ]
        },
        bytes: [
            0x77, 0x11,
            0x31, 0x42, 0x01, 0x00, 0x17, 0x03, 0x3c,
            0x00, 0x00, 0x00, 0x10,
            0x00, 0x00, 0x00, 0x20,
            0x04, 0xff
        ]
    },

    'response for A+ (without lastSummerHour)': {
        id,
        name,
        headerSize,
        maxSize,
        parameters: {
            date: {
                year: 24,
                month: 10,
                date: 2
            },
            demandType: demandTypes.A_PLUS,
            firstIndex: 23,
            count: 3,
            period: 60,
            demands: [
                0x00000010,
                0x00000020,
                null
            ]
        },
        bytes: [
            0x77, 0x11,
            0x31, 0x42, 0x01, 0x00, 0x17, 0x03, 0x3c,
            0x00, 0x00, 0x00, 0x10,
            0x00, 0x00, 0x00, 0x20,
            0xff, 0xff
        ]
    },

    'response for A+ (lastSummerHour only)': {
        id,
        name,
        headerSize,
        maxSize,
        parameters: {
            date: {
                year: 24,
                month: 10,
                date: 2
            },
            demandType: demandTypes.A_PLUS,
            firstIndex: 25,
            count: 1,
            period: 60,
            demands: [
                {lastSummerHour: 4}
            ]
        },
        bytes: [
            0x77, 0x09,
            0x31, 0x42, 0x01, 0x00, 0x19, 0x01, 0x3c,
            0x04, 0xff
        ]
    }
};


const NO_LAST_SUMMER_HOUR_VALUE = 0xffff;
const NO_CUMULATIVE_VALUE = 0xffffffff;


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetDemandCumulativeResponseParameters => {
    if ( !bytes || bytes.length < getDemandCommand.maxSize ) {
        throw new Error('Invalid uplink GetDemandCumulative byte length.');
    }

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);
    const parameters: IGetDemandParameters = getDemand(buffer);

    demands.validateDemandCount(parameters.count);

    const expectedLength = getDemandCommand.maxSize + demands.getDemandValuesSize(parameters, 4, 2);

    if ( bytes.length !== expectedLength ) {
        throw new Error('Invalid uplink GetDemandCumulative demands byte length.');
    }

    const demandValues: Array<TGetDemandCumulativeValue> = new Array(parameters.count)
        .fill(0)
        .map((item, index) => {
            let value;

            if ( demands.isLastSummerHourIndex(parameters.firstIndex + index, parameters.period) ) {
                value = buffer.getUint16();

                return value === NO_LAST_SUMMER_HOUR_VALUE ? null : {
                    lastSummerHour: (value >> 8) & 0xff
                };
            }

            value = buffer.getUint32();

            return (value === NO_CUMULATIVE_VALUE ? null : value) as TGetDemandCumulativeValue;
        });

    return {...parameters, demands: demandValues};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetDemandCumulativeResponseParameters ): types.TBytes => {
    demands.validateDemandValues(parameters.demands, parameters, 'number');

    const indexLastSummerRecord = demands.getLastSummerHourIndex(parameters.period);
    const commandSize = getDemandCommand.maxSize + demands.getDemandValuesSize(parameters, 4, 2);
    const buffer: IBinaryBuffer = new BinaryBuffer(commandSize, false);

    setDemand(buffer, parameters);

    parameters.demands.forEach((value, index) => {
        const absoluteIndex = parameters.firstIndex + index;

        if ( absoluteIndex === indexLastSummerRecord ) {
            if ( value == null ) {
                buffer.setUint16(NO_LAST_SUMMER_HOUR_VALUE);

                return;
            }

            const {lastSummerHour} = value as {lastSummerHour: number};

            buffer.setUint16((lastSummerHour << 8) | 0xff);

            return;
        }

        if ( value == null ) {
            buffer.setUint32(NO_CUMULATIVE_VALUE);

            return;
        }

        buffer.setUint32(value as number);
    });

    return command.toBytes(id, buffer.data);
};
