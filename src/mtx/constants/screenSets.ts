import * as screenIds from './screenIds.js';


/**
 * List of {@link screenIds | available screens}.
 */
export const main = [
    screenIds.SET_ALL_SEGMENT_DISPLAY,
    screenIds.SOFTWARE_VERSION,
    screenIds.TOTAL_ACTIVE_ENERGY,
    screenIds.ACTIVE_ENERGY_T1,
    screenIds.ACTIVE_ENERGY_T2,
    screenIds.ACTIVE_ENERGY_T3,
    screenIds.ACTIVE_ENERGY_T4,
    screenIds.ACTIVE_POWER_PER_PHASE,
    screenIds.ACTIVE_POWER_IN_NEUTRAL,
    screenIds.CURRENT_IN_PHASE,
    screenIds.CURRENT_IN_NEUTRAL,
    screenIds.VOLTAGE,
    screenIds.HOUR_MINUTE_SECOND,
    screenIds.DATE_MONTH_YEAR,
    screenIds.TOTAL_EXPORTED_ACTIVE_ENERGY,
    screenIds.EXPORTED_ACTIVE_ENERGY_T1,
    screenIds.EXPORTED_ACTIVE_ENERGY_T2,
    screenIds.EXPORTED_ACTIVE_ENERGY_T3,
    screenIds.EXPORTED_ACTIVE_ENERGY_T4,
    screenIds.POWER_COEFFICIENT_PHASE_A,
    screenIds.POWER_COEFFICIENT_PHASE_B,
    screenIds.BATTERY_VOLTAGE,
    screenIds.POWER_THRESHOLD_T1,
    screenIds.POWER_THRESHOLD_T2,
    screenIds.POWER_THRESHOLD_T3,
    screenIds.POWER_THRESHOLD_T4,
    screenIds.CURRENT_BALANCE
];

/**
 * List of {@link screenIds | available screens}.
 */
export const extended = [
    ...main,
    screenIds.OPTOPORT_SPEED,
    screenIds.MAGNET_INDUCTION
];
