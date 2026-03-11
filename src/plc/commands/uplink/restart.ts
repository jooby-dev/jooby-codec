/**
 * Uplink command to restart PLC modem.
 *
 * The corresponding downlink command: `restart`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as restart from 'jooby-codec/plc/commands/uplink/restart.js';
 *
 * // get feeders status response
 * const bytes = [
 *     0x0e, 0x01,
 *     0x01
 * ];
 *
 * // decoded payload
 * const parameters = restart.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     reason: 1,
 * }
 */

import * as types from '../../types.js';
import * as command from '../../../mtx1/utils/command.js';
import {validateFixedCommandPayload} from '../../../utils/validateCommandPayload.js';
import {UNENCRYPTED} from '../../../mtx1/constants/accessLevels.js';
import {restart as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 1;
export const accessLevel: types.TAccessLevel = UNENCRYPTED;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'restart response': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            reason: 1
        },
        bytes: [
            0x0e, 0x1,
            0x01
        ]
    }
};


export interface IRestartParameters {
    reason: types.TUint8
}


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IRestartParameters => {
    validateFixedCommandPayload(name, bytes, maxSize);

    return {reason: bytes[0]};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IRestartParameters ): types.TBytes => (
    command.toBytes(id, [parameters.reason])
);
