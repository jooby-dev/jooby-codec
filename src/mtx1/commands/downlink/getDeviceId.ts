/**
 * Downlink command to get device identifier.
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getDeviceId from 'jooby-codec/mtx1/commands/downlink/getDeviceId.js';
 *
 * const bytes = getDeviceId.toBytes();
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [5, 0]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetDeviceId.md#request)
 */

import * as types from '../../types.js';
import * as command from '../../utils/command.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {getDeviceId as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const maxSize = 0;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'simple request': {
        id,
        name,
        headerSize,
        accessLevel,
        maxSize,
        parameters: {},
        bytes: [
            0x05, 0x00
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): command.IEmptyCommandParameters => {
    validateCommandPayload(name, bytes, maxSize);

    // no parameters to decode
    return {};
};


/**
 * Encode command parameters.
 *
 * @returns full message (header with body)
 */
export const toBytes = (): types.TBytes => command.toBytes(id);
