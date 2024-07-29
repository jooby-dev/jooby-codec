/**
 * Tariff `1` cumulative register values lost.
 *
 * Indication code: `C.001`.
 */
export const ENERGY_T0_FAULT = 0x01;

/**
 * Tariff `2` cumulative register values lost.
 *
 * Indication code: `C.002`.
 */
export const ENERGY_T1_FAULT = 0x02;

/**
 * Tariff `3` cumulative register values lost.
 *
 * Indication code: `C.003`.
 */
export const ENERGY_T2_FAULT = 0x03;

/**
 * Tariff `4` cumulative register values lost.
 *
 * Indication code: `C.004`.
 */
export const ENERGY_T3_FAULT = 0x04;

/**
 * Access locked until end of day due to key access errors.
 *
 * Indication code: `C.017`.
 */
export const ACCESS_LOCKED = 0x11;

/**
 * Access unlocked.
 *
 * Indication code: `C.018`.
 */
export const ACCESS_UNLOCKED = 0x12;

/**
 * Invalid access key.
 *
 * Indication code: `C.019`.
 */
export const ERR_ACCESS = 0x13;

/**
 * Meter case opened.
 *
 * Indication code: `C.020`.
 */
export const CASE_OPEN = 0x14;

/**
 * Meter case closed.
 *
 * Indication code: `C.021`.
 */
export const CASE_CLOSE = 0x15;

/**
 * Constant magnetic field influence detected.
 *
 * Indication code: `C.022`.
 */
export const MAGNETIC_ON = 0x16;

/**
 * Constant magnetic field influence ceased.
 *
 * Indication code: `C.023`.
 */
export const MAGNETIC_OFF = 0x17;

/**
 * Access key level `0` changed.
 *
 * Indication code: `C.024`.
 */
export const CHANGE_ACCESS_KEY0 = 0x20;

/**
 * Access key level `1` changed.
 *
 * Indication code: `C.025`.
 */
export const CHANGE_ACCESS_KEY1 = 0x21;

/**
 * Access key level `2` changed.
 *
 * Indication code: `C.026`.
 */
export const CHANGE_ACCESS_KEY2 = 0x22;

/**
 * Access key level `3` changed.
 *
 * Indication code: `C.027`.
 */
export const CHANGE_ACCESS_KEY3 = 0x23;

/**
 * Parameters changed locally.
 *
 * Indication code: `C.028`.
 */
export const CHANGE_PARAMETERS_LOCAL = 0x24;

/**
 * Parameters changed remotely.
 *
 * Indication code: `C.029`.
 */
export const CHANGE_PARAMETERS_REMOTE = 0x25;

/**
 * Time set command received. Time set.
 *
 * Indication code: `C.030`.
 */
export const CMD_CHANGE_TIME = 0x26;

/**
 * `Relay on` command received.
 *
 * Indication code: `C.031`.
 */
export const CMD_RELAY_ON = 0x27;

/**
 * `Relay off` command received.
 *
 * Indication code: `C.032`.
 */
export const CMD_RELAY_OFF = 0x28;

/**
 * Energy cumulative register overflow.
 *
 * Indication code: `C.049`.
 */
export const ENERGY_REGISTER_OVERFLOW = 0x31;

/**
 * Tariff plan changed.
 *
 * Indication code: `C.050`.
 */
export const CHANGE_TARIFF_TABLE = 0x32;

/**
 * New tariff plan received.
 *
 * Indication code: `C.051`.
 */
export const SET_TARIFF_TABLE = 0x33;

/**
 * Switched to summer time.
 *
 * Indication code: `C.052`.
 */
export const SUMMER_TIME = 0x34;

/**
 * Switched to winter time.
 *
 * Indication code: `C.053`.
 */
export const WINTER_TIME = 0x35;

/**
 * Relay turned on.
 *
 * Indication code: `C.054`.
 */
export const RELAY_ON = 0x36;

/**
 * Relay turned off.
 *
 * Indication code: `C.055`.
 */
export const RELAY_OFF = 0x37;

/**
 * Microcontroller program restart.
 *
 * Indication code: `C.056`.
 */
export const RESTART = 0x38;

/**
 * Watchdog restart event.
 *
 * Indication code: `C.057`.
 */
export const WD_RESTART = 0x39;

/**
 * Voltage phase `A` returned to normal after high.
 *
 * Indication code: `C.064`.
 */
export const VA_MAX_OK = 0x40;

/**
 * Voltage phase `A` above maximum threshold.
 *
 * Indication code: `C.065`.
 */
export const VA_MAX_OVER = 0x41;

/**
 * Voltage phase `A` returned to normal after low.
 *
 * Indication code: `C.066`.
 */
export const VA_MIN_OK = 0x42;

/**
 * Voltage phase `A` below minimum threshold.
 *
 * Indication code: `C.067`.
 */
export const VA_MIN_UNDER = 0x43;

/**
 * Voltage phase `B` returned to normal after high.
 *
 * Indication code: `C.068`.
 */
export const VB_MAX_OK = 0x44;

/**
 * Voltage phase `B` above maximum threshold.
 *
 * Indication code: `C.069`.
 */
export const VB_MAX_OVER = 0x45;

/**
 * Voltage phase `B` returned to normal after low.
 *
 * Indication code: `C.070`.
 */
export const VB_MIN_OK = 0x46;

/**
 * Voltage phase `B` below minimum threshold.
 *
 * Indication code: `C.071`.
 */
export const VB_MIN_UNDER = 0x47;

/**
 * Voltage phase `C` returned to normal after high.
 *
 * Indication code: `C.072`.
 */
export const VC_MAX_OK = 0x48;

/**
 * Voltage phase `C` above maximum threshold.
 *
 * Indication code: `C.073`.
 */
export const VC_MAX_OVER = 0x49;

/**
 * Voltage phase `C` returned to normal after low.
 *
 * Indication code: `C.074`.
 */
export const VC_MIN_OK = 0x4A;

/**
 * Voltage phase `C` below minimum threshold.
 *
 * Indication code: `C.075`.
 */
export const VC_MIN_UNDER = 0x4B;

/**
 * Frequency returned to normal after high.
 *
 * Indication code: `C.076`.
 */
export const F_MAX_OK = 0x4C;

/**
 * Frequency above maximum threshold.
 *
 * Indication code: `C.077`.
 */
export const F_MAX_OVER = 0x4D;

/**
 * Frequency returned to normal after low.
 *
 * Indication code: `C.078`.
 */
export const F_MIN_OK = 0x4E;

/**
 * Frequency below minimum threshold.
 *
 * Indication code: `C.079`.
 */
export const F_MIN_UNDER = 0x4F;

/**
 * Temperature returned to normal after high.
 *
 * Indication code: `C.080`.
 */
export const T_MAX_OK = 0x50;

/**
 * Temperature above maximum threshold.
 *
 * Indication code: `C.081`.
 */
export const T_MAX_OVER = 0x51;

/**
 * Temperature returned to normal after low.
 *
 * Indication code: `C.082`.
 */
export const T_MIN_OK = 0x52;

/**
 * Temperature below minimum threshold.
 *
 * Indication code: `C.083`.
 */
export const T_MIN_UNDER = 0x53;

/**
 * Current phase `A` returned to normal after high.
 *
 * Indication code: `C.084`.
 */
export const IA_MAX_OK = 0x54;

/**
 * Current phase `A` above maximum threshold.
 *
 * Indication code: `C.085`.
 */
export const IA_MAX_OVER = 0x55;

/**
 * Current phase `B` returned to normal after high.
 *
 * Indication code: `C.086`.
 */
export const IB_MAX_OK = 0x56;

/**
 * Current phase `B` above maximum threshold.
 *
 * Indication code: `C.087`.
 */
export const IB_MAX_OVER = 0x57;

/**
 * Current phase `C` returned to normal after high.
 *
 * Indication code: `C.088`.
 */
export const IC_MAX_OK = 0x58;

/**
 * Current phase `C` above maximum threshold.
 *
 * Indication code: `C.089`.
 */
export const IC_MAX_OVER = 0x59;

/**
 * Active power returned to normal after high.
 *
 * Indication code: `C.090`.
 */
export const PA_MAX_OK = 0x5A;

/**
 * Active power above maximum threshold.
 *
 * Indication code: `C.091`.
 */
export const PA_MAX_OVER = 0x5B;

/**
 * Reactive power returned to normal after high.
 *
 * Indication code: `C.092`.
 */
export const PV_MAX_OK = 0x5C;

/**
 * Reactive power above maximum threshold.
 *
 * Indication code: `C.093`.
 */
export const PV_MAX_OVER = 0x5D;

/**
 * Differential current returned to normal after high.
 *
 * Indication code: `C.094`.
 */
export const IDIFF_OK = 0x5E;

/**
 * Differential current above maximum threshold.
 *
 * Indication code: `C.095`.
 */
export const IDIFF_OVER = 0x5F;

/**
 * Real-time clock returned to normal.
 *
 * Indication code: `C.096`.
 */
export const CLOCK_OK = 0x60;

/**
 * Real-time clock fault.
 *
 * Indication code: `C.097`.
 */
export const CLOCK_FAULT = 0x61;

/**
 * Phase `C` voltage turned on.
 *
 * Indication code: `C.098`.
 */
export const POWER_C_ON = 0x62;

/**
 * Phase `C` voltage turned off.
 *
 * Indication code: `C.099`.
 */
export const POWER_C_OFF = 0x63;

/**
 * Phase `B` voltage turned on.
 *
 * Indication code: `C.100`.
 */
export const POWER_B_ON = 0x64;

/**
 * Phase `B` voltage turned off.
 *
 * Indication code: `C.101`.
 */
export const POWER_B_OFF = 0x65;

/**
 * Phase `A` voltage turned on.
 *
 * Indication code: `C.102`.
 */
export const POWER_A_ON = 0x66;

/**
 * Phase `A` voltage turned off.
 *
 * Indication code: `C.103`.
 */
export const POWER_A_OFF = 0x67;

/**
 * Battery voltage returned to normal.
 *
 * Indication code: `C.104`.
 */
export const BATTERY_OK = 0x68;

/**
 * Battery voltage low.
 *
 * Indication code: `C.105`.
 */
export const BATTERY_FAULT = 0x69;

/**
 * Calibration parameters set.
 *
 * Indication code: `C.106`.
 */
export const CALIBRATION_OK = 0x6A;

/**
 * Calibration parameters lost.
 *
 * Indication code: `C.107`.
 */
export const CALIBRATION_FAULT = 0x6B;

/**
 * Factory parameters set.
 *
 * Indication code: `C.108`.
 */
export const V_PARAMETERS_OK = 0x6C;

/**
 * Factory parameters lost.
 *
 * Indication code: `C.109`.
 */
export const V_PARAMETERS_FAULT = 0x6D;

/**
 * Parameters set.
 *
 * Indication code: `C.110`.
 */
export const O_PARAMETERS_OK = 0x6E;

/**
 * Parameters lost.
 *
 * Indication code: `C.111`.
 */
export const O_PARAMETERS_FAULT = 0x6F;

/**
 * Daylight saving time transition parameters changed.
 *
 * Indication code: `C.112`.
 */
export const CHANGE_COR_TIME = 0x70;

/**
 * Second relay turned on.
 *
 * Indication code: `C.113`.
 */
export const CMD_RELAY_2_ON = 0x71;

/**
 * Second relay turned off.
 *
 * Indication code: `C.114`.
 */
export const CMD_RELAY_2_OFF = 0x72;

/**
 * Active energy counter tariff `1` crossed zero at `1000000.00` `kW`.
 *
 * Indication code: `C.115`.
 */
export const CROSS_ZERO_ENT0 = 0x73;

/**
 * Active energy counter tariff `2` crossed zero at `1000000.00` `kW`.
 *
 * Indication code: `C.116`.
 */
export const CROSS_ZERO_ENT1 = 0x74;

/**
 * Active energy counter tariff `3` crossed zero at `1000000.00` `kW`.
 *
 * Indication code: `C.117`.
 */
export const CROSS_ZERO_ENT2 = 0x75;

/**
 * Active energy counter tariff `4` crossed zero at `1000000.00` `kW`.
 *
 * Indication code: `C.118`.
 */
export const CROSS_ZERO_ENT3 = 0x76;

/**
 * Reactive positive energy counter tariff `1` crossed zero at `1000000.00` `kVar`.
 *
 * Indication code: `C.119`.
 */
export const CROSS_ZERO_VARI0 = 0x77;

/**
 * Reactive positive energy counter tariff `2` crossed zero at `1000000.00` `kVar`.
 *
 * Indication code: `C.120`.
 */
export const CROSS_ZERO_VARI1 = 0x78;

/**
 * Reactive positive energy counter tariff `3` crossed zero at `1000000.00` `kVar`.
 *
 * Indication code: `C.121`.
 */
export const CROSS_ZERO_VARI2 = 0x79;

/**
 * Reactive positive energy counter tariff `4` crossed zero at `1000000.00` `kVar`.
 *
 * Indication code: `C.122`.
 */
export const CROSS_ZERO_VARI3 = 0x7A;

/**
 * Reactive negative energy counter tariff `1` crossed zero at `1000000.00` `kVar`.
 *
 * Indication code: `C.123`.
 */
export const CROSS_ZERO_VARE0 = 0x7B;

/**
 * Reactive negative energy counter tariff `2` crossed zero at `1000000.00` `kVar`.
 *
 * Indication code: `C.124`.
 */
export const CROSS_ZERO_VARE1 = 0x7C;

/**
 * Reactive negative energy counter tariff `3` crossed zero at `1000000.00` `kVar`.
 *
 * Indication code: `C.125`.
 */
export const CROSS_ZERO_VARE2 = 0x7D;

/**
 * Reactive negative energy counter tariff `4` crossed zero at `1000000.00` `kVar`.
 *
 * Indication code: `C.126`.
 */
export const CROSS_ZERO_VARE3 = 0x7E;

/**
 * Calibration flag set.
 *
 * Indication code: `C.127`.
 */
export const CALIBRATION_FLAG_SET = 0x7F;

/**
 * Calibration flag reset.
 *
 * Indication code: `C.128`.
 */
export const CALIBRATION_FLAG_RESET = 0x80;

/**
 * EEPROM test failed.
 *
 * Indication code: `C.129`.
 */
export const BAD_TEST_EEPROM = 0x81;

/**
 * FRAM test failed.
 *
 * Indication code: `C.130`.
 */
export const BAD_TEST_FRAM = 0x82;

/**
 * New prepayment received.
 *
 * Indication code: `C.131`.
 */
export const SET_NEW_SALDO = 0x83;

/**
 * Saldo parameters lost.
 *
 * Indication code: `C.132`.
 */
export const SALDO_PARAM_BAD = 0x84;

/**
 * Accumulation parameters lost.
 *
 * Indication code: `C.133`.
 */
export const ACCUMULATION_PARAM_BAD = 0x85;

/**
 * Additional accumulation parameters lost.
 *
 * Indication code: `C.134`.
 */
export const ACCUMULATION_PARAM_EXT_BAD = 0x86;

/**
 * Calculation period data lost.
 *
 * Indication code: `C.135`.
 */
export const CALCULATION_PERIOD_BAD = 0x87;

/**
 * Block tariff parameters lost.
 *
 * Indication code: `C.136`.
 */
export const BLOCK_TARIFF_BAD = 0x88;

/**
 * Calibration parameters lost.
 *
 * Indication code: `C.137`.
 */
export const CALIBRATION_PARAM_BAD = 0x89;

/**
 * Winter/summer transition parameters lost.
 *
 * Indication code: `C.138`.
 */
export const WINTER_SUMMER_BAD = 0x8A;

/**
 * Operator parameters lost.
 *
 * Indication code: `C.139`.
 */
export const OP_PARAM_BAD = 0x8B;

/**
 * Additional operator parameters lost.
 *
 * Indication code: `C.140`.
 */
export const OP_PARAM_EXT_BAD = 0x8C;

/**
 * Saldo energy values lost.
 *
 * Indication code: `C.141`.
 */
export const SALDO_ENERGY_BAD = 0x8D;

/**
 * Time correction.
 *
 * Indication code: `C.142`.
 */
export const TIME_CORRECT = 0x8E;

/**
 * Transformation coefficients changed.
 *
 * Indication code: `C.143`.
 */
export const COEFFICIENT_TRANSFORMATION_CHANGE = 0x8F;

/**
 * Relay mechanically turned off.
 *
 * Indication code: `C.144`.
 */
export const RELAY_HARD_BAD_OFF = 0x90;

/**
 * Relay turned on after mechanical impact. Relay state restored.
 *
 * Indication code: `C.145`.
 */
export const RELAY_HARD_ON = 0x91;

/**
 * Relay mechanically turned on.
 *
 * Indication code: `C.146`.
 */
export const RELAY_HARD_BAD_ON = 0x93;

/**
 * Relay turned off after mechanical impact. Relay state restored.
 *
 * Indication code: `C.147`.
 */
export const RELAY_HARD_OFF = 0x94;

/**
 * Meter malfunction.
 *
 * Indication code: `C.148`.
 */
export const METER_TROUBLE = 0x95;

/**
 * Terminal box open.
 *
 * Indication code: `C.149`.
 */
export const CASE_KLEMA_OPEN = 0x96;

/**
 * Terminal box closed.
 *
 * Indication code: `C.150`.
 */
export const CASE_KLEMA_CLOSE = 0x97;

/**
 * Tariff plan `2` changed.
 *
 * Indication code: `C.151`.
 */
export const CHANGE_TARIFF_TABLE_2 = 0x98;

/**
 * Tariff plan `3` changed.
 *
 * Indication code: `C.152`.
 */
export const CHANGE_TARIFF_TABLE_3 = 0x99;

/**
 * Meter module compartment opened.
 *
 * Indication code: `C.153`.
 */
export const CASE_MODULE_OPEN = 0x9A;

/**
 * Meter module compartment closed.
 *
 * Indication code: `C.154`.
 */
export const CASE_MODULE_CLOSE = 0x9B;

/**
 * Saldo parameters set.
 *
 * Indication code: `C.155`.
 */
export const SET_SALDO_PARAM = 0x9C;

/**
 * Relay turned off after exceeding active power (since firmware version >= `302.15.001`).
 *
 * Indication code: `C.156`.
 */
export const POWER_OVER_RELAY_OFF = 0x9D;

/**
 * Load profile parameter `1` changed (since firmware version >= `302.17.001`).
 *
 * Indication code: `C.157`.
 */
export const CHANGE_PARAM_CHANNEL1 = 0x9E;

/**
 * Load profile parameter `2` changed.
 *
 * Indication code: `C.158`.
 */
export const CHANGE_PARAM_CHANNEL2 = 0x9F;

/**
 * Load profile parameter `3` changed.
 *
 * Indication code: `C.159`.
 */
export const CHANGE_PARAM_CHANNEL3 = 0xA0;

/**
 * Load profile parameter `4` changed.
 *
 * Indication code: `C.160`.
 */
export const CHANGE_PARAM_CHANNEL4 = 0xA1;

/**
 * Load profile parameter `5` changed.
 *
 * Indication code: `C.161`.
 */
export const CHANGE_PARAM_CHANNEL5 = 0xA2;

/**
 * Load profile parameter `6` changed.
 *
 * Indication code: `C.162`.
 */
export const CHANGE_PARAM_CHANNEL6 = 0xA3;

/**
 * Active export energy counter tariff `1` crossed zero at `1000000.00` `kW`.
 *
 * Indication code: `C.163`.
 */
export const CROSS_ZERO_EXPORT_ENT0 = 0xA4;

/**
 * Active export energy counter tariff `2` crossed zero at `1000000.00` `kW`.
 *
 * Indication code: `C.164`.
 */
export const CROSS_ZERO_EXPORT_ENT1 = 0xA5;

/**
 * Active export energy counter tariff `3` crossed zero at `1000000.00` `kW`.
 *
 * Indication code: `C.165`.
 */
export const CROSS_ZERO_EXPORT_ENT2 = 0xA6;

/**
 * Active export energy counter tariff `4` crossed zero at `1000000.00` `kW`.
 *
 * Indication code: `C.166`.
 */
export const CROSS_ZERO_EXPORT_ENT3 = 0xA7;

/**
 * Reactive positive energy counter (`Q3`) tariff `1` crossed zero at `1000000.00` `kVar`.
 *
 * Indication code: `C.167`.
 */
export const CROSS_ZERO_EXPORT_VARI0 = 0xA8;

/**
 * Reactive positive energy counter (`Q3`) tariff `2` crossed zero at `1000000.00` `kVar`.
 *
 * Indication code: `C.168`.
 */
export const CROSS_ZERO_EXPORT_VARI1 = 0xA9;

/**
 * Reactive positive energy counter (`Q3`) tariff `3` crossed zero at `1000000.00` `kVar`.
 *
 * Indication code: `C.169`.
 */
export const CROSS_ZERO_EXPORT_VARI2 = 0xAA;

/**
 * Reactive positive energy counter (`Q3`) tariff `4` crossed zero at `1000000.00` `kVar`.
 *
 * Indication code: `C.170`.
 */
export const CROSS_ZERO_EXPORT_VARI3 = 0xAB;

/**
 * Reactive negative energy counter (`Q2`) tariff `1` crossed zero at `1000000.00` `kVar`.
 *
 * Indication code: `C.171`.
 */
export const CROSS_ZERO_EXPORT_VARE0 = 0xAC;

/**
 * Reactive negative energy counter (`Q2`) tariff `2` crossed zero at `1000000.00` `kVar`.
 *
 * Indication code: `C.172`.
 */
export const CROSS_ZERO_EXPORT_VARE1 = 0xAD;

/**
 * Reactive negative energy counter (`Q2`) tariff `3` crossed zero at `1000000.00` `kVar`.
 *
 * Indication code: `C.173`.
 */
export const CROSS_ZERO_EXPORT_VARE2 = 0xAE;

/**
 * Reactive negative energy counter (`Q2`) tariff `4` crossed zero at `1000000.00` `kVar`.
 *
 * Indication code: `C.174`.
 */
export const CROSS_ZERO_EXPORT_VARE3 = 0xAF;

/**
 * Presence of alternating magnetic field detected.
 *
 * Indication code: `C.175`.
 */
export const EM_MAGNETIC_ON = 0xB0;

/**
 * Alternating magnetic field influence ended.
 *
 * Indication code: `C.176`.
 */
export const EM_MAGNETIC_OFF = 0xB1;

/**
 * Electromagnetic impact screen reset.
 *
 * Indication code: `C.177`.
 */
export const RESET_EM_FLAG = 0xB2;

/**
 * Magnetic impact screen reset.
 *
 * Indication code: `C.178`.
 */
export const RESET_MAGNETIC_FLAG = 0xB3;

/**
 * `1`-minute load, voltage, and current graphs recording mode set.
 *
 * Indication code: `C.224`.
 */
export const SET_DEMAND_EN_1_MIN = 0xE0;

/**
 * `3`-minute load, voltage, and current graphs recording mode set.
 *
 * Indication code: `C.225`.
 */
export const SET_DEMAND_EN_3_MIN = 0xE1;

/**
 * `5`-minute load, voltage, and current graphs recording mode set.
 *
 * Indication code: `C.226`.
 */
export const SET_DEMAND_EN_5_MIN = 0xE2;

/**
 * `10`-minute load, voltage, and current graphs recording mode set.
 *
 * Indication code: `C.227`.
 */
export const SET_DEMAND_EN_10_MIN = 0xE3;

/**
 * `15`-minute load, voltage, and current graphs recording mode set.
 *
 * Indication code: `C.228`.
 */
export const SET_DEMAND_EN_15_MIN = 0xE4;

/**
 * `30`-minute load, voltage, and current graphs recording mode set.
 *
 * Indication code: `C.229`.
 */
export const SET_DEMAND_EN_30_MIN = 0xE5;

/**
 * `60`-minute load, voltage, and current graphs recording mode set.
 *
 * Indication code: `C.230`.
 */
export const SET_DEMAND_EN_60_MIN = 0xE6;

/**
 * Recovery of permissible generated power `P-` after being too high.
 *
 * Indication code: `C.231`.
 */
export const P_MAX_A_MINUS_OK = 0xE7;

/**
 * Generated power `P-` exceeds the maximum power threshold.
 *
 * Indication code: `C.232`.
 */
export const P_MAX_A_MINUS_OVER = 0xE8;
