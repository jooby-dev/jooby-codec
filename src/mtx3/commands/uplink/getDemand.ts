/**
 * Uplink command to read load graphs.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getDemand from 'jooby-codec/mtx3/commands/uplink/getDemand.js';
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
 *     demandParam: 0x81,
 *     firstIndex: 0,
 *     count: 2,
 *     period: 30,
 *     demands: [2000, 43981]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx3/commands/GetDemand.md#response)
 */

import * as command from '../../../mtx1/utils/command.js';
import * as types from '../../types.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, IGetDemandParameters, IGetDemandResponseParameters} from '../../utils/CommandBinaryBuffer.js';
import {READ_ONLY} from '../../../mtx1/constants/accessLevels.js';
import * as getDemand from '../downlink/getDemand.js';
import {getDemand as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = getDemand.maxSize + 48 * 2;
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
            demandParam: 0x81,
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
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetDemandResponseParameters => {
    if ( !bytes || bytes.length < getDemand.maxSize ) {
        throw new Error('Invalid uplink GetDemand byte length.');
    }

    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);
    const parameters: IGetDemandParameters = buffer.getDemand();

    if ( bytes.length !== getDemand.maxSize + (2 * parameters.count) ) {
        throw new Error('Invalid uplink GetDemand demands byte length.');
    }

    const demands = new Array(parameters.count).fill(0).map(() => buffer.getUint16());

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
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(getDemand.maxSize + parameters.count * 2);

    buffer.setDemand(parameters);

    parameters.demands.forEach(value => buffer.setUint16(value));

    return command.toBytes(id, buffer.data);
};
