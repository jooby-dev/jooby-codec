/** Magnet is used for more than 20 seconds. */
export const MAGNET_ON = 1;

/** Magnetic interference is removed. */
export const MAGNET_OFF = 2;

/** The device has been activated. */
export const ACTIVATE = 3;

/** Device deactivation. Termination of frame transmission over the air. */
export const DEACTIVATE = 4;

/** The sensor has reset due to low battery voltage. Outdated. */
export const BATTERY_ALARM = 5;

/** The container has tipped over. Outdated. */
export const CAN_OFF = 6;

/** Device installation in the gas meter. */
export const INSERT = 7;

/** Device removal from gas meter. */
export const REMOVE = 8;

/** The pulse counter has overflowed. The number of pulses has exceeded `4294967295`. */
export const COUNTER_OVER = 9;

/** Setting the device time. */
export const SET_TIME = 10;

/** Activation of the module in the electric energy meter (restart or power supply). */
export const ACTIVATE_MTX = 11;

/** Connecting a plug to a 2-port module. */
export const CONNECT = 12;

/** Disconnecting a connector from a 2-port module. */
export const DISCONNECT = 13;

/** Device battery depassivation. */
export const DEPASS_DONE = 14;

/** Low signal level from photodiode (`NOVATOR`). */
export const OPTOLOW = 15;

/** Photodiode overexposure (`NOVATOR`). */
export const OPTOFLASH = 16;

/** MTX electric energy meter event. */
export const MTX = 17;

/** Receiving `JOINACCEPT` from NS in OTAA mode (not implemented). */
export const JOIN_ACCEPT = 18;

/** Ultrasonic water meter event. */
export const WATER_EVENT = 19;

/** No response from ultrasonic water meter. */
export const WATER_NO_RESPONSE = 20;

/** Optical sensor error. */
export const OPTOSENSOR_ERROR = 21;
