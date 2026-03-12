/**
 * Uplink command to start an out-of-schedule link table write..
 *
 * The corresponding downlink command: `writeDownlinkTable`.
 *
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as writeDownlinkTable from 'jooby-codec/mtx1/commands/uplink/writeDownlinkTable.js';
 *
 * // empty response
 * const bytes = [];
 *
 * // decoded payload
 * const parameters = writeDownlinkTable.fromBytes(bytes);
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
import {writeDownlinkTable as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/downlinkNames.js';

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
            0x25, 0x00
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
