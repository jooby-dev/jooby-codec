/**
 * Downlink command to set the extended operator parameters.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as setOperatorParametersExtended from 'jooby-codec/mtx3/commands/downlink/setOperatorParametersExtended.js';
 *
 * const parameters = {
 *     timeoutRelayOn: 1,
 *     define1: {
 *         RESET_DAY_MAX_POWER_KEY: false,
 *         RESET_MONTH_MAX_POWER_KEY: false,
 *         BLOCK_KEY_OPTOPORT: false,
 *         MAGNET_SCREEN_CONST: false,
 *         ALLOW_BROWNOUT_INDICATION: false
 *     },
 *     timeoutRelayKey: 0,
 *     timeoutRelayAuto: 5,
 *     reserved1: 0,
 *     reserved2: 0
 * };
 * const bytes = setOperatorParametersExtended.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [64, 9, 1, 0, 0, 5, 0, 0, 0, 0, 0]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx3/commands/SetOperatorParametersExtended.md#request)
 */

import * as command from '../../../mtx/utils/command.js';
import * as types from '../../types.js';
import {READ_WRITE} from '../../../mtx/constants/accessLevels.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, IOperatorParametersExtended, OPERATOR_PARAMETERS_EXTENDED_SIZE} from '../../utils/CommandBinaryBuffer.js';


export const id: types.TCommandId = 0x40;
export const name: types.TCommandName = 'setOperatorParametersExtended';
export const headerSize = 2;
export const maxSize = OPERATOR_PARAMETERS_EXTENDED_SIZE;
export const accessLevel: types.TAccessLevel = READ_WRITE;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'simple request': {
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
            timeoutRelayAuto: 5,
            reserved1: 0,
            reserved2: 0
        },
        bytes: [
            0x40, 0x09,
            0x01, 0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0x00, 0x00
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
    if ( bytes.length !== maxSize ) {
        throw new Error(`Wrong buffer size: ${bytes.length}.`);
    }

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
