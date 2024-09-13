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
import * as command from '../../utils/command.js';
import * as accessLevels from '../../constants/accessLevels.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, IEventStatus} from '../../utils/CommandBinaryBuffer.js';


export const id: types.TCommandId = 0x01;
export const name: types.TCommandName = 'getEventStatus';
export const headerSize = 2;
export const accessLevel: types.TAccessLevel = accessLevels.READ_ONLY;
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
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( bytes: types.TBytes ): IEventStatus => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes, true);

    return buffer.getEventStatus();
};


/**
 * Encode command parameters.
 *
 * @param eventStatus - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( eventStatus: IEventStatus ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize, true);

    // body
    buffer.setEventStatus(eventStatus);

    return command.toBytes(id, buffer.data);
};
