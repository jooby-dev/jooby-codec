/**
 * Uplink command to get the extended operator parameters.
 *
 * The corresponding downlink command: `getOperatorParametersExtended2`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getOperatorParametersExtended2 from 'jooby-codec/mtx3/commands/uplink/getOperatorParametersExtended2.js';
 *
 * // simple response
 * const bytes = [
 *     0x0f, 0x05, 0x05, 0x05, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
 *     0x00, 0x04, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x18
 * ];
 *
 * // decoded payload
 * const parameters = getOperatorParametersExtended2.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     deltaCorMin: 15,
 *     timeoutMagnetOff: 5,
 *     relaySetExt: {
 *         RELAY_OFF_MAGNET: true,
 *         RELAY_ON_MAGNET_TIMEOUT: false,
 *         RELAY_ON_MAGNET_AUTO: true
 *     },
 *     timeoutMagnetOn: 5,
 *     phaseDefault: 1,
 *     displaySet21: 0,
 *     displaySet22: 0,
 *     displaySet23: 0,
 *     displaySet24: {
 *         OPTOPORT_SPEED: true
 *     },
 *     channel1: 1,
 *     channel2: 2,
 *     channel3: 3,
 *     channel4: 4,
 *     channel5: 5,
 *     channel6: 6,
 *     timeCorrectPeriod: 24
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx3/commands/GetOperatorParametersExtended2.md#response)
 */

import * as command from '../../../mtx1/utils/command.js';
import * as types from '../../types.js';
import {READ_ONLY} from '../../../mtx1/constants/accessLevels.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, IOperatorParametersExtended2, OPERATOR_PARAMETERS_EXTENDED2_SIZE} from '../../utils/CommandBinaryBuffer.js';
import {getOperatorParametersExtended2 as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = OPERATOR_PARAMETERS_EXTENDED2_SIZE;
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
            deltaCorMin: 15,
            timeoutMagnetOff: 5,
            relaySetExt: {
                RELAY_OFF_MAGNET: true,
                RELAY_ON_MAGNET_TIMEOUT: false,
                RELAY_ON_MAGNET_AUTO: true
            },
            timeoutMagnetOn: 5,
            phaseDefault: 1,
            displaySet21: 0,
            displaySet22: 0,
            displaySet23: 0,
            displaySet24: {
                OPTOPORT_SPEED: true
            },
            channel1: 1,
            channel2: 2,
            channel3: 3,
            channel4: 4,
            channel5: 5,
            channel6: 6,
            timeCorrectPeriod: 24
        },
        bytes: [
            0x47, 0x1c,
            0x0f, // deltaCorMin
            0x05, // timeoutMagnetOff
            0x05, // relaySetExt
            0x05, // timeoutMagnetOn
            0x01, // phaseDefault
            0x00, 0x00, 0x00, 0x00, // displaySet21
            0x00, 0x00, 0x00, 0x00, // displaySet22
            0x00, 0x00, 0x00, 0x00, // displaySet23
            0x04, 0x00, 0x00, 0x00, // displaySet24
            0x01, // channel1
            0x02, // channel2
            0x03, // channel3
            0x04, // channel4
            0x05, // channel5
            0x06, // channel6
            0x18 // timeCorrectPeriod
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( bytes: types.TBytes ): IOperatorParametersExtended2 => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    return buffer.getOperatorParametersExtended2();
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IOperatorParametersExtended2 ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    buffer.setOperatorParametersExtended2(parameters);

    return command.toBytes(id, buffer.data);
};
