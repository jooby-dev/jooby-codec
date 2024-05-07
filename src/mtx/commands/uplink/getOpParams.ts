/**
 * Uplink command to get device operator parameters.
 *
 * The corresponding downlink command: `getOpParams`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getOpParams from 'jooby-codec/obis-observer/commands/uplink/getOpParams.js';
 * import {getDefaultOperatorParameters} from 'jooby-codec/mtx/utils/CommandBinaryBuffer.js';
 *
 * // get default operator parameters response
 * const bytes = [
 *     0x00, 0x04, 0x0b, 0x28, 0x00, 0x02, 0x61, 0x60, 0x00, 0x01, 0xd4, 0xc0, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38,
 *     0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x1e, 0x01, 0x7f, 0x07, 0x80, 0x00, 0x31, 0x84, 0x00, 0x00, 0x03,
 *     0x03, 0x00, 0x00, 0x00, 0xf0, 0x0f, 0x05, 0x05, 0x00, 0x01, 0x00, 0x05, 0x05, 0x37, 0x2d, 0x00, 0x00, 0x00, 0x00, 0x00,
 *     0x02, 0x00, 0x05, 0x05, 0x05, 0x01, 0x08, 0x38, 0x3f, 0xff, 0x05, 0x05, 0x00, 0x18
 * ];
 *
 * // decoded payload
 * const parameters = getOpParams.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * // same as getDefaultOperatorParameters()
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/uplink/GetOpParams.md#response)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, IOperatorParameters, OPERATOR_PARAMETERS_SIZE} from '../../utils/CommandBinaryBuffer.js';


export const id: types.TCommandId = 0x1e;
export const name: types.TCommandName = 'getOpParams';
export const headerSize = 2;
export const maxSize = OPERATOR_PARAMETERS_SIZE;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'get default operator parameters response': {
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
            speedOptoPort: 0,
            tint: 30,
            calcPeriodDate: 1,
            timeoutDisplay: 127,
            timeoutScreen: 7,
            displaySet: {
                SET_ALL_SEGMENT_DISPLAY: false,
                SOFTWARE_VERSION: false,
                TOTAL_ACTIVE_ENERGY: true,
                ACTIVE_ENERGY_T1: false,
                ACTIVE_ENERGY_T2: false,
                ACTIVE_ENERGY_T3: false,
                ACTIVE_ENERGY_T4: false,
                ACTIVE_POWER_PER_PHASE: true,
                ACTIVE_POWER_IN_NEUTRAL: true,
                CURRENT_IN_PHASE: false,
                CURRENT_IN_NEUTRAL: false,
                VOLTAGE: false,
                HOUR_MINUTE_SECOND: true,
                DATE_MONTH_YEAR: true,
                TOTAL_EXPORTED_ACTIVE_ENERGY: false,
                EXPORTED_ACTIVE_ENERGY_T1: false,
                EXPORTED_ACTIVE_ENERGY_T2: false,
                EXPORTED_ACTIVE_ENERGY_T3: false,
                EXPORTED_ACTIVE_ENERGY_T4: false,
                POWER_COEFFICIENT_PHASE_A: false,
                POWER_COEFFICIENT_PHASE_B: false,
                BATTERY_VOLTAGE: false,
                POWER_THRESHOLD_T1: false,
                POWER_THRESHOLD_T2: false,
                POWER_THRESHOLD_T3: false,
                POWER_THRESHOLD_T4: false,
                CURRENT_BALANCE: false,
                AUTO_SCREEN_SCROLLING: true
            },
            relaySet4: {
                RELAY_ON_TIMEOUT: false,
                RELAY_ON_SALDO: false,
                RELAY_OFF_SALDO: false,
                RELAY_OFF_SALDO_SOFT: false,
                RELAY_OFF_MAGNET: false,
                RELAY_ON_MAGNET_TIMEOUT: false,
                RELAY_ON_MAGNET_AUTO: false
            },
            relaySet3: {
                RELAY_OFF_LIM_TARIFF_0: false,
                RELAY_OFF_LIM_TARIFF_1: false,
                RELAY_OFF_LIM_TARIFF_2: false,
                RELAY_OFF_LIM_TARIFF_3: false,
                RELAY_OFF_PF_MIN: false
            },
            relaySet2: {
                RELAY_OFF_Y: true,
                RELAY_OFF_CENTER: true,
                RELAY_OFF_TARIFF_0: false,
                RELAY_OFF_TARIFF_1: false,
                RELAY_OFF_TARIFF_2: false,
                RELAY_OFF_TARIFF_3: false,
                RELAY_OFF_I_LIMIT: false,
                RELAY_OFF_V_BAD: false
            },
            relaySet1: {
                RELAY_ON_Y: true,
                RELAY_ON_CENTER: true,
                RELAY_ON_PB: false,
                RELAY_ON_TARIFF_0: false,
                RELAY_ON_TARIFF_1: false,
                RELAY_ON_TARIFF_2: false,
                RELAY_ON_TARIFF_3: false,
                RELAY_ON_V_GOOD: false
            },
            displayType: 0,
            ten: 0,
            timeoutRefresh: 240,
            deltaCorMin: 15,
            timeoutMagnetOff: 5,
            timeoutMagnetOn: 5,
            define1: {BLOCK_KEY_OPTOPORT: false, MAGNET_SCREEN_CONST: false},
            timeoutRelayOn: 1,
            timeoutRelayKey: 0,
            timeoutRelayAuto: 5,
            timeoutBadVAVB: 5,
            freqMax: 55,
            freqMin: 45,
            phMin: 0,
            year: 0,
            month: 0,
            date: 0,
            energyDecimalPoint: 2,
            typeMeter: 0,
            timeoutIMax: 5,
            timeoutPMax: 5,
            timeoutCos: 5,
            pMaxDef: 1,
            displaySetExt: {
                SET_ALL_SEGMENT_DISPLAY: true,
                SOFTWARE_VERSION: true,
                TOTAL_ACTIVE_ENERGY: true,
                ACTIVE_ENERGY_T1: true,
                ACTIVE_ENERGY_T2: true,
                ACTIVE_ENERGY_T3: true,
                ACTIVE_ENERGY_T4: true,
                ACTIVE_POWER_PER_PHASE: true,
                ACTIVE_POWER_IN_NEUTRAL: true,
                CURRENT_IN_PHASE: true,
                CURRENT_IN_NEUTRAL: true,
                VOLTAGE: true,
                HOUR_MINUTE_SECOND: true,
                DATE_MONTH_YEAR: true,
                TOTAL_EXPORTED_ACTIVE_ENERGY: false,
                EXPORTED_ACTIVE_ENERGY_T1: false,
                EXPORTED_ACTIVE_ENERGY_T2: false,
                EXPORTED_ACTIVE_ENERGY_T3: false,
                EXPORTED_ACTIVE_ENERGY_T4: false,
                POWER_COEFFICIENT_PHASE_A: true,
                POWER_COEFFICIENT_PHASE_B: true,
                BATTERY_VOLTAGE: true,
                POWER_THRESHOLD_T1: false,
                POWER_THRESHOLD_T2: false,
                POWER_THRESHOLD_T3: false,
                POWER_THRESHOLD_T4: false,
                CURRENT_BALANCE: false,
                MAGNET_INDUCTION: true,
                OPTOPORT_SPEED: false,
                SORT_DISPLAY_SCREENS: false
            },
            timeoutUneqCurrent: 5,
            timeoutBipolarPower: 5,
            relaySet5: {
                RELAY_OFF_UNEQUAL_CURRENT: false,
                RELAY_ON_UNEQUAL_CURRENT: false,
                RELAY_OFF_BIPOLAR_POWER: false,
                RELAY_ON_BIPOLAR_POWER: false
            },
            timeCorrectPeriod: 24,
            timeCorrectPassHalfhour: false
        },
        bytes: [
            0x1e, 0x4a,
            0x00, 0x04, 0x0b, 0x28, 0x00, 0x02, 0x61, 0x60, 0x00, 0x01, 0xd4, 0xc0, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38,
            0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x1e, 0x01, 0x7f, 0x07, 0x80, 0x00, 0x31, 0x84, 0x00, 0x00, 0x03,
            0x03, 0x00, 0x00, 0x00, 0xf0, 0x0f, 0x05, 0x05, 0x00, 0x01, 0x00, 0x05, 0x05, 0x37, 0x2d, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x02, 0x00, 0x05, 0x05, 0x05, 0x01, 0x08, 0x38, 0x3f, 0xff, 0x05, 0x05, 0x00, 0x18
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
