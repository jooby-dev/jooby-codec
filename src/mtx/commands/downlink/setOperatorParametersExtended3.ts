/**
 * Downlink command to set the shutdown thresholds for negative active power (`A-`).
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as setOperatorParametersExtended3 from 'jooby-codec/mtx/commands/downlink/setOperatorParametersExtended3.js';
 *
 * const parameters = {
 *     pmaxMinusThreshold0: 100,
 *     pmaxMinusThreshold1: 200,
 *     pmaxMinusThreshold2: 300,
 *     pmaxMinusThreshold3: 400,
 *     relaySet: {
 *         RELAY_OFF_LIMIT_P_MINUS_T1: true,
 *         RELAY_OFF_LIMIT_P_MINUS_T2: false,
 *         RELAY_OFF_LIMIT_P_MINUS_T3: true,
 *         RELAY_OFF_LIMIT_P_MINUS_T4: false
 *     }
 * };
 * const bytes = setOperatorParametersExtended3.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [114, 17, 0, 0, 0, 100, 0, 0, 0, 200, 0, 0, 1, 44, 0, 0, 1, 144, 20]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/SetOperatorParametersExtended3.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, IOperatorParametersExtended3} from '../../utils/CommandBinaryBuffer.js';
import {READ_WRITE} from '../../constants/accessLevels.js';


export const id: types.TCommandId = 0x72;
export const name: types.TCommandName = 'setOperatorParametersExtended3';
export const headerSize = 2;
export const maxSize = 17;
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
            pmaxMinusThreshold0: 100,
            pmaxMinusThreshold1: 200,
            pmaxMinusThreshold2: 300,
            pmaxMinusThreshold3: 400,
            relaySet: {
                RELAY_OFF_LIMIT_P_MINUS_T1: true,
                RELAY_OFF_LIMIT_P_MINUS_T2: false,
                RELAY_OFF_LIMIT_P_MINUS_T3: true,
                RELAY_OFF_LIMIT_P_MINUS_T4: false
            }
        },
        bytes: [
            0x72, 0x11,
            0x00, 0x00, 0x00, 0x64, 0x00, 0x00, 0x00, 0xc8, 0x00, 0x00, 0x01, 0x2c, 0x00, 0x00, 0x01, 0x90, 0x14
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( bytes: types.TBytes ): IOperatorParametersExtended3 => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    return buffer.getOperatorParametersExtended3();
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IOperatorParametersExtended3 ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    buffer.setOperatorParametersExtended3(parameters);

    return command.toBytes(id, buffer.data);
};
