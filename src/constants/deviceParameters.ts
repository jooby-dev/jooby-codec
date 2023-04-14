/**
 * Device parameters. Used in SetParameter/GetParameter.
 */

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
