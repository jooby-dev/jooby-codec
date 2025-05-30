/**
 * Each device has 2 display sets: `123` main screens and `125` extended screens.
 * A set is a combination of the following {@link screenIds}.
 *
 * @packageDocumentation
 */

import * as screenIds from './screenIds.js';

/**
 * List of {@link screenIds | available screens} for the main display set.
 */
export const main = [
    screenIds.SET_ALL_SEGMENT_DISPLAY,
    screenIds.SOFTWARE_VERSION,
    screenIds.TOTAL_ACTIVE_ENERGY,
    screenIds.ACTIVE_ENERGY_T1,
    screenIds.ACTIVE_ENERGY_T2,
    screenIds.ACTIVE_ENERGY_T3,
    screenIds.ACTIVE_ENERGY_T4,
    screenIds.TOTAL_REACTIVE_ENERGY,
    screenIds.REACTIVE_ENERGY_T1,
    screenIds.REACTIVE_ENERGY_T2,
    screenIds.REACTIVE_ENERGY_T3,
    screenIds.REACTIVE_ENERGY_T4,
    screenIds.TOTAL_NEGATIVE_REACTIVE_ENERGY,
    screenIds.NEGATIVE_REACTIVE_ENERGY_T1,
    screenIds.NEGATIVE_REACTIVE_ENERGY_T2,
    screenIds.NEGATIVE_REACTIVE_ENERGY_T3,
    screenIds.NEGATIVE_REACTIVE_ENERGY_T4,
    screenIds.TOTAL_EXPORTED_ACTIVE_ENERGY,
    screenIds.EXPORTED_ACTIVE_ENERGY_T1,
    screenIds.EXPORTED_ACTIVE_ENERGY_T2,
    screenIds.EXPORTED_ACTIVE_ENERGY_T3,
    screenIds.EXPORTED_ACTIVE_ENERGY_T4,
    screenIds.TOTAL_EXPORTED_REACTIVE_ENERGY,
    screenIds.EXPORTED_REACTIVE_ENERGY_T1,
    screenIds.EXPORTED_REACTIVE_ENERGY_T2,
    screenIds.EXPORTED_REACTIVE_ENERGY_T3,
    screenIds.EXPORTED_REACTIVE_ENERGY_T4,
    screenIds.TOTAL_EXPORTED_NEGATIVE_REACTIVE_ENERGY,
    screenIds.EXPORTED_NEGATIVE_REACTIVE_ENERGY_T1,
    screenIds.EXPORTED_NEGATIVE_REACTIVE_ENERGY_T2,
    screenIds.EXPORTED_NEGATIVE_REACTIVE_ENERGY_T3,
    screenIds.EXPORTED_NEGATIVE_REACTIVE_ENERGY_T4,
    screenIds.CURRENT_IN_PHASE_A,
    screenIds.CURRENT_IN_PHASE_B,
    screenIds.CURRENT_IN_PHASE_C,
    screenIds.CURRENT_IN_NEUTRAL,
    screenIds.VOLTAGE_IN_PHASE_A,
    screenIds.VOLTAGE_IN_PHASE_B,
    screenIds.VOLTAGE_IN_PHASE_C,
    screenIds.BATTERY_VOLTAGE,
    screenIds.SUPPLY_FREQUENCY,
    screenIds.TOTAL_ACTIVE_POWER,
    screenIds.ACTIVE_POWER_PHASE_A,
    screenIds.ACTIVE_POWER_PHASE_B,
    screenIds.ACTIVE_POWER_PHASE_C,
    screenIds.TOTAL_REACTIVE_POWER_QPLUS,
    screenIds.REACTIVE_POWER_QPLUS_PHASE_A,
    screenIds.REACTIVE_POWER_QPLUS_PHASE_B,
    screenIds.REACTIVE_POWER_QPLUS_PHASE_C,
    screenIds.TOTAL_REACTIVE_POWER_QMINUS,
    screenIds.REACTIVE_POWER_QMINUS_PHASE_A,
    screenIds.REACTIVE_POWER_QMINUS_PHASE_B,
    screenIds.REACTIVE_POWER_QMINUS_PHASE_C,
    screenIds.TOTAL_POWER_FACTOR,
    screenIds.POWER_FACTOR_PHASE_A,
    screenIds.POWER_FACTOR_PHASE_B,
    screenIds.POWER_FACTOR_PHASE_C,
    screenIds.TOTAL_APPARENT_POWER_QPLUS,
    screenIds.APPARENT_POWER_QPLUS_PHASE_A,
    screenIds.APPARENT_POWER_QPLUS_PHASE_B,
    screenIds.APPARENT_POWER_QPLUS_PHASE_C,
    screenIds.TOTAL_APPARENT_POWER_QMINUS,
    screenIds.APPARENT_POWER_QMINUS_PHASE_A,
    screenIds.APPARENT_POWER_QMINUS_PHASE_B,
    screenIds.APPARENT_POWER_QMINUS_PHASE_C,
    screenIds.MAX_ACTIVE_POWER_DAY_T1,
    screenIds.MAX_ACTIVE_POWER_DAY_T2,
    screenIds.MAX_ACTIVE_POWER_DAY_T3,
    screenIds.MAX_ACTIVE_POWER_DAY_T4,
    screenIds.MAX_ACTIVE_POWER_MONTH_T1,
    screenIds.MAX_ACTIVE_POWER_MONTH_T2,
    screenIds.MAX_ACTIVE_POWER_MONTH_T3,
    screenIds.MAX_ACTIVE_POWER_MONTH_T4,
    screenIds.MAX_REACTIVE_POWER_DAY_T1,
    screenIds.MAX_REACTIVE_POWER_DAY_T2,
    screenIds.MAX_REACTIVE_POWER_DAY_T3,
    screenIds.MAX_REACTIVE_POWER_DAY_T4,
    screenIds.MAX_REACTIVE_POWER_MONTH_T1,
    screenIds.MAX_REACTIVE_POWER_MONTH_T2,
    screenIds.MAX_REACTIVE_POWER_MONTH_T3,
    screenIds.MAX_REACTIVE_POWER_MONTH_T4,
    screenIds.MAX_NEGATIVE_REACTIVE_POWER_DAY_T1,
    screenIds.MAX_NEGATIVE_REACTIVE_POWER_DAY_T2,
    screenIds.MAX_NEGATIVE_REACTIVE_POWER_DAY_T3,
    screenIds.MAX_NEGATIVE_REACTIVE_POWER_DAY_T4,
    screenIds.MAX_NEGATIVE_REACTIVE_POWER_MONTH_T1,
    screenIds.MAX_NEGATIVE_REACTIVE_POWER_MONTH_T2,
    screenIds.MAX_NEGATIVE_REACTIVE_POWER_MONTH_T3,
    screenIds.MAX_NEGATIVE_REACTIVE_POWER_MONTH_T4,
    screenIds.MAX_EXPORTED_ACTIVE_POWER_DAY_T1,
    screenIds.MAX_EXPORTED_ACTIVE_POWER_DAY_T2,
    screenIds.MAX_EXPORTED_ACTIVE_POWER_DAY_T3,
    screenIds.MAX_EXPORTED_ACTIVE_POWER_DAY_T4,
    screenIds.MAX_EXPORTED_ACTIVE_POWER_MONTH_T1,
    screenIds.MAX_EXPORTED_ACTIVE_POWER_MONTH_T2,
    screenIds.MAX_EXPORTED_ACTIVE_POWER_MONTH_T3,
    screenIds.MAX_EXPORTED_ACTIVE_POWER_MONTH_T4,
    screenIds.MAX_EXPORTED_REACTIVE_POWER_DAY_T1,
    screenIds.MAX_EXPORTED_REACTIVE_POWER_DAY_T2,
    screenIds.MAX_EXPORTED_REACTIVE_POWER_DAY_T3,
    screenIds.MAX_EXPORTED_REACTIVE_POWER_DAY_T4,
    screenIds.MAX_EXPORTED_REACTIVE_POWER_MONTH_T1,
    screenIds.MAX_EXPORTED_REACTIVE_POWER_MONTH_T2,
    screenIds.MAX_EXPORTED_REACTIVE_POWER_MONTH_T3,
    screenIds.MAX_EXPORTED_REACTIVE_POWER_MONTH_T4,
    screenIds.MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T1,
    screenIds.MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T2,
    screenIds.MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T3,
    screenIds.MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_DAY_T4,
    screenIds.MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T1,
    screenIds.MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T2,
    screenIds.MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T3,
    screenIds.MAX_EXPORTED_NEGATIVE_REACTIVE_POWER_MONTH_T4,
    screenIds.HOUR_MINUTE_SECOND,
    screenIds.DATE_MONTH_YEAR,
    screenIds.CURRENT_TRANSFORMATION_RATIO,
    screenIds.VOLTAGE_TRANSFORMATION_RATIO,
    screenIds.CURRENT_BALANCE,
    screenIds.POWER_THRESHOLD_T1,
    screenIds.POWER_THRESHOLD_T2,
    screenIds.POWER_THRESHOLD_T3,
    screenIds.POWER_THRESHOLD_T4
];

/**
 * List of {@link screenIds | available screens} for the extended display set.
 */
export const extended = [
    ...main,
    screenIds.OPTOPORT_SPEED,
    screenIds.MAGNET_INDUCTION
];
