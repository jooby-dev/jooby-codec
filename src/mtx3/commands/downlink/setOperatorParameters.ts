/**
 * Downlink command to set device operator parameters.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as setOperatorParameters from 'jooby-codec/mtx3/commands/downlink/setOperatorParameters.js';
 * import CommandBinaryBuffer from 'jooby-codec/mtx3/utils/CommandBinaryBuffer.js';
 *
 * const parameters = CommandBinaryBuffer.getDefaultOperatorParameters();
 * const bytes = setOperatorParameters.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [
 *     31, 95, 0, 4, 11, 40, 0, 2, 97, 96, 0, 1, 212, 192, 0, 0,
 *     124, 56, 0, 0, 124, 56, 0, 0, 124, 56, 0, 0, 124, 56, 0, 0,
 *     124, 56, 0, 0, 124, 56, 0, 0, 124, 56, 0, 0, 124, 56, 30, 1,
 *     127, 7, 0, 0, 16, 133, 0, 2, 34, 0, 0, 0, 0, 0, 0, 0,
 *     3, 3, 68, 30, 30, 3, 0, 5, 55, 45, 0, 0, 0, 2, 0, 1,
 *     0, 1, 0, 1, 0, 1, 0, 0, 0, 5, 5, 5, 1, 128, 6, 0, 0
 * ]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx3/commands/SetOpParams.md#request)
 */

import * as command from '../../../mtx/utils/command.js';
import * as types from '../../types.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, IOperatorParameters, OPERATOR_PARAMETERS_SIZE} from '../../utils/CommandBinaryBuffer.js';
import {READ_WRITE} from '../../../mtx/constants/accessLevels.js';


export const id: types.TCommandId = 0x1f;
export const name: types.TCommandName = 'setOperatorParameters';
export const headerSize = 2;
export const maxSize = OPERATOR_PARAMETERS_SIZE;
export const accessLevel: types.TAccessLevel = READ_WRITE;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'set default operator parameters request': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            vpThreshold: 265000,
            vThreshold: 156000,
            ipThreshold: 120000,
            pmaxThreshold0: 31800,
            pmaxThreshold1: 31800,
            pmaxThreshold2: 31800,
            pmaxThreshold3: 31800,
            rmaxThreshold0: 31800,
            rmaxThreshold1: 31800,
            rmaxThreshold2: 31800,
            rmaxThreshold3: 31800,
            tint: 30,
            calcPeriodDate: 1,
            timeoutDisplay: 127,
            timeoutScreen: 7,
            displaySet1: {
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
            displaySet2: {
                CURRENT_IN_PHASE_A: false,
                CURRENT_IN_PHASE_B: false,
                CURRENT_IN_PHASE_C: false,
                CURRENT_IN_NEUTRAL: false,
                VOLTAGE_IN_PHASE_A: false,
                VOLTAGE_IN_PHASE_B: false,
                VOLTAGE_IN_PHASE_C: false,
                BATTERY_VOLTAGE: false,
                FREQUENCY: false,
                ACTIVE_POWER_SUM: true,
                ACTIVE_POWER_PHASE_A: false,
                ACTIVE_POWER_PHASE_B: false,
                ACTIVE_POWER_PHASE_C: false,
                REACTIVE_POWER_QPLUS_SUM: true,
                REACTIVE_POWER_QPLUS_PHASE_A: false,
                REACTIVE_POWER_QPLUS_PHASE_B: false,
                REACTIVE_POWER_QPLUS_PHASE_C: false,
                REACTIVE_POWER_QMINUS_SUM: true,
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
            displaySet3: {
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
            relaySet: {
                RELAY_ON_Y: true,
                RELAY_ON_CENTER: true,
                RELAY_ON_PB: false,
                RELAY_ON_TARIFF_0: false,
                RELAY_ON_TARIFF_1: false,
                RELAY_ON_TARIFF_2: false,
                RELAY_ON_TARIFF_3: false,
                RELAY_ON_V_GOOD: false,
                RELAY_OFF_Y: true,
                RELAY_OFF_CENTER: true,
                RELAY_OFF_TARIFF_0: false,
                RELAY_OFF_TARIFF_1: false,
                RELAY_OFF_TARIFF_2: false,
                RELAY_OFF_TARIFF_3: false,
                RELAY_OFF_I_LIMIT: false,
                RELAY_OFF_V_BAD: false,
                RELAY_OFF_DIFF_BAD: false,
                RELAY_OFF_LIM_TARIFF_0: false,
                RELAY_OFF_LIM_TARIFF_1: false,
                RELAY_OFF_LIM_TARIFF_2: false,
                RELAY_OFF_LIM_TARIFF_3: false,
                RELAY_OFF_LIM_VAR_TARIFF_0: false,
                RELAY_OFF_LIM_VAR_TARIFF_1: false,
                RELAY_OFF_LIM_VAR_TARIFF_2: false,
                RELAY_OFF_LIM_VAR_TARIFF_3: false,
                RELAY_ON_PF_MIN: false,
                RELAY_OFF_PF_MIN: false,
                RELAY_ON_TIMEOUT: false,
                RELAY_ON_SALDO: false,
                RELAY_OFF_SALDO: false,
                RELAY_OFF_SALDO_SOFT: false
            },
            speedOptoPort: {plc: 9600, optoport: 9600},
            ten: 30,
            tu: 30,
            timeIntervalPowerOff: 3,
            reserved: 0,
            timeoutBadVAVB: 5,
            freqMax: 55,
            freqMin: 45,
            year: 0,
            month: 0,
            date: 0,
            energyDecimalPoint: 2,
            voltageTransformationRatioNumerator: 1,
            voltageTransformationRatioDenominator: 1,
            currentTransformationRatioNumerator: 1,
            currentTransformationRatioDenominator: 1,
            typeMeter: {
                TRANSFORMATION_RATIO: false,
                METER_TYPE_R: false,
                ACCUMULATE_BY_R_PLUS_MINUS: false
            },
            phMin: 0,
            timeoutIMax: 5,
            timeoutPMax: 5,
            timeoutCos: 5,
            pMaxDef: 1,
            displaySet4: {
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
                HOUR_MINUTE_SECOND: true,
                DATE_MONTH_YEAR: true,
                CURRENT_TRANSFORMATION_RATIO: false,
                VOLTAGE_TRANSFORMATION_RATIO: false,
                CURRENT_BALANCE: false,
                POWER_THRESHOLD_T1: false,
                POWER_THRESHOLD_T2: false,
                POWER_THRESHOLD_T3: false,
                POWER_THRESHOLD_T4: false,
                OPTOPORT_SPEED: false,
                MAGNET_INDUCTION: false,
                SORT_DISPLAY_SCREENS: false,
                TURN_OFF_DISPLAY: false,
                AUTO_SCREEN_SCROLLING: true
            }
        },
        bytes: [
            0x1f, 0x5f,
            0x00, 0x04, 0x0b, 0x28, 0x00, 0x02, 0x61, 0x60, 0x00, 0x01, 0xd4, 0xc0, 0x00, 0x00, 0x7c, 0x38,
            0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38,
            0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x1e, 0x01, 0x7f, 0x07,
            0x00, 0x00, 0x10, 0x85, 0x00, 0x02, 0x22, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, 0x03,
            0x44, 0x1e, 0x1e, 0x03, 0x00, 0x05, 0x37, 0x2d, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0x00, 0x01,
            0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x05, 0x05, 0x05, 0x01, 0x80, 0x06, 0x00, 0x00
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( bytes: types.TBytes ): IOperatorParameters => {
    if ( bytes.length !== maxSize ) {
        throw new Error('Invalid SetOpParams data size.');
    }

    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    return buffer.getOperatorParameters();
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IOperatorParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    buffer.setOperatorParameters(parameters);

    return command.toBytes(id, buffer.data);
};
