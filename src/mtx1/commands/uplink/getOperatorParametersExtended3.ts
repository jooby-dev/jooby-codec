/**
 * Uplink command to get the shutdown thresholds for negative active power (`A-`).
 *
 * The corresponding downlink command: `getOperatorParametersExtended3`.
 *
 * Supported in MTX1 and MTX3 (since `26.05.21.0.0.5`) devices.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getOperatorParametersExtended3 from 'jooby-codec/mtx1/commands/uplink/getOperatorParametersExtended3.js';
 *
 * // simple response
 * const bytes = [0x00, 0x00, 0x00, 0x64, 0x00, 0x00, 0x00, 0xc8, 0x00, 0x00, 0x01, 0x2c, 0x00, 0x00, 0x01, 0x90, 0x28];
 *
 * // decoded payload
 * const parameters = getOperatorParametersExtended3.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
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
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetOperatorParametersExtended3.md#response)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, IOperatorParametersExtended3} from '../../utils/CommandBinaryBuffer.js';
import {getOperatorParametersExtended3 as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 17;
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
            0x71, 0x11,
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
