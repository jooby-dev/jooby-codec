/**
 * Downlink command to get day energies `A+`, `R+`, `R-` by default or selected energies (`A+`, `R+`, `R-` or `A-`, `R+`, `R-`) for 4 tariffs (`T1`-`T4`) for date.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getDayDemand from 'jooby-codec/mtx3/commands/downlink/getDayDemand.js';
 * import * as energyTypes from 'jooby-codec/mtx3/constants/energyTypes.js';
 *
 * const parameters = {
 *     date: {
 *         year: 24,
 *         month: 3,
 *         date: 22
 *     },
 *     energyType: energyTypes.A_PLUS_R_PLUS_R_MINUS
 * };
 *
 * const bytes = getDayDemand.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [22, 4, 24, 3, 22, 1]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx3/commands/GetDayDemand.md#request)
 */

import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import * as command from '../../../mtx1/utils/command.js';
import {getDate, setDate} from '../../../mtx1/utils/CommandBinaryBuffer.js';
import {READ_ONLY} from '../../../mtx1/constants/accessLevels.js';
import * as energyTypes from '../../constants/energyTypes.js';
import {getDayDemand as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


interface IGetDayDemandParameters {
    date: types.IDate,
    energyType?: types.TEnergyType
}


const MIN_COMMAND_SIZE = 3;
const MAX_COMMAND_SIZE = 4;


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = MAX_COMMAND_SIZE;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'request day values for 2024.03.22 00:00:00 GMT': {
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
            }
        },
        bytes: [
            0x16, 0x03,
            0x18, 0x03, 0x16
        ]
    },
    'request day values with energy type for 2024.03.22 00:00:00 GMT': {
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
            energyType: energyTypes.A_PLUS_R_PLUS_R_MINUS
        },
        bytes: [
            0x16, 0x04,
            0x18, 0x03, 0x16, 0x01
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetDayDemandParameters => {
    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    if ( bytes.length === MAX_COMMAND_SIZE ) {
        return {
            date: getDate(buffer),
            energyType: buffer.getUint8()
        };
    }

    return {date: getDate(buffer)};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetDayDemandParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(parameters?.energyType ? MAX_COMMAND_SIZE : MIN_COMMAND_SIZE, false);

    // body
    setDate(buffer, parameters?.date);

    if ( parameters?.energyType ) {
        buffer.setUint8(parameters.energyType);
    }

    return command.toBytes(id, buffer.data);
};
