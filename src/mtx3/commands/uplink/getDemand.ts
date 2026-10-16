/**
 * Uplink command to read load graphs.
 *
 * The corresponding downlink command: `getDemand`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getDemand from 'jooby-codec/mtx3/commands/uplink/getDemand.js';
 * import * as demandTypes from 'jooby-codec/mtx3/constants/demandTypes.js';
 *
 * // response to getDemand downlink command
 * const bytes = [0x2a, 0xd2, 0x81, 0x00, 0x00, 0x02, 0x1e, 0x07, 0xd0, 0xab, 0xcd];
 *
 * // decoded payload
 * const parameters = getDemand.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     date: {
 *         year: 21,
 *         month: 6,
 *         date: 18
 *     },
 *     demandType: demandTypes.ACTIVE_ENERGY_A_PLUS,
 *     firstIndex: 0,
 *     count: 2,
 *     period: 30,
 *     demands: [2000, 43981]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx3/commands/GetDemand.md#response)
 */

import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import * as command from '../../../mtx1/utils/command.js';
import {
    IGetDemandParameters,
    getDemand,
    setDemand
} from '../../utils/binary/buffer.js';
import * as getDemandCommand from '../downlink/getDemand.js';
import {READ_ONLY} from '../../../mtx1/constants/accessLevels.js';
import * as demandsUtils from '../../../mtx1/utils/demands.js';
import {getDemand as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';
import * as demandTypes from '../../constants/demandTypes.js';


type TGetDemandValue = types.TUint16 | {
    lastSummerHour: number
};

export interface IGetDemandResponseParameters extends IGetDemandParameters {
    /**
     * Load data.
     */
    demands: Array<TGetDemandValue | null>;
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = getDemandCommand.maxSize + demandsUtils.MAX_DEMANDS_COUNT * 2;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'response for A+': {
        id,
        name,
        headerSize,
        maxSize,
        parameters: {
            date: {
                year: 21,
                month: 6,
                date: 18
            },
            demandType: demandTypes.ACTIVE_ENERGY_A_PLUS,
            firstIndex: 0,
            count: 2,
            period: 30,
            demands: [2000, 43981]
        },
        bytes: [
            0x76, 0x0b,
            0x2a, 0xd2,
            0x81,
            0x00, 0x00,
            0x02,
            0x1e,
            0x07, 0xd0,
            0xab, 0xcd
        ]
    },
    'response for A+ with nulls': {
        id,
        name,
        headerSize,
        maxSize,
        parameters: {
            date: {
                year: 21,
                month: 6,
                date: 18
            },
            demandType: demandTypes.ACTIVE_ENERGY_A_PLUS,
            firstIndex: 0,
            count: 4,
            period: 30,
            demands: [2000, 43981, null, null]
        },
        bytes: [
            0x76, 0x0f,
            0x2a, 0xd2,
            0x81,
            0x00, 0x00,
            0x04,
            0x1e,
            0x07, 0xd0,
            0xab, 0xcd,
            0xff, 0xff,
            0xff, 0xff
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
            demandType: demandTypes.ACTIVE_ENERGY_A_PLUS,
            firstIndex: 23,
            count: 3,
            period: 60,
            demands: [
                2000,
                43981,
                {lastSummerHour: 4}
            ]
        },
        bytes: [
            0x76, 0x0d,
            0x31, 0x42, 0x81, 0x00, 0x17, 0x03, 0x3c,
            0x07, 0xd0,
            0xab, 0xcd,
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
            demandType: demandTypes.ACTIVE_ENERGY_A_PLUS,
            firstIndex: 23,
            count: 3,
            period: 60,
            demands: [
                2000,
                43981,
                null
            ]
        },
        bytes: [
            0x76, 0x0d,
            0x31, 0x42, 0x81, 0x00, 0x17, 0x03, 0x3c,
            0x07, 0xd0,
            0xab, 0xcd,
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
            demandType: demandTypes.ACTIVE_ENERGY_A_PLUS,
            firstIndex: 25,
            count: 1,
            period: 60,
            demands: [
                {lastSummerHour: 4}
            ]
        },
        bytes: [
            0x76, 0x09,
            0x31, 0x42, 0x81, 0x00, 0x19, 0x01, 0x3c,
            0x04, 0xff
        ]
    }
};

const NO_VALUE = 0xffff;


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetDemandResponseParameters => {
    if ( !bytes || bytes.length < getDemandCommand.maxSize ) {
        throw new Error('Invalid uplink GetDemand byte length.');
    }

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);
    const parameters: IGetDemandParameters = getDemand(buffer);

    demandsUtils.validateDemandCount(parameters.count);

    const expectedLength = getDemandCommand.maxSize + demandsUtils.getDemandValuesSize(parameters, 2);

    if ( bytes.length !== expectedLength ) {
        throw new Error('Invalid uplink GetDemand demands byte length.');
    }

    const demands = new Array(parameters.count)
        .fill(0)
        .map((item, index) => {
            const value = buffer.getUint16();

            if ( value === NO_VALUE ) {
                return null;
            }

            if ( demandsUtils.isLastSummerHourIndex(parameters.firstIndex + index, parameters.period) ) {
                return {
                    lastSummerHour: (value >> 8) & 0xff
                };
            }

            return value;
        });

    return {...parameters, demands};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetDemandResponseParameters ): types.TBytes => {
    demandsUtils.validateDemandValues(parameters.demands, parameters, 'number');

    const commandSize = getDemandCommand.maxSize + demandsUtils.getDemandValuesSize(parameters, 2);
    const buffer: IBinaryBuffer = new BinaryBuffer(commandSize, false);

    setDemand(buffer, parameters);

    parameters.demands.forEach((value, index) => {
        if ( value == null ) {
            buffer.setUint16(NO_VALUE);

            return;
        }

        const absoluteIndex = parameters.firstIndex + index;

        if ( demandsUtils.isLastSummerHourIndex(absoluteIndex, parameters.period) ) {
            buffer.setUint16(((value as {lastSummerHour: number}).lastSummerHour << 8) | 0xff);
        } else {
            buffer.setUint16(value as number);
        }
    });

    return command.toBytes(id, buffer.data);
};
