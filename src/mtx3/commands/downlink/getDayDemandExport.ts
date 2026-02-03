/**
 * Downlink command to get day energies `A-`, `R+`, `R-` for 4 tariffs (`T1`-`T4`) for date.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getDayDemandExport from 'jooby-codec/mtx3/commands/downlink/getDayDemandExport.js';
 *
 * const parameters = {
 *     date: {
 *         year: 24,
 *         month: 3,
 *         date: 22
 *     }
 * };
 *
 * const bytes = getDayDemandExport.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [79, 3, 24, 3, 22]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx3/commands/GetDayDemandExport.md#request)
 */

import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import * as command from '../../../mtx1/utils/command.js';
import {getDate, setDate} from '../../../mtx1/utils/CommandBinaryBuffer.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {READ_ONLY} from '../../../mtx1/constants/accessLevels.js';
import {getDayDemandExport as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


interface IGetDayDemandExportParameters {
    date: types.IDate
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 3;
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
            0x4f, 0x03,
            0x18, 0x03, 0x16
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetDayDemandExportParameters => {
    validateCommandPayload(name, bytes, maxSize);

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return {date: getDate(buffer)};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetDayDemandExportParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    // body
    setDate(buffer, parameters.date);

    return command.toBytes(id, buffer.data);
};
