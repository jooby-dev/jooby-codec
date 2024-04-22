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

/** Set configuration for session */
export const MQTT_SESSION_CONFIG = 34;

/** Set broker address */
export const MQTT_BROKER_ADDRESS = 35;

/** Enable ssl */
export const MQTT_SSL_ENABLE = 36;

/** Set topic prefix */
export const MQTT_TOPIC_PREFIX = 37;

/** Set configuration for data receive */
export const MQTT_DATA_RECEIVE_CONFIG = 38;

/** Set configuration for data send */
export const MQTT_DATA_SEND_CONFIG = 39;

/** Set configuration for ssl */
export const NBIOT_SSL_CONFIG = 40;

/** Write ssl cacert */
export const NBIOT_SSL_CACERT_WRITE = 41;

/** Set ssl cacert crc32 */
export const NBIOT_SSL_CACERT_SET = 42;

/** Write ssl client cert */
export const NBIOT_SSL_CLIENT_CERT_WRITE = 43;

/** Set ssl client cert crc32 */
export const NBIOT_SSL_CLIENT_CERT_SET = 44;

/** Write ssl client key */
export const NBIOT_SSL_CLIENT_KEY_WRITE = 45;

/** Set ssl client key crc32 */
export const NBIOT_SSL_CLIENT_KEY_SET = 46;

/** Update device software */
export const NBIOT_DEVICE_SOFTWARE_UPDATE = 47;

/** Update module firmware */
export const NBIOT_MODULE_FIRMWARE_UPDATE = 48;

/** Set configuration for reporting data */
export const REPORTING_DATA_CONFIG = 49;

/** Set configuration for events */
export const EVENTS_CONFIG = 50;

/** Get NBIOT module info */
export const NBIOT_MODULE_INFO = 51;

/** Set preferred NB-IoT bands to be searched for */
export const NBIOT_BANDS = 52;
