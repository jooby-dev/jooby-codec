import BinaryBuffer from '../utils/BinaryBuffer.js';
import * as bitSet from '../utils/bitSet.js';
import {getDateFromTime2000, getTime2000FromDate, TTime2000} from '../utils/time.js';
import getHexFromBytes from '../utils/getHexFromBytes.js';
import getBytesFromHex from '../utils/getBytesFromHex.js';
import roundNumber from '../utils/roundNumber.js';
import {extractBits, fillBits} from '../utils/bitSet.js';
import * as hardwareTypes from './constants/hardwareTypes.js';
import * as deviceParameters from './constants/deviceParameters.js';


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
    value: number
}

export interface IChannelHours extends IChannelValue {
    /** values differences between hours */
    diff: Array<number>
}

export interface IChannelHourAbsoluteValue extends IChannelHours {
    /** channel pulse coefficient */
    pulseCoefficient: number
}

export interface IChannelDays extends IChannel {
    dayList: Array<number>
}

export interface IChannelAbsoluteValue extends IChannelValue {
    /** channel pulse coefficient */
    pulseCoefficient: number
}

export interface IChannelArchiveDaysAbsolute extends IChannel {
    /** values by days */
    dayList: Array<number>,

    /** Channel pulse coefficient */
    pulseCoefficient: number
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
    value: number
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
    type: number
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
    value: number
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
    type: number
}

/**
 * Channels config, only for universal 4-channels devices
 * deviceParameters.CHANNELS_CONFIG = `13`.
 */
interface IParameterChannelsConfig {
    /**
     * value from 0 to 18, [values description](https://github.com/jooby-dev/jooby-docs/blob/main/docs/parameter-types.md#channels-config)
     */
    value: number
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
    spreadFactor: number

    /**
     * RX2 data rate frequency.
     * The second receive window (RX2) uses a fixed frequency and data rate.
     * This value configures the frequency to use in RX2.
     * Changing the desired value makes the Network Server transmit the RXParamSetupReq MAC command.
     */
    frequency: number
}

/**
 * Device battery depassivation information.
 * deviceParameters.BATTERY_DEPASSIVATION_INFO = `10`.
 */
interface IParameterBatteryDepassivationInfo {
    /** battery load time in milliseconds */
    loadTime: number,
    /** battery internal resistance, in mΩ */
    internalResistance: number,
    /** battery low voltage, in mV  */
    lowVoltage: number
}

/**
 * Device battery minimum required battery load time per day to prevent passivation.
 * deviceParameters.BATTERY_MINIMAL_LOAD_TIME = `11`.
 */
interface IParameterBatteryMinimalLoadTime {
    value: number
}

/**
 * Absolute data for pulse devices.
 * deviceParameters.ABSOLUTE_DATA = `23`.
 */
interface IParameterAbsoluteData {
    /** 4 byte int BE */
    value: number,

    /** 4 byte int BE */
    meterValue: number,
    pulseCoefficient: number
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
    state: number
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
    latitude: number,
    longitude: number,
    altitude: number
}

/**
 * Interval in seconds when device send EXTRA FRAME.
 * deviceParameters.EXTRA_FRAME_INTERVAL = `28`.
 */
interface IParameterExtraFrameInterval {
    /**
     * If value is `0` EXTRA FRAME disabled.
     *
     * minimal: `90`
     * maximum: `65535`, i.e. two byte unsigned int
     */
    value: number
}

/**
 * Absolute data for multi-channel devices.
 * deviceParameters.ABSOLUTE_DATA_MULTI_CHANNEL = `29`.
 */
interface IParameterAbsoluteDataMC extends IParameterAbsoluteData {
    /** set data for specific channel */
    channel: number
}

/**
 * Data type sending from device - absolute or not, multi-channel devices.
 * deviceParameters.ABSOLUTE_DATA_STATUS_MULTI_CHANNEL = `30`
 */
interface IParameterAbsoluteDataEnableMC extends IParameterAbsoluteDataEnable {
    /** channel that accept status changing */
    channel: number
}

/**
 * Channels scan config for pulse devices.
 * deviceParameters.PULSE_CHANNELS_SCAN_CONFIG = `31`
 */
interface IParameterPulseChannelsScanConfig {
    /** channels to set configuration */
    channelList: Array<number>,
    /** channel pull up time in microseconds */
    pullUpTime: number,
    /** channel scan time in microseconds */
    scanTime: number
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
    resistanceStartThreshold: number,
    resistanceStopThreshold: number
}

/**
 * Set configuration for session.
 * deviceParameters.MQTT_SESSION_CONFIG = `34`
 */
interface IParameterMqttSessionConfig {
    clientId: string,
    username: string,
    password: string,
    cleanSession: number
}

/**
 * Set broker address.
 * deviceParameters.MQTT_BROKER_ADDRESS = `35`
 */
interface IParameterMqttBrokerAddress {
    hostName: string,
    port: number
}

/**
 * Enable ssl.
 * deviceParameters.MQTT_SSL_ENABLE = `36`
 */
interface IParameterMqttSslEnable {
    enable: number
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
    qos: number
}

/**
 * Set configuration for data send.
 * deviceParameters.MQTT_DATA_SEND_CONFIG = `39`
 */
interface IParameterMqttDataSendConfig {
    qos: number,
    retain: number,
    newestSendFirst: number,
    sendCountAttempts: number,
    sendTimeoutBetweenAttempts: number
}

/**
 * Set configuration for ssl.
 * deviceParameters.NBIOT_SSL_CONFIG = `40`
 */
interface IParameterNbiotSslConfig {
    securityLevel: number,
    version: number
}

/**
 * Write ssl.
 * deviceParameters.NBIOT_SSL_CACERT_WRITE = `41`
 */
interface IParameterNbiotSslWrite {
    size: number,
    position: number,
    chunk: Uint8Array
}

/**
 * Set ssl crc32.
 * deviceParameters.NBIOT_SSL_CACERT_SET = `42`
 */
interface IParameterNbiotSslSet {
    crc32: number
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
    dataType: number,
    hour: number,
    minutes: number,
    countToSend: number
}

/**
 * Set configuration for events.
 * deviceParameters.EVENTS_CONFIG = `50`
 */
interface IParameterEventsConfig {
    eventId: number,
    enableEvent: number,
    sendEvent: number,
    saveEvent: number
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
    bands: Array<number>
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
    id: number,
    data: TParameterData | null
}

export interface IRequestParameter {
    id: number,
    data: TRequestParameterData | null
}

export interface IResponseParameter {
    id: number,
    data: TResponseParameterData | null
}

export interface ILegacyCounter {
    isMagneticInfluence: boolean,
    value: number
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
    data: Uint8Array
}


export type TEventStatus =
    IEventGasStatus |
    IEvent2ChannelStatus |
    IEventElimpStatus |
    //IEventWaterStatus |
    IEvent4ChannelStatus |
    IEventMtxStatus;

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
    IParameterNbiotBands;

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
    IParameterNbiotBands;

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
const INT24_BYTE_SIZE = 3;
const SERIAL_NUMBER_SIZE = 6;
const MAGNETIC_INFLUENCE_BIT_INDEX = 8;
const LEGACY_HOUR_COUNTER_SIZE = 2 + 4;
const LEGACY_HOUR_DIFF_SIZE = 2;

const GAS_HARDWARE_TYPES = [
    hardwareTypes.GASI2,
    hardwareTypes.GASI3,
    hardwareTypes.GASI1,
    hardwareTypes.GASIC
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
    isBatteryLow: 2 ** 0,
    isMagneticInfluence: 2 ** 1,
    isButtonReleased: 2 ** 2,
    isConnectionLost: 2 ** 3
};
const twoChannelBitMask = {
    isBatteryLow: 2 ** 0,
    isConnectionLost: 2 ** 3,
    isFirstChannelInactive: 2 ** 4,
    isSecondChannelInactive: 2 ** 5
};
const elimpBitMask = {
    isConnectionLost: 2 ** 3
};
// const waterBitMask = {
//     isBatteryLow: 2 ** 0,
//     isConnectionLost: 2 ** 3
// };
const fourChannelBitMask = {
    isBatteryLow: 2 ** 0,
    isConnectionLost: 2 ** 3,
    isFirstChannelInactive: 2 ** 4,
    isSecondChannelInactive: 2 ** 5,
    isThirdChannelInactive: 2 ** 6,
    isForthChannelInactive: 2 ** 7
};
const mtxBitMask = {
    isMeterCaseOpen: 2 ** 0,
    isMagneticInfluence: 2 ** 1,
    isParametersSetRemotely: 2 ** 2,
    isParametersSetLocally: 2 ** 3,
    isMeterProgramRestarted: 2 ** 4,
    isLockedOut: 2 ** 5,
    isTimeSet: 2 ** 6,
    isTimeCorrected: 2 ** 7,
    isMeterFailure: 2 ** 8,
    isMeterTerminalBoxOpen: 2 ** 9,
    isModuleCompartmentOpen: 2 ** 10,
    isTariffPlanChanged: 2 ** 11,
    isNewTariffPlanReceived: 2 ** 12
};


/**
 * device parameter data size + byte for parameter id
 */
const parametersSizeMap = new Map([
    /* size: 1 byte of parameter id + parameter data*/
    [deviceParameters.REPORTING_DATA_INTERVAL, 1 + 4],
    [deviceParameters.DAY_CHECKOUT_HOUR, 1 + 1],
    [deviceParameters.REPORTING_DATA_TYPE, 1 + 1],
    [deviceParameters.PRIORITY_DATA_DELIVERY_TYPE, 1 + 1],
    [deviceParameters.ACTIVATION_METHOD, 1 + 1],
    [deviceParameters.BATTERY_DEPASSIVATION_INFO, 1 + 6],
    [deviceParameters.BATTERY_MINIMAL_LOAD_TIME, 1 + 4],
    [deviceParameters.CHANNELS_CONFIG, 1 + 1],
    [deviceParameters.RX2_CONFIG, 1 + 4],
    [deviceParameters.ABSOLUTE_DATA, 1 + 9],
    [deviceParameters.ABSOLUTE_DATA_ENABLE, 1 + 1],
    [deviceParameters.SERIAL_NUMBER, 1 + 6],
    [deviceParameters.GEOLOCATION, 1 + 10],
    [deviceParameters.EXTRA_FRAME_INTERVAL, 1 + 2],
    [deviceParameters.ABSOLUTE_DATA_MULTI_CHANNEL, 1 + 10],
    [deviceParameters.ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL, 1 + 2],
    [deviceParameters.PULSE_CHANNELS_SCAN_CONFIG, 1 + 3],
    [deviceParameters.PULSE_CHANNELS_SET_CONFIG, 1 + 1],
    [deviceParameters.BATTERY_DEPASSIVATION_CONFIG, 1 + 4],
    [deviceParameters.MQTT_SSL_ENABLE, 1 + 1],
    [deviceParameters.MQTT_DATA_RECEIVE_CONFIG, 1 + 1],
    [deviceParameters.MQTT_DATA_SEND_CONFIG, 1 + 5],
    [deviceParameters.NBIOT_SSL_CONFIG, 1 + 2],
    [deviceParameters.NBIOT_SSL_CACERT_SET, 1 + 4],
    [deviceParameters.NBIOT_SSL_CLIENT_CERT_SET, 1 + 4],
    [deviceParameters.NBIOT_SSL_CLIENT_KEY_SET, 1 + 4],
    [deviceParameters.REPORTING_DATA_CONFIG, 1 + 4],
    [deviceParameters.EVENTS_CONFIG, 1 + 4]
]);

const fourChannelsBitMask = {
    channel1: 2 ** 0,
    channel2: 2 ** 1,
    channel3: 2 ** 2,
    channel4: 2 ** 3
};

const byteToPulseCoefficientMap = new Map([
    [0x80, 1],
    [0x81, 5],
    [0x82, 10],
    [0x83, 100],
    [0x84, 1000],
    [0x85, 10000],
    [0x86, 100000]
]);

const pulseCoefficientToByteMap = new Map(
    [...byteToPulseCoefficientMap.entries()].map(([key, value]) => [value, key])
);

const isMSBSet = ( value: number ): boolean => !!(value & 0x80);


/**
 * Command specific byte array manipulation.
 */
class CommandBinaryBuffer extends BinaryBuffer {
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
    static getExtendedValueSize ( bits: number ) {
        const extBits = Math.ceil(bits / 7);
        const totalBits = bits + extBits;
        const extBytes = Math.ceil(totalBits / 8);

        return extBytes;
    }

    static getParameterSize ( parameter: IParameter ): number {
        let size;
        let data;

        switch ( parameter.id ) {
            case deviceParameters.MQTT_SESSION_CONFIG:
                if ( parameter.data ) {
                    data = parameter.data as IParameterMqttSessionConfig;
                    // size: parameter id + cleanSession
                    size = 1 + 1;
                    size += data.clientId.length + 1;
                    size += data.username.length + 1;
                    size += data.password.length + 1;
                } else {
                    // size: parameter id
                    size = 1;
                }

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
                if ( parameter.data ) {
                    data = parameter.data as IParameterNbiotSslWrite;
                    // size: parameter id + size + pos
                    size = 1 + 2 + 2;
                    size += data.chunk.length;
                } else {
                    // size: parameter id
                    size = 1;
                }

                break;

            case deviceParameters.NBIOT_DEVICE_SOFTWARE_UPDATE:
                if ( parameter.data ) {
                    data = parameter.data as IParameterNbiotDeviceSoftwareUpdate;
                    // size: parameter id
                    size = 1;
                    size += data.softwareImageUrl.length + 1;
                } else {
                    // size: parameter id
                    size = 1;
                }

                break;

            case deviceParameters.NBIOT_MODULE_FIRMWARE_UPDATE:
                if ( parameter.data ) {
                    data = parameter.data as IParameterNbiotModuleFirmwareUpdate;
                    // size: parameter id
                    size = 1;
                    size += data.moduleFirmwareImageUrl.length + 1;
                } else {
                    // size: parameter id
                    size = 1;
                }

                break;

            case deviceParameters.NBIOT_BANDS:
                if ( parameter.data ) {
                    data = parameter.data as IParameterNbiotBands;
                    // size: parameter id + count
                    size = 1 + 1;
                    size += data.bands.length;
                } else {
                    // size: parameter id
                    size = 1;
                }

                break;

            case deviceParameters.NBIOT_MODULE_INFO:
                // all parameters read only
                // size: parameter id
                size = 1;

                break;

            default:
                size = parametersSizeMap.get(parameter.id);
        }

        if ( size === undefined ) {
            throw new Error('unknown parameter id');
        }

        return size;
    }

    static getRequestParameterSize ( parameter: IRequestParameter ): number {
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
    }

    static getResponseParameterSize ( parameter: IParameter ): number {
        let size;
        let data;

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

            case deviceParameters.NBIOT_MODULE_INFO:
                data = parameter.data as IParameterNbiotModuleInfo;
                // size: parameter id
                size = 1;
                size += data.moduleInfo.length + 1;

                break;

            case deviceParameters.NBIOT_BANDS:
                data = parameter.data as IParameterNbiotBands;
                // size: parameter id + count
                size = 1 + 1;
                size += data.bands.length;

                break;

            default:
                size = parametersSizeMap.get(parameter.id);
        }

        if ( size === undefined ) {
            throw new Error('unknown parameter id');
        }

        return size;
    }

    static getMagneticInfluenceBit ( byte: number ): boolean {
        return !!extractBits(byte, 1, MAGNETIC_INFLUENCE_BIT_INDEX);
    }

    static setMagneticInfluenceBit ( byte: number, value: boolean ): number {
        return fillBits(byte, 1, MAGNETIC_INFLUENCE_BIT_INDEX, +value);
    }

    static getLegacyHourCounterSize ( hourCounter: ILegacyHourCounterWithDiff ): number {
        return LEGACY_HOUR_COUNTER_SIZE + (hourCounter.diff.length * LEGACY_HOUR_DIFF_SIZE);
    }

    getDataSegment (): IDataSegment {
        const segmentationSessionId = this.getUint8();
        const flag = this.getUint8();

        return {
            segmentationSessionId,
            segmentIndex: extractBits(flag, 3, 1),
            segmentsNumber: extractBits(flag, 3, 5),
            isLast: Boolean(extractBits(flag, 1, 8)),
            data: this.getBytesLeft()
        };
    }

    setDataSegment ( value: IDataSegment ) {
        let flag = fillBits(0, 3, 1, value.segmentIndex);
        flag = fillBits(flag, 3, 5, value.segmentsNumber);
        flag = fillBits(flag, 1, 8, +value.isLast);

        this.setUint8(value.segmentationSessionId);
        this.setUint8(flag);
        this.setBytes(value.data);
    }

    setInt24 ( value: number, isLittleEndian = this.isLittleEndian ): void {
        const view = new DataView(this.data, this.offset, INT24_BYTE_SIZE);

        // set first byte as signed value
        if ( isLittleEndian ) {
            view.setInt8(2, (value >> 16) & 0xFF);
            view.setUint8(1, (value >> 8) & 0xFF);
            view.setUint8(0, value & 0xFF);
        } else {
            view.setInt8(0, (value >> 16) & 0xFF);
            view.setUint8(1, (value >> 8) & 0xFF);
            view.setUint8(2, value & 0xFF);
        }

        this.offset += INT24_BYTE_SIZE;
    }

    getInt24 ( isLittleEndian = this.isLittleEndian ): number {
        const view = new DataView(this.data, this.offset, INT24_BYTE_SIZE);
        let byte0;
        let byte1;
        let byte2;

        this.offset += INT24_BYTE_SIZE;

        if ( isLittleEndian ) {
            byte0 = view.getInt8(2);
            byte1 = view.getUint8(1);
            byte2 = view.getUint8(0);
        } else {
            byte0 = view.getInt8(0);
            byte1 = view.getUint8(1);
            byte2 = view.getUint8(2);
        }

        const value = (byte0 << 16) | (byte1 << 8) | byte2;

        // setup sign if value negative
        if ( byte0 & 0x80 ) {
            return value - (1 << 24);
        }

        return value;
    }

    setUint24 ( value: number, isLittleEndian = this.isLittleEndian ): void {
        const view = new DataView(this.data, this.offset, INT24_BYTE_SIZE);

        if ( isLittleEndian ) {
            view.setUint8(2, (value >> 16) & 0xFF);
            view.setUint8(1, (value >> 8) & 0xFF);
            view.setUint8(0, value & 0xFF);
        } else {
            view.setUint8(0, (value >> 16) & 0xFF);
            view.setUint8(1, (value >> 8) & 0xFF);
            view.setUint8(2, value & 0xFF);
        }

        this.offset += INT24_BYTE_SIZE;
    }

    getUint24 ( isLittleEndian = this.isLittleEndian ): number {
        const view = new DataView(this.data, this.offset, INT24_BYTE_SIZE);
        const byte0 = view.getUint8(0);
        const byte1 = view.getUint8(1);
        const byte2 = view.getUint8(2);

        this.offset += INT24_BYTE_SIZE;

        if ( isLittleEndian ) {
            return byte0 + (byte1 << 8) + (byte2 << 16);
        }

        return (byte0 << 16) + (byte1 << 8) + byte2;
    }

    getExtendedValue (): number {
        let value = 0;
        let isByteExtended = true;
        // byte offset
        let position = 0;

        while ( isByteExtended && this.offset <= this.data.byteLength ) {
            const byte = this.getUint8();

            isByteExtended = !!(byte & EXTEND_BIT_MASK);
            value += (byte & 0x7f) << (7 * position);
            ++position;
        }

        if ( value < 0 ) {
            value = 0;
        }

        return value;
    }

    setExtendedValue ( value: number ): void {
        if ( value === 0 ) {
            this.setUint8(0);

            return;
        }

        const data = [];
        let encodedValue = value;

        while ( encodedValue ) {
            data.push(EXTEND_BIT_MASK | (encodedValue & 0x7f));
            encodedValue >>= 7;
        }

        const lastByte = data.pop();

        if ( lastByte ) {
            // clear EXTENDED bit flag for last value
            data.push(lastByte & 0x7f);
        }

        data.forEach(extendedValue => this.setUint8(extendedValue));
    }

    /**
     * Get array of channel indexes.
     */
    getChannels (): Array<number> {
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
    }

    /**
     * Set array of channel indexes.
     */
    setChannels ( channelList: Array<IChannel> ) {
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
    }

    /**
     * Retrieve device time from byte array.
     *
     * @example
     * ['00101111', '10010111'] -> [47, 151] will be '2023-12-23'
     *
     * @returns Date object instance
     */
    getDate (): Date {
        const yearMonthByte = this.getUint8();
        const monthDateByte = this.getUint8();

        const year = yearMonthByte >> YEAR_START_INDEX;
        const month = ((yearMonthByte & 0x01) << MONTH_BIT_SIZE - YEAR_START_INDEX) | (monthDateByte >> DATE_BIT_SIZE);
        const monthDay = monthDateByte & 0x1f;

        return new Date(Date.UTC(year + INITIAL_YEAR, month - 1, monthDay, 0, 0, 0, 0));
    }

    /**
     * Convert date or seconds to bytes.
     * '2023-12-23' will be 0010111-1100-10111, so bytes: ['00101111', '10010111'] -> [47, 151]
     */
    setDate ( dateOrTime: Date | TTime2000 ): void {
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
    }

    /**
     * Retrieve start hour and number of hours from byte array.
     *
     * @example
     * 0xb8 = 0b10111000 will be {hours: 0b101, hour: 0b11000} i.e. {hours: 6, hour: 24}
     */
    getHours ( byte = this.getUint8() ) {
        if ( byte === 0 ) {
            return {hours: 0, hour: 0};
        }

        // real/human hours number = 1 (hour counter value) + each hour diff
        const hours = ((byte & 0xe0) >> 5) + 1;
        const hour = byte & 0x1f;

        return {hours, hour};
    }

    setHours ( hour: number, hours: number ): void {
        if ( hour === 0 && hours === 0 ) {
            this.setUint8(0);

            return;
        }

        // convert real/human to binary - only number of diff hours
        this.setUint8((((hours - 1) & 0x07) << 5) | (hour & 0x1f));
    }

    getTime (): TTime2000 {
        return this.getUint32(false);
    }

    setTime ( value: TTime2000 ): void {
        return this.setUint32(value, false);
    }

    getBatteryVoltage (): IBatteryVoltage {
        let underHighLoad;
        let underLowLoad;

        const lowVoltageByte = this.getUint8();
        const lowAndHightVoltageByte = this.getUint8();
        const highVoltageByte = this.getUint8();

        underLowLoad = lowVoltageByte << 4;
        underLowLoad |= (lowAndHightVoltageByte & 0xf0) >> 4;

        underHighLoad = ((lowAndHightVoltageByte & 0x0f) << 8) | highVoltageByte;

        if ( underHighLoad === UNKNOWN_BATTERY_VOLTAGE ) {
            underHighLoad = undefined;
        }

        if ( underLowLoad === UNKNOWN_BATTERY_VOLTAGE ) {
            underLowLoad = undefined;
        }

        return {underLowLoad, underHighLoad};
    }

    setBatteryVoltage ( batteryVoltage: IBatteryVoltage ): void {
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
    }

    getChannelsValuesWithHourDiff (): {hours: number, startTime2000: TTime2000, channelList: Array<IChannelHours>} {
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
    }

    setChannelsValuesWithHourDiff ( hours: number, startTime2000: TTime2000, channelList: Array<IChannelHours> ): void {
        const date = getDateFromTime2000(startTime2000);
        const hour = date.getUTCHours();

        this.setDate(date);
        this.setHours(hour, hours);
        this.setChannels(channelList);

        channelList.forEach(({value, diff}) => {
            this.setExtendedValue(value);
            diff.forEach(diffValue => this.setExtendedValue(diffValue));
        });
    }

    getChannelsValuesWithHourDiffExtended (): {hour: number, hours: number, startTime2000: TTime2000, channelList: Array<IChannelHours>} {
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
    }

    setChannelsValuesWithHourDiffExtended ( hour: number, hours: number, startTime2000: TTime2000, channelList: Array<IChannelHours> ): void {
        const date = getDateFromTime2000(startTime2000);

        this.setDate(date);
        this.setUint8(hour);
        this.setUint8(hours);
        this.setChannels(channelList);

        channelList.forEach(({value, diff}) => {
            this.setExtendedValue(value);
            diff.forEach(diffValue => this.setExtendedValue(diffValue));
        });
    }

    getChannelsWithAbsoluteValues (): Array<IChannelAbsoluteValue> {
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
    }

    setChannelsWithAbsoluteValues ( channelList: Array<IChannelAbsoluteValue> ): void {
        this.setChannels(channelList);

        for ( const {value, pulseCoefficient} of channelList ) {
            this.setPulseCoefficient(pulseCoefficient);
            this.setExtendedValue(value);
        }
    }

    getChannelsAbsoluteValuesWithHourDiff ( hours: number ): Array<IChannelHourAbsoluteValue> {
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
    }

    setChannelsAbsoluteValuesWithHourDiff ( channelList: Array<IChannelHourAbsoluteValue> ): void {
        this.setChannels(channelList);

        for ( const {value, diff, pulseCoefficient} of channelList ) {
            this.setPulseCoefficient(pulseCoefficient);
            this.setExtendedValue(value);
            diff.forEach(diffValue => this.setExtendedValue(diffValue));
        }
    }

    static getEventStatusSize ( hardwareType: number ): number {
        return TWO_BYTES_HARDWARE_TYPES.includes(hardwareType) ? 2 : 1;
    }

    getEventStatus ( hardwareType: number ): TEventStatus {
        let status: TEventStatus;

        if ( GAS_HARDWARE_TYPES.includes(hardwareType) ) {
            status = bitSet.toObject(gasBitMask, this.getUint8());
        } else if ( TWO_CHANNELS_HARDWARE_TYPES.includes(hardwareType) ) {
            status = bitSet.toObject(twoChannelBitMask, this.getUint8());
        } else if ( ELIMP_HARDWARE_TYPES.includes(hardwareType) ) {
            status = bitSet.toObject(elimpBitMask, this.getUint8());
        // } else if ( WATER_HARDWARE_TYPES.includes(hardwareType) ) {
        //     status = bitSet.toObject(waterBitMask, this.getUint8());
        } else if ( FOUR_CHANNELS_HARDWARE_TYPES.includes(hardwareType) ) {
            status = bitSet.toObject(fourChannelBitMask, this.getExtendedValue());
        } else if ( MTX_HARDWARE_TYPES.includes(hardwareType) ) {
            status = bitSet.toObject(mtxBitMask, this.getUint16());
        } else {
            throw new Error('wrong hardwareType');
        }

        return status;
    }

    setEventStatus ( hardwareType: number, status: TEventStatus ): void {
        if ( GAS_HARDWARE_TYPES.includes(hardwareType) ) {
            this.setUint8(bitSet.fromObject(gasBitMask, status as bitSet.TBooleanObject));
        } else if ( TWO_CHANNELS_HARDWARE_TYPES.includes(hardwareType) ) {
            this.setUint8(bitSet.fromObject(twoChannelBitMask, status as bitSet.TBooleanObject));
        } else if ( ELIMP_HARDWARE_TYPES.includes(hardwareType) ) {
            this.setUint8(bitSet.fromObject(elimpBitMask, status as bitSet.TBooleanObject));
        // } else if ( WATER_HARDWARE_TYPES.includes(hardwareType) ) {
        //     this.setUint8(bitSet.fromObject(waterBitMask, status as bitSet.TBooleanObject));
        } else if ( FOUR_CHANNELS_HARDWARE_TYPES.includes(hardwareType) ) {
            this.setExtendedValue(bitSet.fromObject(fourChannelBitMask, status as bitSet.TBooleanObject));
        } else if ( MTX_HARDWARE_TYPES.includes(hardwareType) ) {
            this.setUint16(bitSet.fromObject(mtxBitMask, status as bitSet.TBooleanObject));
        } else {
            throw new Error('wrong hardwareType');
        }
    }

    getPulseCoefficient (): number {
        const pulseCoefficient = this.getUint8();

        if ( isMSBSet(pulseCoefficient) ) {
            const value = byteToPulseCoefficientMap.get(pulseCoefficient);

            if ( value ) {
                return value;
            }

            throw new Error('pulseCoefficient MSB is set, but value unknown');
        }

        return pulseCoefficient;
    }

    setPulseCoefficient ( value: number ): void {
        if ( pulseCoefficientToByteMap.has(value) ) {
            const byte = pulseCoefficientToByteMap.get(value);

            if ( byte ) {
                this.setUint8(byte);
            } else {
                throw new Error('pulseCoefficient MSB is set, but value unknown');
            }
        } else {
            this.setUint8(value);
        }
    }

    private getParameterAbsoluteData (): IParameterAbsoluteData {
        return {
            meterValue: this.getUint32(false),
            pulseCoefficient: this.getPulseCoefficient(),
            value: this.getUint32(false)
        };
    }

    private setParameterAbsoluteData ( parameter: IParameterAbsoluteData ): void {
        this.setUint32(parameter.meterValue, false);
        this.setPulseCoefficient(parameter.pulseCoefficient);
        this.setUint32(parameter.value, false);
    }

    getChannelValue (): number {
        return this.getUint8() + 1;
    }

    setChannelValue ( value: number ): void {
        if ( value < 1 ) {
            throw new Error('channel must be 1 or greater');
        }

        this.setUint8(value - 1);
    }

    private getParameterAbsoluteDataMC (): IParameterAbsoluteDataMC {
        return {
            channel: this.getChannelValue(),
            meterValue: this.getUint32(false),
            pulseCoefficient: this.getPulseCoefficient(),
            value: this.getUint32(false)
        };
    }

    private setParameterAbsoluteDataMC ( parameter: IParameterAbsoluteDataMC ): void {
        this.setChannelValue(parameter.channel);
        this.setUint32(parameter.meterValue, false);
        this.setPulseCoefficient(parameter.pulseCoefficient);
        this.setUint32(parameter.value, false);
    }

    private getParameterAbsoluteDataEnable (): IParameterAbsoluteDataEnable {
        return {state: this.getUint8()};
    }

    private setParameterAbsoluteDataEnable ( parameter: IParameterAbsoluteDataEnable ): void {
        this.setUint8(parameter.state);
    }

    private getParameterAbsoluteDataEnableMC (): IParameterAbsoluteDataEnableMC {
        return {
            channel: this.getChannelValue(),
            state: this.getUint8()
        };
    }

    private setParameterAbsoluteDataEnableMC ( parameter: IParameterAbsoluteDataEnableMC ): void {
        this.setChannelValue(parameter.channel);
        this.setUint8(parameter.state);
    }

    private getParameterActivationMethod (): IParameterActivationMethod {
        return {
            type: this.getUint8()
        };
    }

    private setParameterActivationMethod ( parameter: IParameterActivationMethod ): void {
        this.setUint8(parameter.type);
    }

    private getParameterReportingDataType (): IParameterReportingDataType {
        return {
            type: this.getUint8()
        };
    }

    private setParameterReportingDataType ( parameter: IParameterReportingDataType ): void {
        this.setUint8(parameter.type);
    }

    private getParameterDayCheckoutHour (): IParameterDayCheckoutHour {
        return {
            value: this.getUint8()
        };
    }

    private setParameterDayCheckoutHour ( parameter: IParameterDayCheckoutHour ) {
        this.setUint8(parameter.value);
    }

    private getParameterReportingDataInterval (): IParameterReportingDataInterval {
        this.seek(this.offset + DATA_SENDING_INTERVAL_RESERVED_BYTES);

        return {
            value: this.getUint8() * DATA_SENDING_INTERVAL_SECONDS_COEFFICIENT
        };
    }

    private setParameterReportingDataInterval ( parameter: IParameterReportingDataInterval ) {
        this.seek(this.offset + DATA_SENDING_INTERVAL_RESERVED_BYTES);

        this.setUint8(parameter.value / DATA_SENDING_INTERVAL_SECONDS_COEFFICIENT);
    }

    private getParameterDeliveryTypeOfPriorityData (): IParameterDeliveryTypeOfPriorityData {
        return {value: this.getUint8()};
    }

    private setParameterDeliveryTypeOfPriorityData ( parameter: IParameterDeliveryTypeOfPriorityData ): void {
        this.setUint8(parameter.value);
    }

    private getParameterChannelsConfig (): IParameterChannelsConfig {
        return {value: this.getUint8()};
    }

    private setParameterChannelsConfig ( parameter: IParameterChannelsConfig ): void {
        if ( parameter.value < 0 || parameter.value > 18 ) {
            throw new Error('channels config must be between 0-18');
        }

        this.setUint8(parameter.value);
    }

    private getParameterRx2Config (): IParameterRx2Config {
        return {
            spreadFactor: this.getUint8(),
            frequency: this.getUint24(false) * PARAMETER_RX2_FREQUENCY_COEFFICIENT
        };
    }

    private setParameterRx2Config ( parameter: IParameterRx2Config ): void {
        this.setUint8(parameter.spreadFactor);
        this.setUint24(parameter.frequency / PARAMETER_RX2_FREQUENCY_COEFFICIENT, false);
    }

    private getParameterExtraFrameInterval (): IParameterExtraFrameInterval {
        return {value: this.getUint16()};
    }

    private setParameterExtraFrameInterval ( parameter: IParameterExtraFrameInterval ): void {
        this.setUint16(parameter.value);
    }

    private getParameterBatteryDepassivationInfo (): IParameterBatteryDepassivationInfo {
        return {
            loadTime: this.getUint16(false),
            internalResistance: this.getUint16(false),
            lowVoltage: this.getUint16(false)
        };
    }

    private setParameterBatteryDepassivationInfo ( parameter: IParameterBatteryDepassivationInfo ): void {
        this.setUint16(parameter.loadTime, false);
        this.setUint16(parameter.internalResistance, false);
        this.setUint16(parameter.lowVoltage, false);
    }

    private getParameterBatteryMinimalLoadTime (): IParameterBatteryMinimalLoadTime {
        return {
            value: this.getUint32(false)
        };
    }

    private setParameterBatteryMinimalLoadTime ( parameter: IParameterBatteryMinimalLoadTime ): void {
        this.setUint32(parameter.value, false);
    }

    private getParameterSerialNumber (): IParameterSerialNumber {
        const {offset} = this;

        this.offset += SERIAL_NUMBER_SIZE;

        return {
            value: getHexFromBytes(this.toUint8Array().slice(offset, this.offset))
        };
    }

    private setParameterSerialNumber ( parameter: IParameterSerialNumber ): void {
        getBytesFromHex(parameter.value).forEach(byte => this.setUint8(byte));
    }

    private getParameterGeolocation (): IParameterGeolocation {
        return {
            latitude: roundNumber(this.getFloat32()),
            longitude: roundNumber(this.getFloat32()),
            altitude: roundNumber(this.getUint16())
        };
    }

    private setParameterGeolocation ( parameter: IParameterGeolocation ): void {
        this.setFloat32(roundNumber(parameter.latitude));
        this.setFloat32(roundNumber(parameter.longitude));
        this.setUint16(roundNumber(parameter.altitude));
    }

    private getParameterPulseChannelsScanConfig (): IParameterPulseChannelsScanConfig {
        return {
            channelList: this.getChannels(),
            pullUpTime: this.getUint8(),
            scanTime: this.getUint8()
        };
    }

    private setParameterPulseChannelsScanConfig ( parameter: IParameterPulseChannelsScanConfig ): void {
        if ( parameter.pullUpTime < 17 ) {
            throw new Error('minimal value for pullUpTime - 17');
        }

        if ( parameter.scanTime < 15 ) {
            throw new Error('minimal value for scanTime - 15');
        }

        this.setChannels(parameter.channelList.map(index => ({index} as IChannel)));
        this.setUint8(parameter.pullUpTime);
        this.setUint8(parameter.scanTime);
    }

    private getParameterPulseChannelsEnableConfig (): IParameterPulseChannelsSetConfig {
        const object = bitSet.toObject(fourChannelsBitMask, this.getUint8());

        return {
            channel1: object.channel1,
            channel2: object.channel2,
            channel3: object.channel3,
            channel4: object.channel4
        };
    }

    private setParameterPulseChannelsEnableConfig ( parameter: IParameterPulseChannelsSetConfig ): void {
        const {
            channel1,
            channel2,
            channel3,
            channel4
        } = parameter;

        this.setUint8(bitSet.fromObject(fourChannelsBitMask, {
            channel1,
            channel2,
            channel3,
            channel4
        }));
    }

    private getParameterBatteryDepassivationConfig (): IParameterBatteryDepassivationConfig {
        return {
            resistanceStartThreshold: this.getUint16(false),
            resistanceStopThreshold: this.getUint16(false)
        };
    }

    private setParameterBatteryDepassivationConfig ( parameter: IParameterBatteryDepassivationConfig ): void {
        this.setUint16(parameter.resistanceStartThreshold, false);
        this.setUint16(parameter.resistanceStopThreshold, false);
    }

    private getParameterMqttSessionConfig (): IParameterMqttSessionConfig {
        return {
            clientId: this.getString(),
            username: this.getString(),
            password: this.getString(),
            cleanSession: this.getUint8()
        };
    }

    private setParameterMqttSessionConfig ( parameter: IParameterMqttSessionConfig ): void {
        this.setString(parameter.clientId);
        this.setString(parameter.username);
        this.setString(parameter.password);
        this.setUint8(parameter.cleanSession);
    }

    private getParameterMqttBrokerAddress (): IParameterMqttBrokerAddress {
        return {
            hostName: this.getString(),
            port: this.getUint16(false)
        };
    }

    private setParameterMqttBrokerAddress ( parameter: IParameterMqttBrokerAddress ): void {
        this.setString(parameter.hostName);
        this.setUint16(parameter.port, false);
    }

    private getParameterMqttSslEnable (): IParameterMqttSslEnable {
        return {
            enable: this.getUint8()
        };
    }

    private setParameterMqttSslEnable ( parameter: IParameterMqttSslEnable ): void {
        this.setUint8(parameter.enable);
    }

    private getParameterMqttTopicPrefix (): IParameterMqttTopicPrefix {
        return {
            topicPrefix: this.getString()
        };
    }

    private setParameterMqttTopicPrefix ( parameter: IParameterMqttTopicPrefix ): void {
        this.setString(parameter.topicPrefix);
    }

    private getParameterMqttDataReceiveConfig (): IParameterMqttDataReceiveConfig {
        return {
            qos: this.getUint8()
        };
    }

    private setParameterMqttDataReceiveConfig ( parameter: IParameterMqttDataReceiveConfig ): void {
        this.setUint8(parameter.qos);
    }

    private getParameterMqttDataSendConfig (): IParameterMqttDataSendConfig {
        return {
            qos: this.getUint8(),
            retain: this.getUint8(),
            newestSendFirst: this.getUint8(),
            sendCountAttempts: this.getUint8(),
            sendTimeoutBetweenAttempts: this.getUint8()
        };
    }

    private setParameterMqttDataSendConfig ( parameter: IParameterMqttDataSendConfig ): void {
        this.setUint8(parameter.qos);
        this.setUint8(parameter.retain);
        this.setUint8(parameter.newestSendFirst);
        this.setUint8(parameter.sendCountAttempts);
        this.setUint8(parameter.sendTimeoutBetweenAttempts);
    }

    private getParameterNbiotSslConfig (): IParameterNbiotSslConfig {
        return {
            securityLevel: this.getUint8(),
            version: this.getUint8()
        };
    }

    private setParameterNbiotSslConfig ( parameter: IParameterNbiotSslConfig ): void {
        this.setUint8(parameter.securityLevel);
        this.setUint8(parameter.version);
    }

    private getParameterNbiotSslWrite (): IParameterNbiotSslWrite {
        return {
            size: this.getUint16(false),
            position: this.getUint16(false),
            chunk: this.getBytes(this.size, this.offset)
        };
    }

    private setParameterNbiotSslWrite ( parameter: IParameterNbiotSslWrite ): void {
        if ( parameter.size !== parameter.chunk.length ) {
            throw new Error('ssl chunk size parameter doesn\'t match actual ssl chunk size');
        }

        this.setUint16(parameter.size, false);
        this.setUint16(parameter.position, false);
        this.setBytes(parameter.chunk);
    }

    private getParameterNbiotSslSet (): IParameterNbiotSslSet {
        return {
            crc32: this.getUint32(false)
        };
    }

    private setParameterNbiotSslSet ( parameter: IParameterNbiotSslSet ): void {
        this.setUint32(parameter.crc32, false);
    }

    private getParameterNbiotDeviceSoftwareUpdate (): IParameterNbiotDeviceSoftwareUpdate {
        return {
            softwareImageUrl: this.getString()
        };
    }

    private setParameterNbiotDeviceSoftwareUpdate ( parameter: IParameterNbiotDeviceSoftwareUpdate ): void {
        this.setString(parameter.softwareImageUrl);
    }

    private getParameterNbiotModuleFirmwareUpdate (): IParameterNbiotModuleFirmwareUpdate {
        return {
            moduleFirmwareImageUrl: this.getString()
        };
    }

    private setParameterNbiotModuleFirmwareUpdate ( parameter: IParameterNbiotModuleFirmwareUpdate ): void {
        this.setString(parameter.moduleFirmwareImageUrl);
    }

    private getParameterReportingDataConfig (): IParameterReportingDataConfig {
        return {
            dataType: this.getUint8(),
            hour: this.getUint8(),
            minutes: this.getUint8(),
            countToSend: this.getUint8()
        };
    }

    private setParameterReportingDataConfig ( parameter: IParameterReportingDataConfig ): void {
        this.setUint8(parameter.dataType);
        this.setUint8(parameter.hour);
        this.setUint8(parameter.minutes);
        this.setUint8(parameter.countToSend);
    }

    private getParameterEventsConfig (): IParameterEventsConfig {
        return {
            eventId: this.getUint8(),
            enableEvent: this.getUint8(),
            sendEvent: this.getUint8(),
            saveEvent: this.getUint8()
        };
    }

    private setParameterEventsConfig ( parameter: IParameterEventsConfig ): void {
        this.setUint8(parameter.eventId);
        this.setUint8(parameter.enableEvent);
        this.setUint8(parameter.sendEvent);
        this.setUint8(parameter.saveEvent);
    }

    private getParameterNbiotModuleInfo (): IParameterNbiotModuleInfo {
        return {
            moduleInfo: this.getString()
        };
    }

    private setParameterNbiotModuleInfo ( parameter: IParameterNbiotModuleInfo ): void {
        this.setString(parameter.moduleInfo);
    }

    private getParameterNbiotBands (): IParameterNbiotBands {
        const count = this.getUint8();
        const bands: Array<number> = [];

        for ( let index = 0; index < count; index++ ) {
            bands.push(this.getUint8());
        }

        return {bands};
    }

    private setParameterNbiotBands ( parameter: IParameterNbiotBands ): void {
        this.setUint8(parameter.bands.length);

        for ( const band of parameter.bands ) {
            this.setUint8(band);
        }
    }

    private getLegacyHourDiff (): ILegacyCounter {
        const stateWithValueByte = this.getUint8();
        const valueLowerByte = this.getUint8();

        return {
            isMagneticInfluence: CommandBinaryBuffer.getMagneticInfluenceBit(stateWithValueByte),
            value: ((stateWithValueByte & 0x1f) << 8) | valueLowerByte
        };
    }

    private setLegacyHourDiff ( diff: ILegacyCounter ): void {
        const bytes = [diff.value >> 8, diff.value & 0xff];

        bytes[0] = CommandBinaryBuffer.setMagneticInfluenceBit(bytes[0], diff.isMagneticInfluence);

        bytes.forEach(byte => this.setUint8(byte));
    }

    getParameter (): IParameter {
        const id = this.getUint8();
        let data;

        switch ( id ) {
            case deviceParameters.REPORTING_DATA_INTERVAL:
                data = this.getParameterReportingDataInterval();
                break;

            case deviceParameters.REPORTING_DATA_TYPE:
                data = this.getParameterReportingDataType();
                break;

            case deviceParameters.DAY_CHECKOUT_HOUR:
                data = this.getParameterDayCheckoutHour();
                break;

            case deviceParameters.PRIORITY_DATA_DELIVERY_TYPE:
                data = this.getParameterDeliveryTypeOfPriorityData();
                break;

            case deviceParameters.ACTIVATION_METHOD:
                data = this.getParameterActivationMethod();
                break;

            case deviceParameters.BATTERY_DEPASSIVATION_INFO:
                data = this.getParameterBatteryDepassivationInfo();
                break;

            case deviceParameters.BATTERY_MINIMAL_LOAD_TIME:
                data = this.getParameterBatteryMinimalLoadTime();
                break;

            case deviceParameters.CHANNELS_CONFIG:
                data = this.getParameterChannelsConfig();
                break;

            case deviceParameters.RX2_CONFIG:
                data = this.getParameterRx2Config();
                break;

            case deviceParameters.ABSOLUTE_DATA:
                data = this.getParameterAbsoluteData();
                break;

            case deviceParameters.ABSOLUTE_DATA_ENABLE:
                data = this.getParameterAbsoluteDataEnable();
                break;

            case deviceParameters.SERIAL_NUMBER:
                data = this.getParameterSerialNumber();
                break;

            case deviceParameters.GEOLOCATION:
                data = this.getParameterGeolocation();
                break;

            case deviceParameters.EXTRA_FRAME_INTERVAL:
                data = this.getParameterExtraFrameInterval();
                break;

            case deviceParameters.ABSOLUTE_DATA_MULTI_CHANNEL:
                data = this.getParameterAbsoluteDataMC();
                break;

            case deviceParameters.ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL:
                data = this.getParameterAbsoluteDataEnableMC();
                break;

            case deviceParameters.PULSE_CHANNELS_SCAN_CONFIG:
                data = this.getParameterPulseChannelsScanConfig();
                break;

            case deviceParameters.PULSE_CHANNELS_SET_CONFIG:
                data = this.getParameterPulseChannelsEnableConfig();
                break;

            case deviceParameters.BATTERY_DEPASSIVATION_CONFIG:
                data = this.getParameterBatteryDepassivationConfig();
                break;

            case deviceParameters.MQTT_SESSION_CONFIG:
                data = this.getParameterMqttSessionConfig();
                break;

            case deviceParameters.MQTT_BROKER_ADDRESS:
                data = this.getParameterMqttBrokerAddress();
                break;

            case deviceParameters.MQTT_SSL_ENABLE:
                data = this.getParameterMqttSslEnable();
                break;

            case deviceParameters.MQTT_TOPIC_PREFIX:
                data = this.getParameterMqttTopicPrefix();
                break;

            case deviceParameters.MQTT_DATA_RECEIVE_CONFIG:
                data = this.getParameterMqttDataReceiveConfig();
                break;

            case deviceParameters.MQTT_DATA_SEND_CONFIG:
                data = this.getParameterMqttDataSendConfig();
                break;

            case deviceParameters.NBIOT_SSL_CONFIG:
                data = this.getParameterNbiotSslConfig();
                break;

            case deviceParameters.NBIOT_SSL_CACERT_WRITE:
            case deviceParameters.NBIOT_SSL_CLIENT_CERT_WRITE:
            case deviceParameters.NBIOT_SSL_CLIENT_KEY_WRITE:
                data = this.getParameterNbiotSslWrite();
                break;

            case deviceParameters.NBIOT_SSL_CACERT_SET:
            case deviceParameters.NBIOT_SSL_CLIENT_CERT_SET:
            case deviceParameters.NBIOT_SSL_CLIENT_KEY_SET:
                data = this.getParameterNbiotSslSet();
                break;

            case deviceParameters.NBIOT_DEVICE_SOFTWARE_UPDATE:
                data = this.getParameterNbiotDeviceSoftwareUpdate();
                break;

            case deviceParameters.NBIOT_MODULE_FIRMWARE_UPDATE:
                data = this.getParameterNbiotModuleFirmwareUpdate();
                break;

            case deviceParameters.REPORTING_DATA_CONFIG:
                data = this.getParameterReportingDataConfig();
                break;

            case deviceParameters.EVENTS_CONFIG:
                data = this.getParameterEventsConfig();
                break;

            case deviceParameters.NBIOT_BANDS:
                data = this.getParameterNbiotBands();
                break;

            case deviceParameters.NBIOT_MODULE_INFO:
                data = null;
                break;

            default:
                throw new Error(`parameter ${id} is not supported`);
        }

        return {id, data};
    }

    setParameter ( parameter: IParameter ): void {
        const {id, data} = parameter;

        this.setUint8(id);

        switch ( id ) {
            case deviceParameters.REPORTING_DATA_INTERVAL:
                this.setParameterReportingDataInterval(data as IParameterReportingDataInterval);
                break;

            case deviceParameters.REPORTING_DATA_TYPE:
                this.setParameterReportingDataType(data as IParameterReportingDataType);
                break;

            case deviceParameters.DAY_CHECKOUT_HOUR:
                this.setParameterDayCheckoutHour(data as IParameterDayCheckoutHour);
                break;

            case deviceParameters.PRIORITY_DATA_DELIVERY_TYPE:
                this.setParameterDeliveryTypeOfPriorityData(data as IParameterDeliveryTypeOfPriorityData);
                break;

            case deviceParameters.ACTIVATION_METHOD:
                this.setParameterActivationMethod(data as IParameterActivationMethod);
                break;

            case deviceParameters.BATTERY_DEPASSIVATION_INFO:
                this.setParameterBatteryDepassivationInfo(data as IParameterBatteryDepassivationInfo);
                break;

            case deviceParameters.BATTERY_MINIMAL_LOAD_TIME:
                this.setParameterBatteryMinimalLoadTime(data as IParameterBatteryMinimalLoadTime);
                break;

            case deviceParameters.CHANNELS_CONFIG:
                this.setParameterChannelsConfig(data as IParameterChannelsConfig);
                break;

            case deviceParameters.RX2_CONFIG:
                this.setParameterRx2Config(data as IParameterRx2Config);
                break;

            case deviceParameters.ABSOLUTE_DATA:
                this.setParameterAbsoluteData(data as IParameterAbsoluteData);
                break;

            case deviceParameters.ABSOLUTE_DATA_ENABLE:
                this.setParameterAbsoluteDataEnable(data as IParameterAbsoluteDataEnable);
                break;

            case deviceParameters.SERIAL_NUMBER:
                this.setParameterSerialNumber(data as IParameterSerialNumber);
                break;

            case deviceParameters.GEOLOCATION:
                this.setParameterGeolocation(data as IParameterGeolocation);
                break;

            case deviceParameters.EXTRA_FRAME_INTERVAL:
                this.setParameterExtraFrameInterval(data as IParameterExtraFrameInterval);
                break;

            case deviceParameters.ABSOLUTE_DATA_MULTI_CHANNEL:
                this.setParameterAbsoluteDataMC(data as IParameterAbsoluteDataMC);
                break;

            case deviceParameters.ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL:
                this.setParameterAbsoluteDataEnableMC(data as IParameterAbsoluteDataEnableMC);
                break;

            case deviceParameters.PULSE_CHANNELS_SCAN_CONFIG:
                this.setParameterPulseChannelsScanConfig(data as IParameterPulseChannelsScanConfig);
                break;

            case deviceParameters.PULSE_CHANNELS_SET_CONFIG:
                this.setParameterPulseChannelsEnableConfig(data as IParameterPulseChannelsSetConfig);
                break;

            case deviceParameters.BATTERY_DEPASSIVATION_CONFIG:
                this.setParameterBatteryDepassivationConfig(data as IParameterBatteryDepassivationConfig);
                break;

            case deviceParameters.MQTT_SESSION_CONFIG:
                this.setParameterMqttSessionConfig(data as IParameterMqttSessionConfig);
                break;

            case deviceParameters.MQTT_BROKER_ADDRESS:
                this.setParameterMqttBrokerAddress(data as IParameterMqttBrokerAddress);
                break;

            case deviceParameters.MQTT_SSL_ENABLE:
                this.setParameterMqttSslEnable(data as IParameterMqttSslEnable);
                break;

            case deviceParameters.MQTT_TOPIC_PREFIX:
                this.setParameterMqttTopicPrefix(data as IParameterMqttTopicPrefix);
                break;

            case deviceParameters.MQTT_DATA_RECEIVE_CONFIG:
                this.setParameterMqttDataReceiveConfig(data as IParameterMqttDataReceiveConfig);
                break;

            case deviceParameters.MQTT_DATA_SEND_CONFIG:
                this.setParameterMqttDataSendConfig(data as IParameterMqttDataSendConfig);
                break;

            case deviceParameters.NBIOT_SSL_CONFIG:
                this.setParameterNbiotSslConfig(data as IParameterNbiotSslConfig);
                break;

            case deviceParameters.NBIOT_SSL_CACERT_WRITE:
            case deviceParameters.NBIOT_SSL_CLIENT_CERT_WRITE:
            case deviceParameters.NBIOT_SSL_CLIENT_KEY_WRITE:
                this.setParameterNbiotSslWrite(data as IParameterNbiotSslWrite);
                break;

            case deviceParameters.NBIOT_SSL_CACERT_SET:
            case deviceParameters.NBIOT_SSL_CLIENT_CERT_SET:
            case deviceParameters.NBIOT_SSL_CLIENT_KEY_SET:
                this.setParameterNbiotSslSet(data as IParameterNbiotSslSet);
                break;

            case deviceParameters.NBIOT_DEVICE_SOFTWARE_UPDATE:
                this.setParameterNbiotDeviceSoftwareUpdate(data as IParameterNbiotDeviceSoftwareUpdate);
                break;

            case deviceParameters.NBIOT_MODULE_FIRMWARE_UPDATE:
                this.setParameterNbiotModuleFirmwareUpdate(data as IParameterNbiotModuleFirmwareUpdate);
                break;

            case deviceParameters.REPORTING_DATA_CONFIG:
                this.setParameterReportingDataConfig(data as IParameterReportingDataConfig);
                break;

            case deviceParameters.EVENTS_CONFIG:
                this.setParameterEventsConfig(data as IParameterEventsConfig);
                break;

            case deviceParameters.NBIOT_BANDS:
                this.setParameterNbiotBands(data as IParameterNbiotBands);
                break;

            case deviceParameters.NBIOT_MODULE_INFO:
                break;

            default:
                throw new Error(`parameter ${id} is not supported`);
        }
    }

    getRequestChannelParameter (): IRequestChannelParameter {
        return {
            channel: this.getChannelValue()
        };
    }

    setRequestChannelParameter ( parameter: IRequestChannelParameter ): void {
        this.setChannelValue(parameter.channel);
    }

    getRequestDataTypeParameter (): IRequestDataTypeParameter {
        return {
            dataType: this.getUint8()
        };
    }

    setRequestDataTypeParameter ( parameter: IRequestDataTypeParameter ): void {
        this.setUint8(parameter.dataType);
    }

    getRequestEventIdParameter (): IRequestEventIdParameter {
        return {
            eventId: this.getUint8()
        };
    }

    setRequestEventIdParameter ( parameter: IRequestEventIdParameter ): void {
        this.setUint8(parameter.eventId);
    }

    getRequestParameter (): IRequestParameter {
        const id = this.getUint8();
        let data = null;

        switch ( id ) {
            case deviceParameters.ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL:
            case deviceParameters.ABSOLUTE_DATA_MULTI_CHANNEL:
                data = this.getRequestChannelParameter();
                break;

            case deviceParameters.REPORTING_DATA_CONFIG:
                data = this.getRequestDataTypeParameter();
                break;

            case deviceParameters.EVENTS_CONFIG:
                data = this.getRequestEventIdParameter();
                break;

            default:
                break;
        }

        return {id, data};
    }

    setRequestParameter ( parameter: IRequestParameter ): void {
        const {id, data} = parameter;

        this.setUint8(id);

        switch ( id ) {
            case deviceParameters.ABSOLUTE_DATA_MULTI_CHANNEL:
            case deviceParameters.ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL:
                this.setRequestChannelParameter(data as IRequestChannelParameter);
                break;

            case deviceParameters.REPORTING_DATA_CONFIG:
                this.setRequestDataTypeParameter(data as IRequestDataTypeParameter);
                break;

            case deviceParameters.EVENTS_CONFIG:
                this.setRequestEventIdParameter(data as IRequestEventIdParameter);
                break;

            default:
                break;
        }
    }

    getResponseParameter (): IParameter {
        const id = this.getUint8();
        let data;

        switch ( id ) {
            case deviceParameters.REPORTING_DATA_INTERVAL:
                data = this.getParameterReportingDataInterval();
                break;

            case deviceParameters.REPORTING_DATA_TYPE:
                data = this.getParameterReportingDataType();
                break;

            case deviceParameters.DAY_CHECKOUT_HOUR:
                data = this.getParameterDayCheckoutHour();
                break;

            case deviceParameters.PRIORITY_DATA_DELIVERY_TYPE:
                data = this.getParameterDeliveryTypeOfPriorityData();
                break;

            case deviceParameters.ACTIVATION_METHOD:
                data = this.getParameterActivationMethod();
                break;

            case deviceParameters.BATTERY_DEPASSIVATION_INFO:
                data = this.getParameterBatteryDepassivationInfo();
                break;

            case deviceParameters.BATTERY_MINIMAL_LOAD_TIME:
                data = this.getParameterBatteryMinimalLoadTime();
                break;

            case deviceParameters.CHANNELS_CONFIG:
                data = this.getParameterChannelsConfig();
                break;

            case deviceParameters.RX2_CONFIG:
                data = this.getParameterRx2Config();
                break;

            case deviceParameters.ABSOLUTE_DATA:
                data = this.getParameterAbsoluteData();
                break;

            case deviceParameters.ABSOLUTE_DATA_ENABLE:
                data = this.getParameterAbsoluteDataEnable();
                break;

            case deviceParameters.SERIAL_NUMBER:
                data = this.getParameterSerialNumber();
                break;

            case deviceParameters.GEOLOCATION:
                data = this.getParameterGeolocation();
                break;

            case deviceParameters.EXTRA_FRAME_INTERVAL:
                data = this.getParameterExtraFrameInterval();
                break;

            case deviceParameters.ABSOLUTE_DATA_MULTI_CHANNEL:
                data = this.getParameterAbsoluteDataMC();
                break;

            case deviceParameters.ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL:
                data = this.getParameterAbsoluteDataEnableMC();
                break;

            case deviceParameters.PULSE_CHANNELS_SCAN_CONFIG:
                data = this.getParameterPulseChannelsScanConfig();
                break;

            case deviceParameters.PULSE_CHANNELS_SET_CONFIG:
                data = this.getParameterPulseChannelsEnableConfig();
                break;

            case deviceParameters.BATTERY_DEPASSIVATION_CONFIG:
                data = this.getParameterBatteryDepassivationConfig();
                break;

            case deviceParameters.MQTT_BROKER_ADDRESS:
                data = this.getParameterMqttBrokerAddress();
                break;

            case deviceParameters.MQTT_SSL_ENABLE:
                data = this.getParameterMqttSslEnable();
                break;

            case deviceParameters.MQTT_TOPIC_PREFIX:
                data = this.getParameterMqttTopicPrefix();
                break;

            case deviceParameters.MQTT_DATA_RECEIVE_CONFIG:
                data = this.getParameterMqttDataReceiveConfig();
                break;

            case deviceParameters.MQTT_DATA_SEND_CONFIG:
                data = this.getParameterMqttDataSendConfig();
                break;

            case deviceParameters.NBIOT_SSL_CONFIG:
                data = this.getParameterNbiotSslConfig();
                break;

            case deviceParameters.REPORTING_DATA_CONFIG:
                data = this.getParameterReportingDataConfig();
                break;

            case deviceParameters.EVENTS_CONFIG:
                data = this.getParameterEventsConfig();
                break;

            case deviceParameters.NBIOT_MODULE_INFO:
                data = this.getParameterNbiotModuleInfo();
                break;

            case deviceParameters.NBIOT_BANDS:
                data = this.getParameterNbiotBands();
                break;

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
                throw new Error(`parameter ${id} is not supported`);
        }

        return {id, data};
    }

    setResponseParameter ( parameter: IParameter ): void {
        const {id, data} = parameter;

        this.setUint8(id);

        switch ( id ) {
            case deviceParameters.REPORTING_DATA_INTERVAL:
                this.setParameterReportingDataInterval(data as IParameterReportingDataInterval);
                break;

            case deviceParameters.REPORTING_DATA_TYPE:
                this.setParameterReportingDataType(data as IParameterReportingDataType);
                break;

            case deviceParameters.DAY_CHECKOUT_HOUR:
                this.setParameterDayCheckoutHour(data as IParameterDayCheckoutHour);
                break;

            case deviceParameters.PRIORITY_DATA_DELIVERY_TYPE:
                this.setParameterDeliveryTypeOfPriorityData(data as IParameterDeliveryTypeOfPriorityData);
                break;

            case deviceParameters.ACTIVATION_METHOD:
                this.setParameterActivationMethod(data as IParameterActivationMethod);
                break;

            case deviceParameters.BATTERY_DEPASSIVATION_INFO:
                this.setParameterBatteryDepassivationInfo(data as IParameterBatteryDepassivationInfo);
                break;

            case deviceParameters.BATTERY_MINIMAL_LOAD_TIME:
                this.setParameterBatteryMinimalLoadTime(data as IParameterBatteryMinimalLoadTime);
                break;

            case deviceParameters.CHANNELS_CONFIG:
                this.setParameterChannelsConfig(data as IParameterChannelsConfig);
                break;

            case deviceParameters.RX2_CONFIG:
                this.setParameterRx2Config(data as IParameterRx2Config);
                break;

            case deviceParameters.ABSOLUTE_DATA:
                this.setParameterAbsoluteData(data as IParameterAbsoluteData);
                break;

            case deviceParameters.ABSOLUTE_DATA_ENABLE:
                this.setParameterAbsoluteDataEnable(data as IParameterAbsoluteDataEnable);
                break;

            case deviceParameters.SERIAL_NUMBER:
                this.setParameterSerialNumber(data as IParameterSerialNumber);
                break;

            case deviceParameters.GEOLOCATION:
                this.setParameterGeolocation(data as IParameterGeolocation);
                break;

            case deviceParameters.EXTRA_FRAME_INTERVAL:
                this.setParameterExtraFrameInterval(data as IParameterExtraFrameInterval);
                break;

            case deviceParameters.ABSOLUTE_DATA_MULTI_CHANNEL:
                this.setParameterAbsoluteDataMC(data as IParameterAbsoluteDataMC);
                break;

            case deviceParameters.ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL:
                this.setParameterAbsoluteDataEnableMC(data as IParameterAbsoluteDataEnableMC);
                break;

            case deviceParameters.PULSE_CHANNELS_SCAN_CONFIG:
                this.setParameterPulseChannelsScanConfig(data as IParameterPulseChannelsScanConfig);
                break;

            case deviceParameters.PULSE_CHANNELS_SET_CONFIG:
                this.setParameterPulseChannelsEnableConfig(data as IParameterPulseChannelsSetConfig);
                break;

            case deviceParameters.BATTERY_DEPASSIVATION_CONFIG:
                this.setParameterBatteryDepassivationConfig(data as IParameterBatteryDepassivationConfig);
                break;

            case deviceParameters.MQTT_BROKER_ADDRESS:
                this.setParameterMqttBrokerAddress(data as IParameterMqttBrokerAddress);
                break;

            case deviceParameters.MQTT_SSL_ENABLE:
                this.setParameterMqttSslEnable(data as IParameterMqttSslEnable);
                break;

            case deviceParameters.MQTT_TOPIC_PREFIX:
                this.setParameterMqttTopicPrefix(data as IParameterMqttTopicPrefix);
                break;

            case deviceParameters.MQTT_DATA_RECEIVE_CONFIG:
                this.setParameterMqttDataReceiveConfig(data as IParameterMqttDataReceiveConfig);
                break;

            case deviceParameters.MQTT_DATA_SEND_CONFIG:
                this.setParameterMqttDataSendConfig(data as IParameterMqttDataSendConfig);
                break;

            case deviceParameters.NBIOT_SSL_CONFIG:
                this.setParameterNbiotSslConfig(data as IParameterNbiotSslConfig);
                break;

            case deviceParameters.REPORTING_DATA_CONFIG:
                this.setParameterReportingDataConfig(data as IParameterReportingDataConfig);
                break;

            case deviceParameters.EVENTS_CONFIG:
                this.setParameterEventsConfig(data as IParameterEventsConfig);
                break;

            case deviceParameters.NBIOT_MODULE_INFO:
                this.setParameterNbiotModuleInfo(data as IParameterNbiotModuleInfo);
                break;

            case deviceParameters.NBIOT_BANDS:
                this.setParameterNbiotBands(data as IParameterNbiotBands);
                break;

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
                throw new Error(`parameter ${id} is not supported`);
        }
    }

    getLegacyCounterValue (): number {
        return this.getUint24(false);
    }

    setLegacyCounterValue ( value: number ): void {
        this.setUint24(value, false);
    }

    getLegacyCounter ( byte = this.getUint8() ): ILegacyCounter {
        return {
            isMagneticInfluence: CommandBinaryBuffer.getMagneticInfluenceBit(byte),
            value: this.getLegacyCounterValue()
        };
    }

    setLegacyCounter ( counter: ILegacyCounter, byte = 0 ): void {
        this.setUint8(CommandBinaryBuffer.setMagneticInfluenceBit(byte, counter.isMagneticInfluence));
        this.setLegacyCounterValue(counter.value);
    }

    getLegacyHourCounterWithDiff (): ILegacyHourCounterWithDiff {
        const date = this.getDate();
        const byte = this.getUint8();
        const {hour} = this.getHours(byte);
        const counter = {
            isMagneticInfluence: CommandBinaryBuffer.getMagneticInfluenceBit(byte),
            value: this.getLegacyCounterValue()
        };
        const diff = [];

        while ( this.offset < this.data.byteLength ) {
            diff.push(this.getLegacyHourDiff());
        }

        date.setUTCHours(hour);

        return {startTime2000: getTime2000FromDate(date), counter, diff};
    }

    setLegacyHourCounterWithDiff ( hourCounter: ILegacyHourCounterWithDiff ): void {
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
    }
}


export default CommandBinaryBuffer;
