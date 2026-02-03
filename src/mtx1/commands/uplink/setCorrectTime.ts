/**
 * Uplink command to set [DST](https://en.wikipedia.org/wiki/Daylight_saving_time)/Standard time transition options.
 *
 * The corresponding downlink command: `setCorrectTime`.
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as setCorrectTime from 'jooby-codec/mtx1/commands/uplink/setCorrectTime.js';
 *
 * // empty response
 * const bytes = [];
 *
 * // decoded payload
 * const parameters = setCorrectTime.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {}
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/SetCorrectTime.md#response)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {READ_WRITE} from '../../constants/accessLevels.js';
import {setCorrectTime as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 0;
export const accessLevel: types.TAccessLevel = READ_WRITE;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'simple response': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {},
        bytes: [
            0x1c, 0x00
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

    return {};
};


/**
 * Encode command parameters.
 *
 * @returns full message (header with body)
 */
export const toBytes = (): types.TBytes => command.toBytes(id);
