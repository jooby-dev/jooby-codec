/**
 * Device parameters. Used in SetParameter/GetParameter.
 */

/** reporting data interval from device */
export const REPORTING_DATA_INTERVAL = 1;

/** the parameter defines the hour of the day by which the daily consumption is calculated */
export const DAY_CHECKOUT_HOUR = 4;

/** data type from device */
export const REPORTING_DATA_TYPE = 5;

/** type of priority data delivery, with confirmation or not */
export const PRIORITY_DATA_DELIVERY_TYPE = 8;

/** device activation method */
export const ACTIVATION_METHOD = 9;

/** device battery depassivation information */
export const BATTERY_DEPASSIVATION_INFO = 10;

/** device battery minimum required battery load time per day to prevent passivation */
export const BATTERY_MINIMAL_LOAD_TIME = 11;

/**
 * Setup channels config, only for universal 4-channels devices.
 *
 * [Values description](https://github.com/jooby-dev/jooby-docs/blob/main/docs/parameter-types.md#channels-config)
 */
export const CHANNELS_CONFIG = 13;

/** setup parameters for RX2 window config */
export const RX2_CONFIG = 18;

/** setup absolute data for device, pulse counter, pulse coefficient, meter value */
export const ABSOLUTE_DATA = 23;

/** enable absolute value sending */
export const ABSOLUTE_DATA_ENABLE = 24;

/** device serial number */
export const SERIAL_NUMBER = 25;

/** device geolocation */
export const GEOLOCATION = 26;

/** interval in seconds when device send EXTRA FRAME */
export const EXTRA_FRAME_INTERVAL = 28;

/** same as ABSOLUTE_DATA for a specific channel */
export const ABSOLUTE_DATA_MULTI_CHANNEL = 29;

/** enable absolute value sending for a specific channel */
export const ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL = 30;

/**
 * Channels scan config for pulse devices.
 *
 * Parameter available from SOFTWARE_VERSION = 0x6C for
 * HARDWARE_TYPE - 15 HARDWARE_VERSION - 2 and HARDWARE_TYPE - 6 HARDWARE_VERSION - 10
 */
export const PULSE_CHANNELS_SCAN_CONFIG = 31;

/**
 * Set channels for pulse devices.
 *
 * Parameter available from SOFTWARE_VERSION = 0x6C for
 * HARDWARE_TYPE - 15 HARDWARE_VERSION - 2 and HARDWARE_TYPE - 6 HARDWARE_VERSION - 10
 */
export const PULSE_CHANNELS_SET_CONFIG = 32;

/**
 * Set configuration for battery depassivation.
 *
 * This parameter replace BATTERY_DEPASSIVATION_INFO and BATTERY_MINIMAL_LOAD_TIME.
 */
export const BATTERY_DEPASSIVATION_CONFIG = 33;
