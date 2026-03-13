/**
 * Uplink command to start PLC network.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as phyStart from 'jooby-codec/plc/commands/uplink/phyStart.js';
 *
 * // empty response
 * const bytes = [];
 *
 * // decoded payload
 * const parameters = phyStart.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {}
 * ```
 */

import * as types from '../../types.js';
import * as command from '../../../mtx1/utils/command.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {UNENCRYPTED} from '../../../mtx1/constants/accessLevels.js';
import {phyStart as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';

export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 0;
export const accessLevel: types.TAccessLevel = UNENCRYPTED;
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
            0x02, 0x00
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
