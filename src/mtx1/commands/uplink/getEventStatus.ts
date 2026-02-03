/**
 * Uplink command to get device status events.
 *
 * The corresponding downlink command: `getEventStatus`.
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getEventStatus from 'jooby-codec/mtx1/commands/uplink/getEventStatus.js';
 *
 * // response to getEventStatus downlink command
 * const bytes = [0x85, 0x10];
 *
 * // decoded payload
 * const parameters = getEventStatus.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     CASE_OPEN: true,
 *     MAGNETIC_ON: false,
 *     PARAMETERS_UPDATE_REMOTE: true,
 *     PARAMETERS_UPDATE_LOCAL: false,
 *     RESTART: false,
 *     ERROR_ACCESS: false,
 *     TIME_SET: false,
 *     TIME_CORRECT: true,
 *     DEVICE_FAILURE: false,
 *     CASE_TERMINAL_OPEN: false,
 *     CASE_MODULE_OPEN: false,
 *     TARIFF_TABLE_SET: false,
 *     TARIFF_TABLE_GET: true,
 *     PROTECTION_RESET_EM: false,
 *     PROTECTION_RESET_MAGNETIC: false
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetEventStatus.md#response)
 */

import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import * as command from '../../utils/command.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {
    IEventStatus,
    getEventStatus,
    setEventStatus
} from '../../utils/CommandBinaryBuffer.js';
import {getEventStatus as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const maxSize = 2;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'simple response': {
        id,
        name,
        headerSize,
        accessLevel,
        maxSize,
        parameters: {
            CASE_OPEN: true,
            MAGNETIC_ON: false,
            PARAMETERS_UPDATE_REMOTE: true,
            PARAMETERS_UPDATE_LOCAL: false,
            RESTART: false,
            ERROR_ACCESS: false,
            TIME_SET: false,
            TIME_CORRECT: true,
            DEVICE_FAILURE: false,
            CASE_TERMINAL_OPEN: false,
            CASE_MODULE_OPEN: false,
            TARIFF_TABLE_SET: false,
            TARIFF_TABLE_GET: true,
            PROTECTION_RESET_EM: false,
            PROTECTION_RESET_MAGNETIC: false
        },
        bytes: [
            0x01, 0x02,
            0x85, 0x10
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IEventStatus => {
    validateCommandPayload(name, bytes, maxSize);

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, true);

    return getEventStatus(buffer);
};


/**
 * Encode command parameters.
 *
 * @param eventStatus - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( eventStatus: IEventStatus ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, true);

    // body
    setEventStatus(buffer, eventStatus);

    return command.toBytes(id, buffer.data);
};
