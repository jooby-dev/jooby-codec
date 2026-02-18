/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-use-before-define */

import * as types from '../../types.js';
import {IBinaryBuffer} from '../../utils/BinaryBuffer.js';
import * as bitSet from '../../utils/bitSet.js';
import invertObject from '../../utils/invertObject.js';
import getHexFromBytes from '../../utils/getHexFromBytes.js';
import getBytesFromHex from '../../utils/getBytesFromHex.js';
import roundNumber from '../../utils/roundNumber.js';
import {extractBits, fillBits} from '../../utils/bitSet.js';
import {getDateFromTime2000, getTime2000FromDate, TTime2000} from './time.js';
import * as hardwareTypes from '../constants/hardwareTypes.js';
import * as deviceParameters from '../constants/deviceParameters.js';
import deviceParameterNames from '../constants/deviceParameterNames.js';
import * as archive from '../constants/archive.js';
import * as channelTypes from '../constants/channelTypes.js';
import spreadFactorNames from '../constants/rx2SpreadFactorNames.js';


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
    isNewTariffPlanReceived?: boolean,
    /** electromagnetic influence reset */
    isElectromagneticInfluenceReset?: boolean,
    /** magnetic influence reset */
    isMagneticInfluenceReset?: boolean
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

export interface IChannelsMask {
    channel1: boolean,
    channel2: boolean,
    channel3: boolean,
    channel4: boolean
}

interface IParameterEmpty {}

/**
 * Device send data periodically using this interval.
 * deviceParameters.REPORTING_DATA_INTERVAL = `1`.
 */
interface IParameterReportingDataInterval {
    /**
     * Minimal interval for data sending from device (in seconds) for a special schedule.
     * Real value = value + pseudo-random value which is not more than `255` * `4`.
     */
    specialSchedulePeriod: types.TUint8,
    /**
     * The number of days at the beginning of the month that follow a special schedule.
     * Must be less than 4. If set to 0, no special schedule is applied.
     */
    firstDaysSpecialSchedule: types.TUint8,
    /**
     * The number of days at the end of the month that follow a special schedule.
     * Must be less than 4. If set to 0, no special schedule is applied.
     */
    lastDaysSpecialSchedule: types.TUint8,
    /**
     * Minimal interval for data sending from device (in seconds).
     * Real value = value + pseudo-random value which is not more than `255` * `4`.
     */
    period: types.TUint8
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
 * MTX Data transmission schedule.
 * `deviceParameters.MTX_DATA_TRANSMISSION_SCHEDULE = 14`.
 * Applicable only for the MTX LoRaWAN module.
 *
 * Configures the schedule for different types of data transmissions.
 */
interface IParameterMtxDataTransmissionSchedule {
    /**
     * Contains an array of four transmission schedule configurations.
     */
    schedules: Array<{
        /**
         * Data type: 0 - half hour consumption, 1 - daily consumption, 2 - current data, 3 - module status
         */
        dataType: types.TUint8,
        /**
         * Transmission period: transmissionPeriod * 600 + random value in range [0 - 1020] seconds
         */
        transmissionPeriod: types.TUint8,
        /**
         * 24-bit half hour schedule as record mapping hour to enabled state
         * Format: `{0: 1, 1: 1, 2: 0, ...}` where key is hour (0-23) and value is enabled (1) or disabled (0)
         */
        allowedHoursSchedule: Record<number, number>
    }>
}

/**
 * MTX Power configuration.
 * deviceParameters.MTX_POWER_CONFIG = `15`.
 * Applicable only for the MTX LoRaWAN module.
 *
 * Defines which half-hour energy data types are transmitted via command `getHalfHourEnergies`.
 * By default, only active energy (A+) is transmitted.
 */
interface IParameterMtxPowerConfig {
    /**
     * ACTIVE: active energy for half hour (А+) - bit 0
     */
    active: boolean,

    /**
     * VARI: positive (capacitive) reactive energy for half hour (A+R+) - bit 1
     */
    vari: boolean,

    /**
     * VARE: negative (inductive) reactive energy for half hour (A+R-) - bit 2
     */
    vare: boolean,

    /**
     * ACTIVE_EXP: active energy for half hour (А-) - bit 3
     */
    activeExp: boolean,

    /**
     * VARI_EXP: positive (capacitive) reactive energy for half hour (A-R+) - bit 4
     */
    variExp: boolean,

    /**
     * VARE_EXP: negative (inductive) reactive energy for half hour (A-R-) - bit 5
     */
    vareExp: boolean
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
    spreadFactor: types.TUint8,

    spreadFactorName?: string,

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
interface IParameterPulseChannelsSetConfig extends IChannelsMask {
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
 * Binary sensor settings
 */
interface IParameterBinarySensor {
    activeStateTimeMs: types.TUint16;
}

/**
 * Binary sensor configurable settings
 */
interface IParameterBinarySensorConfigurable {
    type: types.TUint8;
    activeStateTimeMs: types.TUint16;
    halState: types.TUint8;
}

/**
 * Temperature sensor settings
 */
interface IParameterTemperatureSensor {
    measurementPeriod: types.TUint16;
    hysteresisSec: types.TUint8;
    highTemperatureThreshold: types.TInt8;
    lowTemperatureThreshold: types.TInt8;
}

/**
 * Defines the functional type for each device channel,
 * mapping channels to roles like idle, temperature or binary sensor
 */
interface IParameterChannelType {
    channel: types.TUint8,
    type: types.TUint8
    parameters: IParameterEmpty | IParameterBinarySensor | IParameterBinarySensorConfigurable | IParameterTemperatureSensor
}

/**
 * Enable extra signal quality payload
 * deviceParameters.EXTRA_PAYLOAD_ENABLE = `57`
 */
interface IParameterExtraPayloadEnable {
    enable: types.TUint8
}

/**
 * Time synchronization period in seconds via MAC commands
 * deviceParameters.TIME_SYNCHRONIZATION_PERIOD_VIA_MAC = `58`
 */
interface IParameterTimeSynchronizationPeriodMac {
    period: types.TUint32
}

/**
 * Keep its lora connection even after being removed
 * deviceParameters.KEEP_LORA_CONNECTION_ON_REMOVAL = `59`
 */
interface IParameterKeepLoraConnectionOnRemoval {
    value: boolean
}

/**
 * Set the NTP server. Module will synchronizes the local time with the Universal Time Coordinated (UTC) via the NTP server if synchronization period is set
 * deviceParameters.NBIOT_NTP_SERVER = `60`
 */
interface IParameterNbiotNtpServer {
    server: string
    port: types.TUint16
}

/**
 * Activate/deactivate module
 * deviceParameters.ACTIVATE_MODULE = `61`
 */
interface IParameterActivateModule {
    enable: types.TUint8
}

/**
 * MTX Schedule of the different demand types for uplink command - `getCurrentDemand`
 * `deviceParameters.MTX_GET_CURRENT_DEMAND_SCHEDULE_CONFIG = 64`.
 * Applicable only for the MTX LoRaWAN module.
 */
interface IParameterMtxGetCurrentDemandScheduleConfig {
    schedules: Array<{
        /** Schedule identifier (0-3) */
        id: types.TUint8,
        /** Transmission period: transmissionPeriod * 600 + random value in range [0 - 1020] seconds */
        transmissionPeriod: types.TUint8,
        /**
         * Demand type should be one of the following:
         * - for MTX1: src/mtx1/constants/demandTypes.ts
         * - for MTX3: src/mtx3/constants/demandTypes.ts
         * The applied parameters must also have the same integration period.
         * For example, phase voltages with a 10-minute integration period and a load profile with a 30-minute integration period are not compatible.
         */
        demandType0: types.TUint8;
        demandType1: types.TUint8;
        demandType2: types.TUint8;
    }>
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
    name?: string,

    data: TParameterData
}

export interface IRequestParameter {
    /** One of the {@link deviceParameters | parameter types}. */
    id: types.TUint8,
    name?: string,

    data: TRequestParameterData | null
}

export interface IResponseParameter {
    /** One of the {@link deviceParameters | parameter types}. */
    id: types.TUint8,
    name?: string,

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
    IParameterMtxDataTransmissionSchedule |
    IParameterMtxPowerConfig |
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
    IParameterNbiotSim |
    IParameterChannelType |
    IParameterExtraPayloadEnable |
    IParameterTimeSynchronizationPeriodMac |
    IParameterKeepLoraConnectionOnRemoval |
    IParameterNbiotNtpServer |
    IParameterActivateModule |
    IParameterMtxGetCurrentDemandScheduleConfig;

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
    IParameterMtxDataTransmissionSchedule |
    IParameterMtxPowerConfig |
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
    IParameterNbiotSim |
    IParameterChannelType |
    IParameterExtraPayloadEnable |
    IParameterNbiotNtpServer |
    IParameterActivateModule |
    IParameterMtxGetCurrentDemandScheduleConfig;

const INITIAL_YEAR = 2000;
const MONTH_BIT_SIZE = 4;
const DATE_BIT_SIZE = 5;
const YEAR_START_INDEX = 1;
const UNKNOWN_BATTERY_VOLTAGE = 4095;
const EXTEND_BIT_MASK = 0x80;
const LAST_BIT_INDEX = 7;
const DATA_SENDING_INTERVAL_SECONDS_COEFFICIENT = 600;
/** 'reserved' bytes which not used */
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
const FOUR_CHANNELS_HARDWARE_TYPES = [
    hardwareTypes.IMP4EU,
    hardwareTypes.IMP4IN
];
const MTX_HARDWARE_TYPES = [
    hardwareTypes.MTXLORA,
    hardwareTypes.PLC2LORA,
    hardwareTypes.LORA
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
    isNewTariffPlanReceived: Math.pow(2, 12),
    isElectromagneticInfluenceReset: Math.pow(2, 13),
    isMagneticInfluenceReset: Math.pow(2, 14)
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

const getChannelTypeSize = ( {type}: IParameterChannelType ) => {
    let size = 1; // channel index

    switch ( type ) {
        case channelTypes.IDLE:
        case channelTypes.PULSE_SENSOR:
        case channelTypes.POWER_CHANNEL:
            break;

        case channelTypes.BINARY_SENSOR:
            size += 2;

            break;

        case channelTypes.TEMPERATURE_SENSOR:
            size += 5;

            break;

        case channelTypes.BINARY_SENSOR_CONFIGURABLE:
            size += 4;

            break;

        default:
            break;
    }

    return size;
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
    [deviceParameters.MTX_DATA_TRANSMISSION_SCHEDULE]: 1 + 20,
    [deviceParameters.MTX_POWER_CONFIG]: 1 + 1,
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
    [deviceParameters.NBIOT_SIM]: 1 + 3,
    [deviceParameters.EXTRA_PAYLOAD_ENABLE]: 1 + 1,
    [deviceParameters.TIME_SYNCHRONIZATION_PERIOD_VIA_MAC]: 1 + 4,
    [deviceParameters.KEEP_LORA_CONNECTION_ON_REMOVAL]: 1 + 1,
    [deviceParameters.ACTIVATE_MODULE]: 1 + 1
};

const fourChannelsBitMask = {
    channel1: Math.pow(2, 0),
    channel2: Math.pow(2, 1),
    channel3: Math.pow(2, 2),
    channel4: Math.pow(2, 3)
};

export const getChannelsMaskFromNumber = ( value: types.TUint8 ): IChannelsMask => {
    const object = bitSet.toObject(fourChannelsBitMask, value);

    return {channel1: object.channel1, channel2: object.channel2, channel3: object.channel3, channel4: object.channel4};
};

export const setChannelsMaskToNumber = ( channelsMask: IChannelsMask ): types.TUint8 => {
    const {channel1, channel2, channel3, channel4} = channelsMask;

    return bitSet.fromObject(fourChannelsBitMask, {channel1, channel2, channel3, channel4});
};

const getChannelsMask = ( buffer: IBinaryBuffer ): IChannelsMask => getChannelsMaskFromNumber(buffer.getUint8());

const setChannelsMask = ( buffer: IBinaryBuffer, channelsMask: IChannelsMask ) => (
    buffer.setUint8(setChannelsMaskToNumber(channelsMask))
);


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

const getNbiotSslWrite = ( buffer: IBinaryBuffer ) => ({
    size: buffer.getUint16(),
    position: buffer.getUint16(),
    chunk: buffer.getBytesLeft()
});

const setNbiotSslWrite = ( buffer: IBinaryBuffer, parameter: IParameterNbiotSslWrite ) => {
    if ( parameter.size !== parameter.chunk.length ) {
        throw new Error('ssl chunk size parameter doesn\'t match actual ssl chunk size');
    }

    buffer.setUint16(parameter.size);
    buffer.setUint16(parameter.position);
    buffer.setBytes(parameter.chunk);
};


const getNbiotSslSet = ( buffer: IBinaryBuffer ) => ({crc32: buffer.getUint32()});

const setNbiotSslSet = ( buffer: IBinaryBuffer, parameter: IParameterNbiotSslSet ) => {
    buffer.setUint32(parameter.crc32);
};


const deviceParameterConvertersMap = {
    [deviceParameters.REPORTING_DATA_INTERVAL]: {
        get: ( buffer: IBinaryBuffer ): IParameterReportingDataInterval => ({
            specialSchedulePeriod: buffer.getUint8() * DATA_SENDING_INTERVAL_SECONDS_COEFFICIENT,
            firstDaysSpecialSchedule: buffer.getUint8(),
            lastDaysSpecialSchedule: buffer.getUint8(),
            period: buffer.getUint8() * DATA_SENDING_INTERVAL_SECONDS_COEFFICIENT
        }),
        set: ( buffer: IBinaryBuffer, parameter: IParameterReportingDataInterval ) => {
            buffer.setUint8(parameter.specialSchedulePeriod / DATA_SENDING_INTERVAL_SECONDS_COEFFICIENT);
            buffer.setUint8(parameter.firstDaysSpecialSchedule);
            buffer.setUint8(parameter.lastDaysSpecialSchedule);
            buffer.setUint8(parameter.period / DATA_SENDING_INTERVAL_SECONDS_COEFFICIENT);
        }
    },
    [deviceParameters.DAY_CHECKOUT_HOUR]: {
        get: ( buffer: IBinaryBuffer ): IParameterDayCheckoutHour => ({
            value: buffer.getUint8()
        }),
        set: ( buffer: IBinaryBuffer, parameter: IParameterDayCheckoutHour ) => {
            buffer.setUint8(parameter.value);
        }
    },
    [deviceParameters.REPORTING_DATA_TYPE]: {
        get: ( buffer: IBinaryBuffer ): IParameterReportingDataType => ({
            type: buffer.getUint8()
        }),
        set: ( buffer: IBinaryBuffer, parameter: IParameterReportingDataType ) => {
            buffer.setUint8(parameter.type);
        }
    },
    [deviceParameters.PRIORITY_DATA_DELIVERY_TYPE]: {
        get: ( buffer: IBinaryBuffer ): IParameterDeliveryTypeOfPriorityData => ({value: buffer.getUint8()}),
        set: ( buffer: IBinaryBuffer, parameter: IParameterDeliveryTypeOfPriorityData ) => {
            buffer.setUint8(parameter.value);
        }
    },
    [deviceParameters.ACTIVATION_METHOD]: {
        get: ( buffer: IBinaryBuffer ): IParameterActivationMethod => ({
            type: buffer.getUint8()
        }),
        set: ( buffer: IBinaryBuffer, parameter: IParameterActivationMethod ) => {
            buffer.setUint8(parameter.type);
        }
    },
    [deviceParameters.BATTERY_DEPASSIVATION_INFO]: {
        get: ( buffer: IBinaryBuffer ): IParameterBatteryDepassivationInfo => ({
            loadTime: buffer.getUint16(),
            internalResistance: buffer.getUint16(),
            lowVoltage: buffer.getUint16()
        }),
        set: ( buffer: IBinaryBuffer, parameter: IParameterBatteryDepassivationInfo ) => {
            buffer.setUint16(parameter.loadTime);
            buffer.setUint16(parameter.internalResistance);
            buffer.setUint16(parameter.lowVoltage);
        }
    },
    [deviceParameters.BATTERY_MINIMAL_LOAD_TIME]: {
        get: ( buffer: IBinaryBuffer ): IParameterBatteryMinimalLoadTime => ({
            value: buffer.getUint32()
        }),
        set: ( buffer: IBinaryBuffer, parameter: IParameterBatteryMinimalLoadTime ) => {
            buffer.setUint32(parameter.value);
        }
    },
    [deviceParameters.CHANNELS_CONFIG]: {
        get: ( buffer: IBinaryBuffer ): IParameterChannelsConfig => ({value: buffer.getUint8()}),
        set: ( buffer: IBinaryBuffer, parameter: IParameterChannelsConfig ) => {
            if ( parameter.value < 0 || parameter.value > 18 ) {
                throw new Error('channels config must be between 0-18');
            }

            buffer.setUint8(parameter.value);
        }
    },
    [deviceParameters.MTX_DATA_TRANSMISSION_SCHEDULE]: {
        get: ( buffer: IBinaryBuffer ): IParameterMtxDataTransmissionSchedule => {
            const schedules = [];

            for ( let i = 0; i < 4; i++ ) {
                const dataType = buffer.getUint8();
                const transmissionPeriod = buffer.getUint8() * DATA_SENDING_INTERVAL_SECONDS_COEFFICIENT;
                const allowedHoursScheduleValue = buffer.getUint24();

                // Convert 24-bit value to record mapping hour to enabled state
                const allowedHoursSchedule: Record<number, number> = {};
                for ( let hour = 0; hour < 24; hour++ ) {
                    allowedHoursSchedule[hour] = (allowedHoursScheduleValue & (1 << hour)) ? 1 : 0;
                }

                schedules.push({
                    dataType,
                    transmissionPeriod,
                    allowedHoursSchedule
                });
            }

            return {schedules};
        },
        set: ( buffer: IBinaryBuffer, parameter: IParameterMtxDataTransmissionSchedule ) => {
            for ( const schedule of parameter.schedules ) {
                buffer.setUint8(schedule.dataType);
                buffer.setUint8(schedule.transmissionPeriod / DATA_SENDING_INTERVAL_SECONDS_COEFFICIENT);

                // Convert record mapping hour to enabled state to 24-bit value
                let allowedHoursScheduleValue = 0;
                for ( let hour = 0; hour < 24; hour++ ) {
                    if ( schedule.allowedHoursSchedule[hour] ) {
                        allowedHoursScheduleValue |= (1 << hour);
                    }
                }

                buffer.setUint24(allowedHoursScheduleValue);
            }
        }
    },
    [deviceParameters.MTX_POWER_CONFIG]: {
        get: ( buffer: IBinaryBuffer ): IParameterMtxPowerConfig => {
            const value = buffer.getUint8();

            return {
                active: !!(value & 0x01),
                vari: !!(value & 0x02),
                vare: !!(value & 0x04),
                activeExp: !!(value & 0x08),
                variExp: !!(value & 0x10),
                vareExp: !!(value & 0x20)
            };
        },
        set: ( buffer: IBinaryBuffer, parameter: IParameterMtxPowerConfig ) => {
            let value = 0;

            value |= parameter.active ? 0x01 : 0;
            value |= parameter.vari ? 0x02 : 0;
            value |= parameter.vare ? 0x04 : 0;
            value |= parameter.activeExp ? 0x08 : 0;
            value |= parameter.variExp ? 0x10 : 0;
            value |= parameter.vareExp ? 0x20 : 0;

            buffer.setUint8(value);
        }
    },
    [deviceParameters.RX2_CONFIG]: {
        get: ( buffer: IBinaryBuffer ): IParameterRx2Config => {
            const spreadFactor = buffer.getUint8();
            const spreadFactorName = spreadFactorNames[spreadFactor];
            const frequency = buffer.getUint24() * PARAMETER_RX2_FREQUENCY_COEFFICIENT;

            return {spreadFactor, spreadFactorName, frequency};
        },
        set: ( buffer: IBinaryBuffer, parameter: IParameterRx2Config ) => {
            buffer.setUint8(parameter.spreadFactor);
            buffer.setUint24(parameter.frequency / PARAMETER_RX2_FREQUENCY_COEFFICIENT);
        }
    },
    [deviceParameters.ABSOLUTE_DATA]: {
        get: ( buffer: IBinaryBuffer ): IParameterAbsoluteData => ({
            meterValue: buffer.getUint32(),
            pulseCoefficient: getPulseCoefficient(buffer),
            value: buffer.getUint32()
        }),
        set: ( buffer: IBinaryBuffer, parameter: IParameterAbsoluteData ) => {
            buffer.setUint32(parameter.meterValue);
            setPulseCoefficient(buffer, parameter.pulseCoefficient);
            buffer.setUint32(parameter.value);
        }
    },
    [deviceParameters.ABSOLUTE_DATA_ENABLE]: {
        get: ( buffer: IBinaryBuffer ): IParameterAbsoluteDataEnable => ({state: buffer.getUint8()}),
        set: ( buffer: IBinaryBuffer, parameter: IParameterAbsoluteDataEnable ) => {
            buffer.setUint8(parameter.state);
        }
    },
    [deviceParameters.SERIAL_NUMBER]: {
        get: ( buffer: IBinaryBuffer ): IParameterSerialNumber => ({
            value: getHexFromBytes(buffer.getBytes(SERIAL_NUMBER_SIZE))
        }),
        set: ( buffer: IBinaryBuffer, parameter: IParameterSerialNumber ) => {
            getBytesFromHex(parameter.value).forEach(byte => buffer.setUint8(byte));
        }
    },
    [deviceParameters.GEOLOCATION]: {
        get: ( buffer: IBinaryBuffer ): IParameterGeolocation => ({
            latitude: roundNumber(buffer.getFloat32()),
            longitude: roundNumber(buffer.getFloat32()),
            altitude: roundNumber(buffer.getUint16())
        }),
        set: ( buffer: IBinaryBuffer, parameter: IParameterGeolocation ) => {
            buffer.setFloat32(roundNumber(parameter.latitude));
            buffer.setFloat32(roundNumber(parameter.longitude));
            buffer.setUint16(roundNumber(parameter.altitude));
        }
    },
    [deviceParameters.EXTRA_FRAME_INTERVAL]: {
        get: ( buffer: IBinaryBuffer ): IParameterExtraFrameInterval => ({value: buffer.getUint16()}),
        set: ( buffer: IBinaryBuffer, parameter: IParameterExtraFrameInterval ) => {
            buffer.setUint16(parameter.value);
        }
    },
    [deviceParameters.ABSOLUTE_DATA_MULTI_CHANNEL]: {
        get: ( buffer: IBinaryBuffer ): IParameterAbsoluteDataMC => ({
            channel: getChannelValue(buffer),
            meterValue: buffer.getUint32(),
            pulseCoefficient: getPulseCoefficient(buffer),
            value: buffer.getUint32()
        }),
        set: ( buffer: IBinaryBuffer, parameter: IParameterAbsoluteDataMC ) => {
            setChannelValue(buffer, parameter.channel);
            buffer.setUint32(parameter.meterValue);
            setPulseCoefficient(buffer, parameter.pulseCoefficient);
            buffer.setUint32(parameter.value);
        }
    },
    [deviceParameters.ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL]: {
        get: ( buffer: IBinaryBuffer ): IParameterAbsoluteDataEnableMC => ({
            channel: getChannelValue(buffer),
            state: buffer.getUint8()
        }),
        set: ( buffer: IBinaryBuffer, parameter: IParameterAbsoluteDataEnableMC ) => {
            setChannelValue(buffer, parameter.channel);
            buffer.setUint8(parameter.state);
        }
    },
    [deviceParameters.PULSE_CHANNELS_SCAN_CONFIG]: {
        get: ( buffer: IBinaryBuffer ): IParameterPulseChannelsScanConfig => ({
            channelList: getChannels(buffer),
            pullUpTime: buffer.getUint8(),
            scanTime: buffer.getUint8()
        }),
        set: ( buffer: IBinaryBuffer, parameter: IParameterPulseChannelsScanConfig ) => {
            if ( parameter.pullUpTime < 17 ) {
                throw new Error('minimal value for pullUpTime - 17');
            }

            if ( parameter.scanTime < 15 ) {
                throw new Error('minimal value for scanTime - 15');
            }

            setChannels(buffer, parameter.channelList.map(index => ({index} as IChannel)));
            buffer.setUint8(parameter.pullUpTime);
            buffer.setUint8(parameter.scanTime);
        }
    },
    [deviceParameters.PULSE_CHANNELS_SET_CONFIG]: {
        get: getChannelsMask,
        set: setChannelsMask
    },
    [deviceParameters.BATTERY_DEPASSIVATION_CONFIG]: {
        get: ( buffer: IBinaryBuffer ): IParameterBatteryDepassivationConfig => ({
            resistanceStartThreshold: buffer.getUint16(),
            resistanceStopThreshold: buffer.getUint16()
        }),
        set: ( buffer: IBinaryBuffer, parameter: IParameterBatteryDepassivationConfig ) => {
            buffer.setUint16(parameter.resistanceStartThreshold);
            buffer.setUint16(parameter.resistanceStopThreshold);
        }
    },
    [deviceParameters.MQTT_SESSION_CONFIG]: {
        get: ( buffer: IBinaryBuffer ): IParameterMqttSessionConfig => ({
            clientId: buffer.getString(),
            username: buffer.getString(),
            password: buffer.getString(),
            cleanSession: buffer.getUint8()
        }),
        set: ( buffer: IBinaryBuffer, parameter: IParameterMqttSessionConfig ) => {
            buffer.setString(parameter.clientId);
            buffer.setString(parameter.username);
            buffer.setString(parameter.password);
            buffer.setUint8(parameter.cleanSession);
        }
    },
    [deviceParameters.MQTT_BROKER_ADDRESS]: {
        get: ( buffer: IBinaryBuffer ): IParameterMqttBrokerAddress => ({
            hostName: buffer.getString(),
            port: buffer.getUint16()
        }),
        set: ( buffer: IBinaryBuffer, parameter: IParameterMqttBrokerAddress ) => {
            buffer.setString(parameter.hostName);
            buffer.setUint16(parameter.port);
        }
    },
    [deviceParameters.MQTT_SSL_ENABLE]: {
        get: ( buffer: IBinaryBuffer ): IParameterMqttSslEnable => ({
            enable: buffer.getUint8()
        }),
        set: ( buffer: IBinaryBuffer, parameter: IParameterMqttSslEnable ) => {
            buffer.setUint8(parameter.enable);
        }
    },
    [deviceParameters.MQTT_TOPIC_PREFIX]: {
        get: ( buffer: IBinaryBuffer ): IParameterMqttTopicPrefix => ({
            topicPrefix: buffer.getString()
        }),
        set: ( buffer: IBinaryBuffer, parameter: IParameterMqttTopicPrefix ) => {
            buffer.setString(parameter.topicPrefix);
        }
    },
    [deviceParameters.MQTT_DATA_RECEIVE_CONFIG]: {
        get: ( buffer: IBinaryBuffer ): IParameterMqttDataReceiveConfig => ({
            qos: buffer.getUint8(),
            count: buffer.getUint8(),
            timeout: buffer.getUint8()
        }),
        set: ( buffer: IBinaryBuffer, parameter: IParameterMqttDataReceiveConfig ) => {
            buffer.setUint8(parameter.qos);
            buffer.setUint8(parameter.count);
            buffer.setUint8(parameter.timeout);
        }
    },
    [deviceParameters.MQTT_DATA_SEND_CONFIG]: {
        get: ( buffer: IBinaryBuffer ): IParameterMqttDataSendConfig => ({
            qos: buffer.getUint8(),
            retain: buffer.getUint8(),
            newestSendFirst: buffer.getUint8()
        }),
        set: ( buffer: IBinaryBuffer, parameter: IParameterMqttDataSendConfig ) => {
            buffer.setUint8(parameter.qos);
            buffer.setUint8(parameter.retain);
            buffer.setUint8(parameter.newestSendFirst);
        }
    },
    [deviceParameters.NBIOT_SSL_CONFIG]: {
        get: ( buffer: IBinaryBuffer ): IParameterNbiotSslConfig => ({
            securityLevel: buffer.getUint8(),
            version: buffer.getUint8()
        }),
        set: ( buffer: IBinaryBuffer, parameter: IParameterNbiotSslConfig ) => {
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
        get: ( buffer: IBinaryBuffer ): IParameterNbiotDeviceSoftwareUpdate => ({
            softwareImageUrl: buffer.getString()
        }),
        set: ( buffer: IBinaryBuffer, parameter: IParameterNbiotDeviceSoftwareUpdate ) => {
            buffer.setString(parameter.softwareImageUrl);
        }
    },
    [deviceParameters.NBIOT_MODULE_FIRMWARE_UPDATE]: {
        get: ( buffer: IBinaryBuffer ): IParameterNbiotModuleFirmwareUpdate => ({
            moduleFirmwareImageUrl: buffer.getString()
        }),
        set: ( buffer: IBinaryBuffer, parameter: IParameterNbiotModuleFirmwareUpdate ) => {
            buffer.setString(parameter.moduleFirmwareImageUrl);
        }
    },
    [deviceParameters.REPORTING_DATA_CONFIG]: {
        get: ( buffer: IBinaryBuffer ): IParameterReportingDataConfig => ({
            dataType: buffer.getUint8(),
            hour: buffer.getUint8(),
            minutes: buffer.getUint8(),
            countToSend: buffer.getUint8()
        }),
        set: ( buffer: IBinaryBuffer, parameter: IParameterReportingDataConfig ) => {
            buffer.setUint8(parameter.dataType);
            buffer.setUint8(parameter.hour);
            buffer.setUint8(parameter.minutes);
            buffer.setUint8(parameter.countToSend);
        }
    },
    [deviceParameters.EVENTS_CONFIG]: {
        get: ( buffer: IBinaryBuffer ): IParameterEventsConfig => ({
            eventId: buffer.getUint8(),
            sendEvent: buffer.getUint8(),
            saveEvent: buffer.getUint8()
        }),
        set: ( buffer: IBinaryBuffer, parameter: IParameterEventsConfig ) => {
            buffer.setUint8(parameter.eventId);
            buffer.setUint8(parameter.sendEvent);
            buffer.setUint8(parameter.saveEvent);
        }
    },
    [deviceParameters.NBIOT_MODULE_INFO]: {
        get: ( buffer: IBinaryBuffer ): IParameterNbiotModuleInfo => ({
            moduleInfo: buffer.getString()
        }),
        set: ( buffer: IBinaryBuffer, parameter: IParameterNbiotModuleInfo ) => {
            buffer.setString(parameter.moduleInfo);
        }
    },
    [deviceParameters.NBIOT_BANDS]: {
        get: ( buffer: IBinaryBuffer ): IParameterNbiotBands => {
            const count = buffer.getUint8();
            const bands: Array<number> = [];

            for ( let index = 0; index < count; index++ ) {
                bands.push(buffer.getUint8());
            }

            return {bands};
        },
        set: ( buffer: IBinaryBuffer, parameter: IParameterNbiotBands ) => {
            buffer.setUint8(parameter.bands.length);

            for ( const band of parameter.bands ) {
                buffer.setUint8(band);
            }
        }
    },
    [deviceParameters.NBIOT_APN]: {
        get: ( buffer: IBinaryBuffer ): IParameterNbiotApn => ({
            apn: buffer.getString()
        }),
        set: ( buffer: IBinaryBuffer, parameter: IParameterNbiotApn ) => {
            buffer.setString(parameter.apn);
        }
    },
    [deviceParameters.NBIOT_LED_INDICATION]: {
        get: ( buffer: IBinaryBuffer ): IParameterNbiotLedIndication => ({
            enableLed: buffer.getUint8(),
            enableNbiotNetworkLed: buffer.getUint8()
        }),
        set: ( buffer: IBinaryBuffer, parameter: IParameterNbiotLedIndication ) => {
            buffer.setUint8(parameter.enableLed);
            buffer.setUint8(parameter.enableNbiotNetworkLed);
        }
    },
    [deviceParameters.NBIOT_SIM]: {
        get: ( buffer: IBinaryBuffer ): IParameterNbiotSim => ({
            enable: buffer.getUint8(),
            pin: buffer.getUint16()
        }),
        set: ( buffer: IBinaryBuffer, parameter: IParameterNbiotSim ) => {
            buffer.setUint8(parameter.enable);
            buffer.setUint16(parameter.pin);
        }
    },
    [deviceParameters.CHANNEL_TYPE]: {
        get: ( buffer: IBinaryBuffer ): IParameterChannelType => (getChannelType(buffer)),
        set: ( buffer: IBinaryBuffer, parameter: IParameterChannelType ) => (
            setChannelType(buffer, parameter)
        )
    },
    [deviceParameters.EXTRA_PAYLOAD_ENABLE]: {
        get: ( buffer: IBinaryBuffer ): IParameterExtraPayloadEnable => ({
            enable: buffer.getUint8()
        }),
        set: ( buffer: IBinaryBuffer, parameter: IParameterExtraPayloadEnable ) => {
            buffer.setUint8(parameter.enable);
        }
    },
    [deviceParameters.TIME_SYNCHRONIZATION_PERIOD_VIA_MAC]: {
        get: ( buffer: IBinaryBuffer ): IParameterTimeSynchronizationPeriodMac => ({
            period: buffer.getUint32()
        }),
        set: ( buffer: IBinaryBuffer, parameter: IParameterTimeSynchronizationPeriodMac ) => {
            buffer.setUint32(parameter.period);
        }
    },
    [deviceParameters.KEEP_LORA_CONNECTION_ON_REMOVAL]: {
        get: ( buffer: IBinaryBuffer ): IParameterKeepLoraConnectionOnRemoval => ({
            value: buffer.getUint8() !== 0
        }),
        set: ( buffer: IBinaryBuffer, parameter: IParameterKeepLoraConnectionOnRemoval ) => {
            buffer.setUint8(parameter.value ? 1 : 0);
        }
    },
    [deviceParameters.NBIOT_NTP_SERVER]: {
        get: ( buffer: IBinaryBuffer ): IParameterNbiotNtpServer => ({
            server: buffer.getString(),
            port: buffer.getUint16()
        }),
        set: ( buffer: IBinaryBuffer, parameter: IParameterNbiotNtpServer ) => {
            buffer.setString(parameter.server);
            buffer.setUint16(parameter.port);
        }
    },
    [deviceParameters.ACTIVATE_MODULE]: {
        get: ( buffer: IBinaryBuffer ): IParameterActivateModule => ({
            enable: buffer.getUint8()
        }),
        set: ( buffer: IBinaryBuffer, parameter: IParameterActivateModule ) => {
            buffer.setUint8(parameter.enable);
        }
    },
    [deviceParameters.MTX_GET_CURRENT_DEMAND_SCHEDULE_CONFIG]: {
        get: ( buffer: IBinaryBuffer ): IParameterMtxGetCurrentDemandScheduleConfig => {
            const schedules = [];

            while (buffer.bytesLeft > 0) {
                const id = buffer.getUint8();
                const transmissionPeriod = buffer.getUint8() * DATA_SENDING_INTERVAL_SECONDS_COEFFICIENT;
                const demandType0 = buffer.getUint8();
                const demandType1 = buffer.getUint8();
                const demandType2 = buffer.getUint8();

                schedules.push({
                    id,
                    transmissionPeriod,
                    demandType0,
                    demandType1,
                    demandType2
                });
            }

            return {schedules};
        },
        set: ( buffer: IBinaryBuffer, parameter: IParameterMtxGetCurrentDemandScheduleConfig ) => {
            for ( const schedule of parameter.schedules ) {
                buffer.setUint8(schedule.id);
                buffer.setUint8(schedule.transmissionPeriod / DATA_SENDING_INTERVAL_SECONDS_COEFFICIENT);
                buffer.setUint8(schedule.demandType0);
                buffer.setUint8(schedule.demandType1);
                buffer.setUint8(schedule.demandType2);
            }
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

        case deviceParameters.CHANNEL_TYPE:
            data = parameter.data as IParameterChannelType;
            // size: parameter id + parameter size
            size = 1 + getChannelTypeSize(data);

            break;

        case deviceParameters.NBIOT_NTP_SERVER:
            data = parameter.data as IParameterNbiotNtpServer;
            // size: parameter id + string length + server string + port
            size = 1 + 1 + data.server.length + 2;

            break;

        case deviceParameters.MTX_GET_CURRENT_DEMAND_SCHEDULE_CONFIG:
            data = parameter.data as IParameterMtxGetCurrentDemandScheduleConfig;
            // size: parameter id + data.schedules.length * (id + transmissionPeriod + demandType0 + demandType1 + demandType2)
            size = 1 + data.schedules.length * 5;

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
        case deviceParameters.CHANNEL_TYPE:
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
        case deviceParameters.CHANNEL_TYPE:
        case deviceParameters.NBIOT_NTP_SERVER:
        case deviceParameters.MTX_GET_CURRENT_DEMAND_SCHEDULE_CONFIG:
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


/* export interface ICommandBinaryBuffer extends IBinaryBuffer {
    // static methods
    // getMagneticInfluenceBit ( byte: number ): boolean,
    // setMagneticInfluenceBit ( byte: number, value: boolean ): number,
    // getLegacyHourCounterSize ( hourCounter: ILegacyHourCounterWithDiff ): number,

    // instance methods
    // getExtendedValue (): number,
    // setExtendedValue ( value: number ),
    // getExtendedValueSize (bits: number): number,

    // getTime (): number,
    // setTime (value: TTime2000): void,

    // getBatteryVoltage (): IBatteryVoltage,
    // setBatteryVoltage ( batteryVoltage: IBatteryVoltage ),

    // getLegacyCounterValue (): types.TUint24,
    // setLegacyCounterValue ( value: types.TUint24 ),

    // getLegacyCounter ( byte?: types.TUint8, isArchiveValue?: boolean ): ILegacyCounter,
    // setLegacyCounter ( counter: ILegacyCounter, byte?: types.TUint8, isArchiveValue?: boolean ),

    // getChannels (): Array<number>,
    // setChannels ( channelList: Array<IChannel> );

    // getChannelValue (): number;
    // setChannelValue( value: number );

    // getChannelsValuesWithHourDiff ( isArchiveValue?: boolean ): {hours: number, startTime2000: TTime2000, channelList: Array<IChannelHours>},
    // setChannelsValuesWithHourDiff ( hours: number, startTime2000: TTime2000, channelList: Array<IChannelHours>, isArchiveValue?: boolean ),

    // getHours ( byte?: types.TUint8 ): {hour: number, hours: number},
    // setHours ( hour: number, hours: number ),

    // getDate (): Date,
    // setDate ( dateOrTime: Date | TTime2000 ),

    // getPulseCoefficient (): TPulseCoefficient,
    // setPulseCoefficient ( value: TPulseCoefficient ),

    // getChannelsWithAbsoluteValues (): Array<IChannelAbsoluteValue>,
    // setChannelsWithAbsoluteValues ( channelList: Array<IChannelAbsoluteValue> ),

    // getChannelsAbsoluteValuesWithHourDiff ( hours: number ): Array<IChannelHourAbsoluteValue>,
    // setChannelsAbsoluteValuesWithHourDiff ( channelList: Array<IChannelHourAbsoluteValue> ),

    // getEventStatus ( hardwareType: number ): TEventStatus,
    // setEventStatus ( hardwareType: number, status: TEventStatus ),

    // getParameter (): IParameter,
    // setParameter ( parameter: IParameter ),

    // getRequestParameter (): IRequestParameter,
    // setRequestParameter ( parameter: IRequestParameter ),

    // getResponseParameter (): IResponseParameter,
    // setResponseParameter ( parameter: IResponseParameter ),

    // getLegacyHourDiff (): ILegacyCounter,
    // setLegacyHourDiff ( diff: ILegacyCounter ),

    // getLegacyHourCounterWithDiff ( isArchiveValue?: boolean ): ILegacyHourCounterWithDiff,
    // setLegacyHourCounterWithDiff ( hourCounter: ILegacyHourCounterWithDiff, isArchiveValue?: boolean ),

    // getChannelsValuesWithHourDiffExtended ( isArchiveValue?: boolean ): IChannelValuesWithHourDiffExtended,
    // setChannelsValuesWithHourDiffExtended ( parameters: IChannelValuesWithHourDiffExtended, isArchiveValue?: boolean ),

    // getDataSegment (): IDataSegment,
    // setDataSegment ( parameters: IDataSegment )

    // getBinarySensor(): IParameterBinarySensor,
    // setBinarySensor( parameters: IParameterBinarySensor ),

    // getTemperatureSensor(): IParameterTemperatureSensor,
    // setTemperatureSensor( parameters: IParameterTemperatureSensor ),

    // getChannelType(): IParameterChannelType,
    // setChannelType( parameters: IParameterChannelType)
} */

// function CommandBinaryBuffer ( this: ICommandBinaryBuffer, dataOrLength: types.TBytes | number, isLittleEndian = false ) {
//     BinaryBuffer.call(this, dataOrLength, isLittleEndian);
// }

// extending
// CommandBinaryBuffer.prototype = Object.create(BinaryBuffer.prototype);
// CommandBinaryBuffer.prototype.constructor = CommandBinaryBuffer;


export const getMagneticInfluenceBit = ( byte: number ): boolean => (
    !!extractBits(byte, 1, MAGNETIC_INFLUENCE_BIT_INDEX)
);

export const setMagneticInfluenceBit = ( byte: number, value: boolean ): number => (
    fillBits(byte, 1, MAGNETIC_INFLUENCE_BIT_INDEX, +value)
);

export const getLegacyHourCounterSize = ( hourCounter: ILegacyHourCounterWithDiff ): number => (
    LEGACY_HOUR_COUNTER_SIZE + (hourCounter.diff.length * LEGACY_HOUR_DIFF_SIZE)
);


export const getExtendedValue = function ( buffer: IBinaryBuffer ): number {
    let value = 0;
    let isByteExtended = true;
    // byte offset
    let position = 0;

    while ( isByteExtended && buffer.offset <= buffer.data.length ) {
        const byte = buffer.getUint8();

        isByteExtended = !!(byte & EXTEND_BIT_MASK);
        // https://stackoverflow.com/a/30089815/7119054
        value += ((byte & 0x7f) << (7 * position)) >>> 0;
        ++position;
    }

    return value;
};


export const setExtendedValue = function ( buffer: IBinaryBuffer, value: number ) {
    if ( value === 0 ) {
        buffer.setUint8(0);

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

    data.forEach(extendedValue => buffer.setUint8(extendedValue));
};


/**
 * Get the number of bytes necessary to store an extended value.
 *
 * @param bits - the number of bits of original value
 *
 * @example
 * ```js
 * const bits = (16384).toString(2).length;
 * const bytes = getExtendedValueSize(bits);
 * // 16384 normally is stored in 2 bytes but for extended value 3 bytes are required
 * ```
 */
export const getExtendedValueSize = function ( bits: number ): number {
    const extBits = Math.ceil(bits / 7);
    const totalBits = bits + extBits;
    const extBytes = Math.ceil(totalBits / 8);

    return extBytes;
};


export const getTime = function ( buffer: IBinaryBuffer ): number {
    return buffer.getUint32();
};


export const setTime = function ( buffer: IBinaryBuffer, value: TTime2000 ): void {
    buffer.setUint32(value);
};


export const getBatteryVoltage = function ( buffer: IBinaryBuffer ): IBatteryVoltage {
    const lowVoltageByte = buffer.getUint8();
    const lowAndHightVoltageByte = buffer.getUint8();
    const highVoltageByte = buffer.getUint8();

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


export const setBatteryVoltage = function ( buffer: IBinaryBuffer, batteryVoltage: IBatteryVoltage ) {
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

    [lowVoltageByte, lowAndHighVoltageByte, highVoltageByte].forEach(byte => buffer.setUint8(byte));
};

export const getLegacyCounterValue = function ( buffer: IBinaryBuffer ): types.TUint24 {
    return buffer.getUint24();
};

export const setLegacyCounterValue = function ( buffer: IBinaryBuffer, value: types.TUint24 ) {
    buffer.setUint24(value);
};

export const getLegacyCounter = function ( buffer: IBinaryBuffer, byte = buffer.getUint8(), isArchiveValue = false ): ILegacyCounter {
    const value = getLegacyCounterValue(buffer);

    return {
        isMagneticInfluence: getMagneticInfluenceBit(byte),
        value: isArchiveValue && value === archive.EMPTY_VALUE ? 0 : value
    };
};

export const setLegacyCounter = function ( buffer: IBinaryBuffer, counter: ILegacyCounter, byte = 0, isArchiveValue = false ) {
    buffer.setUint8(setMagneticInfluenceBit(byte, counter.isMagneticInfluence));
    setLegacyCounterValue(buffer, isArchiveValue && counter.value === 0 ? archive.EMPTY_VALUE : counter.value);
};


/**
 * Get array of channel indexes.
 */
export const getChannels = function ( buffer: IBinaryBuffer ): Array<number> {
    const channelList: Array<number> = [];

    let extended = true;
    let channelIndex = 1;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while ( extended ) {
        const byte = buffer.getUint8();

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
export const setChannels = function ( buffer: IBinaryBuffer, channelList: Array<IChannel> ) {
    if ( channelList.length === 0 ) {
        buffer.setUint8(0);

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

    data.forEach((value: number) => buffer.setUint8(value));
};


export const getChannelValue = function ( buffer: IBinaryBuffer ): number {
    return buffer.getUint8() + 1;
};

export const setChannelValue = function ( buffer: IBinaryBuffer, value: number ) {
    if ( value < 1 ) {
        throw new Error('channel must be 1 or greater');
    }

    buffer.setUint8(value - 1);
};


export const getChannelsValuesWithHourDiff = function (
    buffer: IBinaryBuffer,
    isArchiveValue = false
): {hours: number, startTime2000: TTime2000, channelList: Array<IChannelHours>} {
    const date = getDate(buffer);
    const {hour, hours} = getHours(buffer);
    const channels = getChannels(buffer);
    const channelList: Array<IChannelHours> = [];

    date.setUTCHours(hour);

    channels.forEach(channelIndex => {
        const diff: Array<number> = [];

        // decode hour value for channel
        const value = getExtendedValue(buffer);

        // start from first diff hour
        for ( let diffHour = 1; diffHour < hours; ++diffHour ) {
            diff.push(getExtendedValue(buffer));
        }

        channelList.push({
            value: isArchiveValue && value === archive.EMPTY_VALUE ? 0 : value,
            diff,
            index: channelIndex
        });
    });

    return {startTime2000: getTime2000FromDate(date), hours, channelList};
};


export const setChannelsValuesWithHourDiff = function (
    buffer: IBinaryBuffer,
    hours: number,
    startTime2000: TTime2000,
    channelList: Array<IChannelHours>,
    isArchiveValue = false
) {
    const date = getDateFromTime2000(startTime2000);
    const hour = date.getUTCHours();

    setDate(buffer, date);
    setHours(buffer, hour, hours);
    setChannels(buffer, channelList);

    channelList.forEach(({value, diff}) => {
        setExtendedValue(buffer, isArchiveValue && value === 0 ? archive.EMPTY_VALUE : value);
        diff.forEach(diffValue => setExtendedValue(buffer, diffValue));
    });
};


/**
 * Retrieve start hour and number of hours from byte array.
 *
 * @example
 * 0xb8 = 0b10111000 will be {hours: 0b101, hour: 0b11000} i.e. {hours: 6, hour: 24}
 */
export const getHours = function ( buffer: IBinaryBuffer, byte = buffer.getUint8() ): {hour: number, hours: number} {
    if ( byte === 0 ) {
        return {hours: 0, hour: 0};
    }

    // real/human hours number = 1 (hour counter value) + each hour diff
    const hours = ((byte & 0xe0) >> 5) + 1;
    const hour = byte & 0x1f;

    return {hours, hour};
};


export const setHours = function ( buffer: IBinaryBuffer, hour: number, hours: number ) {
    if ( hour === 0 && hours === 0 ) {
        buffer.setUint8(0);

        return;
    }

    // convert real/human to binary - only number of diff hours
    buffer.setUint8((((hours - 1) & 0x07) << 5) | (hour & 0x1f));
};


/**
 * Retrieve device time from byte array.
 *
 * @example
 * ['00101111', '10010111'] -> [47, 151] will be '2023-12-23'
 *
 * @returns Date object instance
 */
export const getDate = function (buffer: IBinaryBuffer): Date {
    const yearMonthByte = buffer.getUint8();
    const monthDateByte = buffer.getUint8();

    const year = yearMonthByte >> YEAR_START_INDEX;
    const month = ((yearMonthByte & 0x01) << MONTH_BIT_SIZE - YEAR_START_INDEX) | (monthDateByte >> DATE_BIT_SIZE);
    const monthDay = monthDateByte & 0x1f;

    return new Date(Date.UTC(year + INITIAL_YEAR, month - 1, monthDay, 0, 0, 0, 0));
};


/**
 * Convert date or seconds to bytes.
 * '2023-12-23' will be 0010111-1100-10111, so bytes: ['00101111', '10010111'] -> [47, 151]
 */
export const setDate = function ( buffer: IBinaryBuffer, dateOrTime: Date | TTime2000 ) {
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

    [yearMonthByte, monthDateByte].forEach(byte => buffer.setUint8(byte));
};


export const getPulseCoefficient = function ( buffer: IBinaryBuffer ): TPulseCoefficient {
    const pulseCoefficient = buffer.getUint8();

    if ( isMSBSet(pulseCoefficient) ) {
        const value = byteToPulseCoefficientMap[pulseCoefficient];

        if ( value ) {
            return value;
        }

        throw new Error('pulseCoefficient MSB is set, but value unknown');
    }

    return pulseCoefficient;
};


export const setPulseCoefficient = function ( buffer: IBinaryBuffer, value: TPulseCoefficient ) {
    if ( value in pulseCoefficientToByteMap ) {
        const byte = pulseCoefficientToByteMap[value] as types.TUint8;

        if ( byte ) {
            buffer.setUint8(byte);
        } else {
            throw new Error('pulseCoefficient MSB is set, but value unknown');
        }
    } else {
        buffer.setUint8(value);
    }
};


export const getChannelsWithAbsoluteValues = function ( buffer: IBinaryBuffer ): Array<IChannelAbsoluteValue> {
    const channels = getChannels(buffer);
    const channelList: Array<IChannelAbsoluteValue> = [];

    channels.forEach(channelIndex => {
        channelList.push({
            pulseCoefficient: getPulseCoefficient(buffer),
            // day value
            value: getExtendedValue(buffer),
            index: channelIndex
        });
    });

    return channelList;
};


export const setChannelsWithAbsoluteValues = function ( buffer: IBinaryBuffer, channelList: Array<IChannelAbsoluteValue> ) {
    setChannels(buffer, channelList);

    channelList.forEach(({value, pulseCoefficient}) => {
        setPulseCoefficient(buffer, pulseCoefficient);
        setExtendedValue(buffer, value);
    });
};


export const getChannelsAbsoluteValuesWithHourDiff = function ( buffer: IBinaryBuffer, hours: number ): Array<IChannelHourAbsoluteValue> {
    const channels = getChannels(buffer);
    const channelList: Array<IChannelHourAbsoluteValue> = [];

    channels.forEach(channelIndex => {
        const pulseCoefficient = getPulseCoefficient(buffer);
        const value = getExtendedValue(buffer);
        const diff: Array<number> = [];

        for ( let hourIndex = 1; hourIndex < hours; ++hourIndex ) {
            diff.push(getExtendedValue(buffer));
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


export const setChannelsAbsoluteValuesWithHourDiff = function ( buffer: IBinaryBuffer, channelList: Array<IChannelHourAbsoluteValue> ) {
    setChannels(buffer, channelList);

    channelList.forEach(({value, diff, pulseCoefficient}) => {
        setPulseCoefficient(buffer, pulseCoefficient);
        setExtendedValue(buffer, value);
        diff.forEach(diffValue => setExtendedValue(buffer, diffValue));
    });
};


export const getEventStatus = function ( buffer: IBinaryBuffer, hardwareType: number ): TEventStatus {
    let status: TEventStatus;

    if ( GAS_HARDWARE_TYPES.indexOf(hardwareType) !== -1 ) {
        status = bitSet.toObject(gasBitMask, buffer.getUint8());
    } else if ( TWO_CHANNELS_HARDWARE_TYPES.indexOf(hardwareType) !== -1 ) {
        status = bitSet.toObject(twoChannelBitMask, buffer.getUint8());
    } else if ( ELIMP_HARDWARE_TYPES.indexOf(hardwareType) !== -1 ) {
        status = bitSet.toObject(elimpBitMask, buffer.getUint8());
    } else if ( FOUR_CHANNELS_HARDWARE_TYPES.indexOf(hardwareType) !== -1 ) {
        status = bitSet.toObject(fourChannelBitMask, buffer.getUint16(true));
    } else if ( MTX_HARDWARE_TYPES.indexOf(hardwareType) !== -1 ) {
        status = bitSet.toObject(mtxBitMask, buffer.getUint16(true));
    } else if ( hardwareType === hardwareTypes.US_WATER ) {
        // ultrasound water meter
        const event = bitSet.toObject(usWaterMeterEventBitMask, buffer.getUint8()) as unknown as IUSWaterMeterEvent;
        status = {event, error: buffer.getUint8()};
    } else {
        throw new Error('wrong hardwareType');
    }

    return status;
};


export const setEventStatus = function ( buffer: IBinaryBuffer, hardwareType: number, status: TEventStatus ) {
    if ( GAS_HARDWARE_TYPES.indexOf(hardwareType) !== -1 ) {
        buffer.setUint8(bitSet.fromObject(gasBitMask, status as bitSet.TBooleanObject));
    } else if ( TWO_CHANNELS_HARDWARE_TYPES.indexOf(hardwareType) !== -1 ) {
        buffer.setUint8(bitSet.fromObject(twoChannelBitMask, status as bitSet.TBooleanObject));
    } else if ( ELIMP_HARDWARE_TYPES.indexOf(hardwareType) !== -1 ) {
        buffer.setUint8(bitSet.fromObject(elimpBitMask, status as bitSet.TBooleanObject));
    } else if ( FOUR_CHANNELS_HARDWARE_TYPES.indexOf(hardwareType) !== -1 ) {
        buffer.setUint16(
            bitSet.fromObject(fourChannelBitMask, status as bitSet.TBooleanObject) | (1 << 7),
            true
        );
    } else if ( MTX_HARDWARE_TYPES.indexOf(hardwareType) !== -1 ) {
        buffer.setUint16(
            bitSet.fromObject(mtxBitMask, status as bitSet.TBooleanObject),
            true
        );
    } else if ( hardwareType === hardwareTypes.US_WATER ) {
        const data = status as IEventUSWaterMeterStatus;
        buffer.setUint8(bitSet.fromObject(usWaterMeterEventBitMask, data.event as unknown as bitSet.TBooleanObject));
        buffer.setUint8(data.error);
    } else {
        throw new Error('wrong hardwareType');
    }
};


export const getParameter = function ( buffer: IBinaryBuffer ): IParameter {
    const id = buffer.getUint8();
    const name = deviceParameterNames[id];

    if ( !deviceParameterConvertersMap[id] || !deviceParameterConvertersMap[id].get ) {
        throw new Error(`parameter ${id} is not supported`);
    }

    const data = deviceParameterConvertersMap[id].get(buffer);

    return {id, name, data};
};

export const setParameter = function ( buffer: IBinaryBuffer, parameter: IParameter ): void {
    const {id, data} = parameter;

    if ( !deviceParameterConvertersMap[id] || !deviceParameterConvertersMap[id].set ) {
        throw new Error(`parameter ${id} is not supported`);
    }

    buffer.setUint8(id);
    deviceParameterConvertersMap[id].set(buffer, data);
};


export const getRequestParameter = function ( buffer: IBinaryBuffer ): IRequestParameter {
    const id = buffer.getUint8();
    const name = deviceParameterNames[id];
    let data = null;

    switch ( id ) {
        case deviceParameters.ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL:
        case deviceParameters.ABSOLUTE_DATA_MULTI_CHANNEL:
        case deviceParameters.CHANNEL_TYPE:
            data = {channel: getChannelValue(buffer)};
            break;

        case deviceParameters.REPORTING_DATA_CONFIG:
            data = {dataType: buffer.getUint8()};
            break;

        case deviceParameters.EVENTS_CONFIG:
            data = {eventId: buffer.getUint8()};
            break;

        default:
            break;
    }

    return {id, name, data};
};


export const setRequestParameter = function ( buffer: IBinaryBuffer, parameter: IRequestParameter ): void {
    const {id, data: parameterData} = parameter;
    let data;

    buffer.setUint8(id);

    switch ( id ) {
        case deviceParameters.ABSOLUTE_DATA_MULTI_CHANNEL:
        case deviceParameters.ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL:
        case deviceParameters.CHANNEL_TYPE:
            data = parameterData as IRequestChannelParameter;
            setChannelValue(buffer, data.channel);
            break;

        case deviceParameters.REPORTING_DATA_CONFIG:
            data = parameterData as IRequestDataTypeParameter;
            buffer.setUint8(data.dataType);
            break;

        case deviceParameters.EVENTS_CONFIG:
            data = parameterData as IRequestEventIdParameter;
            buffer.setUint8(data.eventId);
            break;

        default:
            break;
    }
};


export const getResponseParameter = function ( buffer: IBinaryBuffer ): IResponseParameter {
    const id = buffer.getUint8();
    const name = deviceParameterNames[id];
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
            data = deviceParameterConvertersMap[id].get(buffer);
    }

    return {id, name, data};
};


export const setResponseParameter = function ( buffer: IBinaryBuffer, parameter: IParameter ) {
    const {id, data} = parameter;

    if ( !deviceParameterConvertersMap[id] || !deviceParameterConvertersMap[id].set ) {
        throw new Error(`parameter ${id} is not supported`);
    }

    buffer.setUint8(id);

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
            deviceParameterConvertersMap[id].set(buffer, data);
    }
};


export const getLegacyHourDiff = function ( buffer: IBinaryBuffer ): ILegacyCounter {
    const stateWithValueByte = buffer.getUint8();
    const valueLowerByte = buffer.getUint8();

    return {
        isMagneticInfluence: getMagneticInfluenceBit(stateWithValueByte),
        value: ((stateWithValueByte & 0x1f) << 8) | valueLowerByte
    };
};


export const setLegacyHourDiff = function ( buffer: IBinaryBuffer, diff: ILegacyCounter ): void {
    const bytes = [diff.value >> 8, diff.value & 0xff];

    bytes[0] = setMagneticInfluenceBit(bytes[0], diff.isMagneticInfluence);

    bytes.forEach(byte => buffer.setUint8(byte));
};


export const getLegacyHourCounterWithDiff = function ( buffer: IBinaryBuffer, isArchiveValue = false ): ILegacyHourCounterWithDiff {
    const date = getDate(buffer);
    const byte = buffer.getUint8();
    const {hour} = getHours(buffer, byte);
    const value = getLegacyCounterValue(buffer);
    const counter = {
        isMagneticInfluence: getMagneticInfluenceBit(byte),
        value: isArchiveValue && value === archive.EMPTY_VALUE ? 0 : value
    };
    const diff = [];

    while ( buffer.offset < buffer.data.length ) {
        diff.push(getLegacyHourDiff(buffer));
    }

    date.setUTCHours(hour);

    return {startTime2000: getTime2000FromDate(date), counter, diff};
};


export const setLegacyHourCounterWithDiff = function ( buffer: IBinaryBuffer, hourCounter: ILegacyHourCounterWithDiff, isArchiveValue = false ): void {
    const date = getDateFromTime2000(hourCounter.startTime2000);
    const hour = date.getUTCHours();
    const {value} = hourCounter.counter;

    setDate(buffer, date);
    // force hours to 0
    setHours(buffer, hour, 1);

    // reset byte with isMagneticInfluence bit
    buffer.seek(buffer.offset - 1);
    const byte = buffer.getUint8();
    buffer.seek(buffer.offset - 1);
    buffer.setUint8(setMagneticInfluenceBit(byte, hourCounter.counter.isMagneticInfluence));

    setLegacyCounterValue(buffer, isArchiveValue && value === 0 ? archive.EMPTY_VALUE : value);
    hourCounter.diff.forEach(diffItem => setLegacyHourDiff(buffer, diffItem));
};


export const getChannelsValuesWithHourDiffExtended = function ( buffer: IBinaryBuffer, isArchiveValue = false ): IChannelValuesWithHourDiffExtended {
    const date = getDate(buffer);
    const hour = buffer.getUint8();
    const hours = buffer.getUint8();
    const channels = getChannels(buffer);
    const channelList: Array<IChannelHours> = [];

    date.setUTCHours(hour);

    channels.forEach(channelIndex => {
        const diff: Array<number> = [];

        // decode hour value for channel
        const value = getExtendedValue(buffer);

        // start from first diff hour
        for ( let diffHour = 0; diffHour < hours; ++diffHour ) {
            diff.push(getExtendedValue(buffer));
        }

        channelList.push({
            value: isArchiveValue && value === archive.EMPTY_VALUE ? 0 : value,
            diff,
            index: channelIndex
        });
    });

    return {startTime2000: getTime2000FromDate(date), hour, hours, channelList};
};


export const setChannelsValuesWithHourDiffExtended = function ( buffer: IBinaryBuffer, parameters: IChannelValuesWithHourDiffExtended, isArchiveValue = false ): void {
    const date = getDateFromTime2000(parameters.startTime2000);

    setDate(buffer, date);
    buffer.setUint8(parameters.hour);
    buffer.setUint8(parameters.hours);
    setChannels(buffer, parameters.channelList);

    parameters.channelList.forEach(({value, diff}) => {
        setExtendedValue(buffer, isArchiveValue && value === 0 ? archive.EMPTY_VALUE : value);
        diff.forEach(diffValue => setExtendedValue(buffer, diffValue));
    });
};


export const getDataSegment = function ( buffer: IBinaryBuffer ): IDataSegment {
    const segmentationSessionId = buffer.getUint8();
    const flag = buffer.getUint8();

    return {
        segmentationSessionId,
        segmentIndex: extractBits(flag, 3, 1),
        segmentsNumber: extractBits(flag, 3, 5),
        isLast: Boolean(extractBits(flag, 1, 8)),
        data: buffer.getBytesLeft()
    };
};


export const setDataSegment = function ( buffer: IBinaryBuffer, parameters: IDataSegment ) {
    let flag = fillBits(0, 3, 1, parameters.segmentIndex);
    flag = fillBits(flag, 3, 5, parameters.segmentsNumber);
    flag = fillBits(flag, 1, 8, +parameters.isLast);

    buffer.setUint8(parameters.segmentationSessionId);
    buffer.setUint8(flag);
    buffer.setBytes(parameters.data);
};


export const getBinarySensor = function ( buffer: IBinaryBuffer ): IParameterBinarySensor {
    const activeStateTimeMs = buffer.getUint16();

    return {activeStateTimeMs};
};


export const setBinarySensor = function ( buffer: IBinaryBuffer, parameters: IParameterBinarySensor ) {
    buffer.setUint16(parameters.activeStateTimeMs);
};

export const getBinarySensorConfigurable = function ( buffer: IBinaryBuffer ): IParameterBinarySensorConfigurable {
    const type = buffer.getUint8();
    const activeStateTimeMs = buffer.getUint16();
    const halState = buffer.getUint8();

    return {type, activeStateTimeMs, halState};
};

export const setBinarySensorConfigurable = function ( buffer: IBinaryBuffer, parameters: IParameterBinarySensorConfigurable ) {
    buffer.setUint8(parameters.type);
    buffer.setUint16(parameters.activeStateTimeMs);
    buffer.setUint8(parameters.halState);
};


export const getTemperatureSensor = function ( buffer: IBinaryBuffer ): IParameterTemperatureSensor {
    const measurementPeriod = buffer.getUint16();
    const hysteresisSec = buffer.getUint8();
    const highTemperatureThreshold = buffer.getInt8();
    const lowTemperatureThreshold = buffer.getInt8();

    return {
        measurementPeriod,
        hysteresisSec,
        highTemperatureThreshold,
        lowTemperatureThreshold
    };
};

export const setTemperatureSensor = function ( buffer: IBinaryBuffer, parameters: IParameterTemperatureSensor ) {
    buffer.setUint16(parameters.measurementPeriod);
    buffer.setUint8(parameters.hysteresisSec);
    buffer.setInt8(parameters.highTemperatureThreshold);
    buffer.setInt8(parameters.lowTemperatureThreshold);
};


export const getChannelType = function ( buffer: IBinaryBuffer ): IParameterChannelType {
    const channel = getChannelValue(buffer);
    const type = buffer.getUint8();
    let parameters = {};

    switch ( type ) {
        case channelTypes.BINARY_SENSOR:
            parameters = getBinarySensor(buffer);
            break;

        case channelTypes.TEMPERATURE_SENSOR:
            parameters = getTemperatureSensor(buffer);
            break;

        case channelTypes.BINARY_SENSOR_CONFIGURABLE:
            parameters = getBinarySensorConfigurable(buffer);
            break;

        default:
            break;
    }

    return {
        channel,
        type,
        parameters
    };
};


export const setChannelType = function ( buffer: IBinaryBuffer, {type, channel, parameters}: IParameterChannelType ) {
    setChannelValue(buffer, channel);
    buffer.setUint8(type);

    switch ( type ) {
        case channelTypes.BINARY_SENSOR:
            setBinarySensor(buffer, parameters as IParameterBinarySensor);
            break;

        case channelTypes.TEMPERATURE_SENSOR:
            setTemperatureSensor(buffer, parameters as IParameterTemperatureSensor);
            break;

        case channelTypes.BINARY_SENSOR_CONFIGURABLE:
            setBinarySensorConfigurable(buffer, parameters as IParameterBinarySensorConfigurable);
            break;

        default:
            break;
    }
};


// export default CommandBinaryBuffer;
