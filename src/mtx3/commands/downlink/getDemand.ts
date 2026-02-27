/**
 * Downlink command to read load graphs.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getDemand from 'jooby-codec/mtx3/commands/downlink/getDemand.js';
 * import * as demandTypes from 'jooby-codec/mtx3/constants/demandTypes.js';
 *
 * const parameters = {
 *     date: {
 *         year: 21,
 *         month: 6,
 *         date: 18
 *     },
 *     demandType: demandTypes.ACTIVE_ENERGY_A_PLUS,
 *     firstIndex: 0,
 *     count: 2,
 *     period: 30
 * };
 *
 * const bytes = getDemand.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [118, 7, 42, 210, 129, 0, 0, 2, 30]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx3/commands/GetDemand.md#request)
 */

import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import * as command from '../../../mtx1/utils/command.js';
import {
    IGetDemandParameters,
    getDemand,
    setDemand
} from '../../utils/binary/buffer.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {READ_ONLY} from '../../../mtx1/constants/accessLevels.js';
import {getDemand as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';
import * as demandTypes from '../../constants/demandTypes.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 7;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'request for A+': {
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
            period: 30
        },
        bytes: [
            0x76, 0x07,
            0x2a, 0xd2,
            0x81,
            0x00, 0x00,
            0x02,
            0x1e
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetDemandParameters => {
    validateCommandPayload(name, bytes, maxSize);

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return getDemand(buffer);
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetDemandParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    setDemand(buffer, parameters);

    return command.toBytes(id, buffer.data);
};
