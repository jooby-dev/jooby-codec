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
 *     0x00, 0x04, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x98
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
 *     displaySet21: {
 *         SET_ALL_SEGMENT_DISPLAY: false,
 *         SOFTWARE_VERSION: false,
 *         TOTAL_ACTIVE_ENERGY: false,
 *         ACTIVE_ENERGY_T1: false,
 *         ACTIVE_ENERGY_T2: false,
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
 *         EXPORTED_NEGATIVE_REACTIVE_ENERGY_T3: false,
 *         EXPORTED_NEGATIVE_REACTIVE_ENERGY_T4: false
 *     },
 *     displaySet22: {
 *         CURRENT_IN_PHASE_A: false,
 *         CURRENT_IN_PHASE_B: false,
 *         CURRENT_IN_PHASE_C: false,
 *         CURRENT_IN_NEUTRAL: false,
 *         VOLTAGE_IN_PHASE_A: false,
 *         VOLTAGE_IN_PHASE_B: false,
 *         VOLTAGE_IN_PHASE_C: false,
 *         BATTERY_VOLTAGE: false,
 *         FREQUENCY: false,
 *         ACTIVE_POWER_SUM: false,
 *         ACTIVE_POWER_PHASE_A: false,
 *         ACTIVE_POWER_PHASE_B: false,
 *         ACTIVE_POWER_PHASE_C: false,
 *         REACTIVE_POWER_QPLUS_SUM: false,
 *         REACTIVE_POWER_QPLUS_PHASE_A: false,
 *         REACTIVE_POWER_QPLUS_PHASE_B: false,
 *         REACTIVE_POWER_QPLUS_PHASE_C: false,
 *         REACTIVE_POWER_QMINUS_SUM: false,
 *         REACTIVE_POWER_QMINUS_PHASE_A: false,
 *         REACTIVE_POWER_QMINUS_PHASE_B: false,
 *         REACTIVE_POWER_QMINUS_PHASE_C: false,
 *         POWER_COEFFICIENT_SUM: false,
 *         POWER_COEFFICIENT_PHASE_A: false,
 *         POWER_COEFFICIENT_PHASE_B: false,
 *         POWER_COEFFICIENT_PHASE_C: false,
 *         APPARENT_POWER_QPLUS_SUM: false,
 *         APPARENT_POWER_QPLUS_PHASE_A: false,
 *         APPARENT_POWER_QPLUS_PHASE_B: false,
 *         APPARENT_POWER_QPLUS_PHASE_C: false,
 *         APPARENT_POWER_QMINUS_SUM: false,
 *         APPARENT_POWER_QMINUS_PHASE_A: false,
 *         APPARENT_POWER_QMINUS_PHASE_B: false
 *     },
 *     displaySet23: {
 *         APPARENT_POWER_QMINUS_PHASE_C: false,
 *         MAX_ACTIVE_POWER_DAY_T1: false,
 *         MAX_ACTIVE_POWER_DAY_T2: false,
 *         MAX_ACTIVE_POWER_DAY_T3: false,
 *         MAX_ACTIVE_POWER_DAY_T4: false,
 *         MAX_ACTIVE_POWER_MONTH_T1: false,
 *         MAX_ACTIVE_POWER_MONTH_T2: false,
 *         MAX_ACTIVE_POWER_MONTH_T3: false,
 *         MAX_ACTIVE_POWER_MONTH_T4: false,
 *         MAX_REACTIVE_POWER_DAY_T1: false,
 *         MAX_REACTIVE_POWER_DAY_T2: false,
 *         MAX_REACTIVE_POWER_DAY_T3: false,
 *         MAX_REACTIVE_POWER_DAY_T4: false,
 *         MAX_REACTIVE_POWER_MONTH_T1: false,
 *         MAX_REACTIVE_POWER_MONTH_T2: false,
 *         MAX_REACTIVE_POWER_MONTH_T3: false,
 *         MAX_REACTIVE_POWER_MONTH_T4: false,
 *         MAX_NEGATIVE_REACTIVE_POWER_DAY_T1: false,
 *         MAX_NEGATIVE_REACTIVE_POWER_DAY_T2: false,
 *         MAX_NEGATIVE_REACTIVE_POWER_DAY_T3: false,
 *         MAX_NEGATIVE_REACTIVE_POWER_DAY_T4: false,
 *         MAX_NEGATIVE_REACTIVE_POWER_MONTH_T1: false,
 *         MAX_NEGATIVE_REACTIVE_POWER_MONTH_T2: false,
 *         MAX_NEGATIVE_REACTIVE_POWER_MONTH_T3: false,
 *         MAX_NEGATIVE_REACTIVE_POWER_MONTH_T4: false,
 *         MAX_EXPORTED_ACTIVE_POWER_DAY_T1: false,
 *         MAX_EXPORTED_ACTIVE_POWER_DAY_T2: false,
 *         MAX_EXPORTED_ACTIVE_POWER_DAY_T3: false,
 *         MAX_EXPORTED_ACTIVE_POWER_DAY_T4: false,
 *         MAX_EXPORTED_ACTIVE_POWER_MONTH_T1: false,
 *         MAX_EXPORTED_ACTIVE_POWER_MONTH_T2: false,
 *         MAX_EXPORTED_ACTIVE_POWER_MONTH_T3: false
 *     },
 *     displaySet24: {
 *         MAX_EXPORTED_ACTIVE_POWER_MONTH_T4: false,
 *         MAX_EXPORTED_REACTIVE_POWER_DAY_T1: false,
 *         MAX_EXPORTED_REACTIVE_POWER_DAY_T2: false,
 *         MAX_EXPORTED_REACTIVE_POWER_DAY_T3: false,
 *         MAX_EXPORTED_REACTIVE_POWER_DAY_T4: false,
 *         MAX_EXPORTED_REACTIVE_POWER_MONTH_T1: false,
 *         MAX_EXPORTED_REACTIVE_POWER_MONTH_T2: false,
 *         MAX_EXPORTED_REACTIVE_POWER_MONTH_T3: false,
 *         MAX_EXPORTED_REACTIVE_POWER_MONTH_T4: false,
 *         MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T1: false,
 *         MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T2: false,
 *         MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T3: false,
 *         MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T4: false,
 *         MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T1: false,
 *         MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T2: false,
 *         MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T3: false,
 *         MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T4: false,
 *         HOUR_MINUTE_SECOND: false,
 *         DATE_MONTH_YEAR: false,
 *         CURRENT_TRANSFORMATION_RATIO: false,
 *         VOLTAGE_TRANSFORMATION_RATIO: false,
 *         CURRENT_BALANCE: false,
 *         POWER_THRESHOLD_T1: false,
 *         POWER_THRESHOLD_T2: false,
 *         POWER_THRESHOLD_T3: false,
 *         POWER_THRESHOLD_T4: false,
 *         OPTOPORT_SPEED: true,
 *         MAGNET_INDUCTION: false
 *     },
 *     channel1: 1,
 *     channel2: 2,
 *     channel3: 3,
 *     channel4: 4,
 *     channel5: 5,
 *     channel6: 6,
 *     timeCorrectPeriod: 24,
 *     timeCorrectPassHalfhour: true
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
            displaySet21: {
                SET_ALL_SEGMENT_DISPLAY: false,
                SOFTWARE_VERSION: false,
                TOTAL_ACTIVE_ENERGY: false,
                ACTIVE_ENERGY_T1: false,
                ACTIVE_ENERGY_T2: false,
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
            displaySet22: {
                CURRENT_IN_PHASE_A: false,
                CURRENT_IN_PHASE_B: false,
                CURRENT_IN_PHASE_C: false,
                CURRENT_IN_NEUTRAL: false,
                VOLTAGE_IN_PHASE_A: false,
                VOLTAGE_IN_PHASE_B: false,
                VOLTAGE_IN_PHASE_C: false,
                BATTERY_VOLTAGE: false,
                FREQUENCY: false,
                ACTIVE_POWER_SUM: false,
                ACTIVE_POWER_PHASE_A: false,
                ACTIVE_POWER_PHASE_B: false,
                ACTIVE_POWER_PHASE_C: false,
                REACTIVE_POWER_QPLUS_SUM: false,
                REACTIVE_POWER_QPLUS_PHASE_A: false,
                REACTIVE_POWER_QPLUS_PHASE_B: false,
                REACTIVE_POWER_QPLUS_PHASE_C: false,
                REACTIVE_POWER_QMINUS_SUM: false,
                REACTIVE_POWER_QMINUS_PHASE_A: false,
                REACTIVE_POWER_QMINUS_PHASE_B: false,
                REACTIVE_POWER_QMINUS_PHASE_C: false,
                POWER_COEFFICIENT_SUM: false,
                POWER_COEFFICIENT_PHASE_A: false,
                POWER_COEFFICIENT_PHASE_B: false,
                POWER_COEFFICIENT_PHASE_C: false,
                APPARENT_POWER_QPLUS_SUM: false,
                APPARENT_POWER_QPLUS_PHASE_A: false,
                APPARENT_POWER_QPLUS_PHASE_B: false,
                APPARENT_POWER_QPLUS_PHASE_C: false,
                APPARENT_POWER_QMINUS_SUM: false,
                APPARENT_POWER_QMINUS_PHASE_A: false,
                APPARENT_POWER_QMINUS_PHASE_B: false
            },
            displaySet23: {
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
            displaySet24: {
                MAX_EXPORTED_ACTIVE_POWER_MONTH_T4: false,
                MAX_EXPORTED_REACTIVE_POWER_DAY_T1: false,
                MAX_EXPORTED_REACTIVE_POWER_DAY_T2: false,
                MAX_EXPORTED_REACTIVE_POWER_DAY_T3: false,
                MAX_EXPORTED_REACTIVE_POWER_DAY_T4: false,
                MAX_EXPORTED_REACTIVE_POWER_MONTH_T1: false,
                MAX_EXPORTED_REACTIVE_POWER_MONTH_T2: false,
                MAX_EXPORTED_REACTIVE_POWER_MONTH_T3: false,
                MAX_EXPORTED_REACTIVE_POWER_MONTH_T4: false,
                MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T1: false,
                MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T2: false,
                MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T3: false,
                MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_DAY_T4: false,
                MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T1: false,
                MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T2: false,
                MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T3: false,
                MAX_NEGATIVE_EXPORTED_REACTIVE_POWER_MONTH_T4: false,
                HOUR_MINUTE_SECOND: false,
                DATE_MONTH_YEAR: false,
                CURRENT_TRANSFORMATION_RATIO: false,
                VOLTAGE_TRANSFORMATION_RATIO: false,
                CURRENT_BALANCE: false,
                POWER_THRESHOLD_T1: false,
                POWER_THRESHOLD_T2: false,
                POWER_THRESHOLD_T3: false,
                POWER_THRESHOLD_T4: false,
                OPTOPORT_SPEED: true,
                MAGNET_INDUCTION: false
            },
            channel1: 1,
            channel2: 2,
            channel3: 3,
            channel4: 4,
            channel5: 5,
            channel6: 6,
            timeCorrectPeriod: 24,
            timeCorrectPassHalfhour: true
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
            0x98 // timeCorrectPeriod with timeCorrectPassHalfhour
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
