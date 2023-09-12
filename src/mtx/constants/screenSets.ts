import * as screenIds from './screenIds.js';


export const main = [
    screenIds.M_VERSION,
    screenIds.M_WH,
    screenIds.M_WH_T0,
    screenIds.M_WH_T1,
    screenIds.M_WH_T2,
    screenIds.M_WH_T3,
    screenIds.M_POWER,
    screenIds.M_POWER_B,
    screenIds.M_IRMS,
    screenIds.M_IRMS_B,
    screenIds.M_VRMS,
    screenIds.M_TIME,
    screenIds.M_DATE,
    screenIds.M_PF_A,
    screenIds.M_PF_B,
    screenIds.M_VBAT,
    screenIds.M_POWER_THRESHOLD_T0,
    screenIds.M_POWER_THRESHOLD_T1,
    screenIds.M_POWER_THRESHOLD_T2,
    screenIds.M_POWER_THRESHOLD_T3
];

export const extended = [
    ...main,
    screenIds.M_MAGNET_TESLA
];
