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


type TGetDemandCumulativeValue = types.TUint32 | {
    lastSummerHour: number
};

export interface IGetDemandCumulativeResponseParameters extends IGetDemandParameters {
    /**
     * Cumulative load data.
     */
    demands?: Array<TGetDemandCumulativeValue | null>;
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = getDemandCommand.maxSize + 48;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'response for A+ (period: 5)': {
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
            period: 5,
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
            0x31, 0x42, 0x01, 0x00, 0x00, 0x18, 0x05,
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


const NO_VALUE = 0xffffffff;


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetDemandCumulativeResponseParameters => {
    if ( !bytes || bytes.length < getDemandCommand.maxSize ) {
        throw new Error('Invalid uplink GetDemand byte length.');
    }

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);
    const parameters: IGetDemandCumulativeResponseParameters = getDemand(buffer);
    const indexLastSummerRecord = demands.getLastSummerHourIndex(parameters.period);
    const hasLastSummerHour = parameters.count > 0 && indexLastSummerRecord >= parameters.firstIndex && indexLastSummerRecord < (parameters.firstIndex + parameters.count);
    const expectedLength = getDemandCommand.maxSize + (4 * parameters.count) - (hasLastSummerHour ? 2 : 0);

    if ( bytes.length !== expectedLength ) {
        throw new Error('Invalid uplink GetDemandCumulative demands byte length.');
    }

    parameters.demands = new Array(parameters.count)
        .fill(0)
        .map((item, index) => {
            if ( parameters.firstIndex + index === indexLastSummerRecord ) {
                return {
                    lastSummerHour: ((buffer.getUint16() >> 8) & 0xff)
                };
            }

            const value = buffer.getUint32();

            return value === NO_VALUE ? null : value;
        });

    return parameters;
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetDemandCumulativeResponseParameters ): types.TBytes => {
    const hasLastSummerHour = parameters.demands?.some(
        d => d != null && typeof d !== 'number' && d.lastSummerHour != null
    );
    const demandsCount = parameters.demands?.length ?? 0;
    const commandSize = demandsCount > 0
        ? getDemandCommand.maxSize + (demandsCount * 4) - (hasLastSummerHour ? 2 : 0)
        : getDemandCommand.maxSize;
    const buffer: IBinaryBuffer = new BinaryBuffer(commandSize, false);

    setDemand(buffer, parameters);

    parameters.demands.forEach(value => {
        if ( value == null ) {
            buffer.setUint32(NO_VALUE);

            return;
        }

        if ( typeof value === 'number' ) {
            buffer.setUint32(value);
        } else {
            buffer.setUint16((value.lastSummerHour << 8) | 0xff);
        }
    });

    return command.toBytes(id, buffer.data);
};
