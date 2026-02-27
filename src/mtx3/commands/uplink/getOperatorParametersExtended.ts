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

import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import * as command from '../../../mtx1/utils/command.js';
import {
    IOperatorParametersExtended,
    OPERATOR_PARAMETERS_EXTENDED_SIZE,
    getOperatorParametersExtended,
    setOperatorParametersExtended
} from '../../utils/binary/buffer.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {READ_ONLY} from '../../../mtx1/constants/accessLevels.js';
import {getOperatorParametersExtended as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
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
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IOperatorParametersExtended => {
    validateCommandPayload(name, bytes, maxSize);

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return getOperatorParametersExtended(buffer);
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IOperatorParametersExtended ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    setOperatorParametersExtended(buffer, parameters);

    return command.toBytes(id, buffer.data);
};
