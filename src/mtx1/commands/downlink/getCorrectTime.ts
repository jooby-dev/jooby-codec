/**
 * Downlink command to get [DST](https://en.wikipedia.org/wiki/Daylight_saving_time)/Standard time transition options.
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getCorrectTime from 'jooby-codec/mtx1/commands/downlink/getCorrectTime.js';
 *
 * const bytes = getCorrectTime.toBytes();
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [62, 0]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetCorrectTime.md#request)
 */

import * as types from '../../types.js';
import * as command from '../../utils/command.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {getCorrectTime as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 0;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'simple request': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {},
        bytes: [
            0x3e, 0x00
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
