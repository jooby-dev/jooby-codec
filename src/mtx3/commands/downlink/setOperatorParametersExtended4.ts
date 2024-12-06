/**
 * Downlink command to set the extended operator parameters.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as setOperatorParametersExtended4 from 'jooby-codec/mtx3/commands/downlink/setOperatorParametersExtended4.js';
 *
 * const parameters = {
 *     displaySet5: {
 *         EVENT: true,
 *         PROFILE_P01: true,
 *         PROFILE_P02: false,
 *         PROFILE_P03: true,
 *         PROFILE_P04: true,
 *         PROFILE_P05: false,
 *         PROFILE_P06: true
 *     },
 *     displaySet25: {
 *         EVENT: true,
 *         PROFILE_P01: false,
 *         PROFILE_P02: true,
 *         PROFILE_P03: false,
 *         PROFILE_P04: true,
 *         PROFILE_P05: false,
 *         PROFILE_P06: true
 *     },
 *     displaySet31: {
 *         SET_ALL_SEGMENT_DISPLAY: false,
 *         SOFTWARE_VERSION: false,
 *         TOTAL_ACTIVE_ENERGY: false,
 *         ACTIVE_ENERGY_T1: false,
 *         ACTIVE_ENERGY_T2: false,
 *         ACTIVE_ENERGY_T3: true,
 *         ACTIVE_ENERGY_T4: false,
 *         TOTAL_REACTIVE_ENERGY: false,
 *         REACTIVE_ENERGY_T1: false,
 *         REACTIVE_ENERGY_T2: true,
 *         REACTIVE_ENERGY_T3: false,
 *         REACTIVE_ENERGY_T4: false,
 *         TOTAL_NEGATIVE_REACTIVE_ENERGY: false,
 *         NEGATIVE_REACTIVE_ENERGY_T1: false,
 *         NEGATIVE_REACTIVE_ENERGY_T2: false,
 *         NEGATIVE_REACTIVE_ENERGY_T3: false,
 *         NEGATIVE_REACTIVE_ENERGY_T4: false,
 *         TOTAL_EXPORTED_ACTIVE_ENERGY: false,
 *         EXPORTED_ACTIVE_ENERGY_T1: true,
 *         EXPORTED_ACTIVE_ENERGY_T2: false,
 *         EXPORTED_ACTIVE_ENERGY_T3: false,
 *         EXPORTED_ACTIVE_ENERGY_T4: false,
 *         TOTAL_EXPORTED_REACTIVE_ENERGY: false,
 *         EXPORTED_REACTIVE_ENERGY_T1: false,
 *         EXPORTED_REACTIVE_ENERGY_T2: false,
 *         EXPORTED_REACTIVE_ENERGY_T3: false,
 *         EXPORTED_REACTIVE_ENERGY_T4: false,
 *         TOTAL_EXPORTED_NEGATIVE_REACTIVE_ENERGY: false,
 *         EXPORTED_NEGATIVE_REACTIVE_ENERGY_T1: false,
 *         EXPORTED_NEGATIVE_REACTIVE_ENERGY_T2: false,
 *         EXPORTED_NEGATIVE_REACTIVE_ENERGY_T3: true,
 *         EXPORTED_NEGATIVE_REACTIVE_ENERGY_T4: false
 *     },
 *     displaySet32: {
 *         SET_ALL_SEGMENT_DISPLAY: false,
 *         SOFTWARE_VERSION: true,
 *         TOTAL_ACTIVE_ENERGY: false,
 *         ACTIVE_ENERGY_T1: false,
 *         ACTIVE_ENERGY_T2: false,
 *         ACTIVE_ENERGY_T3: true,
 *         ACTIVE_ENERGY_T4: false,
 *         TOTAL_REACTIVE_ENERGY: false,
 *         REACTIVE_ENERGY_T1: false,
 *         REACTIVE_ENERGY_T2: false,
 *         REACTIVE_ENERGY_T3: false,
 *         REACTIVE_ENERGY_T4: true,
 *         TOTAL_NEGATIVE_REACTIVE_ENERGY: false,
 *         NEGATIVE_REACTIVE_ENERGY_T1: false,
 *         NEGATIVE_REACTIVE_ENERGY_T2: false,
 *         NEGATIVE_REACTIVE_ENERGY_T3: false,
 *         NEGATIVE_REACTIVE_ENERGY_T4: false,
 *         TOTAL_EXPORTED_ACTIVE_ENERGY: false,
 *         EXPORTED_ACTIVE_ENERGY_T1: false,
 *         EXPORTED_ACTIVE_ENERGY_T2: false,
 *         EXPORTED_ACTIVE_ENERGY_T3: false,
 *         EXPORTED_ACTIVE_ENERGY_T4: false,
 *         TOTAL_EXPORTED_REACTIVE_ENERGY: false,
 *         EXPORTED_REACTIVE_ENERGY_T1: false,
 *         EXPORTED_REACTIVE_ENERGY_T2: true,
 *         EXPORTED_REACTIVE_ENERGY_T3: false,
 *         EXPORTED_REACTIVE_ENERGY_T4: false,
 *         TOTAL_EXPORTED_NEGATIVE_REACTIVE_ENERGY: false,
 *         EXPORTED_NEGATIVE_REACTIVE_ENERGY_T1: false,
 *         EXPORTED_NEGATIVE_REACTIVE_ENERGY_T2: false,
 *         EXPORTED_NEGATIVE_REACTIVE_ENERGY_T3: false,
 *         EXPORTED_NEGATIVE_REACTIVE_ENERGY_T4: false
 *     },
 *     displaySet33: {
 *         SET_ALL_SEGMENT_DISPLAY: false,
 *         SOFTWARE_VERSION: false,
 *         TOTAL_ACTIVE_ENERGY: false,
 *         ACTIVE_ENERGY_T1: true,
 *         ACTIVE_ENERGY_T2: true,
 *         ACTIVE_ENERGY_T3: false,
 *         ACTIVE_ENERGY_T4: false,
 *         TOTAL_REACTIVE_ENERGY: false,
 *         REACTIVE_ENERGY_T1: false,
 *         REACTIVE_ENERGY_T2: false,
 *         REACTIVE_ENERGY_T3: false,
 *         REACTIVE_ENERGY_T4: false,
 *         TOTAL_NEGATIVE_REACTIVE_ENERGY: true,
 *         NEGATIVE_REACTIVE_ENERGY_T1: false,
 *         NEGATIVE_REACTIVE_ENERGY_T2: false,
 *         NEGATIVE_REACTIVE_ENERGY_T3: false,
 *         NEGATIVE_REACTIVE_ENERGY_T4: false,
 *         TOTAL_EXPORTED_ACTIVE_ENERGY: false,
 *         EXPORTED_ACTIVE_ENERGY_T1: false,
 *         EXPORTED_ACTIVE_ENERGY_T2: false,
 *         EXPORTED_ACTIVE_ENERGY_T3: false,
 *         EXPORTED_ACTIVE_ENERGY_T4: false,
 *         TOTAL_EXPORTED_REACTIVE_ENERGY: false,
 *         EXPORTED_REACTIVE_ENERGY_T1: false,
 *         EXPORTED_REACTIVE_ENERGY_T2: false,
 *         EXPORTED_REACTIVE_ENERGY_T3: false,
 *         EXPORTED_REACTIVE_ENERGY_T4: true,
 *         TOTAL_EXPORTED_NEGATIVE_REACTIVE_ENERGY: true,
 *         EXPORTED_NEGATIVE_REACTIVE_ENERGY_T1: false,
 *         EXPORTED_NEGATIVE_REACTIVE_ENERGY_T2: false,
 *         EXPORTED_NEGATIVE_REACTIVE_ENERGY_T3: false,
 *         EXPORTED_NEGATIVE_REACTIVE_ENERGY_T4: false
 *     },
 *     displaySet34: {
 *         SET_ALL_SEGMENT_DISPLAY: false,
 *         SOFTWARE_VERSION: false,
 *         TOTAL_ACTIVE_ENERGY: false,
 *         ACTIVE_ENERGY_T1: true,
 *         ACTIVE_ENERGY_T2: true,
 *         ACTIVE_ENERGY_T3: false,
 *         ACTIVE_ENERGY_T4: false,
 *         TOTAL_REACTIVE_ENERGY: false,
 *         REACTIVE_ENERGY_T1: false,
 *         REACTIVE_ENERGY_T2: false,
 *         REACTIVE_ENERGY_T3: false,
 *         REACTIVE_ENERGY_T4: false,
 *         TOTAL_NEGATIVE_REACTIVE_ENERGY: false,
 *         NEGATIVE_REACTIVE_ENERGY_T1: false,
 *         NEGATIVE_REACTIVE_ENERGY_T2: false,
 *         NEGATIVE_REACTIVE_ENERGY_T3: false,
 *         NEGATIVE_REACTIVE_ENERGY_T4: false,
 *         TOTAL_EXPORTED_ACTIVE_ENERGY: false,
 *         EXPORTED_ACTIVE_ENERGY_T1: false,
 *         EXPORTED_ACTIVE_ENERGY_T2: true,
 *         EXPORTED_ACTIVE_ENERGY_T3: true,
 *         EXPORTED_ACTIVE_ENERGY_T4: false,
 *         TOTAL_EXPORTED_REACTIVE_ENERGY: false,
 *         EXPORTED_REACTIVE_ENERGY_T1: false,
 *         EXPORTED_REACTIVE_ENERGY_T2: false,
 *         EXPORTED_REACTIVE_ENERGY_T3: false,
 *         EXPORTED_REACTIVE_ENERGY_T4: false,
 *         TOTAL_EXPORTED_NEGATIVE_REACTIVE_ENERGY: false,
 *         EXPORTED_NEGATIVE_REACTIVE_ENERGY_T1: false,
 *         EXPORTED_NEGATIVE_REACTIVE_ENERGY_T2: false,
 *         EXPORTED_NEGATIVE_REACTIVE_ENERGY_T3: true,
 *         EXPORTED_NEGATIVE_REACTIVE_ENERGY_T4: false
 *     },
 *     displaySet35: {
 *         EVENT: false,
 *         PROFILE_P01: false,
 *         PROFILE_P02: true,
 *         PROFILE_P03: true,
 *         PROFILE_P04: true,
 *         PROFILE_P05: false,
 *         PROFILE_P06: false
 *     }
 * };
 * const bytes = setOperatorParametersExtended4.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [117, 28, 0, 0, 0, 91, 0, 0, 0, 85, 64, 4, 2, 32, 1, 0, 8, 34, 12, 0, 16, 24, 64, 24, 0, 24, 0, 0, 0, 28]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx3/commands/SetOperatorParametersExtended4.md#request)
 */

import * as command from '../../../mtx1/utils/command.js';
import * as types from '../../types.js';
import {READ_WRITE} from '../../../mtx1/constants/accessLevels.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, IOperatorParametersExtended4, OPERATOR_PARAMETERS_EXTENDED4_SIZE} from '../../utils/CommandBinaryBuffer.js';
import {setOperatorParametersExtended4 as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = OPERATOR_PARAMETERS_EXTENDED4_SIZE;
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
            displaySet5: {
                EVENT: true,
                PROFILE_P01: true,
                PROFILE_P02: false,
                PROFILE_P03: true,
                PROFILE_P04: true,
                PROFILE_P05: false,
                PROFILE_P06: true
            },
            displaySet25: {
                EVENT: true,
                PROFILE_P01: false,
                PROFILE_P02: true,
                PROFILE_P03: false,
                PROFILE_P04: true,
                PROFILE_P05: false,
                PROFILE_P06: true
            },
            displaySet31: {
                SET_ALL_SEGMENT_DISPLAY: false,
                SOFTWARE_VERSION: false,
                TOTAL_ACTIVE_ENERGY: false,
                ACTIVE_ENERGY_T1: false,
                ACTIVE_ENERGY_T2: false,
                ACTIVE_ENERGY_T3: true,
                ACTIVE_ENERGY_T4: false,
                TOTAL_REACTIVE_ENERGY: false,
                REACTIVE_ENERGY_T1: false,
                REACTIVE_ENERGY_T2: true,
                REACTIVE_ENERGY_T3: false,
                REACTIVE_ENERGY_T4: false,
                TOTAL_NEGATIVE_REACTIVE_ENERGY: false,
                NEGATIVE_REACTIVE_ENERGY_T1: false,
                NEGATIVE_REACTIVE_ENERGY_T2: false,
                NEGATIVE_REACTIVE_ENERGY_T3: false,
                NEGATIVE_REACTIVE_ENERGY_T4: false,
                TOTAL_EXPORTED_ACTIVE_ENERGY: false,
                EXPORTED_ACTIVE_ENERGY_T1: true,
                EXPORTED_ACTIVE_ENERGY_T2: false,
                EXPORTED_ACTIVE_ENERGY_T3: false,
                EXPORTED_ACTIVE_ENERGY_T4: false,
                TOTAL_EXPORTED_REACTIVE_ENERGY: false,
                EXPORTED_REACTIVE_ENERGY_T1: false,
                EXPORTED_REACTIVE_ENERGY_T2: false,
                EXPORTED_REACTIVE_ENERGY_T3: false,
                EXPORTED_REACTIVE_ENERGY_T4: false,
                TOTAL_EXPORTED_NEGATIVE_REACTIVE_ENERGY: false,
                EXPORTED_NEGATIVE_REACTIVE_ENERGY_T1: false,
                EXPORTED_NEGATIVE_REACTIVE_ENERGY_T2: false,
                EXPORTED_NEGATIVE_REACTIVE_ENERGY_T3: true,
                EXPORTED_NEGATIVE_REACTIVE_ENERGY_T4: false
            },
            displaySet32: {
                SET_ALL_SEGMENT_DISPLAY: false,
                SOFTWARE_VERSION: true,
                TOTAL_ACTIVE_ENERGY: false,
                ACTIVE_ENERGY_T1: false,
                ACTIVE_ENERGY_T2: false,
                ACTIVE_ENERGY_T3: true,
                ACTIVE_ENERGY_T4: false,
                TOTAL_REACTIVE_ENERGY: false,
                REACTIVE_ENERGY_T1: false,
                REACTIVE_ENERGY_T2: false,
                REACTIVE_ENERGY_T3: false,
                REACTIVE_ENERGY_T4: true,
                TOTAL_NEGATIVE_REACTIVE_ENERGY: false,
                NEGATIVE_REACTIVE_ENERGY_T1: false,
                NEGATIVE_REACTIVE_ENERGY_T2: false,
                NEGATIVE_REACTIVE_ENERGY_T3: false,
                NEGATIVE_REACTIVE_ENERGY_T4: false,
                TOTAL_EXPORTED_ACTIVE_ENERGY: false,
                EXPORTED_ACTIVE_ENERGY_T1: false,
                EXPORTED_ACTIVE_ENERGY_T2: false,
                EXPORTED_ACTIVE_ENERGY_T3: false,
                EXPORTED_ACTIVE_ENERGY_T4: false,
                TOTAL_EXPORTED_REACTIVE_ENERGY: false,
                EXPORTED_REACTIVE_ENERGY_T1: false,
                EXPORTED_REACTIVE_ENERGY_T2: true,
                EXPORTED_REACTIVE_ENERGY_T3: false,
                EXPORTED_REACTIVE_ENERGY_T4: false,
                TOTAL_EXPORTED_NEGATIVE_REACTIVE_ENERGY: false,
                EXPORTED_NEGATIVE_REACTIVE_ENERGY_T1: false,
                EXPORTED_NEGATIVE_REACTIVE_ENERGY_T2: false,
                EXPORTED_NEGATIVE_REACTIVE_ENERGY_T3: false,
                EXPORTED_NEGATIVE_REACTIVE_ENERGY_T4: false
            },
            displaySet33: {
                SET_ALL_SEGMENT_DISPLAY: false,
                SOFTWARE_VERSION: false,
                TOTAL_ACTIVE_ENERGY: false,
                ACTIVE_ENERGY_T1: true,
                ACTIVE_ENERGY_T2: true,
                ACTIVE_ENERGY_T3: false,
                ACTIVE_ENERGY_T4: false,
                TOTAL_REACTIVE_ENERGY: false,
                REACTIVE_ENERGY_T1: false,
                REACTIVE_ENERGY_T2: false,
                REACTIVE_ENERGY_T3: false,
                REACTIVE_ENERGY_T4: false,
                TOTAL_NEGATIVE_REACTIVE_ENERGY: true,
                NEGATIVE_REACTIVE_ENERGY_T1: false,
                NEGATIVE_REACTIVE_ENERGY_T2: false,
                NEGATIVE_REACTIVE_ENERGY_T3: false,
                NEGATIVE_REACTIVE_ENERGY_T4: false,
                TOTAL_EXPORTED_ACTIVE_ENERGY: false,
                EXPORTED_ACTIVE_ENERGY_T1: false,
                EXPORTED_ACTIVE_ENERGY_T2: false,
                EXPORTED_ACTIVE_ENERGY_T3: false,
                EXPORTED_ACTIVE_ENERGY_T4: false,
                TOTAL_EXPORTED_REACTIVE_ENERGY: false,
                EXPORTED_REACTIVE_ENERGY_T1: false,
                EXPORTED_REACTIVE_ENERGY_T2: false,
                EXPORTED_REACTIVE_ENERGY_T3: false,
                EXPORTED_REACTIVE_ENERGY_T4: true,
                TOTAL_EXPORTED_NEGATIVE_REACTIVE_ENERGY: true,
                EXPORTED_NEGATIVE_REACTIVE_ENERGY_T1: false,
                EXPORTED_NEGATIVE_REACTIVE_ENERGY_T2: false,
                EXPORTED_NEGATIVE_REACTIVE_ENERGY_T3: false,
                EXPORTED_NEGATIVE_REACTIVE_ENERGY_T4: false
            },
            displaySet34: {
                SET_ALL_SEGMENT_DISPLAY: false,
                SOFTWARE_VERSION: false,
                TOTAL_ACTIVE_ENERGY: false,
                ACTIVE_ENERGY_T1: true,
                ACTIVE_ENERGY_T2: true,
                ACTIVE_ENERGY_T3: false,
                ACTIVE_ENERGY_T4: false,
                TOTAL_REACTIVE_ENERGY: false,
                REACTIVE_ENERGY_T1: false,
                REACTIVE_ENERGY_T2: false,
                REACTIVE_ENERGY_T3: false,
                REACTIVE_ENERGY_T4: false,
                TOTAL_NEGATIVE_REACTIVE_ENERGY: false,
                NEGATIVE_REACTIVE_ENERGY_T1: false,
                NEGATIVE_REACTIVE_ENERGY_T2: false,
                NEGATIVE_REACTIVE_ENERGY_T3: false,
                NEGATIVE_REACTIVE_ENERGY_T4: false,
                TOTAL_EXPORTED_ACTIVE_ENERGY: false,
                EXPORTED_ACTIVE_ENERGY_T1: false,
                EXPORTED_ACTIVE_ENERGY_T2: true,
                EXPORTED_ACTIVE_ENERGY_T3: true,
                EXPORTED_ACTIVE_ENERGY_T4: false,
                TOTAL_EXPORTED_REACTIVE_ENERGY: false,
                EXPORTED_REACTIVE_ENERGY_T1: false,
                EXPORTED_REACTIVE_ENERGY_T2: false,
                EXPORTED_REACTIVE_ENERGY_T3: false,
                EXPORTED_REACTIVE_ENERGY_T4: false,
                TOTAL_EXPORTED_NEGATIVE_REACTIVE_ENERGY: false,
                EXPORTED_NEGATIVE_REACTIVE_ENERGY_T1: false,
                EXPORTED_NEGATIVE_REACTIVE_ENERGY_T2: false,
                EXPORTED_NEGATIVE_REACTIVE_ENERGY_T3: true,
                EXPORTED_NEGATIVE_REACTIVE_ENERGY_T4: false
            },
            displaySet35: {
                EVENT: false,
                PROFILE_P01: false,
                PROFILE_P02: true,
                PROFILE_P03: true,
                PROFILE_P04: true,
                PROFILE_P05: false,
                PROFILE_P06: false
            }
        },
        bytes: [
            0x75, 0x1c,
            0x00, 0x00, 0x00, 0x5b, // displaySet5
            0x00, 0x00, 0x00, 0x55, // displaySet25
            0x40, 0x04, 0x02, 0x20, // displaySet31
            0x01, 0x00, 0x08, 0x22, // displaySet32
            0x0c, 0x00, 0x10, 0x18, // displaySet33
            0x40, 0x18, 0x00, 0x18, // displaySet34
            0x00, 0x00, 0x00, 0x1c // displaySet35
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( bytes: types.TBytes ): IOperatorParametersExtended4 => {
    if ( bytes.length !== maxSize ) {
        throw new Error(`Wrong buffer size: ${bytes.length}.`);
    }

    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    return buffer.getOperatorParametersExtended4();
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IOperatorParametersExtended4 ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    buffer.setOperatorParametersExtended4(parameters);

    return command.toBytes(id, buffer.data);
};
