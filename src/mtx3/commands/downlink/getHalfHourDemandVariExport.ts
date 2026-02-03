/**
 * Downlink command to get reactive energy `A-R+` (`II` quadrant) in half hours by date.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getHalfHourDemandVariExport from 'jooby-codec/mtx3/commands/downlink/getHalfHourDemandVariExport.js';
 *
 * const parameters = {
 *     date: {
 *         year: 24,
 *         month: 3,
 *         date: 22
 *     }
 * };
 *
 * const bytes = getHalfHourDemandVariExport.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [84, 3, 24, 3, 22]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx3/commands/GetHalfHourDemandVariExport.md#request)
 */

import * as command from '../../../mtx1/utils/command.js';
import {READ_ONLY} from '../../../mtx1/constants/accessLevels.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {getDate, setDate} from '../../../mtx1/utils/CommandBinaryBuffer.js';
import * as types from '../../types.js';
import {getHalfHourDemandVariExport as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';


interface IGetHalfHourDemandVariExportParameters {
    date: types.IDate
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 3;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'request archive values for 2024.03.22': {
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
            0x54, 0x03,
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
export const fromBytes = ( bytes: types.TBytes ): IGetHalfHourDemandVariExportParameters => {
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
export const toBytes = ( parameters: IGetHalfHourDemandVariExportParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    // body
    setDate(buffer, parameters.date);

    return command.toBytes(id, buffer.data);
};
