/**
 * Uplink command to get special day information for the given tariff table.
 *
 * The corresponding downlink command: `getSpecialDay`.
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getSpecialDay from 'jooby-codec/mtx1/commands/uplink/getSpecialDay.js';
 *
 * // special day response
 * const bytes = [0x01, 0x09, 0x03, 0x00];
 *
 * // decoded payload
 * const parameters = getSpecialDay.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     month: 1,
 *     date: 9,
 *     dayIndex: 3,
 *     isPeriodic: true
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetSpecialDay.md#response)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {
    ISpecialDay,
    getSpecialDay,
    setSpecialDay
} from '../../utils/CommandBinaryBuffer.js';
import {getSpecialDay as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 4;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'special day response': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            month: 1,
            date: 9,
            dayIndex: 3,
            year: 10
        },
        bytes: [
            0x3d, 0x04,
            0x01, 0x09, 0x03, 0x0a
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): ISpecialDay => {
    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return getSpecialDay(buffer);
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: ISpecialDay ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    setSpecialDay(buffer, parameters);

    return command.toBytes(id, buffer.data);
};
