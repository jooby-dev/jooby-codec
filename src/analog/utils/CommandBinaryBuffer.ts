/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../utils/BinaryBuffer.js';
import * as bitSet from '../../utils/bitSet.js';
import {getDateFromTime2000, getTime2000FromDate, TTime2000} from './time.js';
import getHexFromBytes from '../../utils/getHexFromBytes.js';
import getBytesFromHex from '../../utils/getBytesFromHex.js';
import roundNumber from '../../utils/roundNumber.js';
import {extractBits, fillBits} from '../../utils/bitSet.js';
import * as hardwareTypes from '../constants/hardwareTypes.js';
import * as deviceParameters from '../constants/deviceParameters.js';
import invertObject from '../../utils/invertObject.js';


export interface IBatteryVoltage {
    /**
     * Battery voltage under minimum load (sleep mode), value in `mV`. Typical value is about `3600` `mV`.
     *
     * `4095` - unknown value and becomes `undefined`
     */
    underLowLoad: number | undefined,

    /**
     * Battery voltage under load simulating transmission mode, value in `mV`. Typical value is about `3600` `mV`.
     *
     * `4095` - unknown value and becomes `undefined`
     */
    underHighLoad: number | undefined
}

export interface IChannel {
    /** channel number */
    index: number
}

export interface IChannelValue extends IChannel {
    /** pulse counter or absolute value of device channel */
    value: types.TInt32
}

export interface IChannelHours extends IChannelValue {
    /** values differences between hours */
    diff: Array<number>
}

/**
 * It's `1`-byte value of the pulse coefficient for a metering device, which determines the correspondence of consumed resources to 1 pulse.
 *
 * | Pulse coefficient | dm<sup>3</sup> | m<sup>3</sup> |
 * | ----------------- | -------------- | ------------- |
 * | `0х80`            | `1`            | `0.001`       |
 * | `0х81`            | `5`            | `0.005`       |
 * | `0х82`            | `10`           | `0.01`        |
 * | `0х83`            | `100`          | `0.1`         |
 * | `0х84`            | `1000`         | `1`           |
 * | `0х85`            | `10000`        | `10`          |
 * | `0х86`            | `100000`       | `100`         |
 */
export type TPulseCoefficient = types.BrandType<number, 'uint8'>;

export interface IChannelHourAbsoluteValue extends IChannelHours {
    pulseCoefficient: TPulseCoefficient
}

export interface IChannelDays extends IChannel {
    dayList: Array<number>
}

export interface IChannelAbsoluteValue extends IChannelValue {
    /** channel pulse coefficient */
    pulseCoefficient: TPulseCoefficient
}

export interface IChannelArchiveDaysAbsolute extends IChannel {
    /** values by days */
    dayList: Array<number>,

    /** Channel pulse coefficient */
    pulseCoefficient: TPulseCoefficient
}


export interface IEventGasStatus {
    /** the battery voltage has dropped below the set threshold */
    isBatteryLow?: boolean,
    /** there is a magnetic field influence */
    isMagneticInfluence?: boolean,
    /** button is release (device is unmounted) */
    isButtonReleased?: boolean,
    /** the device has detected a loss of connection to the server */
    isConnectionLost?: boolean
}

export interface IEvent2ChannelStatus {
    /** the battery voltage has dropped below the set threshold */
    isBatteryLow?: boolean,
    /** the device has detected a loss of connection to the server */
    isConnectionLost?: boolean,
    /** the first channel is not active */
    isFirstChannelInactive?: boolean,
    /** the second channel is not active */
    isSecondChannelInactive?: boolean
}

export interface IEventElimpStatus {
    /** the device has detected a loss of connection to the server */
    isConnectionLost?: boolean
}

// export interface IEventWaterStatus {
//     /** the battery voltage has dropped below the set threshold */
//     isBatteryLow?: boolean,
//     /** the device has detected a loss of connection to the server */
//     isConnectionLost?: boolean
// }

export interface IEvent4ChannelStatus {
    /** the battery voltage has dropped below the set threshold */
    isBatteryLow?: boolean,
    /** the device has detected a loss of connection to the server */
    isConnectionLost?: boolean,
    /** the first channel is not active */
    isFirstChannelInactive?: boolean,
    /** the second channel is not active */
    isSecondChannelInactive?: boolean,
    /** the third channel is not active */
    isThirdChannelInactive?: boolean,
    /** the forth channel is not active */
    isForthChannelInactive?: boolean
}

export interface IEventMtxStatus {
    /** meter case is open */
    isMeterCaseOpen?: boolean,
    /** there is a magnetic field influence */
    isMagneticInfluence?: boolean,
    /** parameters set remotely */
    isParametersSetRemotely?: boolean,
    /** parameters set locally */
    isParametersSetLocally?: boolean,
    /** meter program restart */
    isMeterProgramRestarted?: boolean,
    /** incorrect password and lockout */
    isLockedOut?: boolean,
    /** time set */
    isTimeSet?: boolean,
    /** time correction */
    isTimeCorrected?: boolean,
    /** meter failure */
    isMeterFailure?: boolean,
    /** meter terminal box is open */
    isMeterTerminalBoxOpen?: boolean,
    /** meter module compartment is open */
    isModuleCompartmentOpen?: boolean,
    /** tariff plan changed */
    isTariffPlanChanged?: boolean,
    /** new tariff plan received */
    isNewTariffPlanReceived?: boolean
}

export interface IUSWaterMeterEvent {
    /** transport mode activated/deactivated */
    transportMode: boolean,
    /** frequency output activated/deactivated */
    frequencyOutput: boolean,
    /** reverse flow detected/prevented */
    reverseFlow: boolean,
    /** tamper break detected/prevented */
    tamperBreak: boolean,
    /** leakage detected/prevented */
    leakage: boolean,
    /** pipe break detected/prevented */
    pipeBreak: boolean,
    /** empty pipe detected/prevented */
    pipeEmpty: boolean,
    /** battery discharge detected/prevented */
    batteryDischarge: boolean
}

export interface IEventUSWaterMeterStatus {
    event: IUSWaterMeterEvent

    /**
     * Measurement error code 0 - normal, 1-255 - error
     */
    error: types.TUint8
}


/**
 * Device send data periodically using this interval.
 * deviceParameters.REPORTING_DATA_INTERVAL = `1`.
 */
interface IParameterReportingDataInterval {
    /**
     * Minimal interval for data sending from device (in seconds).
     * Real value = value + pseudo-random value which is not more than `255` * `4`.
     */
    value: number
}

/**
 * The parameter defines the hour of the day by which the daily consumption is calculated.
 * deviceParameters.DAY_CHECKOUT_HOUR = `4`.
 */
interface IParameterDayCheckoutHour {
    /**
     * The value from `0` to `23`. The default calculation hour is `0`.
     */
    value: types.TUint8
}

/**
 * Type of data from device.
 * deviceParameters.REPORTING_DATA_TYPE = `5`.
 */
interface IParameterReportingDataType {
    /**
     * `0` - hour, by default
     * `1` - day
     * `2` - current
     * `3` - hour + day
     */
    type: types.TUint8
}

/**
 * Delivery type of priority data, with or without acknowledgment.
 * Priority data - frames from uplink/NewEvent command.
 * deviceParameters.PRIORITY_DATA_DELIVERY_TYPE = `8`.
 */
interface IParameterDeliveryTypeOfPriorityData {
    /**
     * `0` - delivery with confirmation
     * `1` - delivery without confirmation
     */
    value: types.TUint8
}

/**
 * Device activation method in LoRaWAN network.
 * deviceParameters.ACTIVATION_METHOD = `9`.
 */
interface IParameterActivationMethod {
    /**
     * `0` - OTAA, by default
     * `1` - ABP
     *
     * @see https://www.thethingsindustries.com/docs/devices/abp-vs-otaa/
     */
    type: types.TUint8
}

/**
 * Channels config, only for universal 4-channels devices
 * deviceParameters.CHANNELS_CONFIG = `13`.
 */
interface IParameterChannelsConfig {
    /**
     * value from 0 to 18, [values description](https://github.com/jooby-dev/jooby-docs/blob/main/docs/parameter-types.md#channels-config)
     */
    value: types.TUint8
}

/**
 * RX2 configuration.
 * deviceParameters.RX2_CONFIG = `18`.
 *
 * @see https://www.thethingsindustries.com/docs/reference/glossary/
 */
interface IParameterRx2Config {
    /**
     * The transmission speed or Data Rate of a LoRaWAN message, ranging from `SF7` (highest Data Rate) to `SF12` (lowest Data Rate).
     * Making the spreading factor `1` step lower (from `SF10` to `SF9`) allows you to roughly send the same amount of data use half the time on air.
     * Lowering the spreading factor makes it more difficult for the gateway to receive a transmission, as it will be more sensitive to noise.
     *
     * @see https://www.thethingsnetwork.org/docs/lorawan/spreading-factors/
     */
    spreadFactor: types.TUint8

    /**
     * RX2 data rate frequency.
     * The second receive window (RX2) uses a fixed frequency and data rate.
     * This value configures the frequency to use in RX2.
     * Changing the desired value makes the Network Server transmit the RXParamSetupReq MAC command.
     */
    frequency: types.TUint24
}

/**
 * Device battery depassivation information.
 * deviceParameters.BATTERY_DEPASSIVATION_INFO = `10`.
 */
interface IParameterBatteryDepassivationInfo {
    /** battery load time in milliseconds */
    loadTime: types.TUint16,
    /** battery internal resistance, in mΩ */
    internalResistance: types.TUint16,
    /** battery low voltage, in mV  */
    lowVoltage: types.TUint16
}

/**
 * Device battery minimum required battery load time per day to prevent passivation.
 * deviceParameters.BATTERY_MINIMAL_LOAD_TIME = `11`.
 */
interface IParameterBatteryMinimalLoadTime {
    value: types.TUint32
}

/**
 * Absolute data for pulse devices.
 * deviceParameters.ABSOLUTE_DATA = `23`.
 */
interface IParameterAbsoluteData {
    /** BE */
    value: types.TUint32,

    /** BE */
    meterValue: types.TUint32,

    pulseCoefficient: TPulseCoefficient
}

/**
 * Data type sending from device - absolute or not.
 * deviceParameters.ABSOLUTE_DATA_ENABLE = `24`
 */
interface IParameterAbsoluteDataEnable {
    /**
     * `1` - absolute data enabled
     * `0` - absolute data disabled, device send pulse counter
     */
    state: types.TUint8
}

/**
 * Device serial number.
 * deviceParameters.SERIAL_NUMBER = `25`
 */
interface IParameterSerialNumber {
    /**
     * hex string, 6 bytes
     */
    value: string
}

/**
 * Device geolocation.
 * deviceParameters.GEOLOCATION = `26`
 */
interface IParameterGeolocation {
    latitude: types.TFloat32,
    longitude: types.TFloat32,
    altitude: types.TInt16
}

/**
 * Interval in seconds when device send EXTRA FRAME.
 * deviceParameters.EXTRA_FRAME_INTERVAL = `28`.
 */
interface IParameterExtraFrameInterval {
    /**
     * The parameter is `2` bytes long and measured in seconds.
     * Its value must not be less than `90` seconds.
     * If the parameter is set to `0`, it means that the issuance of `ExtraFrames` will be prohibited.
     * GazMoldova modules provide for issuing `ExtraFrame` `UPLINK` frames in case of loss of communication with `NS`.
     * This will happen after transmitting `16` standard `UPLINK` frames without receiving a confirmation from `NS`.
     * In `OTAA` connection mode, after more than `5` unsuccessful attempts to connect via `JOINREQ`, the `ExtraFrame` `UPLINK` frame transmission mode will be initiated.
     *
     * minimal: `90`
     * maximum: `65535`, i.e. two byte unsigned int
     */
    value: types.TUint16
}

/**
 * Absolute data for multi-channel devices.
 * deviceParameters.ABSOLUTE_DATA_MULTI_CHANNEL = `29`.
 */
interface IParameterAbsoluteDataMC extends IParameterAbsoluteData {
    /** set data for specific channel */
    channel: types.TUint8
}

/**
 * Data type sending from device - absolute or not, multi-channel devices.
 * deviceParameters.ABSOLUTE_DATA_STATUS_MULTI_CHANNEL = `30`
 */
interface IParameterAbsoluteDataEnableMC extends IParameterAbsoluteDataEnable {
    /** channel that accept status changing */
    channel: types.TUint8
}

/**
 * Channels scan config for pulse devices.
 * deviceParameters.PULSE_CHANNELS_SCAN_CONFIG = `31`
 */
interface IParameterPulseChannelsScanConfig {
    /**
     * List of channel numbers to configure.
     * Max channels: `32`.
     */
    channelList: Array<types.TUint8>;

    /**
     * Channel pull up time in microseconds.
     * <br>
     * Minimal value - `17` `μs`, maximum - `255` `μs`, `18` `μs` by default.
     */
    pullUpTime: types.TUint8,

    /**
     * Channel scan time in microseconds `μs`.
     * <br>
     * Minimal value - `15` `μs`, maximum - `255` `μs`, `50` `μs` by default.
     */
    scanTime: types.TUint8
}

/**
 * Set channels for pulse devices.
 * deviceParameters.PULSE_CHANNELS_SET_CONFIG = `32`
 */
interface IParameterPulseChannelsSetConfig {
    channel1: boolean,
    channel2: boolean,
    channel3: boolean,
    channel4: boolean
}

/**
 * Set configuration for battery depassivation.
 * deviceParameters.BATTERY_DEPASSIVATION_CONFIG = `33`
 */
interface IParameterBatteryDepassivationConfig {
    /**
     * Represents the value of the internal resistance of the battery (in `mΩ`) upon exceeding which the depassivation process will be initiated.
     * For WLE modules, this value is set by default to `35000` `mΩ`, and for modules using the `SX1276` transceiver, this value is set to `16000` `mΩ`.
     */
    resistanceStartThreshold: types.TUint16,

    /**
     * Represents the value of the internal resistance of the battery (in `mΩ`).
     * If the internal resistance of the battery falls below this threshold, the depassivation process will stop.
     * For WLE modules, this value is set by default to `25000` `mΩ`, and for modules using the `SX1276` transceiver, this value is set to `10350` `mΩ`.
     */
    resistanceStopThreshold: types.TUint16
}

/**
 * Set configuration for session.
 * deviceParameters.MQTT_SESSION_CONFIG = `34`
 */
interface IParameterMqttSessionConfig {
    clientId: string,
    username: string,
    password: string,
    cleanSession: types.TUint8
}

/**
 * Set broker address.
 * deviceParameters.MQTT_BROKER_ADDRESS = `35`
 */
interface IParameterMqttBrokerAddress {
    hostName: string,
    port: types.TUint16
}

/**
 * Enable ssl.
 * deviceParameters.MQTT_SSL_ENABLE = `36`
 */
interface IParameterMqttSslEnable {
    enable: types.TUint8
}

/**
 * Set topic prefix.
 * deviceParameters.MQTT_TOPIC_PREFIX = `37`
 */
interface IParameterMqttTopicPrefix {
    topicPrefix: string
}

/**
 * Set configuration for data receive.
 * deviceParameters.MQTT_DATA_RECEIVE_CONFIG = `38`
 */
interface IParameterMqttDataReceiveConfig {
    qos: types.TUint8,
    count: types.TUint8,
    timeout: types.TUint8
}

/**
 * Set configuration for data send.
 * deviceParameters.MQTT_DATA_SEND_CONFIG = `39`
 */
interface IParameterMqttDataSendConfig {
    qos: types.TUint8,
    retain: types.TUint8,
    newestSendFirst: types.TUint8
}

/**
 * Set configuration for ssl.
 * deviceParameters.NBIOT_SSL_CONFIG = `40`
 */
interface IParameterNbiotSslConfig {
    securityLevel: types.TUint8,
    version: types.TUint8
}

/**
 * Write ssl.
 * deviceParameters.NBIOT_SSL_CACERT_WRITE = `41`
 */
interface IParameterNbiotSslWrite {
    size: types.TUint16,
    position: types.TUint16,
    chunk: types.TBytes
}

/**
 * Set ssl crc32.
 * deviceParameters.NBIOT_SSL_CACERT_SET = `42`
 */
interface IParameterNbiotSslSet {
    crc32: types.TUint32
}

/**
 * Update device software.
 * deviceParameters.NBIOT_DEVICE_SOFTWARE_UPDATE = `47`
 */
interface IParameterNbiotDeviceSoftwareUpdate {
    softwareImageUrl: string
}

/**
 * Update module firmware.
 * deviceParameters.NBIOT_MODULE_FIRMWARE_UPDATE = `48`
 */
interface IParameterNbiotModuleFirmwareUpdate {
    moduleFirmwareImageUrl: string
}

/**
 * Set configuration for reporting data.
 * deviceParameters.REPORTING_DATA_CONFIG = `49`
 */
interface IParameterReportingDataConfig {
    dataType: types.TUint8,
    hour: types.TUint8,
    minutes: types.TUint8,
    countToSend: types.TUint8
}

/**
 * Set configuration for events.
 * deviceParameters.EVENTS_CONFIG = `50`
 */
interface IParameterEventsConfig {
    eventId: types.TUint8,
    sendEvent: types.TUint8,
    saveEvent: types.TUint8
}

/**
 * Get nbiot module info.
 * deviceParameters.NBIOT_MODULE_INFO = `51`
 */
interface IParameterNbiotModuleInfo {
    moduleInfo: string
}

/**
 * Set preferred nbiot bands to be searched for.
 * deviceParameters.NBIOT_BANDS = `52`
 */
interface IParameterNbiotBands {
    bands: Array<types.TUint8>
}

/**
 * Set preferred nbiot bands to be searched for.
 * deviceParameters.NBIOT_APN = `53`
 */
interface IParameterNbiotApn {
    apn: string
}

/**
 * Enable LED indication.
 * deviceParameters.NBIOT_LED_INDICATION = `54`
 */
interface IParameterNbiotLedIndication {
    enableLed: types.TUint8,
    enableNbiotNetworkLed: types.TUint8
}

/**
 * Set NB-IoT SIM PIN code.
 * deviceParameters.NBIOT_SIM = `55`
 */
interface IParameterNbiotSim {
    enable: types.TUint8,
    pin: types.TUint16
}

/**
 * Request parameter for specific channel, works for multichannel devices only.
 */
interface IRequestChannelParameter {
    channel: number
}

/**
 * Request status for device parameter.
 */
interface IRequestDeviceParameterStatus {
    status: number
}

/**
 * Request parameter for specific data type.
 */
interface IRequestDataTypeParameter {
    dataType: number
}

/**
 * Request parameter for specific event id.
 */
interface IRequestEventIdParameter {
    eventId: number
}


export interface IParameter {
    id: types.TUint8,

    data: TParameterData
}

export interface IRequestParameter {
    /** One of the {@link deviceParameters | parameter types}. */
    id: types.TUint8,

    data: TRequestParameterData | null
}

export interface IResponseParameter {
    /** One of the {@link deviceParameters | parameter types}. */
    id: types.TUint8,

    data: TResponseParameterData | null
}

export interface ILegacyCounter {
    /**
     * The magnetic influence flag indicates that there was a magnet intervention.
     */
    isMagneticInfluence: boolean,

    /**
     * It's a pulse counter value packed in `3` bytes.
     */
    value: types.TUint24
}

export interface ILegacyHourCounterWithDiff {
    startTime2000: TTime2000
    counter: ILegacyCounter,
    diff: Array<ILegacyCounter>
}

export interface IDataSegment {
    segmentationSessionId: number,
    segmentIndex: number,
    segmentsNumber: number,
    isLast: boolean,
    data: types.TBytes
}

export interface IChannelValuesWithHourDiffExtended {
    channelList: Array<IChannelHours>,

    /**
     * Start date for requested day pulse counter's values.
     */
    startTime2000: TTime2000

    hour: types.TUint8,

    /**
     * The number of hours to retrieve.
     */
    hours: types.TUint8
}


export type TEventStatus =
    IEventGasStatus |
    IEvent2ChannelStatus |
    IEventElimpStatus |
    //IEventWaterStatus |
    IEvent4ChannelStatus |
    IEventMtxStatus |
    IEventUSWaterMeterStatus;

/* sorted by parameter id */
type TParameterData =
    IParameterReportingDataInterval |
    IParameterReportingDataType |
    IParameterDayCheckoutHour |
    IParameterDeliveryTypeOfPriorityData |
    IParameterActivationMethod |
    IParameterBatteryDepassivationInfo |
    IParameterBatteryMinimalLoadTime |
    IParameterChannelsConfig |
    IParameterRx2Config |
    IParameterAbsoluteData |
    IParameterAbsoluteDataEnable |
    IParameterSerialNumber |
    IParameterGeolocation |
    IParameterAbsoluteDataMC |
    IParameterAbsoluteDataEnableMC |
    IParameterPulseChannelsScanConfig |
    IParameterPulseChannelsSetConfig |
    IParameterBatteryDepassivationConfig |
    IParameterMqttSessionConfig |
    IParameterMqttBrokerAddress |
    IParameterMqttSslEnable |
    IParameterMqttTopicPrefix |
    IParameterMqttDataReceiveConfig |
    IParameterMqttDataSendConfig |
    IParameterNbiotSslConfig |
    IParameterNbiotSslWrite |
    IParameterNbiotSslSet |
    IParameterNbiotDeviceSoftwareUpdate |
    IParameterNbiotModuleFirmwareUpdate |
    IParameterReportingDataConfig |
    IParameterEventsConfig |
    IParameterNbiotModuleInfo |
    IParameterNbiotBands |
    IParameterNbiotApn |
    IParameterNbiotLedIndication |
    IParameterNbiotSim;


type TRequestParameterData =
    IRequestChannelParameter |
    IRequestDeviceParameterStatus |
    IRequestDataTypeParameter |
    IRequestEventIdParameter;

type TResponseParameterData =
    IParameterReportingDataInterval |
    IParameterReportingDataType |
    IParameterDayCheckoutHour |
    IParameterDeliveryTypeOfPriorityData |
    IParameterActivationMethod |
    IParameterBatteryDepassivationInfo |
    IParameterBatteryMinimalLoadTime |
    IParameterChannelsConfig |
    IParameterRx2Config |
    IParameterAbsoluteData |
    IParameterAbsoluteDataEnable |
    IParameterSerialNumber |
    IParameterGeolocation |
    IParameterAbsoluteDataMC |
    IParameterAbsoluteDataEnableMC |
    IParameterPulseChannelsScanConfig |
    IParameterPulseChannelsSetConfig |
    IParameterBatteryDepassivationConfig |
    IParameterMqttBrokerAddress |
    IParameterMqttSslEnable |
    IParameterMqttTopicPrefix |
    IParameterMqttDataReceiveConfig |
    IParameterMqttDataSendConfig |
    IParameterNbiotSslConfig |
    IParameterReportingDataConfig |
    IParameterEventsConfig |
    IParameterNbiotModuleInfo |
    IParameterNbiotBands |
    IParameterNbiotApn |
    IParameterNbiotLedIndication |
    IParameterNbiotSim;

const INITIAL_YEAR = 2000;
const MONTH_BIT_SIZE = 4;
const DATE_BIT_SIZE = 5;
const YEAR_START_INDEX = 1;
const UNKNOWN_BATTERY_VOLTAGE = 4095;
const EXTEND_BIT_MASK = 0x80;
const LAST_BIT_INDEX = 7;
const DATA_SENDING_INTERVAL_SECONDS_COEFFICIENT = 600;
/** 'reserved' bytes which not used */
const DATA_SENDING_INTERVAL_RESERVED_BYTES = 3;
const PARAMETER_RX2_FREQUENCY_COEFFICIENT = 100;
const SERIAL_NUMBER_SIZE = 6;
const MAGNETIC_INFLUENCE_BIT_INDEX = 8;
const LEGACY_HOUR_COUNTER_SIZE = 2 + 4;
const LEGACY_HOUR_DIFF_SIZE = 2;

const GAS_HARDWARE_TYPES = [
    hardwareTypes.GASI2,
    hardwareTypes.GASI3,
    hardwareTypes.GASI1,
    hardwareTypes.GASIC,
    hardwareTypes.NBIOT
];
const TWO_CHANNELS_HARDWARE_TYPES = [
    hardwareTypes.IMP2AS,
    hardwareTypes.IMP2EU,
    hardwareTypes.IMP2IN,
    hardwareTypes.NOVATOR
];
const ELIMP_HARDWARE_TYPES = [
    hardwareTypes.ELIMP
];
// const WATER_HARDWARE_TYPES = [
//     hardwareTypes.WATER
// ];
const FOUR_CHANNELS_HARDWARE_TYPES = [
    hardwareTypes.IMP4EU,
    hardwareTypes.IMP4IN
];
const MTX_HARDWARE_TYPES = [
    hardwareTypes.MTXLORA
];

const TWO_BYTES_HARDWARE_TYPES = [...FOUR_CHANNELS_HARDWARE_TYPES, ...MTX_HARDWARE_TYPES];

const gasBitMask = {
    isBatteryLow: Math.pow(2, 0),
    isMagneticInfluence: Math.pow(2, 1),
    isButtonReleased: Math.pow(2, 2),
    isConnectionLost: Math.pow(2, 3)
};
const twoChannelBitMask = {
    isBatteryLow: Math.pow(2, 0),
    isConnectionLost: Math.pow(2, 3),
    isFirstChannelInactive: Math.pow(2, 4),
    isSecondChannelInactive: Math.pow(2, 5)
};
const elimpBitMask = {
    isConnectionLost: Math.pow(2, 3)
};
// const waterBitMask = {
//     isBatteryLow: Math.pow(2, 0),
//     isConnectionLost: Math.pow(2, 3)
// };
const fourChannelBitMask = {
    isBatteryLow: Math.pow(2, 0),
    isConnectionLost: Math.pow(2, 3),
    isFirstChannelInactive: Math.pow(2, 4),
    isSecondChannelInactive: Math.pow(2, 5),
    isThirdChannelInactive: Math.pow(2, 6),
    isForthChannelInactive: Math.pow(2, 8)
};
const mtxBitMask = {
    isMeterCaseOpen: Math.pow(2, 0),
    isMagneticInfluence: Math.pow(2, 1),
    isParametersSetRemotely: Math.pow(2, 2),
    isParametersSetLocally: Math.pow(2, 3),
    isMeterProgramRestarted: Math.pow(2, 4),
    isLockedOut: Math.pow(2, 5),
    isTimeSet: Math.pow(2, 6),
    isTimeCorrected: Math.pow(2, 7),
    isMeterFailure: Math.pow(2, 8),
    isMeterTerminalBoxOpen: Math.pow(2, 9),
    isModuleCompartmentOpen: Math.pow(2, 10),
    isTariffPlanChanged: Math.pow(2, 11),
    isNewTariffPlanReceived: Math.pow(2, 12)
};
const usWaterMeterEventBitMask = {
    transportMode: 0x01,
    frequencyOutput: 0x02,
    reverseFlow: 0x04,
    tamperBreak: 0x08,
    leakage: 0x10,
    pipeBreak: 0x20,
    pipeEmpty: 0x40,
    batteryDischarge: 0x80
};


/**
 * device parameter data size + byte for parameter id
 */
const parametersSizeMap = {
    /* size: 1 byte of parameter id + parameter data*/
    [deviceParameters.REPORTING_DATA_INTERVAL]: 1 + 4,
    [deviceParameters.DAY_CHECKOUT_HOUR]: 1 + 1,
    [deviceParameters.REPORTING_DATA_TYPE]: 1 + 1,
    [deviceParameters.PRIORITY_DATA_DELIVERY_TYPE]: 1 + 1,
    [deviceParameters.ACTIVATION_METHOD]: 1 + 1,
    [deviceParameters.BATTERY_DEPASSIVATION_INFO]: 1 + 6,
    [deviceParameters.BATTERY_MINIMAL_LOAD_TIME]: 1 + 4,
    [deviceParameters.CHANNELS_CONFIG]: 1 + 1,
    [deviceParameters.RX2_CONFIG]: 1 + 4,
    [deviceParameters.ABSOLUTE_DATA]: 1 + 9,
    [deviceParameters.ABSOLUTE_DATA_ENABLE]: 1 + 1,
    [deviceParameters.SERIAL_NUMBER]: 1 + 6,
    [deviceParameters.GEOLOCATION]: 1 + 10,
    [deviceParameters.EXTRA_FRAME_INTERVAL]: 1 + 2,
    [deviceParameters.ABSOLUTE_DATA_MULTI_CHANNEL]: 1 + 10,
    [deviceParameters.ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL]: 1 + 2,
    [deviceParameters.PULSE_CHANNELS_SCAN_CONFIG]: 1 + 3,
    [deviceParameters.PULSE_CHANNELS_SET_CONFIG]: 1 + 1,
    [deviceParameters.BATTERY_DEPASSIVATION_CONFIG]: 1 + 4,
    [deviceParameters.MQTT_SSL_ENABLE]: 1 + 1,
    [deviceParameters.MQTT_DATA_RECEIVE_CONFIG]: 1 + 3,
    [deviceParameters.MQTT_DATA_SEND_CONFIG]: 1 + 3,
    [deviceParameters.NBIOT_SSL_CONFIG]: 1 + 2,
    [deviceParameters.NBIOT_SSL_CACERT_SET]: 1 + 4,
    [deviceParameters.NBIOT_SSL_CLIENT_CERT_SET]: 1 + 4,
    [deviceParameters.NBIOT_SSL_CLIENT_KEY_SET]: 1 + 4,
    [deviceParameters.REPORTING_DATA_CONFIG]: 1 + 4,
    [deviceParameters.EVENTS_CONFIG]: 1 + 3,
    [deviceParameters.NBIOT_LED_INDICATION]: 1 + 2,
    [deviceParameters.NBIOT_SIM]: 1 + 3
};

const fourChannelsBitMask = {
    channel1: Math.pow(2, 0),
    channel2: Math.pow(2, 1),
    channel3: Math.pow(2, 2),
    channel4: Math.pow(2, 3)
};

// 0x80 - 0x86
const byteToPulseCoefficientMap = {
    128: 1,
    129: 5,
    130: 10,
    131: 100,
    132: 1000,
    133: 10000,
    134: 100000
};

const pulseCoefficientToByteMap = invertObject(byteToPulseCoefficientMap);

const isMSBSet = ( value: number ): boolean => !!(value & 0x80);

const getChannelValue = ( buffer: ICommandBinaryBuffer ): number => buffer.getUint8() + 1;

const setChannelValue = ( buffer: ICommandBinaryBuffer, value: number ) => {
    if ( value < 1 ) {
        throw new Error('channel must be 1 or greater');
    }

    buffer.setUint8(value - 1);
};

const getNbiotSslWrite = ( buffer: ICommandBinaryBuffer ) => ({
    size: buffer.getUint16(false),
    position: buffer.getUint16(false),
    chunk: buffer.getBytesLeft()
});

const setNbiotSslWrite = ( buffer: ICommandBinaryBuffer, parameter: IParameterNbiotSslWrite ) => {
    if ( parameter.size !== parameter.chunk.length ) {
        throw new Error('ssl chunk size parameter doesn\'t match actual ssl chunk size');
    }

    buffer.setUint16(parameter.size, false);
    buffer.setUint16(parameter.position, false);
    buffer.setBytes(parameter.chunk);
};


const getNbiotSslSet = ( buffer: ICommandBinaryBuffer ) => ({crc32: buffer.getUint32(false)});

const setNbiotSslSet = ( buffer: ICommandBinaryBuffer, parameter: IParameterNbiotSslSet ) => {
    buffer.setUint32(parameter.crc32, false);
};


const deviceParameterConvertersMap = {
    [deviceParameters.REPORTING_DATA_INTERVAL]: {
        get: ( buffer: ICommandBinaryBuffer ): IParameterReportingDataInterval => {
            buffer.seek( buffer.offset + DATA_SENDING_INTERVAL_RESERVED_BYTES);

            return {
                value: buffer.getUint8() * DATA_SENDING_INTERVAL_SECONDS_COEFFICIENT
            };
        },
        set: ( buffer: ICommandBinaryBuffer, parameter: IParameterReportingDataInterval ) => {
            buffer.seek( buffer.offset + DATA_SENDING_INTERVAL_RESERVED_BYTES);

            buffer.setUint8(parameter.value / DATA_SENDING_INTERVAL_SECONDS_COEFFICIENT);
        }
    },
    [deviceParameters.DAY_CHECKOUT_HOUR]: {
        get: ( buffer: ICommandBinaryBuffer ): IParameterDayCheckoutHour => ({
            value: buffer.getUint8()
        }),
        set: ( buffer: ICommandBinaryBuffer, parameter: IParameterDayCheckoutHour ) => {
            buffer.setUint8(parameter.value);
        }
    },
    [deviceParameters.REPORTING_DATA_TYPE]: {
        get: ( buffer: ICommandBinaryBuffer ): IParameterReportingDataType => ({
            type: buffer.getUint8()
        }),
        set: ( buffer: ICommandBinaryBuffer, parameter: IParameterReportingDataType ) => {
            buffer.setUint8(parameter.type);
        }
    },
    [deviceParameters.PRIORITY_DATA_DELIVERY_TYPE]: {
        get: ( buffer: ICommandBinaryBuffer ): IParameterDeliveryTypeOfPriorityData => ({value: buffer.getUint8()}),
        set: ( buffer: ICommandBinaryBuffer, parameter: IParameterDeliveryTypeOfPriorityData ) => {
            buffer.setUint8(parameter.value);
        }
    },
    [deviceParameters.ACTIVATION_METHOD]: {
        get: ( buffer: ICommandBinaryBuffer ): IParameterActivationMethod => ({
            type: buffer.getUint8()
        }),
        set: ( buffer: ICommandBinaryBuffer, parameter: IParameterActivationMethod ) => {
            buffer.setUint8(parameter.type);
        }
    },
    [deviceParameters.BATTERY_DEPASSIVATION_INFO]: {
        get: ( buffer: ICommandBinaryBuffer ): IParameterBatteryDepassivationInfo => ({
            loadTime: buffer.getUint16(false),
            internalResistance: buffer.getUint16(false),
            lowVoltage: buffer.getUint16(false)
        }),
        set: ( buffer: ICommandBinaryBuffer, parameter: IParameterBatteryDepassivationInfo ) => {
            buffer.setUint16(parameter.loadTime, false);
            buffer.setUint16(parameter.internalResistance, false);
            buffer.setUint16(parameter.lowVoltage, false);
        }
    },
    [deviceParameters.BATTERY_MINIMAL_LOAD_TIME]: {
        get: ( buffer: ICommandBinaryBuffer ): IParameterBatteryMinimalLoadTime => ({
            value: buffer.getUint32(false)
        }),
        set: ( buffer: ICommandBinaryBuffer, parameter: IParameterBatteryMinimalLoadTime ) => {
            buffer.setUint32(parameter.value, false);
        }
    },
    [deviceParameters.CHANNELS_CONFIG]: {
        get: ( buffer: ICommandBinaryBuffer ): IParameterChannelsConfig => ({value: buffer.getUint8()}),
        set: ( buffer: ICommandBinaryBuffer, parameter: IParameterChannelsConfig ) => {
            if ( parameter.value < 0 || parameter.value > 18 ) {
                throw new Error('channels config must be between 0-18');
            }

            buffer.setUint8(parameter.value);
        }
    },
    [deviceParameters.RX2_CONFIG]: {
        get: ( buffer: ICommandBinaryBuffer ): IParameterRx2Config => ({
            spreadFactor: buffer.getUint8(),
            frequency: buffer.getUint24(false) * PARAMETER_RX2_FREQUENCY_COEFFICIENT
        }),
        set: ( buffer: ICommandBinaryBuffer, parameter: IParameterRx2Config ) => {
            buffer.setUint8(parameter.spreadFactor);
            buffer.setUint24(parameter.frequency / PARAMETER_RX2_FREQUENCY_COEFFICIENT, false);
        }
    },
    [deviceParameters.ABSOLUTE_DATA]: {
        get: ( buffer: ICommandBinaryBuffer ): IParameterAbsoluteData => ({
            meterValue: buffer.getUint32(false),
            pulseCoefficient: buffer.getPulseCoefficient(),
            value: buffer.getUint32(false)
        }),
        set: ( buffer: ICommandBinaryBuffer, parameter: IParameterAbsoluteData ) => {
            buffer.setUint32(parameter.meterValue, false);
            buffer.setPulseCoefficient(parameter.pulseCoefficient);
            buffer.setUint32(parameter.value, false);
        }
    },
    [deviceParameters.ABSOLUTE_DATA_ENABLE]: {
        get: ( buffer: ICommandBinaryBuffer ): IParameterAbsoluteDataEnable => ({state: buffer.getUint8()}),
        set: ( buffer: ICommandBinaryBuffer, parameter: IParameterAbsoluteDataEnable ) => {
            buffer.setUint8(parameter.state);
        }
    },
    [deviceParameters.SERIAL_NUMBER]: {
        get: ( buffer: ICommandBinaryBuffer ): IParameterSerialNumber => ({
            value: getHexFromBytes(buffer.getBytes(SERIAL_NUMBER_SIZE))
        }),
        set: ( buffer: ICommandBinaryBuffer, parameter: IParameterSerialNumber ) => {
            getBytesFromHex(parameter.value).forEach(byte => buffer.setUint8(byte));
        }
    },
    [deviceParameters.GEOLOCATION]: {
        get: ( buffer: ICommandBinaryBuffer ): IParameterGeolocation => ({
            latitude: roundNumber( buffer.getFloat32()),
            longitude: roundNumber( buffer.getFloat32()),
            altitude: roundNumber( buffer.getUint16())
        }),
        set: ( buffer: ICommandBinaryBuffer, parameter: IParameterGeolocation ) => {
            buffer.setFloat32(roundNumber(parameter.latitude));
            buffer.setFloat32(roundNumber(parameter.longitude));
            buffer.setUint16(roundNumber(parameter.altitude));
        }
    },
    [deviceParameters.EXTRA_FRAME_INTERVAL]: {
        get: ( buffer: ICommandBinaryBuffer ): IParameterExtraFrameInterval => ({value: buffer.getUint16()}),
        set: ( buffer: ICommandBinaryBuffer, parameter: IParameterExtraFrameInterval ) => {
            buffer.setUint16(parameter.value);
        }
    },
    [deviceParameters.ABSOLUTE_DATA_MULTI_CHANNEL]: {
        get: ( buffer: ICommandBinaryBuffer ): IParameterAbsoluteDataMC => ({
            channel: getChannelValue(buffer),
            meterValue: buffer.getUint32(false),
            pulseCoefficient: buffer.getPulseCoefficient(),
            value: buffer.getUint32(false)
        }),
        set: ( buffer: ICommandBinaryBuffer, parameter: IParameterAbsoluteDataMC ) => {
            setChannelValue(buffer, parameter.channel);
            buffer.setUint32(parameter.meterValue, false);
            buffer.setPulseCoefficient(parameter.pulseCoefficient);
            buffer.setUint32(parameter.value, false);
        }
    },
    [deviceParameters.ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL]: {
        get: ( buffer: ICommandBinaryBuffer ): IParameterAbsoluteDataEnableMC => ({
            channel: getChannelValue(buffer),
            state: buffer.getUint8()
        }),
        set: ( buffer: ICommandBinaryBuffer, parameter: IParameterAbsoluteDataEnableMC ) => {
            setChannelValue(buffer, parameter.channel);
            buffer.setUint8(parameter.state);
        }
    },
    [deviceParameters.PULSE_CHANNELS_SCAN_CONFIG]: {
        get: ( buffer: ICommandBinaryBuffer ): IParameterPulseChannelsScanConfig => ({
            channelList: buffer.getChannels(),
            pullUpTime: buffer.getUint8(),
            scanTime: buffer.getUint8()
        }),
        set: ( buffer: ICommandBinaryBuffer, parameter: IParameterPulseChannelsScanConfig ) => {
            if ( parameter.pullUpTime < 17 ) {
                throw new Error('minimal value for pullUpTime - 17');
            }

            if ( parameter.scanTime < 15 ) {
                throw new Error('minimal value for scanTime - 15');
            }

            buffer.setChannels(parameter.channelList.map(index => ({index} as IChannel)));
            buffer.setUint8(parameter.pullUpTime);
            buffer.setUint8(parameter.scanTime);
        }
    },
    [deviceParameters.PULSE_CHANNELS_SET_CONFIG]: {
        get: ( buffer: ICommandBinaryBuffer ): IParameterPulseChannelsSetConfig => {
            const object = bitSet.toObject(fourChannelsBitMask, buffer.getUint8());

            return {channel1: object.channel1, channel2: object.channel2, channel3: object.channel3, channel4: object.channel4};
        },
        set: ( buffer: ICommandBinaryBuffer, parameter: IParameterPulseChannelsSetConfig ) => {
            const {channel1, channel2, channel3, channel4} = parameter;

            buffer.setUint8(bitSet.fromObject(fourChannelsBitMask, {channel1, channel2, channel3, channel4}));
        }
    },
    [deviceParameters.BATTERY_DEPASSIVATION_CONFIG]: {
        get: ( buffer: ICommandBinaryBuffer ): IParameterBatteryDepassivationConfig => ({
            resistanceStartThreshold: buffer.getUint16(false),
            resistanceStopThreshold: buffer.getUint16(false)
        }),
        set: ( buffer: ICommandBinaryBuffer, parameter: IParameterBatteryDepassivationConfig ) => {
            buffer.setUint16(parameter.resistanceStartThreshold, false);
            buffer.setUint16(parameter.resistanceStopThreshold, false);
        }
    },
    [deviceParameters.MQTT_SESSION_CONFIG]: {
        get: ( buffer: ICommandBinaryBuffer ): IParameterMqttSessionConfig => ({
            clientId: buffer.getString(),
            username: buffer.getString(),
            password: buffer.getString(),
            cleanSession: buffer.getUint8()
        }),
        set: ( buffer: ICommandBinaryBuffer, parameter: IParameterMqttSessionConfig ) => {
            buffer.setString(parameter.clientId);
            buffer.setString(parameter.username);
            buffer.setString(parameter.password);
            buffer.setUint8(parameter.cleanSession);
        }
    },
    [deviceParameters.MQTT_BROKER_ADDRESS]: {
        get: ( buffer: ICommandBinaryBuffer ): IParameterMqttBrokerAddress => ({
            hostName: buffer.getString(),
            port: buffer.getUint16(false)
        }),
        set: ( buffer: ICommandBinaryBuffer, parameter: IParameterMqttBrokerAddress ) => {
            buffer.setString(parameter.hostName);
            buffer.setUint16(parameter.port, false);
        }
    },
    [deviceParameters.MQTT_SSL_ENABLE]: {
        get: ( buffer: ICommandBinaryBuffer ): IParameterMqttSslEnable => ({
            enable: buffer.getUint8()
        }),
        set: ( buffer: ICommandBinaryBuffer, parameter: IParameterMqttSslEnable ) => {
            buffer.setUint8(parameter.enable);
        }
    },
    [deviceParameters.MQTT_TOPIC_PREFIX]: {
        get: ( buffer: ICommandBinaryBuffer ): IParameterMqttTopicPrefix => ({
            topicPrefix: buffer.getString()
        }),
        set: ( buffer: ICommandBinaryBuffer, parameter: IParameterMqttTopicPrefix ) => {
            buffer.setString(parameter.topicPrefix);
        }
    },
    [deviceParameters.MQTT_DATA_RECEIVE_CONFIG]: {
        get: ( buffer: ICommandBinaryBuffer ): IParameterMqttDataReceiveConfig => ({
            qos: buffer.getUint8(),
            count: buffer.getUint8(),
            timeout: buffer.getUint8()
        }),
        set: ( buffer: ICommandBinaryBuffer, parameter: IParameterMqttDataReceiveConfig ) => {
            buffer.setUint8(parameter.qos);
            buffer.setUint8(parameter.count);
            buffer.setUint8(parameter.timeout);
        }
    },
    [deviceParameters.MQTT_DATA_SEND_CONFIG]: {
        get: ( buffer: ICommandBinaryBuffer ): IParameterMqttDataSendConfig => ({
            qos: buffer.getUint8(),
            retain: buffer.getUint8(),
            newestSendFirst: buffer.getUint8()
        }),
        set: ( buffer: ICommandBinaryBuffer, parameter: IParameterMqttDataSendConfig ) => {
            buffer.setUint8(parameter.qos);
            buffer.setUint8(parameter.retain);
            buffer.setUint8(parameter.newestSendFirst);
        }
    },
    [deviceParameters.NBIOT_SSL_CONFIG]: {
        get: ( buffer: ICommandBinaryBuffer ): IParameterNbiotSslConfig => ({
            securityLevel: buffer.getUint8(),
            version: buffer.getUint8()
        }),
        set: ( buffer: ICommandBinaryBuffer, parameter: IParameterNbiotSslConfig ) => {
            buffer.setUint8(parameter.securityLevel);
            buffer.setUint8(parameter.version);
        }
    },
    [deviceParameters.NBIOT_SSL_CACERT_WRITE]: {
        get: getNbiotSslWrite,
        set: setNbiotSslWrite
    },
    [deviceParameters.NBIOT_SSL_CACERT_SET]: {
        get: getNbiotSslSet,
        set: setNbiotSslSet
    },
    [deviceParameters.NBIOT_SSL_CLIENT_CERT_WRITE]: {
        get: getNbiotSslWrite,
        set: setNbiotSslWrite
    },
    [deviceParameters.NBIOT_SSL_CLIENT_CERT_SET]: {
        get: getNbiotSslSet,
        set: setNbiotSslSet
    },
    [deviceParameters.NBIOT_SSL_CLIENT_KEY_WRITE]: {
        get: getNbiotSslWrite,
        set: setNbiotSslWrite
    },
    [deviceParameters.NBIOT_SSL_CLIENT_KEY_SET]: {
        get: getNbiotSslSet,
        set: setNbiotSslSet
    },
    [deviceParameters.NBIOT_DEVICE_SOFTWARE_UPDATE]: {
        get: ( buffer: ICommandBinaryBuffer ): IParameterNbiotDeviceSoftwareUpdate => ({
            softwareImageUrl: buffer.getString()
        }),
        set: ( buffer: ICommandBinaryBuffer, parameter: IParameterNbiotDeviceSoftwareUpdate ) => {
            buffer.setString(parameter.softwareImageUrl);
        }
    },
    [deviceParameters.NBIOT_MODULE_FIRMWARE_UPDATE]: {
        get: ( buffer: ICommandBinaryBuffer ): IParameterNbiotModuleFirmwareUpdate => ({
            moduleFirmwareImageUrl: buffer.getString()
        }),
        set: ( buffer: ICommandBinaryBuffer, parameter: IParameterNbiotModuleFirmwareUpdate ) => {
            buffer.setString(parameter.moduleFirmwareImageUrl);
        }
    },
    [deviceParameters.REPORTING_DATA_CONFIG]: {
        get: ( buffer: ICommandBinaryBuffer ): IParameterReportingDataConfig => ({
            dataType: buffer.getUint8(),
            hour: buffer.getUint8(),
            minutes: buffer.getUint8(),
            countToSend: buffer.getUint8()
        }),
        set: ( buffer: ICommandBinaryBuffer, parameter: IParameterReportingDataConfig ) => {
            buffer.setUint8(parameter.dataType);
            buffer.setUint8(parameter.hour);
            buffer.setUint8(parameter.minutes);
            buffer.setUint8(parameter.countToSend);
        }
    },
    [deviceParameters.EVENTS_CONFIG]: {
        get: ( buffer: ICommandBinaryBuffer ): IParameterEventsConfig => ({
            eventId: buffer.getUint8(),
            sendEvent: buffer.getUint8(),
            saveEvent: buffer.getUint8()
        }),
        set: ( buffer: ICommandBinaryBuffer, parameter: IParameterEventsConfig ) => {
            buffer.setUint8(parameter.eventId);
            buffer.setUint8(parameter.sendEvent);
            buffer.setUint8(parameter.saveEvent);
        }
    },
    [deviceParameters.NBIOT_MODULE_INFO]: {
        get: ( buffer: ICommandBinaryBuffer ): IParameterNbiotModuleInfo => ({
            moduleInfo: buffer.getString()
        }),
        set: ( buffer: ICommandBinaryBuffer, parameter: IParameterNbiotModuleInfo ) => {
            buffer.setString(parameter.moduleInfo);
        }
    },
    [deviceParameters.NBIOT_BANDS]: {
        get: ( buffer: ICommandBinaryBuffer ): IParameterNbiotBands => {
            const count = buffer.getUint8();
            const bands: Array<number> = [];

            for ( let index = 0; index < count; index++ ) {
                bands.push(buffer.getUint8());
            }

            return {bands};
        },
        set: ( buffer: ICommandBinaryBuffer, parameter: IParameterNbiotBands ) => {
            buffer.setUint8(parameter.bands.length);

            for ( const band of parameter.bands ) {
                buffer.setUint8(band);
            }
        }
    },
    [deviceParameters.NBIOT_APN]: {
        get: ( buffer: ICommandBinaryBuffer ): IParameterNbiotApn => ({
            apn: buffer.getString()
        }),
        set: ( buffer: ICommandBinaryBuffer, parameter: IParameterNbiotApn ) => {
            buffer.setString(parameter.apn);
        }
    },
    [deviceParameters.NBIOT_LED_INDICATION]: {
        get: ( buffer: ICommandBinaryBuffer ): IParameterNbiotLedIndication => ({
            enableLed: buffer.getUint8(),
            enableNbiotNetworkLed: buffer.getUint8()
        }),
        set: ( buffer: ICommandBinaryBuffer, parameter: IParameterNbiotLedIndication ) => {
            buffer.setUint8(parameter.enableLed);
            buffer.setUint8(parameter.enableNbiotNetworkLed);
        }
    },
    [deviceParameters.NBIOT_SIM]: {
        get: ( buffer: ICommandBinaryBuffer ): IParameterNbiotSim => ({
            enable: buffer.getUint8(),
            pin: buffer.getUint16(false)
        }),
        set: ( buffer: ICommandBinaryBuffer, parameter: IParameterNbiotSim ) => {
            buffer.setUint8(parameter.enable);
            buffer.setUint16(parameter.pin, false);
        }
    }
};


export const getEventStatusSize = ( hardwareType: number ): number => (
    TWO_BYTES_HARDWARE_TYPES.indexOf(hardwareType) !== -1 ? 2 : 1
);


export const getParameterSize = ( parameter: IParameter ): number => {
    let size;
    let data;

    switch ( parameter.id ) {
        case deviceParameters.MQTT_SESSION_CONFIG:
            data = parameter.data as IParameterMqttSessionConfig;
            // size: parameter id + cleanSession
            size = 1 + 1;
            size += data.clientId.length + 1;
            size += data.username.length + 1;
            size += data.password.length + 1;

            break;

        case deviceParameters.MQTT_BROKER_ADDRESS:
            data = parameter.data as IParameterMqttBrokerAddress;
            // size: parameter id + port
            size = 1 + 2;
            size += data.hostName.length + 1;
            break;

        case deviceParameters.MQTT_TOPIC_PREFIX:
            data = parameter.data as IParameterMqttTopicPrefix;
            // size: parameter id
            size = 1;
            size += data.topicPrefix.length + 1;
            break;

        case deviceParameters.NBIOT_SSL_CACERT_WRITE:
        case deviceParameters.NBIOT_SSL_CLIENT_CERT_WRITE:
        case deviceParameters.NBIOT_SSL_CLIENT_KEY_WRITE:
            data = parameter.data as IParameterNbiotSslWrite;
            // size: parameter id + size + pos
            size = 1 + 2 + 2;
            size += data.chunk.length;

            break;

        case deviceParameters.NBIOT_DEVICE_SOFTWARE_UPDATE:
            data = parameter.data as IParameterNbiotDeviceSoftwareUpdate;
            // size: parameter id
            size = 1;
            size += data.softwareImageUrl.length + 1;

            break;

        case deviceParameters.NBIOT_MODULE_FIRMWARE_UPDATE:
            data = parameter.data as IParameterNbiotModuleFirmwareUpdate;
            // size: parameter id
            size = 1;
            size += data.moduleFirmwareImageUrl.length + 1;

            break;

        case deviceParameters.NBIOT_MODULE_INFO:
            data = parameter.data as IParameterNbiotModuleInfo;
            // size: parameter id + string length + moduleInfo string
            size = 1 + 1 + data.moduleInfo.length;

            break;

        case deviceParameters.NBIOT_BANDS:
            data = parameter.data as IParameterNbiotBands;
            // size: parameter id + number of bands, one band - one byte
            size = 1 + 1;
            size += data.bands.length;

            break;

        case deviceParameters.NBIOT_APN:
            data = parameter.data as IParameterNbiotApn;
            // size: parameter id + string length + apn string
            size = 1 + 1 + data.apn.length;

            break;

        default:
            size = parametersSizeMap[parameter.id];
    }

    if ( size === undefined ) {
        throw new Error('unknown parameter id');
    }

    return size;
};


export const getRequestParameterSize = ( parameter: IRequestParameter ): number => {
    let size;

    switch ( parameter.id ) {
        case deviceParameters.ABSOLUTE_DATA_MULTI_CHANNEL:
        case deviceParameters.ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL:
        case deviceParameters.REPORTING_DATA_CONFIG:
        case deviceParameters.EVENTS_CONFIG:
            // 1 byte ID + parameter 1 byte
            size = 2;
            break;

        default:
            // 1 byte for ID
            size = 1;
            break;
    }

    return size;
};


export const getResponseParameterSize = ( parameter: IParameter ): number => {
    let size;

    switch ( parameter.id ) {
        case deviceParameters.MQTT_SESSION_CONFIG:
        case deviceParameters.NBIOT_SSL_CACERT_WRITE:
        case deviceParameters.NBIOT_SSL_CLIENT_CERT_WRITE:
        case deviceParameters.NBIOT_SSL_CLIENT_KEY_WRITE:
        case deviceParameters.NBIOT_SSL_CACERT_SET:
        case deviceParameters.NBIOT_SSL_CLIENT_CERT_SET:
        case deviceParameters.NBIOT_SSL_CLIENT_KEY_SET:
        case deviceParameters.NBIOT_DEVICE_SOFTWARE_UPDATE:
        case deviceParameters.NBIOT_MODULE_FIRMWARE_UPDATE:
            // all parameters write only
            size = 1;
            break;

        // dynamic but same data for parameter in response
        case deviceParameters.MQTT_BROKER_ADDRESS:
        case deviceParameters.MQTT_TOPIC_PREFIX:
        case deviceParameters.NBIOT_MODULE_INFO:
        case deviceParameters.NBIOT_BANDS:
        case deviceParameters.NBIOT_APN:
            size = getParameterSize(parameter);

            break;

        default:
            size = parametersSizeMap[parameter.id];
    }

    if ( size === undefined ) {
        throw new Error('unknown parameter id');
    }

    return size;
};


export interface ICommandBinaryBuffer extends IBinaryBuffer {
    // static methods
    getMagneticInfluenceBit ( byte: number ): boolean,
    setMagneticInfluenceBit ( byte: number, value: boolean ): number,
    getLegacyHourCounterSize ( hourCounter: ILegacyHourCounterWithDiff ): number,

    // instance methods
    getExtendedValue (): number,
    setExtendedValue ( value: number ),
    getExtendedValueSize (bits: number): number,

    getTime (): number,
    setTime (value: TTime2000): void,

    getBatteryVoltage (): IBatteryVoltage,
    setBatteryVoltage ( batteryVoltage: IBatteryVoltage ),

    getLegacyCounterValue (): types.TUint24,
    setLegacyCounterValue ( value: types.TUint24 ),

    getLegacyCounter (): ILegacyCounter,
    setLegacyCounter ( counter: ILegacyCounter, byte?: types.TUint8 ),

    getChannels (): Array<number>,
    setChannels ( channelList: Array<IChannel> );

    getChannelsValuesWithHourDiff (): {hours: number, startTime2000: TTime2000, channelList: Array<IChannelHours>},
    setChannelsValuesWithHourDiff ( hours: number, startTime2000: TTime2000, channelList: Array<IChannelHours> ),

    getHours ( byte?: types.TUint8 ): {hour: number, hours: number},
    setHours ( hour: number, hours: number ),

    getDate (): Date,
    setDate ( dateOrTime: Date | TTime2000 ),

    getPulseCoefficient (): TPulseCoefficient,
    setPulseCoefficient ( value: TPulseCoefficient ),

    getChannelsWithAbsoluteValues (): Array<IChannelAbsoluteValue>,
    setChannelsWithAbsoluteValues ( channelList: Array<IChannelAbsoluteValue> ),

    getChannelsAbsoluteValuesWithHourDiff ( hours: number ): Array<IChannelHourAbsoluteValue>,
    setChannelsAbsoluteValuesWithHourDiff ( channelList: Array<IChannelHourAbsoluteValue> ),

    getEventStatus ( hardwareType: number ): TEventStatus,
    setEventStatus ( hardwareType: number, status: TEventStatus ),

    getParameter (): IParameter,
    setParameter ( parameter: IParameter ),

    getRequestParameter (): IRequestParameter,
    setRequestParameter ( parameter: IRequestParameter ),

    getResponseParameter (): IResponseParameter,
    setResponseParameter ( parameter: IResponseParameter ),

    getLegacyHourDiff (): ILegacyCounter,
    setLegacyHourDiff ( diff: ILegacyCounter ),

    getLegacyHourCounterWithDiff (): ILegacyHourCounterWithDiff,
    setLegacyHourCounterWithDiff ( hourCounter: ILegacyHourCounterWithDiff )

    getChannelsValuesWithHourDiffExtended (): IChannelValuesWithHourDiffExtended,
    setChannelsValuesWithHourDiffExtended ( parameters: IChannelValuesWithHourDiffExtended )

    getDataSegment (): IDataSegment,
    setDataSegment ( parameters: IDataSegment )
}

function CommandBinaryBuffer ( this: ICommandBinaryBuffer, dataOrLength: types.TBytes | number, isLittleEndian = true ) {
    BinaryBuffer.call(this, dataOrLength, isLittleEndian);
}

// extending
CommandBinaryBuffer.prototype = Object.create(BinaryBuffer.prototype);
CommandBinaryBuffer.prototype.constructor = CommandBinaryBuffer;


CommandBinaryBuffer.getMagneticInfluenceBit = ( byte: number ): boolean => (
    !!extractBits(byte, 1, MAGNETIC_INFLUENCE_BIT_INDEX)
);

CommandBinaryBuffer.setMagneticInfluenceBit = ( byte: number, value: boolean ): number => (
    fillBits(byte, 1, MAGNETIC_INFLUENCE_BIT_INDEX, +value)
);

CommandBinaryBuffer.getLegacyHourCounterSize = ( hourCounter: ILegacyHourCounterWithDiff ): number => (
    LEGACY_HOUR_COUNTER_SIZE + (hourCounter.diff.length * LEGACY_HOUR_DIFF_SIZE)
);


CommandBinaryBuffer.prototype.getExtendedValue = function (): number {
    let value = 0;
    let isByteExtended = true;
    // byte offset
    let position = 0;

    while ( isByteExtended && this.offset <= this.data.length ) {
        const byte = this.getUint8();

        isByteExtended = !!(byte & EXTEND_BIT_MASK);
        // https://stackoverflow.com/a/30089815/7119054
        value += ((byte & 0x7f) << (7 * position)) >>> 0;
        ++position;
    }

    if ( value < 0 ) {
        value = 0;
    }

    return value;
};


CommandBinaryBuffer.prototype.setExtendedValue = function ( value: number ) {
    if ( value === 0 ) {
        this.setUint8(0);

        return;
    }

    const data = [];
    let encodedValue = value;

    while ( encodedValue ) {
        data.push(EXTEND_BIT_MASK | (encodedValue & 0x7f));
        encodedValue >>>= 7;
    }

    const lastByte = data.pop();

    if ( lastByte ) {
        // clear EXTENDED bit flag for last value
        data.push(lastByte & 0x7f);
    }

    data.forEach(extendedValue => this.setUint8(extendedValue));
};


/**
 * Get the number of bytes necessary to store an extended value.
 *
 * @param bits - the number of bits of original value
 *
 * @example
 * ```js
 * const bits = (16384).toString(2).length;
 * const bytes = CommandBinaryBuffer.getExtendedValueSize(bits);
 * // 16384 normally is stored in 2 bytes but for extended value 3 bytes are required
 * ```
 */
CommandBinaryBuffer.prototype.getExtendedValueSize = function ( bits: number ): number {
    const extBits = Math.ceil(bits / 7);
    const totalBits = bits + extBits;
    const extBytes = Math.ceil(totalBits / 8);

    return extBytes;
};


CommandBinaryBuffer.prototype.getTime = function (): number {
    return this.getUint32(false);
};


CommandBinaryBuffer.prototype.setTime = function ( value: TTime2000 ): void {
    this.setUint32(value, false);
};


CommandBinaryBuffer.prototype.getBatteryVoltage = function (): IBatteryVoltage {
    const lowVoltageByte = this.getUint8();
    const lowAndHightVoltageByte = this.getUint8();
    const highVoltageByte = this.getUint8();

    let underLowLoad = lowVoltageByte << 4;
    underLowLoad |= (lowAndHightVoltageByte & 0xf0) >> 4;
    let underHighLoad = ((lowAndHightVoltageByte & 0x0f) << 8) | highVoltageByte;

    if ( underHighLoad === UNKNOWN_BATTERY_VOLTAGE ) {
        underHighLoad = undefined;
    }

    if ( underLowLoad === UNKNOWN_BATTERY_VOLTAGE ) {
        underLowLoad = undefined;
    }

    return {underLowLoad, underHighLoad};
};


CommandBinaryBuffer.prototype.setBatteryVoltage = function ( batteryVoltage: IBatteryVoltage ) {
    let {underLowLoad, underHighLoad} = batteryVoltage;

    if ( underLowLoad === undefined ) {
        underLowLoad = UNKNOWN_BATTERY_VOLTAGE;
    }

    if ( underHighLoad === undefined ) {
        underHighLoad = UNKNOWN_BATTERY_VOLTAGE;
    }

    const lowVoltageByte = (underLowLoad >> 4) & 0xff;
    const lowAndHighVoltageByte = ((underLowLoad & 0x0f) << 4) | ((underHighLoad >> 8) & 0x0f);
    const highVoltageByte = underHighLoad & 0xff;

    [lowVoltageByte, lowAndHighVoltageByte, highVoltageByte].forEach(byte => this.setUint8(byte));
};

CommandBinaryBuffer.prototype.getLegacyCounterValue = function (): types.TUint24 {
    return this.getUint24(false);
};

CommandBinaryBuffer.prototype.setLegacyCounterValue = function ( value: types.TUint24 ) {
    this.setUint24(value, false);
};

CommandBinaryBuffer.prototype.getLegacyCounter = function ( byte = this.getUint8() ): ILegacyCounter {
    return {
        isMagneticInfluence: CommandBinaryBuffer.getMagneticInfluenceBit(byte),
        value: this.getLegacyCounterValue()
    };
};

CommandBinaryBuffer.prototype.setLegacyCounter = function ( counter: ILegacyCounter, byte = 0 ) {
    this.setUint8(CommandBinaryBuffer.setMagneticInfluenceBit(byte, counter.isMagneticInfluence));
    this.setLegacyCounterValue(counter.value);
};


/**
 * Get array of channel indexes.
 */
CommandBinaryBuffer.prototype.getChannels = function (): Array<number> {
    const channelList: Array<number> = [];

    let extended = true;
    let channelIndex = 1;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while ( extended ) {
        const byte = this.getUint8();

        // original 0b00000001, reverse it to get first - `1`
        const bits = byte.toString(2).padStart(LAST_BIT_INDEX + 1, '0').split('').reverse();

        // eslint-disable-next-line @typescript-eslint/no-loop-func
        bits.forEach((bit, index) => {
            const value = Number(bit);

            if ( index === LAST_BIT_INDEX ) {
                // highest bit in byte
                extended = !!value;
            } else {
                if ( value ) {
                    channelList.push(channelIndex);
                }

                ++channelIndex;
            }
        });
    }

    return channelList;
};


/**
 * Set array of channel indexes.
 */
CommandBinaryBuffer.prototype.setChannels = function ( channelList: Array<IChannel> ) {
    if ( channelList.length === 0 ) {
        this.setUint8(0);

        return;
    }

    // sort channels by index
    channelList.sort((a, b) => a.index - b.index);

    // find max channel index from 0 to detect the number of bytes
    const maxChannel = Math.max(...channelList.map(({index}) => index));
    const size = (maxChannel - (maxChannel % 8)) / 8;
    const data = new Array(size + 1).fill(0);

    let byte = 0;

    data.forEach((_, byteIndex) => {
        // max channel index in one byte - 6

        let channelIndex = (byteIndex * LAST_BIT_INDEX) + 1;
        const maxChannelIndex = channelIndex + LAST_BIT_INDEX;

        while ( channelIndex < maxChannelIndex ) {
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            const channel = channelList.find((item => item.index === channelIndex));

            if ( channel !== undefined ) {
                // set channel bit
                byte |= 1 << ((channel.index - 1) % LAST_BIT_INDEX);
            }

            ++channelIndex;
        }

        // set extended bit if next byte exist
        if ( data[byteIndex + 1] !== undefined ) {
            byte |= 1 << LAST_BIT_INDEX;
        }

        data[byteIndex] = byte;
        byte = 0;
    });

    data.forEach((value: number) => this.setUint8(value));
};


CommandBinaryBuffer.prototype.getChannelsValuesWithHourDiff = function (): {hours: number, startTime2000: TTime2000, channelList: Array<IChannelHours>} {
    const date = this.getDate();
    const {hour, hours} = this.getHours();
    const channels = this.getChannels();
    const channelList: Array<IChannelHours> = [];

    date.setUTCHours(hour);

    channels.forEach(channelIndex => {
        const diff: Array<number> = [];

        // decode hour value for channel
        const value = this.getExtendedValue();

        // start from first diff hour
        for ( let diffHour = 1; diffHour < hours; ++diffHour ) {
            diff.push(this.getExtendedValue());
        }

        channelList.push({
            value,
            diff,
            index: channelIndex
        });
    });

    return {startTime2000: getTime2000FromDate(date), hours, channelList};
};


CommandBinaryBuffer.prototype.setChannelsValuesWithHourDiff = function ( hours: number, startTime2000: TTime2000, channelList: Array<IChannelHours> ) {
    const date = getDateFromTime2000(startTime2000);
    const hour = date.getUTCHours();

    this.setDate(date);
    this.setHours(hour, hours);
    this.setChannels(channelList);

    channelList.forEach(({value, diff}) => {
        this.setExtendedValue(value);
        diff.forEach(diffValue => this.setExtendedValue(diffValue));
    });
};


/**
 * Retrieve start hour and number of hours from byte array.
 *
 * @example
 * 0xb8 = 0b10111000 will be {hours: 0b101, hour: 0b11000} i.e. {hours: 6, hour: 24}
 */
CommandBinaryBuffer.prototype.getHours = function ( byte = this.getUint8() ): {hour: number, hours: number} {
    if ( byte === 0 ) {
        return {hours: 0, hour: 0};
    }

    // real/human hours number = 1 (hour counter value) + each hour diff
    const hours = ((byte & 0xe0) >> 5) + 1;
    const hour = byte & 0x1f;

    return {hours, hour};
};


CommandBinaryBuffer.prototype.setHours = function ( hour: number, hours: number ) {
    if ( hour === 0 && hours === 0 ) {
        this.setUint8(0);

        return;
    }

    // convert real/human to binary - only number of diff hours
    this.setUint8((((hours - 1) & 0x07) << 5) | (hour & 0x1f));
};


/**
 * Retrieve device time from byte array.
 *
 * @example
 * ['00101111', '10010111'] -> [47, 151] will be '2023-12-23'
 *
 * @returns Date object instance
 */
CommandBinaryBuffer.prototype.getDate = function (): Date {
    const yearMonthByte = this.getUint8();
    const monthDateByte = this.getUint8();

    const year = yearMonthByte >> YEAR_START_INDEX;
    const month = ((yearMonthByte & 0x01) << MONTH_BIT_SIZE - YEAR_START_INDEX) | (monthDateByte >> DATE_BIT_SIZE);
    const monthDay = monthDateByte & 0x1f;

    return new Date(Date.UTC(year + INITIAL_YEAR, month - 1, monthDay, 0, 0, 0, 0));
};


/**
 * Convert date or seconds to bytes.
 * '2023-12-23' will be 0010111-1100-10111, so bytes: ['00101111', '10010111'] -> [47, 151]
 */
CommandBinaryBuffer.prototype.setDate = function ( dateOrTime: Date | TTime2000 ) {
    let date;

    if ( dateOrTime instanceof Date ) {
        date = dateOrTime;
    } else {
        date = getDateFromTime2000(dateOrTime);
    }

    const year = date.getUTCFullYear() - INITIAL_YEAR;
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();

    // create year and month bytes
    const yearMonthByte = (year << YEAR_START_INDEX) | (month >> MONTH_BIT_SIZE - YEAR_START_INDEX);
    const monthDateByte = ((month & 0x07) << DATE_BIT_SIZE) | day;

    [yearMonthByte, monthDateByte].forEach(byte => this.setUint8(byte));
};


CommandBinaryBuffer.prototype.getPulseCoefficient = function (): TPulseCoefficient {
    const pulseCoefficient = this.getUint8();

    if ( isMSBSet(pulseCoefficient) ) {
        const value = byteToPulseCoefficientMap[pulseCoefficient];

        if ( value ) {
            return value;
        }

        throw new Error('pulseCoefficient MSB is set, but value unknown');
    }

    return pulseCoefficient;
};


CommandBinaryBuffer.prototype.setPulseCoefficient = function ( value: TPulseCoefficient ) {
    if ( value in pulseCoefficientToByteMap ) {
        const byte = pulseCoefficientToByteMap[value];

        if ( byte ) {
            this.setUint8(byte);
        } else {
            throw new Error('pulseCoefficient MSB is set, but value unknown');
        }
    } else {
        this.setUint8(value);
    }
};


CommandBinaryBuffer.prototype.getChannelsWithAbsoluteValues = function (): Array<IChannelAbsoluteValue> {
    const channels = this.getChannels();
    const channelList: Array<IChannelAbsoluteValue> = [];

    channels.forEach(channelIndex => {
        channelList.push({
            pulseCoefficient: this.getPulseCoefficient(),
            // day value
            value: this.getExtendedValue(),
            index: channelIndex
        });
    });

    return channelList;
};


CommandBinaryBuffer.prototype.setChannelsWithAbsoluteValues = function ( channelList: Array<IChannelAbsoluteValue> ) {
    this.setChannels(channelList);

    channelList.forEach(({value, pulseCoefficient}) => {
        this.setPulseCoefficient(pulseCoefficient);
        this.setExtendedValue(value);
    });
};


CommandBinaryBuffer.prototype.getChannelsAbsoluteValuesWithHourDiff = function ( hours: number ): Array<IChannelHourAbsoluteValue> {
    const channels = this.getChannels();
    const channelList: Array<IChannelHourAbsoluteValue> = [];

    channels.forEach(channelIndex => {
        const pulseCoefficient = this.getPulseCoefficient();
        const value = this.getExtendedValue();
        const diff: Array<number> = [];

        for ( let hourIndex = 1; hourIndex < hours; ++hourIndex ) {
            diff.push(this.getExtendedValue());
        }

        channelList.push({
            diff,
            value,
            pulseCoefficient,
            index: channelIndex
        });
    });

    return channelList;
};


CommandBinaryBuffer.prototype.setChannelsAbsoluteValuesWithHourDiff = function ( channelList: Array<IChannelHourAbsoluteValue> ) {
    this.setChannels(channelList);

    channelList.forEach(({value, diff, pulseCoefficient}) => {
        this.setPulseCoefficient(pulseCoefficient);
        this.setExtendedValue(value);
        diff.forEach(diffValue => this.setExtendedValue(diffValue));
    });
};


CommandBinaryBuffer.prototype.getEventStatus = function ( hardwareType: number ): TEventStatus {
    let status: TEventStatus;

    if ( GAS_HARDWARE_TYPES.indexOf(hardwareType) !== -1 ) {
        status = bitSet.toObject(gasBitMask, this.getUint8());
    } else if ( TWO_CHANNELS_HARDWARE_TYPES.indexOf(hardwareType) !== -1 ) {
        status = bitSet.toObject(twoChannelBitMask, this.getUint8());
    } else if ( ELIMP_HARDWARE_TYPES.indexOf(hardwareType) !== -1 ) {
        status = bitSet.toObject(elimpBitMask, this.getUint8());
    // } else if ( WATER_HARDWARE_TYPES.includes(hardwareType) ) {
    //     status = bitSet.toObject(waterBitMask, this.getUint8());
    } else if ( FOUR_CHANNELS_HARDWARE_TYPES.indexOf(hardwareType) !== -1 ) {
        status = bitSet.toObject(fourChannelBitMask, this.getUint16());
    } else if ( MTX_HARDWARE_TYPES.indexOf(hardwareType) !== -1 ) {
        status = bitSet.toObject(mtxBitMask, this.getUint16());
    } else if ( hardwareType === hardwareTypes.US_WATER ) {
        // ultrasound water meter
        const event = bitSet.toObject(usWaterMeterEventBitMask, this.getUint8()) as unknown as IUSWaterMeterEvent;
        status = {event, error: this.getUint8()};
    } else {
        throw new Error('wrong hardwareType');
    }

    return status;
};


CommandBinaryBuffer.prototype.setEventStatus = function ( hardwareType: number, status: TEventStatus ) {
    if ( GAS_HARDWARE_TYPES.indexOf(hardwareType) !== -1 ) {
        this.setUint8(bitSet.fromObject(gasBitMask, status as bitSet.TBooleanObject));
    } else if ( TWO_CHANNELS_HARDWARE_TYPES.indexOf(hardwareType) !== -1 ) {
        this.setUint8(bitSet.fromObject(twoChannelBitMask, status as bitSet.TBooleanObject));
    } else if ( ELIMP_HARDWARE_TYPES.indexOf(hardwareType) !== -1 ) {
        this.setUint8(bitSet.fromObject(elimpBitMask, status as bitSet.TBooleanObject));
    // } else if ( WATER_HARDWARE_TYPES.includes(hardwareType) ) {
    //     this.setUint8(bitSet.fromObject(waterBitMask, status as bitSet.TBooleanObject));
    } else if ( FOUR_CHANNELS_HARDWARE_TYPES.indexOf(hardwareType) !== -1 ) {
        // apply 2 bytes with always set extended bit to 1 (on the 7-th position)
        this.setUint16(
            bitSet.fromObject(fourChannelBitMask, status as bitSet.TBooleanObject) | (1 << 7)
        );
    } else if ( MTX_HARDWARE_TYPES.indexOf(hardwareType) !== -1 ) {
        this.setUint16(bitSet.fromObject(mtxBitMask, status as bitSet.TBooleanObject));
    } else if ( hardwareType === hardwareTypes.US_WATER ) {
        const data = status as IEventUSWaterMeterStatus;
        this.setUint8(bitSet.fromObject(usWaterMeterEventBitMask, data.event as unknown as bitSet.TBooleanObject));
        this.setUint8(data.error);
    } else {
        throw new Error('wrong hardwareType');
    }
};


CommandBinaryBuffer.prototype.getParameter = function (): IParameter {
    const id = this.getUint8();

    if ( !deviceParameterConvertersMap[id] || !deviceParameterConvertersMap[id].get ) {
        throw new Error(`parameter ${id} is not supported`);
    }

    const data = deviceParameterConvertersMap[id].get(this);

    return {id, data};
};

CommandBinaryBuffer.prototype.setParameter = function ( parameter: IParameter ): void {
    const {id, data} = parameter;

    if ( !deviceParameterConvertersMap[id] || !deviceParameterConvertersMap[id].set ) {
        throw new Error(`parameter ${id} is not supported`);
    }

    this.setUint8(id);
    deviceParameterConvertersMap[id].set(this, data);
};


CommandBinaryBuffer.prototype.getRequestParameter = function (): IRequestParameter {
    const id = this.getUint8();
    let data = null;

    switch ( id ) {
        case deviceParameters.ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL:
        case deviceParameters.ABSOLUTE_DATA_MULTI_CHANNEL:
            data = {channel: getChannelValue(this)};
            break;

        case deviceParameters.REPORTING_DATA_CONFIG:
            data = {dataType: this.getUint8()};
            break;

        case deviceParameters.EVENTS_CONFIG:
            data = {eventId: this.getUint8()};
            break;

        default:
            break;
    }

    return {id, data};
};


CommandBinaryBuffer.prototype.setRequestParameter = function ( parameter: IRequestParameter ): void {
    const {id, data: parameterData} = parameter;
    let data;

    this.setUint8(id);

    switch ( id ) {
        case deviceParameters.ABSOLUTE_DATA_MULTI_CHANNEL:
        case deviceParameters.ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL:
            data = parameterData as IRequestChannelParameter;
            setChannelValue(this, data.channel);
            break;

        case deviceParameters.REPORTING_DATA_CONFIG:
            data = parameterData as IRequestDataTypeParameter;
            this.setUint8(data.dataType);
            break;

        case deviceParameters.EVENTS_CONFIG:
            data = parameterData as IRequestEventIdParameter;
            this.setUint8(data.eventId);
            break;

        default:
            break;
    }
};


CommandBinaryBuffer.prototype.getResponseParameter = function (): IParameter {
    const id = this.getUint8();
    let data;

    if ( !deviceParameterConvertersMap[id] || !deviceParameterConvertersMap[id].get ) {
        throw new Error(`parameter ${id} is not supported`);
    }

    switch ( id ) {
        case deviceParameters.MQTT_SESSION_CONFIG:
        case deviceParameters.NBIOT_SSL_CACERT_WRITE:
        case deviceParameters.NBIOT_SSL_CLIENT_CERT_WRITE:
        case deviceParameters.NBIOT_SSL_CLIENT_KEY_WRITE:
        case deviceParameters.NBIOT_SSL_CACERT_SET:
        case deviceParameters.NBIOT_SSL_CLIENT_CERT_SET:
        case deviceParameters.NBIOT_SSL_CLIENT_KEY_SET:
        case deviceParameters.NBIOT_DEVICE_SOFTWARE_UPDATE:
        case deviceParameters.NBIOT_MODULE_FIRMWARE_UPDATE:
            data = null;
            break;

        default:
            data = deviceParameterConvertersMap[id].get(this);
    }

    return {id, data};
};


CommandBinaryBuffer.prototype.setResponseParameter = function ( parameter: IParameter ) {
    const {id, data} = parameter;

    if ( !deviceParameterConvertersMap[id] || !deviceParameterConvertersMap[id].set ) {
        throw new Error(`parameter ${id} is not supported`);
    }

    this.setUint8(id);

    switch ( id ) {
        case deviceParameters.MQTT_SESSION_CONFIG:
        case deviceParameters.NBIOT_SSL_CACERT_WRITE:
        case deviceParameters.NBIOT_SSL_CLIENT_CERT_WRITE:
        case deviceParameters.NBIOT_SSL_CLIENT_KEY_WRITE:
        case deviceParameters.NBIOT_SSL_CACERT_SET:
        case deviceParameters.NBIOT_SSL_CLIENT_CERT_SET:
        case deviceParameters.NBIOT_SSL_CLIENT_KEY_SET:
        case deviceParameters.NBIOT_DEVICE_SOFTWARE_UPDATE:
        case deviceParameters.NBIOT_MODULE_FIRMWARE_UPDATE:
            break;

        default:
            deviceParameterConvertersMap[id].set(this, data);
    }
};


CommandBinaryBuffer.prototype.getLegacyHourDiff = function (): ILegacyCounter {
    const stateWithValueByte = this.getUint8();
    const valueLowerByte = this.getUint8();

    return {
        isMagneticInfluence: CommandBinaryBuffer.getMagneticInfluenceBit(stateWithValueByte),
        value: ((stateWithValueByte & 0x1f) << 8) | valueLowerByte
    };
};


CommandBinaryBuffer.prototype.setLegacyHourDiff = function ( diff: ILegacyCounter ): void {
    const bytes = [diff.value >> 8, diff.value & 0xff];

    bytes[0] = CommandBinaryBuffer.setMagneticInfluenceBit(bytes[0], diff.isMagneticInfluence);

    bytes.forEach(byte => this.setUint8(byte));
};


CommandBinaryBuffer.prototype.getLegacyHourCounterWithDiff = function (): ILegacyHourCounterWithDiff {
    const date = this.getDate();
    const byte = this.getUint8();
    const {hour} = this.getHours(byte);
    const counter = {
        isMagneticInfluence: CommandBinaryBuffer.getMagneticInfluenceBit(byte),
        value: this.getLegacyCounterValue()
    };
    const diff = [];

    while ( this.offset < this.data.length ) {
        diff.push(this.getLegacyHourDiff());
    }

    date.setUTCHours(hour);

    return {startTime2000: getTime2000FromDate(date), counter, diff};
};


CommandBinaryBuffer.prototype.setLegacyHourCounterWithDiff = function ( hourCounter: ILegacyHourCounterWithDiff ): void {
    const date = getDateFromTime2000(hourCounter.startTime2000);
    const hour = date.getUTCHours();

    this.setDate(date);
    // force hours to 0
    this.setHours(hour, 1);

    // reset byte with isMagneticInfluence bit
    this.seek(this.offset - 1);
    const byte = this.getUint8();
    this.seek(this.offset - 1);
    this.setUint8(CommandBinaryBuffer.setMagneticInfluenceBit(byte, hourCounter.counter.isMagneticInfluence));

    this.setLegacyCounterValue(hourCounter.counter.value);
    hourCounter.diff.forEach(diffItem => this.setLegacyHourDiff(diffItem));
};


CommandBinaryBuffer.prototype.getChannelsValuesWithHourDiffExtended = function (): IChannelValuesWithHourDiffExtended {
    const date = this.getDate();
    const hour = this.getUint8();
    const hours = this.getUint8();
    const channels = this.getChannels();
    const channelList: Array<IChannelHours> = [];

    date.setUTCHours(hour);

    channels.forEach(channelIndex => {
        const diff: Array<number> = [];

        // decode hour value for channel
        const value = this.getExtendedValue();

        // start from first diff hour
        for ( let diffHour = 0; diffHour < hours; ++diffHour ) {
            diff.push(this.getExtendedValue());
        }

        channelList.push({
            value,
            diff,
            index: channelIndex
        });
    });

    return {startTime2000: getTime2000FromDate(date), hour, hours, channelList};
};


CommandBinaryBuffer.prototype.setChannelsValuesWithHourDiffExtended = function ( parameters: IChannelValuesWithHourDiffExtended ): void {
    const date = getDateFromTime2000(parameters.startTime2000);

    this.setDate(date);
    this.setUint8(parameters.hour);
    this.setUint8(parameters.hours);
    this.setChannels(parameters.channelList);

    parameters.channelList.forEach(({value, diff}) => {
        this.setExtendedValue(value);
        diff.forEach(diffValue => this.setExtendedValue(diffValue));
    });
};


CommandBinaryBuffer.prototype.getDataSegment = function (): IDataSegment {
    const segmentationSessionId = this.getUint8();
    const flag = this.getUint8();

    return {
        segmentationSessionId,
        segmentIndex: extractBits(flag, 3, 1),
        segmentsNumber: extractBits(flag, 3, 5),
        isLast: Boolean(extractBits(flag, 1, 8)),
        data: this.getBytesLeft()
    };
};


CommandBinaryBuffer.prototype.setDataSegment = function ( parameters: IDataSegment ) {
    let flag = fillBits(0, 3, 1, parameters.segmentIndex);
    flag = fillBits(flag, 3, 5, parameters.segmentsNumber);
    flag = fillBits(flag, 1, 8, +parameters.isLast);

    this.setUint8(parameters.segmentationSessionId);
    this.setUint8(flag);
    this.setBytes(parameters.data);
};


export default CommandBinaryBuffer;
