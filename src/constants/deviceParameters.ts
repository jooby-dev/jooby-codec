/**
 * Device parameters. Used in SetParameter/GetParameter.
 */

/**
 * Interval of data sending from device.
 */
export const DATA_SENDING_INTERVAL = 1;

/**
 * The parameter defines the hour of the day by which the daily consumption is calculated.
 */
export const DAY_CHECKOUT_HOUR = 4;

/**
 * Type of device data sending.
 */
export const OUTPUT_DATA_TYPE = 5;

/**
 * Device activation method.
 */
export const ACTIVATION_METHOD = 9;

/**
 * Setup initial data for device, pulse counter, pulse coefficient, meter value
 */
export const INITIAL_DATA = 23;

/**
 * Status of device data sending, absolute value or pulse counter
 */
export const ABSOLUTE_DATA_STATUS = 24;

/**
 * same as INITIAL_DATA for a specific channel
 */
export const INITIAL_DATA_MULTI_CHANNEL = 29;

/**
 * Status of device data sending, absolute value or pulse counter for a specific channel
 */
export const ABSOLUTE_DATA_STATUS_MULTI_CHANNEL = 30;
