/**
 * Device parameters. Used in SetParameter/GetParameter.
 */

/** interval of data sending from device */
export const DATA_SENDING_INTERVAL = 1;

/** the parameter defines the hour of the day by which the daily consumption is calculated */
export const DAY_CHECKOUT_HOUR = 4;

/** type of device data sending */
export const OUTPUT_DATA_TYPE = 5;

/** type of priority data delivery, with confirmation or not */
export const DELIVERY_TYPE_OF_PRIORITY_DATA = 8;

/** device activation method */
export const ACTIVATION_METHOD = 9;

/** device battery depassivation information */
export const BATTERY_DEPASSIVATION_INFO = 10;

/** device battery minimum required battery load time per day to prevent passivation */
export const BATTERY_MINIMAL_LOAD_TIME = 11;

/** setup parameters for RX2 window config */
export const RX2_CONFIG = 18;

/** setup initial data for device, pulse counter, pulse coefficient, meter value */
export const INITIAL_DATA = 23;

/** status of device data sending, absolute value or pulse counter */
export const ABSOLUTE_DATA_STATUS = 24;

/** device serial number */
export const SERIAL_NUMBER = 25;

/** device geolocation */
export const GEOLOCATION = 26;

/** interval in seconds when device send EXTRA FRAME */
export const EXTRA_FRAME_INTERVAL = 28;

/** same as INITIAL_DATA for a specific channel */
export const INITIAL_DATA_MULTI_CHANNEL = 29;

/** status of device data sending, absolute value or pulse counter for a specific channel */
export const ABSOLUTE_DATA_STATUS_MULTI_CHANNEL = 30;
