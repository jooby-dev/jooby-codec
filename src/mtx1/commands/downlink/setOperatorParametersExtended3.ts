/**
 * Downlink command to set the shutdown thresholds for negative active power (`A-`).
 *
 * Supported in MTX1 and MTX3 (since `26.05.21.0.0.5`) devices.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as setOperatorParametersExtended3 from 'jooby-codec/mtx1/commands/downlink/setOperatorParametersExtended3.js';
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
 *
 * const bytes = setOperatorParametersExtended3.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [114, 17, 0, 0, 0, 100, 0, 0, 0, 200, 0, 0, 1, 44, 0, 0, 1, 144, 40]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/SetOperatorParametersExtended3.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {
    IOperatorParametersExtended3,
    getOperatorParametersExtended3,
    setOperatorParametersExtended3
} from '../../utils/CommandBinaryBuffer.js';
import {READ_WRITE} from '../../constants/accessLevels.js';
import {setOperatorParametersExtended3 as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
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
            0x00, 0x00, 0x00, 0x64,
            0x00, 0x00, 0x00, 0xc8,
            0x00, 0x00, 0x01, 0x2c,
            0x00, 0x00, 0x01, 0x90,
            0x28
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IOperatorParametersExtended3 => {
    validateCommandPayload(name, bytes, maxSize);

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return getOperatorParametersExtended3(buffer);
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IOperatorParametersExtended3 ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    setOperatorParametersExtended3(buffer, parameters);

    return command.toBytes(id, buffer.data);
};
