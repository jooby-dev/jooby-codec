/**
 * Downlink command to get the extended operator parameters 4.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getOperatorParametersExtended4 from 'jooby-codec/mtx3/commands/downlink/getOperatorParametersExtended4.js';
 *
 * const bytes = getOperatorParametersExtended4.toBytes();
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [116, 0]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx3/commands/GetOperatorParametersExtended4.md#request)
 */

import * as types from '../../types.js';
import * as command from '../../../mtx1/utils/command.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {READ_ONLY} from '../../../mtx1/constants/accessLevels.js';
import {getOperatorParametersExtended4 as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


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
            0x75, 0x00
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
