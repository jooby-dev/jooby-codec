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
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import * as command from '../../../mtx1/utils/command.js';
import {
    IGetDemandParameters,
    IGetDemandResponseParameters,
    getDemand,
    setDemand
} from '../../utils/CommandBinaryBuffer.js';
import * as getDemandCommand from '../downlink/getDemand.js';
import {READ_ONLY} from '../../../mtx1/constants/accessLevels.js';
import {getDemand as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';
import * as demandTypes from '../../constants/demandTypes.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = getDemandCommand.maxSize + 48;
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

    if ( bytes.length !== getDemandCommand.maxSize + (2 * parameters.count) ) {
        throw new Error('Invalid uplink GetDemand demands byte length.');
    }

    const demands = new Array(parameters.count)
        .fill(0)
        .map(() => {
            const value = buffer.getUint16();

            return value === NO_VALUE ? null : value;
        });

    return {
        ...parameters,
        demands
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetDemandResponseParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(getDemandCommand.maxSize + parameters.count * 2, false);

    setDemand(buffer, parameters);

    parameters.demands.forEach(value => buffer.setUint16(value === null ? NO_VALUE : value));

    return command.toBytes(id, buffer.data);
};
