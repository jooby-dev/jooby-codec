/**
 * Accumulative register values lost.
 */
export const ENERGY_REGISTER_FAULT = 0x01;

/**
 * Factory parameter values lost.
 */
export const VENDOR_PAR_FAULT = 0x02;

/**
 * Operator parameter values lost.
 */
export const OP_PARAMETERS_VALUES_FAULT = 0x03;

/**
 * Access locked until end of day due to key access errors.
 */
export const ACCESS_LOCKED = 0x10;

/**
 * Invalid access key.
 */
export const ACCESS_ERROR = 0x11;

/**
 * Meter case opened.
 */
export const CASE_OPENED = 0x12;

/**
 * Meter case closed.
 */
export const CASE_CLOSED = 0x13;

/**
 * Magnetic influence detected.
 */
export const MAGNETIC_INFLUENCE_ON = 0x14;

/**
 * Magnetic influence ceased.
 */
export const MAGNETIC_INFLUENCE_OFF = 0x15;

/**
 * Access key level `0` changed.
 */
export const CHANGE_ACCESS_KEY0 = 0x20;

/**
 * Access key level `1` changed.
 */
export const CHANGE_ACCESS_KEY1 = 0x21;

/**
 * Access key level `2` changed.
 */
export const CHANGE_ACCESS_KEY2 = 0x22;

/**
 * Access key level `3` changed.
 */
export const CHANGE_ACCESS_KEY3 = 0x23;

/**
 * Parameters changed locally.
 */
export const CHANGE_PARAMETERS_LOCAL = 0x24;

/**
 * Parameters changed remotely.
 */
export const CHANGE_PARAMETERS_REMOTE = 0x25;

/**
 * Time changed (Correction: TIME SET).
 */
export const CMD_CHANGE_TIME = 0x26;

/**
 * `Relay on` command received.
 */
export const CMD_RELAY_ON = 0x27;

/**
 * `Relay off` command received.
 */
export const CMD_RELAY_OFF = 0x28;

/**
 * Daylight saving time transition parameters changed.
 */
export const CHANGE_COR_TIME = 0x29;

/**
 * Energy accumulation register overflow.
 */
export const ENERGY_REGISTER_OVERFLOW = 0x31;

/**
 * Tariff plan changed.
 */
export const CHANGE_TARIFF_TABLE = 0x32;

/**
 * New tariff plan received.
 */
export const SET_TARIFF_TABLE = 0x33;

/**
 * Switched to summer time.
 */
export const SUMMER_TIME = 0x34;

/**
 * Switched to winter time.
 */
export const WINTER_TIME = 0x35;

/**
 * Relay turned on.
 */
export const RELAY_ON = 0x36;

/**
 * Relay turned off.
 */
export const RELAY_OFF = 0x37;

/**
 * Microcontroller program restart.
 */
export const RESTART = 0x38;

/**
 * WATCHDOG restart.
 */
export const WD_RESTART = 0x39;

/**
 * Phase `B` voltage turned on.
 */
export const POWER_B_ON = 0x3C;

/**
 * Phase `B` voltage turned off.
 */
export const POWER_B_OFF = 0x3D;

/**
 * Phase `C` voltage turned on.
 */
export const POWER_C_ON = 0x3E;

/**
 * Phase `C` voltage turned off.
 */
export const POWER_C_OFF = 0x3F;

/**
 * Normal voltage restored after over-voltage.
 */
export const V_MAX_OK = 0x40;

/**
 * Voltage above maximum voltage threshold.
 */
export const V_MAX_OVER = 0x41;

/**
 * Normal voltage restored after under-voltage.
 */
export const V_MIN_OK = 0x42;

/**
 * Voltage below minimum voltage threshold.
 */
export const V_MIN_OVER = 0x43;

/**
 * Normal temperature restored after over-temperature.
 */
export const T_MAX_OK = 0x44;

/**
 * Temperature above maximum temperature threshold.
 */
export const T_MAX_OVER = 0x45;

/**
 * Normal temperature restored after under-temperature.
 */
export const T_MIN_OK = 0x46;

/**
 * Temperature below minimum temperature threshold.
 */
export const T_MIN_OVER = 0x47;

/**
 * Normal frequency restored after over-frequency.
 */
export const F_MAX_OK = 0x48;

/**
 * Frequency above maximum grid frequency threshold.
 */
export const F_MAX_OVER = 0x49;

/**
 * Normal frequency restored after under-frequency.
 */
export const F_MIN_OK = 0x4A;

/**
 * Frequency below minimum grid frequency threshold.
 */
export const F_MIN_OVER = 0x4B;

/**
 * Permissible current restored after over-current.
 */
export const I_MAX_OK = 0x4C;

/**
 * Current above maximum current threshold.
 */
export const I_MAX_OVER = 0x4D;

/**
 * Permissible power consumption restored after over-power.
 */
export const P_MAX_OK = 0x4E;

/**
 * Power consumption above maximum power threshold.
 */
export const P_MAX_OVER = 0x4F;

/**
 * No power excess in credit mode.
 */
export const POWER_SALDO_OK = 0x50;

/**
 * Power exceeded in credit mode.
 */
export const POWER_SALDO_OVER = 0x51;

/**
 * Normal battery voltage restored.
 */
export const BATTERY_OK = 0x52;

/**
 * Low battery voltage.
 */
export const BATTERY_FAULT = 0x53;

/**
 * Calibration parameters set.
 */
export const CALIBRATION_OK = 0x54;

/**
 * Calibration parameters lost.
 */
export const CALIBRATION_FAULT = 0x55;

/**
 * Real-time clock normal state restored.
 */
export const CLOCK_OK = 0x56;

/**
 * Real-time clock not set.
 */
export const CLOCK_FAULT = 0x57;

/**
 * Phase `A` voltage turned off.
 */
export const POWER_A_OFF = 0x58;

/**
 * Phase `A` voltage turned on.
 */
export const POWER_A_ON = 0x59;

/**
 * Second relay ON command.
 */
export const CMD_RELAY_2_ON = 0x60;

/**
 * Second relay OFF command.
 */
export const CMD_RELAY_2_OFF = 0x61;

/**
 * Active energy meter transition through `0` for tariff `1` upon reaching `1000000.00` kW.
 */
export const CROSS_ZERO_EN_T1 = 0x62;

/**
 * Active energy meter transition through `0` for tariff `2` upon reaching `1000000.00` kW.
 */
export const CROSS_ZERO_EN_T2 = 0x63;

/**
 * Active energy meter transition through `0` for tariff `3` upon reaching `1000000.00` kW.
 */
export const CROSS_ZERO_EN_T3 = 0x64;

/**
 * Active energy meter transition through `0` for tariff `4` upon reaching `1000000.00` kW.
 */
export const CROSS_ZERO_EN_T4 = 0x65;

/**
 * Calibration flag set.
 */
export const CALIBRATION_FLAG_SET = 0x66;

/**
 * Calibration flag reset.
 */
export const CALIBRATION_FLAG_RESET = 0x67;

/**
 * EEPROM test failed.
 */
export const BAD_TEST_EEPROM = 0x68;

/**
 * FRAM test failed.
 */
export const BAD_TEST_FRAM = 0x69;

/**
 * New prepayment received.
 */
export const SET_NEW_SALDO = 0x70;

/**
 * Balance parameters lost.
 */
export const SALDO_PARAMETERS_FAULT = 0x71;

/**
 * Accumulation parameters lost.
 */
export const ACC_PARAMETERS_FAULT = 0x72;

/**
 * Additional accumulation parameters lost.
 */
export const ACC_PARAMETERS_EXT_FAULT = 0x73;

/**
 * Calculation period data lost.
 */
export const CALC_PERIOD_FAULT = 0x74;

/**
 * Block tariff parameters lost.
 */
export const BLOCK_TARIFF_FAULT = 0x75;

/**
 * Calibration parameter values lost.
 */
export const CALIBRATION_PARAMETERS_FAULT = 0x76;

/**
 * Winter/summer time transition parameter values lost.
 */
export const WINTER_SUMMER_FAULT = 0x77;

/**
 * Energy values for balance calculation lost.
 */
export const SALDO_EN_FAULT = 0x78;

/**
 * Time correction.
 */
export const TIME_CORRECT = 0x79;

/**
 * Terminal box opened.
 */
export const CASE_TERMINAL_BOX_OPENED = 0x7A;

/**
 * Terminal box closed.
 */
export const CASE_TERMINAL_BOX_CLOSED = 0x7B;

/**
 * Meter module compartment opened.
 */
export const CASE_MODULE_OPENED = 0x7C;

/**
 * Meter module compartment closed.
 */
export const CASE_MODULE_CLOSED = 0x7D;

/**
 * POWER_GOOD signal missing.
 */
export const POWER_GOOD_DIO = 0x7E;

/**
 * Relay mechanically switched OFF.
 */
export const RELAY_HARD_BAD_OFF = 0x90;

/**
 * Relay switched ON after mechanical intervention. Relay state restored.
 */
export const RELAY_HARD_ON = 0x91;

/**
 * Relay mechanically switched ON.
 */
export const RELAY_HARD_BAD_ON = 0x93;

/**
 * Relay switched OFF after mechanical intervention. Relay state restored.
 */
export const RELAY_HARD_OFF = 0x94;

/**
 * Tariff plan `2` changed.
 */
export const CHANGE_TARIFF_TABLE_2 = 0x98;

/**
 * Balance parameters set.
 */
export const SET_SALDO_PARAM = 0x9C;

/**
 * Relay switched OFF due to active power exceeding.
 */
export const POWER_OVER_RELAY_OFF = 0x9D;

/**
 * Active energy `A-` meter transition through `0` for tariff `1` upon reaching `1000000.00` kW.
 */
export const CROSS_ZERO_EXPORT_EN_T1 = 0x9E;

/**
 * Active energy `A-` meter transition through `0` for tariff `2` upon reaching `1000000.00` kW.
 */
export const CROSS_ZERO_EXPORT_EN_T2 = 0x9F;

/**
 * Active energy `A-` meter transition through `0` for tariff `3` upon reaching `1000000.00` kW.
 */
export const CROSS_ZERO_EXPORT_EN_T3 = 0xA0;

/**
 * Active energy `A-` meter transition through `0` for tariff `4` upon reaching `1000000.00` kW.
 */
export const CROSS_ZERO_EXPORT_EN_T4 = 0xA1;

/**
 * Time correction. Reserved event - do not use.
 */
export const TIME_CORRECT_NEW = 0xA2;

/**
 * Electromagnetic influence detected.
 */
export const EM_MAGNETIC_INFLUENCE_ON = 0xB0;

/**
 * Electromagnetic influence ceased.
 */
export const EM_MAGNETIC_INFLUENCE_OFF = 0xB1;

/**
 * Current inequality detected.
 */
export const CURRENT_UNEQUAL_FAULT = 0xB2;

/**
 * Current inequality absent.
 */
export const CURRENT_UNEQUAL_OK = 0xB3;

/**
 * Bipolar power detected in phase and neutral.
 */
export const BIPOLAR_POWER_FAULT = 0xB4;

/**
 * Bipolar power in phase and neutral not detected.
 */
export const BIPOLAR_POWER_OK = 0xB5;

/**
 * Electromagnetic influence flag reset.
 */
export const RESET_EM_FLAG = 0xB6;

/**
 * Magnetic influence flag reset.
 */
export const RESET_MAGNET_FLAG = 0xB7;

/**
 * Load profile parameter changed.
 */
export const CHANGE_PARAMETERS_CHANNEL = 0xB9;

/**
 * Relay switched OFF due to consumption limit in credit mode.
 */
export const RELAY_OFF_BAD_SALDO = 0xBA;

/**
 * `1`-minute energy (voltage) load profiles recording mode set.
 */
export const SET_DEMAND_EN_1MIN = 0xE0;

/**
 * `3`-minute energy (voltage) load profiles recording mode set.
 */
export const SET_DEMAND_EN_3MIN = 0xE1;

/**
 * `5`-minute energy (voltage) load profiles recording mode set.
 */
export const SET_DEMAND_EN_5MIN = 0xE2;

/**
 * `10`-minute energy (voltage) load profiles recording mode set.
 */
export const SET_DEMAND_EN_10MIN = 0xE3;

/**
 * `15`-minute energy (voltage) load profiles recording mode set.
 */
export const SET_DEMAND_EN_15MIN = 0xE4;

/**
 * `30`-minute energy (voltage) load profiles recording mode set.
 */
export const SET_DEMAND_EN_30MIN = 0xE5;

/**
 * `60`-minute energy (voltage) load profiles recording mode set.
 */
export const SET_DEMAND_EN_60MIN = 0xE6;

/**
 * Recovery of permissible generated power `P-` after being too high.
 */
export const P_MAX_A_MINUS_OK = 0xE7;

/**
 * Generated power `P-` exceeds the maximum power threshold.
 */
export const P_MAX_A_MINUS_OVER = 0xE8;
