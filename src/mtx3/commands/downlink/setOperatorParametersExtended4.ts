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
 *         ACTIVE_POWER_PHASE_A: false,
 *         ACTIVE_POWER_PHASE_B: true,
 *         ACTIVE_POWER_PHASE_C: false,
 *         ACTIVE_POWER_SUM: false,
 *         APPARENT_POWER_QMINUS_PHASE_A: false,
 *         APPARENT_POWER_QMINUS_PHASE_B: false,
 *         APPARENT_POWER_QPLUS_PHASE_A: false,
 *         APPARENT_POWER_QPLUS_PHASE_B: false,
 *         APPARENT_POWER_QPLUS_PHASE_C: false,
 *         BATTERY_VOLTAGE: false,
 *         CURRENT_IN_NEUTRAL: false,
 *         CURRENT_IN_PHASE_A: false,
 *         CURRENT_IN_PHASE_B: true,
 *         CURRENT_IN_PHASE_C: false,
 *         POWER_COEFFICIENT_PHASE_A: false,
 *         POWER_COEFFICIENT_PHASE_B: false,
 *         POWER_COEFFICIENT_PHASE_C: true,
 *         REACTIVE_POWER_QMINUS_PHASE_A: false,
 *         REACTIVE_POWER_QMINUS_PHASE_B: false,
 *         REACTIVE_POWER_QMINUS_PHASE_C: false,
 *         REACTIVE_POWER_QPLUS_PHASE_A: false,
 *         REACTIVE_POWER_QPLUS_PHASE_B: false,
 *         REACTIVE_POWER_QPLUS_PHASE_C: false,
 *         SUPPLY_FREQUENCY: false,
 *         TOTAL_APPARENT_POWER_QMINUS: false,
 *         TOTAL_APPARENT_POWER_QPLUS: false,
 *         TOTAL_POWER_FACTOR: false,
 *         TOTAL_REACTIVE_POWER_QMINUS: false,
 *         TOTAL_REACTIVE_POWER_QPLUS: false,
 *         VOLTAGE_IN_PHASE_A: false,
 *         VOLTAGE_IN_PHASE_B: true,
 *         VOLTAGE_IN_PHASE_C: false
 *     },
 *     displaySet33: {
 *         APPARENT_POWER_QMINUS_PHASE_C: false,
 *         MAX_ACTIVE_POWER_DAY_T1: false,
 *         MAX_ACTIVE_POWER_DAY_T2: false,
 *         MAX_ACTIVE_POWER_DAY_T3: true,
 *         MAX_ACTIVE_POWER_DAY_T4: true,
 *         MAX_ACTIVE_POWER_MONTH_T1: false,
 *         MAX_ACTIVE_POWER_MONTH_T2: false,
 *         MAX_ACTIVE_POWER_MONTH_T3: false,
 *         MAX_ACTIVE_POWER_MONTH_T4: false,
 *         MAX_EXPORTED_ACTIVE_POWER_DAY_T1: false,
 *         MAX_EXPORTED_ACTIVE_POWER_DAY_T2: true,
 *         MAX_EXPORTED_ACTIVE_POWER_DAY_T3: true,
 *         MAX_EXPORTED_ACTIVE_POWER_DAY_T4: false,
 *         MAX_EXPORTED_ACTIVE_POWER_MONTH_T1: false,
 *         MAX_EXPORTED_ACTIVE_POWER_MONTH_T2: false,
 *         MAX_EXPORTED_ACTIVE_POWER_MONTH_T3: false,
 *         MAX_NEGATIVE_REACTIVE_POWER_DAY_T1: false,
 *         MAX_NEGATIVE_REACTIVE_POWER_DAY_T2: false,
 *         MAX_NEGATIVE_REACTIVE_POWER_DAY_T3: false,
 *         MAX_NEGATIVE_REACTIVE_POWER_DAY_T4: false,
 *         MAX_NEGATIVE_REACTIVE_POWER_MONTH_T1: false,
 *         MAX_NEGATIVE_REACTIVE_POWER_MONTH_T2: false,
 *         MAX_NEGATIVE_REACTIVE_POWER_MONTH_T3: false,
 *         MAX_NEGATIVE_REACTIVE_POWER_MONTH_T4: false,
 *         MAX_REACTIVE_POWER_DAY_T1: false,
 *         MAX_REACTIVE_POWER_DAY_T2: false,
 *         MAX_REACTIVE_POWER_DAY_T3: false,
 *         MAX_REACTIVE_POWER_DAY_T4: true,
 *         MAX_REACTIVE_POWER_MONTH_T1: false,
 *         MAX_REACTIVE_POWER_MONTH_T2: false,
 *         MAX_REACTIVE_POWER_MONTH_T3: false,
 *         MAX_REACTIVE_POWER_MONTH_T4: false
 *     },
 *     displaySet34: {
 *         AUTO_SCREEN_SCROLLING: false,
 *         CURRENT_BALANCE: false,
 *         CURRENT_TRANSFORMATION_RATIO: true,
 *         DATE_MONTH_YEAR: false,
 *         HOUR_MINUTE_SECOND: false,
 *         MAX_EXPORTED_ACTIVE_POWER_MONTH_T4: false,
 *         MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T1: false,
 *         MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T2: false,
 *         MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T3: false,
 *         MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T4: false,
 *         MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T1: false,
 *         MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T2: false,
 *         MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T3: false,
 *         MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T4: false,
 *         MAX_EXPORTED_REACTIVE_POWER_DAY_T1: false,
 *         MAX_EXPORTED_REACTIVE_POWER_DAY_T2: false,
 *         MAX_EXPORTED_REACTIVE_POWER_DAY_T3: true,
 *         MAX_EXPORTED_REACTIVE_POWER_DAY_T4: true,
 *         MAX_EXPORTED_REACTIVE_POWER_MONTH_T1: false,
 *         MAX_EXPORTED_REACTIVE_POWER_MONTH_T2: false,
 *         MAX_EXPORTED_REACTIVE_POWER_MONTH_T3: false,
 *         MAX_EXPORTED_REACTIVE_POWER_MONTH_T4: false,
 *         POWER_THRESHOLD_T1: false,
 *         POWER_THRESHOLD_T2: false,
 *         POWER_THRESHOLD_T3: false,
 *         POWER_THRESHOLD_T4: false,
 *         SORT_DISPLAY_SCREENS: false,
 *         VOLTAGE_TRANSFORMATION_RATIO: true
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
                SET_ALL_SEGMENT_DISPLAY: true,
                SOFTWARE_VERSION: false,
                TOTAL_ACTIVE_ENERGY: true,
                ACTIVE_ENERGY_T1: false,
                ACTIVE_ENERGY_T2: false,
                ACTIVE_ENERGY_T3: false,
                ACTIVE_ENERGY_T4: false,
                TOTAL_REACTIVE_ENERGY: true,
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
                EXPORTED_REACTIVE_ENERGY_T4: false,
                TOTAL_EXPORTED_NEGATIVE_REACTIVE_ENERGY: false,
                EXPORTED_NEGATIVE_REACTIVE_ENERGY_T1: false,
                EXPORTED_NEGATIVE_REACTIVE_ENERGY_T2: false,
                EXPORTED_NEGATIVE_REACTIVE_ENERGY_T3: false,
                EXPORTED_NEGATIVE_REACTIVE_ENERGY_T4: false
            },
            displaySet32: {
                CURRENT_IN_PHASE_A: false,
                CURRENT_IN_PHASE_B: false,
                CURRENT_IN_PHASE_C: false,
                CURRENT_IN_NEUTRAL: false,
                VOLTAGE_IN_PHASE_A: false,
                VOLTAGE_IN_PHASE_B: false,
                VOLTAGE_IN_PHASE_C: false,
                BATTERY_VOLTAGE: false,
                SUPPLY_FREQUENCY: false,
                ACTIVE_POWER_SUM: true,
                ACTIVE_POWER_PHASE_A: false,
                ACTIVE_POWER_PHASE_B: false,
                ACTIVE_POWER_PHASE_C: false,
                TOTAL_REACTIVE_POWER_QPLUS: true,
                REACTIVE_POWER_QPLUS_PHASE_A: false,
                REACTIVE_POWER_QPLUS_PHASE_B: false,
                REACTIVE_POWER_QPLUS_PHASE_C: false,
                TOTAL_REACTIVE_POWER_QMINUS: true,
                REACTIVE_POWER_QMINUS_PHASE_A: false,
                REACTIVE_POWER_QMINUS_PHASE_B: false,
                REACTIVE_POWER_QMINUS_PHASE_C: false,
                TOTAL_POWER_FACTOR: false,
                POWER_COEFFICIENT_PHASE_A: false,
                POWER_COEFFICIENT_PHASE_B: false,
                POWER_COEFFICIENT_PHASE_C: false,
                TOTAL_APPARENT_POWER_QPLUS: false,
                APPARENT_POWER_QPLUS_PHASE_A: false,
                APPARENT_POWER_QPLUS_PHASE_B: false,
                APPARENT_POWER_QPLUS_PHASE_C: false,
                TOTAL_APPARENT_POWER_QMINUS: false,
                APPARENT_POWER_QMINUS_PHASE_A: false,
                APPARENT_POWER_QMINUS_PHASE_B: false
            },
            displaySet33: {
                APPARENT_POWER_QMINUS_PHASE_C: false,
                MAX_ACTIVE_POWER_DAY_T1: false,
                MAX_ACTIVE_POWER_DAY_T2: false,
                MAX_ACTIVE_POWER_DAY_T3: false,
                MAX_ACTIVE_POWER_DAY_T4: false,
                MAX_ACTIVE_POWER_MONTH_T1: false,
                MAX_ACTIVE_POWER_MONTH_T2: false,
                MAX_ACTIVE_POWER_MONTH_T3: false,
                MAX_ACTIVE_POWER_MONTH_T4: false,
                MAX_REACTIVE_POWER_DAY_T1: false,
                MAX_REACTIVE_POWER_DAY_T2: false,
                MAX_REACTIVE_POWER_DAY_T3: false,
                MAX_REACTIVE_POWER_DAY_T4: false,
                MAX_REACTIVE_POWER_MONTH_T1: false,
                MAX_REACTIVE_POWER_MONTH_T2: false,
                MAX_REACTIVE_POWER_MONTH_T3: false,
                MAX_REACTIVE_POWER_MONTH_T4: false,
                MAX_NEGATIVE_REACTIVE_POWER_DAY_T1: false,
                MAX_NEGATIVE_REACTIVE_POWER_DAY_T2: false,
                MAX_NEGATIVE_REACTIVE_POWER_DAY_T3: false,
                MAX_NEGATIVE_REACTIVE_POWER_DAY_T4: false,
                MAX_NEGATIVE_REACTIVE_POWER_MONTH_T1: false,
                MAX_NEGATIVE_REACTIVE_POWER_MONTH_T2: false,
                MAX_NEGATIVE_REACTIVE_POWER_MONTH_T3: false,
                MAX_NEGATIVE_REACTIVE_POWER_MONTH_T4: false,
                MAX_EXPORTED_ACTIVE_POWER_DAY_T1: false,
                MAX_EXPORTED_ACTIVE_POWER_DAY_T2: false,
                MAX_EXPORTED_ACTIVE_POWER_DAY_T3: false,
                MAX_EXPORTED_ACTIVE_POWER_DAY_T4: false,
                MAX_EXPORTED_ACTIVE_POWER_MONTH_T1: false,
                MAX_EXPORTED_ACTIVE_POWER_MONTH_T2: false,
                MAX_EXPORTED_ACTIVE_POWER_MONTH_T3: false
            },
            displaySet34: {
                MAX_EXPORTED_ACTIVE_POWER_MONTH_T4: false,
                MAX_EXPORTED_REACTIVE_POWER_DAY_T1: false,
                MAX_EXPORTED_REACTIVE_POWER_DAY_T2: false,
                MAX_EXPORTED_REACTIVE_POWER_DAY_T3: false,
                MAX_EXPORTED_REACTIVE_POWER_DAY_T4: false,
                MAX_EXPORTED_REACTIVE_POWER_MONTH_T1: false,
                MAX_EXPORTED_REACTIVE_POWER_MONTH_T2: false,
                MAX_EXPORTED_REACTIVE_POWER_MONTH_T3: false,
                MAX_EXPORTED_REACTIVE_POWER_MONTH_T4: false,
                MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T1: false,
                MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T2: false,
                MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T3: false,
                MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T4: false,
                MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T1: false,
                MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T2: false,
                MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T3: false,
                MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T4: false,
                HOUR_MINUTE_SECOND: true,
                DATE_MONTH_YEAR: true,
                CURRENT_TRANSFORMATION_RATIO: false,
                VOLTAGE_TRANSFORMATION_RATIO: false,
                CURRENT_BALANCE: false,
                POWER_THRESHOLD_T1: false,
                POWER_THRESHOLD_T2: false,
                POWER_THRESHOLD_T3: false,
                POWER_THRESHOLD_T4: false,
                SORT_DISPLAY_SCREENS: false,
                AUTO_SCREEN_SCROLLING: true
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
            0x74, 0x1c,
            0x00, 0x00, 0x00, 0x5b, // displaySet5
            0x00, 0x00, 0x00, 0x55, // displaySet25
            0x00, 0x00, 0x10, 0x85, // displaySet31
            0x00, 0x02, 0x22, 0x00, // displaySet32
            0x00, 0x00, 0x00, 0x00, // displaySet33
            0x80, 0x06, 0x00, 0x00, // displaySet34
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
