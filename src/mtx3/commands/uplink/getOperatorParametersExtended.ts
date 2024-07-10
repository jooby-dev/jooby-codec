/**
 * Uplink command to get the extended operator parameters.
 *
 * The corresponding downlink command: `getOperatorParametersExtended`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getOperatorParametersExtended from 'jooby-codec/mtx3/commands/uplink/getOperatorParametersExtended.js';
 *
 * // simple response
 * const bytes = [0x01, 0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0x00, 0x00];
 *
 * // decoded payload
 * const parameters = getOperatorParametersExtended.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     timeoutRelayOn: 1,
 *     define1: {
 *         RESET_DAY_MAX_POWER_KEY: false,
 *         RESET_MONTH_MAX_POWER_KEY: false,
 *         BLOCK_KEY_OPTOPORT: false,
 *         MAGNET_SCREEN_CONST: false,
 *         ALLOW_BROWNOUT_INDICATION: false
 *     },
 *     timeoutRelayKey: 0,
 *     timeoutRelayAuto: 5
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx3/commands/GetOperatorParametersExtended.md#response)
 */

import * as command from '../../../mtx/utils/command.js';
import * as types from '../../types.js';
import {READ_ONLY} from '../../../mtx/constants/accessLevels.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, IOperatorParametersExtended, OPERATOR_PARAMETERS_EXTENDED_SIZE} from '../../utils/CommandBinaryBuffer.js';


export const id: types.TCommandId = 0x3f;
export const name: types.TCommandName = 'getOperatorParametersExtended';
export const headerSize = 2;
export const maxSize = OPERATOR_PARAMETERS_EXTENDED_SIZE;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'simple response': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            timeoutRelayOn: 1,
            define1: {
                RESET_DAY_MAX_POWER_KEY: false,
                RESET_MONTH_MAX_POWER_KEY: false,
                BLOCK_KEY_OPTOPORT: false,
                MAGNET_SCREEN_CONST: false,
                ALLOW_BROWNOUT_INDICATION: false
            },
            timeoutRelayKey: 0,
            timeoutRelayAuto: 5
        },
        bytes: [
            0x3f, 0x09,
            0x01,
            0x00, // define1 mask
            0x00,
            0x05,
            0x00, 0x00, 0x00, 0x00, // reserved1
            0x00 // reserved2
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( bytes: types.TBytes ): IOperatorParametersExtended => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    return buffer.getOperatorParametersExtended();
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IOperatorParametersExtended ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    buffer.setOperatorParametersExtended(parameters);

    return command.toBytes(id, buffer.data);
};
