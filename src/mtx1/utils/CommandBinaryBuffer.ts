/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import * as types from '../types.js';
import * as hashCrc16 from '../../utils/hashCrc16.js';
import {IBinaryBuffer} from '../../utils/BinaryBuffer.js';
import * as bitSet from '../../utils/bitSet.js';
import type {IDeviceType} from './deviceType.js';
import * as DeviceType from './deviceType.js';
import getHexFromBytes from '../../utils/getHexFromBytes.js';
import getBytesFromHex from '../../utils/getBytesFromHex.js';
import {IDateTime, ITimeCorrectionParameters} from './dateTime.js';
import * as screenIds from '../constants/screenIds.js';
import * as frameTypes from '../constants/frameTypes.js';
import frameNames from '../constants/frameNames.js';
import {baudRates, events, eventNames} from '../constants/index.js';
import * as demandTypes from '../constants/demandTypes.js';
import * as gsmAccessTypes from '../constants/gsmAccessTypes.js';
import * as gsmBlockTypes from '../constants/gsmBlockTypes.js';


export const frameHeaderSize = 5;

export interface IFrameHeader {
    /**
     * Frame type from the list of {@link frameTypes | available types}.
     */
    type: number,

    typeName?: string,

    /**
     * Source device address.
     *
     * @example
     * 0x238a
     */
    source: number,

    /**
     * Destination device address.
     *
     * @example
     * 0xffff
     */
    destination: number
}

/**
 * GSM module parameters
 */
export interface IGsmBlock {
    index: types.TUint8,
    data: types.TBytes
}

export interface IGsmConfiguration {
    blockVersion: types.TUint8,

    configurationId: types.TUint32,

    /**
     * possible value is one of {@link gsmAccessTypes}
     */
    gsmAccessTypes: types.TUint8,

    /**
     * GPRS access point
     */
    gprsAccessPoint: string,

    /**
     * GPRS user name
     */
    gprsUserName: string,

    /**
     * GPRS password
     */
    gprsPassword: string,

    /**
     * TCP server port for the main data channel.
     * The device listens on this port and accepts incoming connections
     * to receive commands / messages.
     */
    commandServerPort: types.TUint16;

    /**
     * TCP server port used for activity monitoring.
     * External systems can connect to this port to check whether
     * the device is online and responsive.
     */
    activityServerPort: types.TUint16;

    /**
     * period between activity pings in seconds
     */
    activityPingIntervalSec: types.TUint16;

    /**
     * Remote server IP address for activity pings.
     * The device acts as a TCP client and periodically
     * connects to the specified host.
     */
    activityPingIp: types.TIPv4;

    /**
     * Remote server TCP port for activity pings
     * Used together with {@link activityPingIp}.
     */
    activityPingPort: types.TUint16;
}

export interface IGsmStatusAttributesV11 {
    OPERATION_ERROR_PRESENT: boolean,
    USING_METER_CONFIGURATION: boolean,
    CONFIGURATION_DATA_SAVED: boolean,
    DEVICE_LONG_ADDRESS_SET: boolean,
    DEVICE_SHORT_ADDRESS_SET: boolean,
    CONFIGURATION_VALID: boolean,
    CONFIGURATION_SAVE_REQUIRED: boolean,
    CONFIGURATION_READY: boolean,
    READY_FOR_OPERATION: boolean
}

export interface IGsmStatusV11 {
    hardwareVersion: types.IVersion,
    softwareVersion: types.IVersion,
    uptime: types.TUint32,
    lastErrorStatus: types.TUint8,
    attributes: IGsmStatusAttributesV11,

    /**
     * number of allocated data blocks
     */
    allocatedDataBlockCount: types.TUint8;

    /**
     * number of allocated messages
     */
    allocatedMessageCount: types.TUint8;

    /**
     * IP address assigned to the modem by the GPRS network
     */
    ip: types.TIPv4;

    /**
     * GSM signal strength (RSSI)
     */
    rssi: types.TUint8;

    /**
     * GSM bit error rate (BER)
     */
    ber: types.TUint8;

    /**
     * maximum number of TCP requests
     */
    maxTcpRequestCount: types.TUint8;

    /**
     * maximum number of requests to the mtx device
     */
    maxMtxRequestCount: types.TUint8;

    /**
     * GSM module operational state
     */
    gsmState: types.TUint8;

    /**
     * TCP stack operational state
     */
    tcpState: types.TUint8;

    /**
     * MTX module operational state
     */
    mtxState: types.TUint8;
}

export interface IGsmStatusAttributesV12 {
    MESSAGE_SYSTEM_LOCKED: boolean,
    OPERATION_ERROR_PRESENT: boolean,
    SAVE_PARAMETERS_NOT_SUPPORTED: boolean,
    USING_METER_CONFIGURATION: boolean,
    CONFIGURATION_DATA_SAVED: boolean,
    DEVICE_LONG_ADDRESS_SET: boolean,
    DEVICE_SHORT_ADDRESS_SET: boolean,
    DEVICE_CONFIGURATION_RECEIVED: boolean,
    CONFIGURATION_SAVE_REQUIRED: boolean,
    CONFIGURATION_VALID: boolean,
    READY_FOR_OPERATION: boolean
}

export interface IGsmStatus12 {
    hardwareVersion: types.IVersion,
    softwareVersion: types.IVersion,
    uptime: types.TUint32,

    /**
     * number of allocated messages
     */
    allocatedMessageCount: types.TUint8;

    /**
     * number of allocated data blocks
     */
    allocatedDataBlockCount: types.TUint8;

    attributes: IGsmStatusAttributesV12,

    /**
     * IP address assigned to the modem by the GPRS network
     */
    ip: types.TIPv4;

    /**
     * GSM signal strength (RSSI)
     */
    rssi: types.TUint8;

    /**
     * GSM bit error rate (BER)
     */
    ber: types.TUint8;

    lastErrorStatus: types.TUint8,

    /**
     * MTX module operational state
     */
    mtxState: types.TUint8;

    /**
     * GSM module operational state
     */
    gsmState: types.TUint8;

    /**
     * TCP stack operational state
     */
    tcpState: types.TUint8;

    /**
     * maximum number of requests to the mtx device
     */
    maxMtxRequestCount: types.TUint8;

    mtxErrorCount: types.TUint8;

    /**
     * maximum number of TCP requests
     */
    maxTcpRequestCount: types.TUint16;

    tcpErrorCount: types.TUint16;
}

export type TGsmStatus =
    {version: 0x11, data: IGsmStatusV11} |
    {version: 0x12, data: IGsmStatus12};

/**
 * Day profiles, seasons and special days are grouped into a tariff plan.
 * It allows determining the current tariff based on the date and time.
 */
export interface ITariffPlan {
    /**
     * tariff plan identifier
     */
    id: types.TUint32,

    /**
     * indicates the state of this tariff plan
     * (`1` - tariff table is valid, `0` - not valid)
     */
    tariffSet: types.TUint8,

    /**
     * the year when this plan is activated
     */
    activateYear: types.TYear2000,

    /**
     * the month when this plan is activated
     */
    activateMonth: types.TMonth,

    /**
     * the day of month when this plan is activated
     */
    activateDay: types.TMonthDay,

    /**
     * the number of special days in the tariff table
     * (max `26`)
     */
    specialProfilesArraySize: types.TUint8,

    /**
     * the number of seasons in the tariff table
     * (max `14`)
     */
    seasonProfilesArraySize: types.TUint8,

    /**
     * the number of days in the tariff table
     * (max `32`)
     */
    dayProfilesArraySize: types.TUint8
}

/**
 * Flags to show/hide {@link screenIds | available screens}.
 */
export interface IDisplaySetBaseOperatorParameter {
    SET_ALL_SEGMENT_DISPLAY: boolean,
    SOFTWARE_VERSION: boolean,
    TOTAL_ACTIVE_ENERGY: boolean,
    ACTIVE_ENERGY_T1: boolean,
    ACTIVE_ENERGY_T2: boolean,
    ACTIVE_ENERGY_T3: boolean,
    ACTIVE_ENERGY_T4: boolean,
    ACTIVE_POWER_PER_PHASE: boolean,
    ACTIVE_POWER_IN_NEUTRAL: boolean,
    CURRENT_IN_PHASE: boolean,
    CURRENT_IN_NEUTRAL: boolean,
    VOLTAGE: boolean,
    HOUR_MINUTE_SECOND: boolean,
    DATE_MONTH_YEAR: boolean,
    TOTAL_EXPORTED_ACTIVE_ENERGY: boolean,
    EXPORTED_ACTIVE_ENERGY_T1: boolean,
    EXPORTED_ACTIVE_ENERGY_T2: boolean,
    EXPORTED_ACTIVE_ENERGY_T3: boolean,
    EXPORTED_ACTIVE_ENERGY_T4: boolean,
    POWER_FACTOR_PHASE_A: boolean,
    POWER_FACTOR_PHASE_B: boolean,
    BATTERY_VOLTAGE: boolean,
    POWER_THRESHOLD_T1: boolean,
    POWER_THRESHOLD_T2: boolean,
    POWER_THRESHOLD_T3: boolean,
    POWER_THRESHOLD_T4: boolean,
    CURRENT_BALANCE: boolean
}

export interface IDisplaySetOperatorParameter extends IDisplaySetBaseOperatorParameter {
    AUTO_SCREEN_SCROLLING: boolean
}

export interface IDisplaySetExtOperatorParameter extends IDisplaySetBaseOperatorParameter {
    MAGNET_INDUCTION: boolean,
    OPTOPORT_SPEED: boolean,
    SORT_DISPLAY_SCREENS: boolean
}

export interface IRelaySet1OperatorParameter {
    /**
     * Relay activation function (`true` - enabled, `false` - disabled).
     */
    RELAY_ON_Y: boolean,

    /**
     * Turn on by command from the center.
     */
    RELAY_ON_CENTER: boolean,

    /**
     * Turn on by button.
     */
    RELAY_ON_PB: boolean,

    /**
     * Turn on by tariff `T1`.
     */
    RELAY_ON_TARIFF_1: boolean,

    /**
     * Turn on by tariff `T2`.
     */
    RELAY_ON_TARIFF_2: boolean,

    /**
     * Turn on by tariff `T3`.
     */
    RELAY_ON_TARIFF_3: boolean,

    /**
     * Turn on by tariff `T4`.
     */
    RELAY_ON_TARIFF_4: boolean,

    /**
     * Turn on by restoration of good voltage.
     */
    RELAY_ON_V_GOOD: boolean
}

export interface IRelaySet2OperatorParameter {
    /**
     * Relay deactivation function (`true` - enabled, `false` - disabled).
     */
    RELAY_OFF_Y: boolean,

    /**
     * Turn off by command from the center.
     */
    RELAY_OFF_CENTER: boolean,

    /**
     * Turn off by tariff `T1`.
     */
    RELAY_OFF_TARIFF_1: boolean,

    /**
     * Turn off by tariff `T2`.
     */
    RELAY_OFF_TARIFF_2: boolean,

    /**
     * Turn off by tariff `T3`.
     */
    RELAY_OFF_TARIFF_3: boolean,

    /**
     * Turn off by tariff `T4`.
     */
    RELAY_OFF_TARIFF_4: boolean,

    /**
     * Turn off on load current exceeding.
     */
    RELAY_OFF_I_LIMIT: boolean,

    /**
     * Turn off on poor voltage.
     */
    RELAY_OFF_V_BAD: boolean
}

export interface IRelaySet3OperatorParameter {
    /**
     * Turn off on exceeding the power consumption limit for tariff `T1`.
     */
    RELAY_OFF_LIM_TARIFF_1: boolean,

    /**
     * Turn off on exceeding the power consumption limit for tariff `T2`.
     */
    RELAY_OFF_LIM_TARIFF_2: boolean,

    /**
     * Turn off on exceeding the power consumption limit for tariff `T3`.
     */
    RELAY_OFF_LIM_TARIFF_3: boolean,

    /**
     * Turn off on exceeding the power consumption limit for tariff `T4`.
     */
    RELAY_OFF_LIM_TARIFF_4: boolean,

    /**
     * Turn off on `cos φ`.
     */
    RELAY_OFF_PF_MIN: boolean
}

export interface IRelaySet4OperatorParameter {
    /**
     * Turn on after timeout {@link IOperatorParameters.timeoutRelayOn}
     */
    RELAY_ON_TIMEOUT: boolean,

    /**
     * Turn on based on saldo.
     */
    RELAY_ON_SALDO: boolean,

    /**
     * Turn off based on saldo.
     */
    RELAY_OFF_SALDO: boolean,

    /**
     * Turn off based on saldo with condition.
     */
    RELAY_OFF_SALDO_SOFT: boolean,

    /**
     * Turn off relay upon detection of a magnetic field.
     */
    RELAY_OFF_MAGNET: boolean,

    /**
     * Turn on after timeout {@link IOperatorParameters.timeoutRelayOn} (not used).
     */
    RELAY_ON_MAGNET_TIMEOUT: boolean,

    /**
     * Turn on relay after removal of the magnetic field.
     */
    RELAY_ON_MAGNET_AUTO: boolean
}

export interface IRelaySet5OperatorParameter {
    /**
     * Turn off relay upon detection of current inequality.
     */
    RELAY_OFF_UNEQUAL_CURRENT: boolean,

    /**
     * Turn on relay after turning off due to current inequality.
     */
    RELAY_ON_UNEQUAL_CURRENT: boolean,

    /**
     * Turn off relay upon detection of different-polarity powers in phase and neutral (only for `G` meter).
     */
    RELAY_OFF_BIPOLAR_POWER: boolean,

    /**
     * Turn on relay after deactivation due to different-polarity powers in phase and neutral (only for `G` meter)
     */
    RELAY_ON_BIPOLAR_POWER: boolean
}

export interface IDefine1OperatorParameter {
    /**
     * `true` - optoport is unlocked by button, `false` - optoport is unlocked (default is `false`).
     */
    BLOCK_KEY_OPTOPORT: boolean,

    /**
     * `true` - constant magnetic field screen (`104.21.017`)
     */
    MAGNET_SCREEN_CONST: boolean
}

export interface IOperatorParameters {
    /**
     * Maximum voltage threshold, mV.
     */
    vpThreshold: types.TUint32,

    /**
     * Minimum voltage threshold, mV.
     */
    vThreshold: types.TUint32,

    /**
     * Maximum current threshold, mA.
     */
    ipThreshold: types.TUint32,

    /**
     * Maximum power threshold for tariff `T1`, Watts.
     */
    pmaxThreshold0: types.TUint32,

    /**
     * Maximum power threshold for tariff `T2`, Watts.
     */
    pmaxThreshold1: types.TUint32,

    /**
     * Maximum power threshold for tariff `T3`, Watts.
     */
    pmaxThreshold2: types.TUint32,

    /**
     * Maximum power threshold for tariff `T4`, Watts.
     */
    pmaxThreshold3: types.TUint32,

    /**
     * Controls the data transmission speed for UART interfaces.
     */
    serialPortsSpeed: ISerialPortsSpeedOperatorParameter,

    /**
     * Power averaging interval, in minutes.
     */
    tint: types.TUint8,

    /**
     * Start date of the monthly billing period.
     */
    calcPeriodDate: types.TUint8,

    /**
     * Display active time.
     */
    timeoutDisplay: types.TUint8,

    /**
     * Display active time for each screen.
     */
    timeoutScreen: types.TUint8,

    /**
     * Display settings for meter readings.
     */
    displaySet: IDisplaySetOperatorParameter,

    /**
     * Relay settings.
     */
    relaySet4: IRelaySet4OperatorParameter,

    /**
     * Relay settings.
     */
    relaySet3: IRelaySet3OperatorParameter,

    /**
     * Relay settings.
     */
    relaySet2: IRelaySet2OperatorParameter,

    /**
     * Relay settings.
     */
    relaySet1: IRelaySet1OperatorParameter,

    /**
     * Display type on the remote display (`0` - `OBIS`, `1` - symbolic (not used)).
     */
    displayType: types.TUint8,

    /**
     * Integration period for energy profiles `A+`, `A-`, voltage VA `0`, `30` - `30` minutes, `15` - `15` minutes, `60` - `60` minutes.
     */
    ten: types.TUint8,

    /**
     * Voltage averaging interval.
     *
     * `0`, `1`, `3`, `5`, `10`, `15`, `30` minutes.
     *
     * since version `0.0.17`
     */
    voltageAveragingInterval: types.TUint8,

    /**
     * Allowed correction interval (`15` minutes by default).
     * `0` - correction is disabled.
     */
    deltaCorMin: types.TUint8,

    /**
     * Timeout for relay shutdown upon magnetic interference, seconds.
     */
    timeoutMagnetOff: types.TUint8,

    /**
     * Timeout for relay activation after magnetic field removal, seconds.
     */
    timeoutMagnetOn: types.TUint8,

    /**
     * Setting for optoport and constant magnetic field screen.
     */
    define1: IDefine1OperatorParameter,

    /**
     * Timeout for automatic relay activation based on `IMAX`, `PMAX`, `IDIFF`, `COSFI`, minutes.
     */
    timeoutRelayOn: types.TUint8,

    /**
     * Timeout for relay activation based on `IMAX`, `PMAX`, `IDIFF`, `COSFI`, seconds.
     */
    timeoutRelayKey: types.TUint8,

    /**
     * Timeout for relay activation upon restoration of quality voltage, seconds.
     */
    timeoutRelayAuto: types.TUint8,

    /**
     * Timeout for relay deactivation due to poor voltage, seconds.
     */
    timeoutBadVAVB: types.TUint8,

    /**
     * Maximum threshold for the frequency of the grid voltage.
     */
    freqMax: types.TUint8,

    /**
     * Minimum threshold for the frequency of the grid voltage.
     */
    freqMin: types.TUint8,

    /**
     * Minimum threshold for the `cos φ` value.
     */
    phMin: types.TUint16,

    /**
     * Year of parameters recording.
     */
    year: types.TUint8,

    /**
     * Month of parameters recording.
     */
    month: types.TUint8,

    /**
     * Date of parameters recording.
     */
    date: types.TUint8,

    /**
     * The number of digits after the decimal point for displaying energy values.
     * (`0x00` - no digits, `0x01` - `1` digit, `0x02` - `2` digits, `0x03` - `3` digits)
     */
    energyDecimalPoint: types.TUint8,

    /**
     * Measurement type.
     * (`0` - active `|A|+`, `1` - active `A+`, `A-`)
     */
    typeMeter: types.TUint8,

    /**
     * Timeout for relay deactivation based on maximum current.
     */
    timeoutIMax: types.TUint8,

    /**
     * Timeout for relay deactivation based on maximum power.
     */
    timeoutPMax: types.TUint8,

    /**
     * Timeout for relay deactivation based on `cos φ`.
     */
    timeoutCos: types.TUint8,

    /**
     * `0` - `PMAX` = `POWER_A`; `1` - `PMAX` averaged power over the integration period.
     */
    pMaxDef: types.TUint8,

    /**
     * Setting for displaying meter readings on additional displays (long press).
     */
    displaySetExt: IDisplaySetExtOperatorParameter,

    /**
     * Timeout for relay deactivation based on current inequality (`5`).
     */
    timeoutUneqCurrent: types.TUint8,

    /**
     * Timeout for relay deactivation upon detection of power with different polarities (`5`).
     */
    timeoutBipolarPower: types.TUint8,

    /**
     * Relay settings.
     */
    relaySet5: IRelaySet5OperatorParameter,

    /**
     * Allowed correction period, in hours (`24` hours by default, `0` - no limitations).
     */
    timeCorrectPeriod: types.TUint8,

    /**
     * Is the time correction with a transition across the half-hour boundary allowed.
     */
    timeCorrectPassHalfhour: boolean
}

export interface IDayProfile {
    /**
     * Period start hour.
     */
    hour: number,

    /**
     * Is it the first half of the hour (second - otherwise).
     */
    isFirstHalfHour: boolean,

    /**
     * Tariff number to apply for this period.
     */
    tariff: number
}

export interface ISeasonProfile {
    month: types.TMonth,

    date: types.TMonthDay,

    /**
     * List of day profile indexes.
     */
    dayIndexes: Array<types.TUint8>
}

export interface ISpecialDay {
    month: types.TMonth,

    date: types.TMonthDay,

    /**
     * Day profile index.
     */
    dayIndex: types.TUint8,

    /**
     * If year === 0, it affects all years, otherwise only the specified year.
     */
    year: types.TYear2000
}

export interface IDeviceId {
    /**
     * Device manufacturer (`001a79` at the moment)
     */
    manufacturer: string,

    /**
     * Device type.
     *
     * ID   | Name
     * -----|------
     * `01` | MTX 1
     * `02` | MTX 3 direct (old)
     * `03` | MTX 3 transformer (old)
     * `04` | MTX 3 direct
     * `05` | MTX 3 transformer
     * `11` | MTX 1 new (two shunts)
     * `12` | MTX 3 direct new (shunts)
     * `13` | MTX 3 transformer new
     * `14` | MTX 1 pole
     * `15` | MTX RD remote display
     * `16` | MTX RR repeater
     * `21` | MTX 1 new, current transformers
     * `22` | MTX 3 direct new, current transformers
     * `80` | RF module
     * `81` | water meter
     */
    type: number,

    /**
     * Device production year.
     *
     * @example
     * 24
     */
    year: types.TYear2000,

    /**
     * Device serial number.
     *
     * @example
     * '1b1d6a'
     */
    serial: string
}

export {IDeviceType};

export interface ISaldoParameters {
    /**
     * Saldo coefficients for tariffs `T1`-`T4`.
     */
    coefficients: Array<types.TUint32>,

    /**
     * Decimal point in the saldo coefficient for the tariff (default is `4`).
     */
    decimalPointTariff: types.TUint8,

    /**
     * Threshold at which the saldo is indicated.
     */
    indicationThreshold: types.TInt32,

    /**
     * Threshold at which relay turns off based on saldo.
     */
    relayThreshold: types.TInt32,

    /**
     * Definitions setting the operating mode based on saldo.
     */
    mode: types.TUint8,

    /**
     * Not to deactivate based on saldo after.
     */
    saldoOffTimeBegin: types.TUint8,

    /**
     * Not to deactivate based on saldo before.
     */
    saldoOffTimeEnd: types.TUint8,

    /**
     * Decimal point for saldo indication.
     */
    decimalPointIndication: types.TUint8,

    /**
     * Power limitation based on saldo.
     */
    powerThreshold: types.TUint32,

    /**
     * Saldo credit limit.
     */
    creditThreshold: types.TInt32
}

export interface IEnergyPeriod {
    /** one of four tariffs (`T1`-`T4`) */
    tariff?: types.TUint8,
    /** value for period */
    energy?: types.TUint16
}

/** active energy by tariffs `T1`-`T4` */
export type TEnergies = Array<types.TInt32 | null>;

export interface IPackedEnergiesWithType {
    energyType?: types.TEnergyType,

    energies: TEnergies
}

export interface IEventStatus {
    /**
     * The meter casing is open.
     */
    CASE_OPEN: boolean;

    /**
     * Electromagnetic influence detected.
     */
    MAGNETIC_ON: boolean;

    /**
     * Parameter setup remotely.
     */
    PARAMETERS_UPDATE_REMOTE: boolean;

    /**
     * Parameter setup locally.
     */
    PARAMETERS_UPDATE_LOCAL: boolean;

    /**
     * Meter program restart.
     */
    RESTART: boolean;

    /**
     * Incorrect password entered, device is locked.
     */
    ERROR_ACCESS: boolean;

    /**
     * Device time has been set.
     */
    TIME_SET: boolean;

    /**
     * Time correction.
     */
    TIME_CORRECT: boolean;

    /**
     * Meter failure.
     */
    DEVICE_FAILURE: boolean;

    /**
     * The meter terminal box is open.
     */
    CASE_TERMINAL_OPEN: boolean;

    /**
     * The meter module compartment is open.
     */
    CASE_MODULE_OPEN: boolean;

    /**
     * Tariff plan changed.
     */
    TARIFF_TABLE_SET: boolean;

    /**
     * New tariff plan received.
     */
    TARIFF_TABLE_GET: boolean;

    /**
     * Electromagnetic influence screen reset.
     *
     * since version `104.23.001` (`MTX1`), `302.37.001` (`MTX3`)
     */
    PROTECTION_RESET_EM: boolean;

    /**
     * Magnetic influence screen reset.
     *
     * since version `104.23.001` (`MTX1`), `302.37.001` (`MTX3`)
     */
    PROTECTION_RESET_MAGNETIC: boolean;
}

export interface IEvent {
    hours: types.TUint8,
    minutes: types.TUint8,
    seconds: types.TUint8,
    event: types.TUint8,
    eventName?: string,
    power?: Array<types.TUint8>,
    newDate?: IDateTime
}

export interface IExtendedCurrentValues2RelayStatus {
    /** Current relay state: 1 - on, 0 - off. */
    RELAY_STATE: boolean,
    /** Relay turned off due to poor voltage. */
    RELAY_UBAD: boolean,
    /** Relay switched off due to unequal currents. */
    RELAY_UNEQ_CURRENT: boolean,
    /** Relay switched off from the control center. */
    RELAY_OFF_CENTER: boolean,
    /** Relay turned off due to maximum current. */
    RELAY_IMAX: boolean,
    /** Relay turned off due to maximum power. */
    RELAY_PMAX: boolean
}

export interface IExtendedCurrentValues2RelayStatus2 {
    /** Relay turned off due to cos φ. */
    RELAY_COSFI: boolean,
    /** Relay turned off due to balance. */
    RELAY_SALDO_OFF_FLAG: boolean,
    /** Relay turned off due to current imbalance between phase and neutral. */
    RELAY_UNEQUAL_CURRENT_OFF: boolean,
    /** Relay turned off due to bidirectional power in phase and neutral. */
    RELAY_BIPOLAR_POWER_OFF: boolean,
    /** Relay turned off due to exceeding allowable power in net balance limit mode. */
    RELAY_SALDO_OFF_ON_MAX_POWER: boolean,
    /** Relay switched on manually by hardware. */
    RELAY_HARD_ST1: boolean,
    /** Relay turned off due to magnet interference. */
    RELAY_MAGNET_OFF: boolean,
    /** Relay turned off due to maximum negative power exceeded. */
    RELAY_P_MINUS_MAX_OFF: boolean
}

export interface IExtendedCurrentValues2Status1 {
    /** Voltage is above threshold. */
    MAXVA: boolean,
    /** Voltage is below threshold. */
    MINVA: boolean,
    /** Temperature is above threshold. */
    MAXT: boolean,
    /** Temperature is below threshold. */
    MINT: boolean,
    /** Frequency is above threshold. */
    MAXF: boolean,
    /** Frequency is below threshold. */
    MINF: boolean,
    /** Current is above threshold. */
    MAXIA: boolean,
    /** Power is above threshold. */
    MAXP: boolean
}

export interface IExtendedCurrentValues2Status2 {
    /** Power exceeded in credit mode. */
    MAX_POWER_SALDO: boolean,
    /** Low battery voltage. */
    BATTERY_VBAT_BAD: boolean,
    /** Clock not synchronized. */
    CLOCK_UNSET: boolean,
    /** cos φ below threshold. */
    MIN_COS_FI: boolean
}

export interface IExtendedCurrentValues2Status3 {
    /** Current imbalance. */
    UNEQUAL_CURRENT: boolean,
    /** Opposite power directions in phases A and B. */
    BIPOLAR_POWER: boolean,
    /** Negative power in phase A. */
    POWER_A_NEGATIVE: boolean,
    /** Negative power in phase B. */
    POWER_B_NEGATIVE: boolean
}

export interface IExtendedCurrentValues2Parameters {
    /** current battery voltage */
    uBattery: number,

    relayStatus: IExtendedCurrentValues2RelayStatus,
    relayStatus2: IExtendedCurrentValues2RelayStatus2,
    status1: IExtendedCurrentValues2Status1,
    status2: IExtendedCurrentValues2Status2,
    status3: IExtendedCurrentValues2Status3
}

export interface IGetDemandParameters {
    /**
     * Packed date.
     */
    date: types.IDate,

    /**
     * Possible value is one of {@link demandTypes}.
     */
    demandType: types.TUint8,

    /**
     * Starting block number of requested data.
     * Depends on the `ten` parameter in {@link IOperatorParameters}.
     *
     * Possible values:
     *
     * | Ten   | Value range |
     * | ----- | ----------- |
     * | `1`   | `0`..`1440` |
     * | `3`   | `0`..`480`  |
     * | `5`   | `0`..`288`  |
     * | `10`  | `0`..`144`  |
     * | `15`  | `0`..`96`   |
     * | `30`  | `0`..`48`   |
     * | `60`  | `0`..`24`   |
     */
    firstIndex: types.TUint16,

    /**
     * Number of requested blocks.
     * No more than `48` blocks in a single request.
     */
    count: types.TUint8,

    /**
     * Accumulation period.
     *
     * Can be `1`, `3`, `5`, `10`, `15`, `30`, `60` minutes.
     * Value `0` is also `30` minutes.
     */
    period: types.TUint8
}

export interface IGetDayMaxDemandResponseParameters {
    date: types.IDate,
    power: Array<{
        hours: types.TUint8,
        minutes: types.TUint8,
        power: types.TUint32
    }>
}

export interface IOperatorParametersExtended3RelaySet {
    /**
     * Turn off the relay upon exceeding the active maximum negative power threshold for tariff `T1`.
     */
    RELAY_OFF_LIMIT_P_MINUS_T1: boolean,

    /**
     * Turn off the relay upon exceeding the active maximum negative power threshold for tariff `T2`.
     */
    RELAY_OFF_LIMIT_P_MINUS_T2: boolean,

    /**
     * Turn off the relay upon exceeding the active maximum negative power threshold for tariff `T3`.
     */
    RELAY_OFF_LIMIT_P_MINUS_T3: boolean,

    /**
     * Turn off the relay upon exceeding the active maximum negative power threshold for tariff `T4`.
     */
    RELAY_OFF_LIMIT_P_MINUS_T4: boolean
}

export interface IOperatorParametersExtended3 {
    /**
     * Active maximum negative power threshold for tariff `T1`, Watts.
     */
    pmaxMinusThreshold0: types.TUint32,

    /**
     * Active maximum negative power threshold for tariff `T2`, Watts.
     */
    pmaxMinusThreshold1: types.TUint32,

    /**
     * Active maximum negative power threshold for tariff `T3`, Watts.
     */
    pmaxMinusThreshold2: types.TUint32,

    /**
     * Active maximum negative power threshold for tariff `T4`, Watts.
     */
    pmaxMinusThreshold3: types.TUint32,

    /**
     * Additional relay settings.
     */
    relaySet: IOperatorParametersExtended3RelaySet
}

export interface IMonthMaxPower {
    date: types.TMonthDay,
    hours: types.TUint8,
    minutes: types.TUint8,

    /**
     * max power value for a month
     */
    power: types.TUint32
}


export const defaultFrameHeader: IFrameHeader = {
    type: frameTypes.DATA_REQUEST,
    destination: 0xffff,
    source: 0xfffe
};

export interface IGetHalfHourDemandResponseParameters {
    date: types.IDate,
    periods: Array<IEnergyPeriod>,
    /** if DST start/end of this day, contain DST hour */
    dstHour?: types.TUint8
}

export interface IGetDemandParametersResponseParameters {
    /**
     * | Value | Hex    | Description                                                |
     * | ----- | ------ | ---------------------------------------------------------- |
     * | `0`   | `0x00` | voltage profile disabled                                   |
     * | `64`  | `0x40` | `10`-minute phase voltage profile (archive depth `7` days) |
     */
    channelParam1: types.TUint8,

    /**
     * time interval for counting power-off events, minutes
     */
    powerOffTrackingInterval: types.TUint8,

    /**
     * | Value | Hex    | Description                                                                                      |
     * | ----- | ------ | ------------------------------------------------------------------------------------------------ |
     * | `0`   | `0x00` | voltage profile disabled                                                                         |
     * | `160` | `0xa0` | `15/30/60`-minute phase voltage profile, determined by parameter `ten` (archive depth `1` month) |
     */
    channelParam2: types.TUint8,
}

export const GSM_BLOCK_PREFIX = 0xda;
export const GSM_BLOCK_SIZE = 60;
export const GSM_VALID_BLOCK_NUMBER = gsmBlockTypes.STATUS + 1;
export const GSM_CONFIGURATION_PREFIX = 0xae;
export const TARIFF_PLAN_SIZE = 11;
export const OPERATOR_PARAMETERS_SIZE = 74;
export const SEASON_PROFILE_DAYS_NUMBER = 7;
export const SEASON_PROFILE_SIZE = 2 + SEASON_PROFILE_DAYS_NUMBER;
export const TARIFF_NUMBER = 4;
export const PACKED_ENERGY_TYPE_SIZE = 1;
export const ENERGY_SIZE = 4;
export const DATE_SIZE = 3;
export const MIN_HALF_HOUR_PERIODS = 48;
export const MAX_HALF_HOUR_PERIODS = 50;
export const MIN_HALF_HOUR_COMMAND_SIZE = 3 + (MIN_HALF_HOUR_PERIODS * 2);
export const MAX_HALF_HOUR_COMMAND_SIZE = 4 + (MAX_HALF_HOUR_PERIODS * 2);


const baseDisplaySetMask = {
    SET_ALL_SEGMENT_DISPLAY: 0x0001,
    SOFTWARE_VERSION: 0x0002,
    TOTAL_ACTIVE_ENERGY: 0x0004,
    ACTIVE_ENERGY_T1: 0x0008,
    ACTIVE_ENERGY_T2: 0x0010,
    ACTIVE_ENERGY_T3: 0x0020,
    ACTIVE_ENERGY_T4: 0x0040,
    ACTIVE_POWER_PER_PHASE: 0x0080,
    ACTIVE_POWER_IN_NEUTRAL: 0x0100,
    CURRENT_IN_PHASE: 0x0200,
    CURRENT_IN_NEUTRAL: 0x0400,
    VOLTAGE: 0x0800,
    HOUR_MINUTE_SECOND: 0x1000,
    DATE_MONTH_YEAR: 0x2000,
    TOTAL_EXPORTED_ACTIVE_ENERGY: 0x4000,
    EXPORTED_ACTIVE_ENERGY_T1: 0x8000,
    EXPORTED_ACTIVE_ENERGY_T2: 0x00010000,
    EXPORTED_ACTIVE_ENERGY_T3: 0x00020000,
    EXPORTED_ACTIVE_ENERGY_T4: 0x00040000,
    POWER_FACTOR_PHASE_A: 0x00080000,
    POWER_FACTOR_PHASE_B: 0x00100000,
    BATTERY_VOLTAGE: 0x00200000,
    POWER_THRESHOLD_T1: 0x00400000,
    POWER_THRESHOLD_T2: 0x00800000,
    POWER_THRESHOLD_T3: 0x01000000,
    POWER_THRESHOLD_T4: 0x02000000,
    CURRENT_BALANCE: 0x20000000
};

const displaySetMask = {
    ...baseDisplaySetMask,
    AUTO_SCREEN_SCROLLING: 0x80000000
};

const displaySetExtMask = {
    ...baseDisplaySetMask,
    MAGNET_INDUCTION: 0x08000000,
    OPTOPORT_SPEED: 0x40000000,
    SORT_DISPLAY_SCREENS: 0x80000000
};

const gsmAttributeV11Mask = {
    OPERATION_ERROR_PRESENT: 0x0001,
    USING_METER_CONFIGURATION: 0x0002,
    CONFIGURATION_DATA_SAVED: 0x0004,
    DEVICE_LONG_ADDRESS_SET: 0x0008,
    DEVICE_SHORT_ADDRESS_SET: 0x0010,
    CONFIGURATION_VALID: 0x0020,
    CONFIGURATION_SAVE_REQUIRED: 0x0040,
    CONFIGURATION_READY: 0x0080,
    READY_FOR_OPERATION: 0x0100
};

const gsmAttributeV12Mask = {
    MESSAGE_SYSTEM_LOCKED: 0x0001,
    OPERATION_ERROR_PRESENT: 0x0002,
    SAVE_PARAMETERS_NOT_SUPPORTED: 0x0004,
    USING_METER_CONFIGURATION: 0x0008,
    CONFIGURATION_DATA_SAVED: 0x0010,
    DEVICE_LONG_ADDRESS_SET: 0x0020,
    DEVICE_SHORT_ADDRESS_SET: 0x0040,
    DEVICE_CONFIGURATION_RECEIVED: 0x0080,
    CONFIGURATION_SAVE_REQUIRED: 0x0100,
    CONFIGURATION_VALID: 0x0200,
    READY_FOR_OPERATION: 0x0400
};

const relaySet1Mask = {
    RELAY_ON_Y: 0x01,
    RELAY_ON_CENTER: 0x02,
    RELAY_ON_PB: 0x04,
    RELAY_ON_TARIFF_1: 0x08,
    RELAY_ON_TARIFF_2: 0x10,
    RELAY_ON_TARIFF_3: 0x20,
    RELAY_ON_TARIFF_4: 0x40,
    RELAY_ON_V_GOOD: 0x80
};

const relaySet2Mask = {
    RELAY_OFF_Y: 0x01,
    RELAY_OFF_CENTER: 0x02,
    RELAY_OFF_TARIFF_1: 0x04,
    RELAY_OFF_TARIFF_2: 0x08,
    RELAY_OFF_TARIFF_3: 0x10,
    RELAY_OFF_TARIFF_4: 0x20,
    RELAY_OFF_I_LIMIT: 0x40,
    RELAY_OFF_V_BAD: 0x80
};

const relaySet3Mask = {
    RELAY_OFF_LIM_TARIFF_1: 0x02,
    RELAY_OFF_LIM_TARIFF_2: 0x04,
    RELAY_OFF_LIM_TARIFF_3: 0x08,
    RELAY_OFF_LIM_TARIFF_4: 0x10,
    RELAY_OFF_PF_MIN: 0x20
};

const relaySet4Mask = {
    RELAY_ON_TIMEOUT: 0x01,
    RELAY_ON_SALDO: 0x02,
    RELAY_OFF_SALDO: 0x04,
    RELAY_OFF_SALDO_SOFT: 0x08,
    RELAY_OFF_MAGNET: 0x10,
    RELAY_ON_MAGNET_TIMEOUT: 0x20,
    RELAY_ON_MAGNET_AUTO: 0x40
};

const relaySet5Mask = {
    RELAY_OFF_UNEQUAL_CURRENT: 0x01,
    RELAY_ON_UNEQUAL_CURRENT: 0x02,
    RELAY_OFF_BIPOLAR_POWER: 0x04,
    RELAY_ON_BIPOLAR_POWER: 0x08
};

const define1Mask = {
    BLOCK_KEY_OPTOPORT: 0x02,
    MAGNET_SCREEN_CONST: 0x20
};

export const eventStatusMask = {
    CASE_OPEN: 2 ** 0,
    MAGNETIC_ON: 2 ** 1,
    PARAMETERS_UPDATE_REMOTE: 2 ** 2,
    PARAMETERS_UPDATE_LOCAL: 2 ** 3,
    RESTART: 2 ** 4,
    ERROR_ACCESS: 2 ** 5,
    TIME_SET: 2 ** 6,
    TIME_CORRECT: 2 ** 7,
    DEVICE_FAILURE: 2 ** 8,
    CASE_TERMINAL_OPEN: 2 ** 9,
    CASE_MODULE_OPEN: 2 ** 10,
    TARIFF_TABLE_SET: 2 ** 11,
    TARIFF_TABLE_GET: 2 ** 12,
    PROTECTION_RESET_EM: 2 ** 13,
    PROTECTION_RESET_MAGNETIC: 2 ** 14
};


export const extendedCurrentValues2RelayStatusMask = {
    RELAY_STATE: 2 ** 0,
    RELAY_UBAD: 2 ** 1,
    RELAY_UNEQ_CURRENT: 2 ** 4,
    RELAY_OFF_CENTER: 2 ** 5,
    RELAY_IMAX: 2 ** 6,
    RELAY_PMAX: 2 ** 7
};

const extendedCurrentValues2RelayStatus2Mask = {
    RELAY_COSFI: 2 ** 0,
    RELAY_SALDO_OFF_FLAG: 2 ** 1,
    RELAY_UNEQUAL_CURRENT_OFF: 2 ** 2,
    RELAY_BIPOLAR_POWER_OFF: 2 ** 3,
    RELAY_SALDO_OFF_ON_MAX_POWER: 2 ** 4,
    RELAY_HARD_ST1: 2 ** 5,
    RELAY_MAGNET_OFF: 2 ** 6,
    RELAY_P_MINUS_MAX_OFF: 2 ** 7
};

const extendedCurrentValues2Status1Mask = {
    MAXVA: 2 ** 0,
    MINVA: 2 ** 1,
    MAXT: 2 ** 2,
    MINT: 2 ** 3,
    MAXF: 2 ** 4,
    MINF: 2 ** 5,
    MAXIA: 2 ** 6,
    MAXP: 2 ** 7
};

const extendedCurrentValues2Status2Mask = {
    MAX_POWER_SALDO: 2 ** 0,
    BATTERY_VBAT_BAD: 2 ** 1,
    CLOCK_UNSET: 2 ** 3,
    MIN_COS_FI: 2 ** 5
};

const extendedCurrentValues2Status3Mask = {
    UNEQUAL_CURRENT: 2 ** 0,
    BIPOLAR_POWER: 2 ** 1,
    POWER_A_NEGATIVE: 2 ** 6,
    POWER_B_NEGATIVE: 2 ** 7
};

const operatorParametersExtended3RelaySetMask = {
    RELAY_OFF_LIMIT_P_MINUS_T1: 0x08,
    RELAY_OFF_LIMIT_P_MINUS_T2: 0x10,
    RELAY_OFF_LIMIT_P_MINUS_T3: 0x20,
    RELAY_OFF_LIMIT_P_MINUS_T4: 0x40
};

const getSerialPortsSpeed = ( value: number ): ISerialPortsSpeedOperatorParameter => ({
    rs485orTwi: baudRates.valueToRate.rs485orTwi[bitSet.extractBits(value, 4, 1)],
    optoport: baudRates.valueToRate.optoport[bitSet.extractBits(value, 4, 5)]
});

const setSerialPortsSpeed = ( serialPortsSpeed: ISerialPortsSpeedOperatorParameter ): number => {
    let result = 0;

    result = bitSet.fillBits(result, 4, 1, Number(baudRates.rateToValue.rs485orTwi[serialPortsSpeed.rs485orTwi]));
    result = bitSet.fillBits(result, 4, 5, Number(baudRates.rateToValue.optoport[serialPortsSpeed.optoport]));

    return result;
};

function getPackedEnergies ( buffer: IBinaryBuffer, energyType: types.TEnergyType, tariffMapByte: number ): TEnergies {
    const byte = tariffMapByte >> TARIFF_NUMBER;
    const energies = new Array(TARIFF_NUMBER).fill(0) as TEnergies;

    energies.forEach((energy, index) => {
        // read flags by one bit
        const isTariffExists = !!bitSet.extractBits(byte, 1, index + 1);

        if ( isTariffExists ) {
            energies[index] = buffer.getInt32();
        } else {
            energies[index] = null;
        }
    });

    return energies;
}

function setPackedEnergyType ( buffer: IBinaryBuffer, energyType: types.TEnergyType, energies: TEnergies ) {
    const indexShift = 1 + TARIFF_NUMBER;
    let tariffsByte = energyType;

    energies.forEach((energy, index) => {
        // set flags by one bit
        tariffsByte = bitSet.fillBits(tariffsByte, 1, index + indexShift, Number(!!energy));
    });

    buffer.setUint8(tariffsByte);
}

function getEnergyPeriod ( period: number ): IEnergyPeriod {
    if ( period === 0xffff ) {
        return {
            tariff: undefined,
            energy: undefined
        };
    }

    return {
        tariff: ((period >> 14) & 0x03),
        energy: (period & 0x3fff)
    };
}

function setEnergyPeriod ( buffer: IBinaryBuffer, {tariff, energy}: IEnergyPeriod ) {
    if ( tariff !== undefined && energy !== undefined ) {
        buffer.setUint16((tariff << 14) | (energy & 0x3fff));
    } else {
        buffer.setUint16(0xffff);
    }
}

/* export interface ICommandBinaryBuffer extends IBinaryBuffer {
    // static methods
    // getDayProfileFromByte ( value: number ): IDayProfile,
    // getByteFromDayProfile ( dayProfile: IDayProfile ): number,

    // getDefaultSeasonProfile (): ISeasonProfile,

    // getDefaultOperatorParameters (): IOperatorParameters,

    // getDefaultOperatorParametersExtended3 (): IOperatorParametersExtended3,

    // instance methods
    // getFrameHeader (): IFrameHeader,
    // setFrameHeader ( frameHeader: IFrameHeader ),

    // getDeviceId (): IDeviceId,
    // setDeviceId ( {manufacturer, type, year, serial}: IDeviceId ),

    // getDateTime (): IDateTime,
    // setDateTime ( dateTime: IDateTime ),

    // getTariffPlan(): ITariffPlan,
    // setTariffPlan ( tariffPlan: ITariffPlan ),

    // getTimeCorrectionParameters (): ITimeCorrectionParameters,
    // setTimeCorrectionParameters ( parameters: ITimeCorrectionParameters ),

    // getDayProfile (): IDayProfile,
    // setDayProfile ( dayProfile: IDayProfile ),

    // getSeasonProfile (): ISeasonProfile,
    // setSeasonProfile ( seasonProfile: ISeasonProfile ),

    // getSpecialDay (): ISpecialDay,
    // setSpecialDay ( specialDay: ISpecialDay ),

    // getDeviceType (): IDeviceType,
    // setDeviceType ( deviceType: IDeviceType ),

    // getPackedEnergyWithType (): IPackedEnergiesWithType,
    // setPackedEnergyWithType ( {energyType, energies}: IPackedEnergiesWithType ),

    // getEnergies(): TEnergies,
    // setEnergies ( energies: TEnergies ),

    // getDate (): types.IDate,
    // setDate ( date: types.IDate ),

    // getOperatorParameters (): IOperatorParameters,
    // setOperatorParameters ( operatorParameters: IOperatorParameters),

    // getSaldoParameters (): ISaldoParameters,
    // setSaldoParameters ( saldoParameters: ISaldoParameters ),

    // getEnergyPeriods ( periodsNumber: number ): Array<IEnergyPeriod>,
    // setEnergyPeriods ( periods: Array<IEnergyPeriod> ),

    // getExtendedCurrentValues2 (): IExtendedCurrentValues2Parameters,
    // setExtendedCurrentValues2 ( parameters: IExtendedCurrentValues2Parameters ),

    // getEventStatus (): IEventStatus,
    // setEventStatus ( parameters: IEventStatus ),

    // getEvent (): IEvent,
    // setEvent ( event: IEvent ),

    // getDemand (): IGetDemandParameters,
    // setDemand ( parameters: IGetDemandParameters ),

    // getDemandParameters (): IGetDemandParametersResponseParameters,
    // setDemandParameters ( parameters: IGetDemandParametersResponseParameters ),

    // getDayMaxDemandResponse (): IGetDayMaxDemandResponseParameters,
    // setDayMaxDemandResponse ( event: IGetDayMaxDemandResponseParameters ),

    // getOperatorParametersExtended3 (): IOperatorParametersExtended3,
    // setOperatorParametersExtended3 ( operatorParameters: IOperatorParametersExtended3 ),

    // getMonthMaxPowerByTariffs (): Array<IMonthMaxPower>,
    // setMonthMaxPowerByTariffs ( tariffs: Array<IMonthMaxPower> )
} */

// function CommandBinaryBuffer ( this: ICommandBinaryBuffer, dataOrLength: types.TBytes | number, isLittleEndian = false ) {
//     BinaryBuffer.call(this, dataOrLength, isLittleEndian);
// }

// extending
// CommandBinaryBuffer.prototype = Object.create(BinaryBuffer.prototype);
// CommandBinaryBuffer.prototype.constructor = CommandBinaryBuffer;

export const getDayProfileFromByte = ( value: number ): IDayProfile => ({
    tariff: bitSet.extractBits(value, 2, 1),
    isFirstHalfHour: !bitSet.extractBits(value, 1, 3),
    hour: bitSet.extractBits(value, 5, 4)
});

export const getByteFromDayProfile = ( dayProfile: IDayProfile ): number => {
    let value = 0;

    value = bitSet.fillBits(value, 2, 1, dayProfile.tariff);
    value = bitSet.fillBits(value, 1, 3, +!dayProfile.isFirstHalfHour);
    value = bitSet.fillBits(value, 5, 4, dayProfile.hour);

    return value;
};

export const getDefaultSeasonProfile = (): ISeasonProfile => ({
    month: 1,
    date: 1,
    dayIndexes: [0, 0, 0, 0, 0, 0, 0]
});

export const getDefaultOperatorParameters = (): IOperatorParameters => ({
    vpThreshold: 265000,
    vThreshold: 156000,
    ipThreshold: 120000,
    pmaxThreshold0: 31800,
    pmaxThreshold1: 31800,
    pmaxThreshold2: 31800,
    pmaxThreshold3: 31800,
    serialPortsSpeed: getSerialPortsSpeed(0),
    tint: 30,
    calcPeriodDate: 1,
    timeoutDisplay: 127,
    timeoutScreen: 7,
    displaySet: (bitSet.toObject(displaySetMask, 0x80003184) as unknown) as IDisplaySetOperatorParameter,
    relaySet4: (bitSet.toObject(relaySet4Mask, 0) as unknown) as IRelaySet4OperatorParameter,
    relaySet3: (bitSet.toObject(relaySet3Mask, 0) as unknown) as IRelaySet3OperatorParameter,
    relaySet2: (bitSet.toObject(relaySet2Mask, 3) as unknown) as IRelaySet2OperatorParameter,
    relaySet1: (bitSet.toObject(relaySet1Mask, 3) as unknown) as IRelaySet1OperatorParameter,
    displayType: 0,
    ten: 0,
    voltageAveragingInterval: 240,
    deltaCorMin: 15,
    timeoutMagnetOff: 5,
    timeoutMagnetOn: 5,
    define1: (bitSet.toObject(define1Mask, 0) as unknown) as IDefine1OperatorParameter,
    timeoutRelayOn: 1,
    timeoutRelayKey: 0,
    timeoutRelayAuto: 5,
    timeoutBadVAVB: 5,
    freqMax: 55,
    freqMin: 45,
    phMin: 0,
    year: 0,
    month: 0,
    date: 0,
    energyDecimalPoint: 2,
    typeMeter: 0,
    timeoutIMax: 5,
    timeoutPMax: 5,
    timeoutCos: 5,
    pMaxDef: 1,
    displaySetExt: (bitSet.toObject(displaySetExtMask, 0x8383fff) as unknown) as IDisplaySetExtOperatorParameter,
    timeoutUneqCurrent: 5,
    timeoutBipolarPower: 5,
    relaySet5: (bitSet.toObject(relaySet5Mask, 0) as unknown) as IRelaySet5OperatorParameter,
    timeCorrectPeriod: 24,
    timeCorrectPassHalfhour: false
});

export const getDefaultOperatorParametersExtended3 = (): IOperatorParametersExtended3 => ({
    pmaxMinusThreshold0: 0,
    pmaxMinusThreshold1: 0,
    pmaxMinusThreshold2: 0,
    pmaxMinusThreshold3: 0,
    relaySet: (bitSet.toObject(operatorParametersExtended3RelaySetMask, 0) as unknown) as IOperatorParametersExtended3RelaySet
});


export const getFrameHeader = function ( buffer: IBinaryBuffer ): IFrameHeader {
    const type = buffer.getUint8();
    const typeName = frameNames[type];
    const destination = buffer.getUint16();
    const source = buffer.getUint16();

    return {
        type,
        typeName,
        destination,
        source
    };
};

export const setFrameHeader = function ( buffer: IBinaryBuffer, {
    type = defaultFrameHeader.type,
    destination = defaultFrameHeader.destination,
    source = defaultFrameHeader.source
}: IFrameHeader ) {
    buffer.setUint8(type);
    buffer.setUint16(destination);
    buffer.setUint16(source);
};


// https://gitlab.infomir.dev/electric_meters/emdoc/-/blob/master/src/deviceInfo/deviceId.md
export const getDeviceId = function ( buffer: IBinaryBuffer ): IDeviceId {
    const manufacturer = getHexFromBytes(buffer.getBytes(3), {separator: ''});
    const type = buffer.getUint8();
    const year = buffer.getUint8() as unknown as types.TYear2000;
    const serial = getHexFromBytes(buffer.getBytes(3), {separator: ''});

    return {manufacturer, type, year, serial};
};

export const setDeviceId = function ( buffer: IBinaryBuffer, {manufacturer, type, year, serial}: IDeviceId ) {
    buffer.setBytes(getBytesFromHex(manufacturer));
    buffer.setUint8(type);
    buffer.setUint8(year as unknown as types.TUint8);
    buffer.setBytes(getBytesFromHex(serial));
};

export const getDateTime = function ( buffer: IBinaryBuffer ): IDateTime {
    return {
        isSummerTime: !!buffer.getUint8(),
        seconds: buffer.getUint8(),
        minutes: buffer.getUint8(),
        hours: buffer.getUint8(),
        day: buffer.getUint8() as unknown as types.TWeekDay,
        date: buffer.getUint8() as unknown as types.TMonthDay,
        month: buffer.getUint8() as unknown as types.TMonth,
        year: buffer.getUint8() as unknown as types.TYear2000
    };
};

export const setDateTime = function ( buffer: IBinaryBuffer, dateTime: IDateTime ) {
    buffer.setUint8(dateTime.isSummerTime ? 1 : 0);
    buffer.setUint8(dateTime.seconds);
    buffer.setUint8(dateTime.minutes);
    buffer.setUint8(dateTime.hours);
    buffer.setUint8((dateTime.day || 0) as unknown as types.TUint8);
    buffer.setUint8(dateTime.date as unknown as types.TUint8);
    buffer.setUint8(dateTime.month as unknown as types.TUint8);
    buffer.setUint8(dateTime.year as unknown as types.TUint8);
};

const gprsAccessPointSize: number = 27;
const gprsUserNameSize: number = 14;
const gprsPasswordSize: number = 14;


export const getGsmConfiguration = ( buffer: IBinaryBuffer ): IGsmConfiguration => {
    const configurationPrefix = buffer.getUint8();

    if ( configurationPrefix !== GSM_CONFIGURATION_PREFIX ) {
        throw new Error(`Gsm configuration. Invalid prefix: ${configurationPrefix}.`);
    }

    return {
        blockVersion: buffer.getUint8(),
        configurationId: buffer.getUint32(),
        gsmAccessTypes: buffer.getUint8(),
        gprsAccessPoint: buffer.getFixedString(gprsAccessPointSize),
        gprsUserName: buffer.getFixedString(gprsUserNameSize),
        gprsPassword: buffer.getFixedString(gprsPasswordSize),
        commandServerPort: buffer.getUint16(),
        activityServerPort: buffer.getUint16(),
        activityPingIntervalSec: buffer.getUint16(),
        activityPingIp: buffer.getIPv4(),
        activityPingPort: buffer.getUint16()
    };
};

export const setGsmConfiguration = ( buffer: IBinaryBuffer, value: IGsmConfiguration ) => {
    buffer.setUint8(GSM_CONFIGURATION_PREFIX);
    buffer.setUint8(value.blockVersion);
    buffer.setUint32(value.configurationId);
    buffer.setUint8(value.gsmAccessTypes);
    buffer.setFixedString(value.gprsAccessPoint, gprsAccessPointSize);
    buffer.setFixedString(value.gprsUserName, gprsUserNameSize);
    buffer.setFixedString(value.gprsPassword, gprsPasswordSize);
    buffer.setUint16(value.commandServerPort);
    buffer.setUint16(value.activityServerPort);
    buffer.setUint16(value.activityPingIntervalSec);
    buffer.setIPv4(value.activityPingIp);
    buffer.setUint16(value.activityPingPort);
};

export const getGsmStatus11 = ( buffer: IBinaryBuffer ): IGsmStatusV11 => ({
    hardwareVersion: buffer.getVersion(),
    softwareVersion: buffer.getVersion(),
    uptime: buffer.getUint32(),
    lastErrorStatus: (() => {
        const value = buffer.getUint8();

        // skip reserved bytes
        buffer.getUint16();

        return value;
    })(),
    attributes: (bitSet.toObject(gsmAttributeV11Mask, buffer.getUint32()) as unknown) as IGsmStatusAttributesV11,
    allocatedDataBlockCount: buffer.getUint8(),
    allocatedMessageCount: buffer.getUint8(),
    ip: buffer.getIPv4(),
    rssi: buffer.getUint8(),
    ber: buffer.getUint8(),
    maxTcpRequestCount: buffer.getUint8(),
    maxMtxRequestCount: buffer.getUint8(),
    gsmState: buffer.getUint8(),
    tcpState: buffer.getUint8(),
    mtxState: buffer.getUint8()
});

export const setGsmStatus11 = ( buffer: IBinaryBuffer, value: IGsmStatusV11 ) => {
    buffer.setVersion(value.hardwareVersion);
    buffer.setVersion(value.softwareVersion);
    buffer.setUint32(value.uptime);
    buffer.setUint8(value.lastErrorStatus);
    buffer.setUint16(0);
    buffer.setUint32(bitSet.fromObject(gsmAttributeV11Mask, (value.attributes as unknown) as bitSet.TBooleanObject));
    buffer.setUint8(value.allocatedDataBlockCount);
    buffer.setUint8(value.allocatedMessageCount);
    buffer.setIPv4(value.ip);
    buffer.setUint8(value.rssi);
    buffer.setUint8(value.ber);
    buffer.setUint8(value.maxTcpRequestCount);
    buffer.setUint8(value.maxMtxRequestCount);
    buffer.setUint8(value.gsmState);
    buffer.setUint8(value.tcpState);
    buffer.setUint8(value.mtxState);
};

export const getGsmStatus12 = ( buffer: IBinaryBuffer ): IGsmStatus12 => ({
    hardwareVersion: buffer.getVersion(),
    softwareVersion: buffer.getVersion(),
    uptime: buffer.getUint32(),
    allocatedMessageCount: buffer.getUint8(),
    allocatedDataBlockCount: buffer.getUint8(),
    attributes: (bitSet.toObject(gsmAttributeV12Mask, buffer.getUint32()) as unknown) as IGsmStatusAttributesV12,
    ip: buffer.getIPv4(),
    rssi: buffer.getUint8(),
    ber: buffer.getUint8(),
    lastErrorStatus: (() => {
        const value = buffer.getUint8();

        // skip reserved bytes
        buffer.getUint32();
        buffer.getUint32();

        return value;
    })(),
    mtxState: buffer.getUint8(),
    gsmState: buffer.getUint8(),
    tcpState: buffer.getUint8(),
    maxMtxRequestCount: buffer.getUint8(),
    mtxErrorCount: buffer.getUint8(),
    maxTcpRequestCount: buffer.getUint16(),
    tcpErrorCount: buffer.getUint16()
});

export const setGsmStatus12 = ( buffer: IBinaryBuffer, value: IGsmStatus12 ) => {
    buffer.setVersion(value.hardwareVersion);
    buffer.setVersion(value.softwareVersion);
    buffer.setUint32(value.uptime);
    buffer.setUint8(value.allocatedMessageCount);
    buffer.setUint8(value.allocatedDataBlockCount);
    buffer.setUint32(bitSet.fromObject(gsmAttributeV12Mask, (value.attributes as unknown) as bitSet.TBooleanObject));
    buffer.setIPv4(value.ip);
    buffer.setUint8(value.rssi);
    buffer.setUint8(value.ber);
    buffer.setUint8(value.lastErrorStatus);
    buffer.setUint32(0);
    buffer.setUint32(0);
    buffer.setUint8(value.mtxState);
    buffer.setUint8(value.gsmState);
    buffer.setUint8(value.tcpState);
    buffer.setUint8(value.maxMtxRequestCount);
    buffer.setUint8(value.mtxErrorCount);
    buffer.setUint16(value.maxTcpRequestCount);
    buffer.setUint16(value.tcpErrorCount);
};

export const getGsmStatus = ( buffer: IBinaryBuffer ): TGsmStatus => {
    const payloadLength = buffer.bytesLeft;

    if ( payloadLength < 1 ) {
        throw new Error(`GsmStatus. Invalid payload length: ${payloadLength}.`);
    }

    const version = buffer.getUint8();

    switch ( version ) {
        case 0x11: {
            if ( payloadLength < 29 ) {
                throw new Error(`GsmStatus. Invalid payload length: ${payloadLength}.`);
            }

            return {
                version: 0x11,
                data: getGsmStatus11(buffer)
            };
        }

        case 0x12:
        case 0x16: {
            if ( payloadLength < 39 ) {
                throw new Error(`GsmStatus. Invalid payload length: ${payloadLength}.`);
            }

            return {
                version: 0x12,
                data: getGsmStatus12(buffer)
            };
        }

        default:
            throw new Error(`GsmStatus. Unsupported version: ${version}.`);
    }
};

export const setGsmStatus = ( buffer: IBinaryBuffer, {version, data}: TGsmStatus ) => {
    switch ( version ) {
        case 0x11: {
            buffer.setUint8(version);
            setGsmStatus11(buffer, data);
            break;
        }

        case 0x12: {
            buffer.setUint8(version);
            setGsmStatus12(buffer, data);
            break;
        }

        default: {
            const exhaustive: never = version;
            throw new Error(`GsmStatus. Unsupported version: ${String(exhaustive)}.`);
        }
    }
};

export const getGsmBlock = ( commandName: string, bytes: types.TBytes ): IGsmBlock => {
    const [index] = bytes;
    const block = hashCrc16.parse(bytes.slice(1));

    if ( index > 3 ) {
        throw new Error(`Command ${commandName}. Invalid block index: ${index}.`);
    }

    if ( block.crc.calculated !== block.crc.received ) {
        const crcToHex = value => (value.toString(16).padStart(4, '0'));
        throw new Error(
            `Command ${commandName}. Invalid block crc. Calculated: `
            + `0x${crcToHex(block.crc.calculated)}, received: 0x${crcToHex(block.crc.received)}`
        );
    }

    const [blockPrefix, ...data] = block.payload;

    if ( blockPrefix !== GSM_BLOCK_PREFIX ) {
        throw new Error(`Command ${commandName}. Invalid block prefix: ${blockPrefix}.`);
    }

    // data contains payload length and payload data
    if ( data.length !== 1 + GSM_BLOCK_SIZE ) {
        throw new Error(`Command ${commandName}. Invalid payload length: ${data.length}.`);
    }

    return {index, data};
};

export const setGsmBlock = ( block: IGsmBlock ): types.TBytes => {
    const data = [GSM_BLOCK_PREFIX, ...block.data];

    if ( block.data.length < GSM_BLOCK_SIZE ) {
        // block data contains payload length and payload data
        data.push(...new Array<types.TUint8>(GSM_BLOCK_SIZE + 1 - block.data.length).fill(0));
    }

    return [block.index, ...hashCrc16.appendCrc(data)];
};

export const getTariffPlan = function ( buffer: IBinaryBuffer ): ITariffPlan {
    return {
        id: buffer.getUint32(),
        tariffSet: buffer.getUint8(),
        activateYear: buffer.getUint8() as unknown as types.TYear2000,
        activateMonth: buffer.getUint8() as unknown as types.TMonth,
        activateDay: buffer.getUint8() as unknown as types.TMonthDay,
        specialProfilesArraySize: buffer.getUint8(),
        seasonProfilesArraySize: buffer.getUint8(),
        dayProfilesArraySize: buffer.getUint8()
    };
};

export const setTariffPlan = function ( buffer: IBinaryBuffer, tariffPlan: ITariffPlan ) {
    buffer.setUint32(tariffPlan.id);
    buffer.setUint8(tariffPlan.tariffSet);
    buffer.setUint8(tariffPlan.activateYear as unknown as types.TUint8);
    buffer.setUint8(tariffPlan.activateMonth as unknown as types.TUint8);
    buffer.setUint8(tariffPlan.activateDay as unknown as types.TUint8);
    buffer.setUint8(tariffPlan.specialProfilesArraySize);
    buffer.setUint8(tariffPlan.seasonProfilesArraySize);
    buffer.setUint8(tariffPlan.dayProfilesArraySize);
};

export const getTimeCorrectionParameters = function ( buffer: IBinaryBuffer ): ITimeCorrectionParameters {
    return {
        monthTransitionSummer: buffer.getUint8() as unknown as types.TMonth,
        dateTransitionSummer: buffer.getUint8() as unknown as types.TMonthDay,
        hoursTransitionSummer: buffer.getUint8(),
        hoursCorrectSummer: buffer.getUint8(),
        monthTransitionWinter: buffer.getUint8() as unknown as types.TMonth,
        dateTransitionWinter: buffer.getUint8() as unknown as types.TMonthDay,
        hoursTransitionWinter: buffer.getUint8(),
        hoursCorrectWinter: buffer.getUint8(),
        isCorrectionNeeded: buffer.getUint8() === 1
    };
};

export const setTimeCorrectionParameters = function ( buffer: IBinaryBuffer, parameters: ITimeCorrectionParameters ) {
    buffer.setUint8(parameters.monthTransitionSummer as unknown as types.TUint8);
    buffer.setUint8(parameters.dateTransitionSummer as unknown as types.TUint8);
    buffer.setUint8(parameters.hoursTransitionSummer);
    buffer.setUint8(parameters.hoursCorrectSummer);
    buffer.setUint8(parameters.monthTransitionWinter as unknown as types.TUint8);
    buffer.setUint8(parameters.dateTransitionWinter as unknown as types.TUint8);
    buffer.setUint8(parameters.hoursTransitionWinter);
    buffer.setUint8(parameters.hoursCorrectWinter);
    buffer.setUint8(+parameters.isCorrectionNeeded);
};

export const getDayProfile = function ( buffer: IBinaryBuffer ): IDayProfile {
    return getDayProfileFromByte(buffer.getUint8());
};

export const setDayProfile = function ( buffer: IBinaryBuffer, dayProfile: IDayProfile ) {
    buffer.setUint8(getByteFromDayProfile(dayProfile));
};


export const getSeasonProfile = function ( buffer: IBinaryBuffer ): ISeasonProfile {
    return {
        month: buffer.getUint8() as unknown as types.TMonth,
        date: buffer.getUint8() as unknown as types.TMonthDay,
        dayIndexes: new Array(SEASON_PROFILE_DAYS_NUMBER).fill(0).map(() => buffer.getUint8())
    };
};

export const setSeasonProfile = function ( buffer: IBinaryBuffer, seasonProfile: ISeasonProfile ) {
    buffer.setUint8(seasonProfile.month as unknown as types.TUint8);
    buffer.setUint8(seasonProfile.date as unknown as types.TUint8);
    seasonProfile.dayIndexes.forEach(value => buffer.setUint8(value));
};

export const getSpecialDay = function ( buffer: IBinaryBuffer ): ISpecialDay {
    return {
        month: buffer.getUint8() as unknown as types.TMonth,
        date: buffer.getUint8() as unknown as types.TMonthDay,
        dayIndex: buffer.getUint8(),
        year: buffer.getUint8() as unknown as types.TYear2000
    };
};

export const setSpecialDay = function ( buffer: IBinaryBuffer, specialDay: ISpecialDay ) {
    buffer.setUint8(specialDay.month as unknown as types.TUint8);
    buffer.setUint8(specialDay.date as unknown as types.TUint8);
    buffer.setUint8(specialDay.dayIndex);
    buffer.setUint8(specialDay.year as unknown as types.TUint8);
};

// https://gitlab.infomir.dev/electric_meters/emdoc/-/blob/master/src/deviceInfo/deviceType.md
export const getDeviceType = function ( buffer: IBinaryBuffer ): IDeviceType {
    return DeviceType.fromBytes(buffer.getBytes(9));
};

export const setDeviceType = function ( buffer: IBinaryBuffer, deviceType: IDeviceType ) {
    buffer.setBytes(DeviceType.toBytes(deviceType));
};

export interface ISerialPortsSpeedOperatorParameter {
    /**
     * Baud rate of the RS485/TWI: `2400` or `9600`.
     *
     * | Value | Baud Rate |
     * | ----- | --------- |
     * | `0`   | `9600`    |
     * | `2`   | `2400`    |
     * | `4`   | `9600`    |
     */
    rs485orTwi: typeof baudRates.RATE_2400 | typeof baudRates.RATE_9600,

    /**
     * Baud rate of the optoport: `2400` or `9600`.
     *
     * | Value | Baud Rate |
     * | ----- | --------- |
     * | `0`   | `2400`    |
     * | `2`   | `2400`    |
     * | `4`   | `9600`    |
     */
    optoport: typeof baudRates.RATE_2400 | typeof baudRates.RATE_9600
}

export const getOperatorParameters = function ( buffer: IBinaryBuffer ): IOperatorParameters {
    let value;
    const operatorParameters = {
        vpThreshold: buffer.getUint32(),
        vThreshold: buffer.getUint32(),
        ipThreshold: buffer.getUint32(),
        pmaxThreshold0: buffer.getUint32(),
        pmaxThreshold1: buffer.getUint32(),
        pmaxThreshold2: buffer.getUint32(),
        pmaxThreshold3: buffer.getUint32(),
        serialPortsSpeed: getSerialPortsSpeed(buffer.getUint8()),
        tint: buffer.getUint8(),
        calcPeriodDate: buffer.getUint8(),
        timeoutDisplay: buffer.getUint8(),
        timeoutScreen: buffer.getUint8(),
        displaySet: (bitSet.toObject(displaySetMask, buffer.getUint32()) as unknown) as IDisplaySetOperatorParameter,
        relaySet4: (bitSet.toObject(relaySet4Mask, buffer.getUint8()) as unknown) as IRelaySet4OperatorParameter,
        relaySet3: (bitSet.toObject(relaySet3Mask, buffer.getUint8()) as unknown) as IRelaySet3OperatorParameter,
        relaySet2: (bitSet.toObject(relaySet2Mask, buffer.getUint8()) as unknown) as IRelaySet2OperatorParameter,
        relaySet1: (bitSet.toObject(relaySet1Mask, buffer.getUint8()) as unknown) as IRelaySet1OperatorParameter,
        displayType: buffer.getUint8(),
        ten: buffer.getUint8(),
        voltageAveragingInterval: (value = buffer.getUint8(), buffer.getUint8(), value),
        deltaCorMin: buffer.getUint8(),
        timeoutMagnetOff: buffer.getUint8(),
        timeoutMagnetOn: buffer.getUint8(),
        define1: (bitSet.toObject(define1Mask, buffer.getUint8()) as unknown) as IDefine1OperatorParameter,
        timeoutRelayOn: buffer.getUint8(),
        timeoutRelayKey: buffer.getUint8(),
        timeoutRelayAuto: buffer.getUint8(),
        timeoutBadVAVB: buffer.getUint8(),
        freqMax: buffer.getUint8(),
        freqMin: buffer.getUint8(),
        phMin: buffer.getUint16(),
        year: buffer.getUint8(),
        month: buffer.getUint8(),
        date: buffer.getUint8(),
        energyDecimalPoint: buffer.getUint8(),
        typeMeter: buffer.getUint8(),
        timeoutIMax: buffer.getUint8(),
        timeoutPMax: buffer.getUint8(),
        timeoutCos: buffer.getUint8(),
        pMaxDef: buffer.getUint8(),
        displaySetExt: (bitSet.toObject(displaySetExtMask, buffer.getUint32()) as unknown) as IDisplaySetExtOperatorParameter,
        timeoutUneqCurrent: buffer.getUint8(),
        timeoutBipolarPower: buffer.getUint8(),
        relaySet5: (bitSet.toObject(relaySet5Mask, buffer.getUint8()) as unknown) as IRelaySet5OperatorParameter,
        timeCorrectPeriod: 0,
        timeCorrectPassHalfhour: false
    };

    const timeCorrectPeriod = buffer.getUint8();

    operatorParameters.timeCorrectPeriod = timeCorrectPeriod & 0x7f;
    operatorParameters.timeCorrectPassHalfhour = !!(timeCorrectPeriod & 0x80);

    return operatorParameters as IOperatorParameters;
};

export const setOperatorParameters = function ( buffer: IBinaryBuffer, operatorParameters: IOperatorParameters ) {
    const timeCorrectPeriod = operatorParameters.timeCorrectPeriod
        | (operatorParameters.timeCorrectPassHalfhour ? 0x80 : 0);

    buffer.setUint32(operatorParameters.vpThreshold);
    buffer.setUint32(operatorParameters.vThreshold);
    buffer.setUint32(operatorParameters.ipThreshold);
    buffer.setUint32(operatorParameters.pmaxThreshold0);
    buffer.setUint32(operatorParameters.pmaxThreshold1);
    buffer.setUint32(operatorParameters.pmaxThreshold2);
    buffer.setUint32(operatorParameters.pmaxThreshold3);
    buffer.setUint8(setSerialPortsSpeed(operatorParameters.serialPortsSpeed));
    buffer.setUint8(operatorParameters.tint);
    buffer.setUint8(operatorParameters.calcPeriodDate);
    buffer.setUint8(operatorParameters.timeoutDisplay);
    buffer.setUint8(operatorParameters.timeoutScreen);
    buffer.setUint32(bitSet.fromObject(displaySetMask, (operatorParameters.displaySet as unknown) as bitSet.TBooleanObject));
    buffer.setUint8(bitSet.fromObject(relaySet4Mask, (operatorParameters.relaySet4 as unknown) as bitSet.TBooleanObject));
    buffer.setUint8(bitSet.fromObject(relaySet3Mask, (operatorParameters.relaySet3 as unknown) as bitSet.TBooleanObject));
    buffer.setUint8(bitSet.fromObject(relaySet2Mask, (operatorParameters.relaySet2 as unknown) as bitSet.TBooleanObject));
    buffer.setUint8(bitSet.fromObject(relaySet1Mask, (operatorParameters.relaySet1 as unknown) as bitSet.TBooleanObject));
    buffer.setUint8(operatorParameters.displayType);
    buffer.setUint8(operatorParameters.ten);
    buffer.setUint8(operatorParameters.voltageAveragingInterval);
    buffer.setUint8(0); // reserve
    buffer.setUint8(operatorParameters.deltaCorMin);
    buffer.setUint8(operatorParameters.timeoutMagnetOff);
    buffer.setUint8(operatorParameters.timeoutMagnetOn);
    buffer.setUint8(bitSet.fromObject(define1Mask, (operatorParameters.define1 as unknown) as bitSet.TBooleanObject));
    buffer.setUint8(operatorParameters.timeoutRelayOn);
    buffer.setUint8(operatorParameters.timeoutRelayKey);
    buffer.setUint8(operatorParameters.timeoutRelayAuto);
    buffer.setUint8(operatorParameters.timeoutBadVAVB);
    buffer.setUint8(operatorParameters.freqMax);
    buffer.setUint8(operatorParameters.freqMin);
    buffer.setUint16(operatorParameters.phMin);
    buffer.setUint8(operatorParameters.year);
    buffer.setUint8(operatorParameters.month);
    buffer.setUint8(operatorParameters.date);
    buffer.setUint8(operatorParameters.energyDecimalPoint);
    buffer.setUint8(operatorParameters.typeMeter);
    buffer.setUint8(operatorParameters.timeoutIMax);
    buffer.setUint8(operatorParameters.timeoutPMax);
    buffer.setUint8(operatorParameters.timeoutCos);
    buffer.setUint8(operatorParameters.pMaxDef);
    buffer.setUint32(bitSet.fromObject(displaySetExtMask, (operatorParameters.displaySetExt as unknown) as bitSet.TBooleanObject));
    buffer.setUint8(operatorParameters.timeoutUneqCurrent);
    buffer.setUint8(operatorParameters.timeoutBipolarPower);
    buffer.setUint8(bitSet.fromObject(relaySet5Mask, (operatorParameters.relaySet5 as unknown) as bitSet.TBooleanObject));
    buffer.setUint8(timeCorrectPeriod);
};

export const getPackedEnergyWithType = function ( buffer: IBinaryBuffer ): IPackedEnergiesWithType {
    const byte = buffer.getUint8();
    const energyType = bitSet.extractBits(byte, TARIFF_NUMBER, 1);
    const energies = getPackedEnergies(buffer, energyType, byte);

    return {
        energyType,
        energies
    };
};

export const setPackedEnergyWithType = function ( buffer: IBinaryBuffer, {energyType, energies}: IPackedEnergiesWithType ) {
    if ( energyType ) {
        setPackedEnergyType(buffer, energyType, energies);
    }

    energies.forEach(energy => {
        if ( energy !== null ) {
            buffer.setInt32(energy);
        }
    });
};

export const getEnergies = function ( buffer: IBinaryBuffer ): TEnergies {
    return new Array(TARIFF_NUMBER).fill(0).map(() => buffer.getInt32());
};

export const setEnergies = function ( buffer: IBinaryBuffer, energies: TEnergies ) {
    energies.forEach(value => buffer.setInt32(value));
};

export const getDate = function ( buffer: IBinaryBuffer ): types.IDate {
    return {
        year: buffer.getUint8() as unknown as types.TYear2000,
        month: buffer.getUint8() as unknown as types.TMonth,
        date: buffer.getUint8() as unknown as types.TMonthDay
    };
};

export const setDate = function ( buffer: IBinaryBuffer, date: types.IDate ) {
    buffer.setUint8(date.year as unknown as types.TUint8);
    buffer.setUint8(date.month as unknown as types.TUint8);
    buffer.setUint8(date.date as unknown as types.TUint8);
};

export const getSaldoParameters = function ( buffer: IBinaryBuffer ): ISaldoParameters {
    return {
        coefficients: new Array(4).fill(0).map(() => buffer.getUint32()),
        decimalPointTariff: buffer.getUint8(),
        indicationThreshold: buffer.getInt32(),
        relayThreshold: buffer.getInt32(),
        mode: buffer.getUint8(),
        saldoOffTimeBegin: buffer.getUint8(),
        saldoOffTimeEnd: buffer.getUint8(),
        decimalPointIndication: buffer.getUint8(),
        powerThreshold: buffer.getUint32(),
        creditThreshold: buffer.getInt32()
    };
};

export const setSaldoParameters = function ( buffer: IBinaryBuffer, saldoParameters: ISaldoParameters ) {
    saldoParameters.coefficients.forEach(value => buffer.setUint32(value));
    buffer.setUint8(saldoParameters.decimalPointTariff);
    buffer.setInt32(saldoParameters.indicationThreshold);
    buffer.setInt32(saldoParameters.relayThreshold);
    buffer.setUint8(saldoParameters.mode);
    buffer.setUint8(saldoParameters.saldoOffTimeBegin);
    buffer.setUint8(saldoParameters.saldoOffTimeEnd);
    buffer.setUint8(saldoParameters.decimalPointIndication);
    buffer.setUint32(saldoParameters.powerThreshold);
    buffer.setInt32(saldoParameters.creditThreshold);
};

export const getEnergyPeriods = function ( buffer: IBinaryBuffer, periodsNumber: number ): Array<IEnergyPeriod> {
    const periods = new Array(periodsNumber).fill(0).map(() => buffer.getUint16());

    return periods.map(period => getEnergyPeriod(period));
};

export const setEnergyPeriods = function ( buffer: IBinaryBuffer, periods: Array<IEnergyPeriod> ) {
    periods.forEach(period => setEnergyPeriod(buffer, period));
};

export const getEventStatus = function ( buffer: IBinaryBuffer ): IEventStatus {
    const eventStatus = buffer.getUint16();

    return (bitSet.toObject(eventStatusMask, eventStatus) as unknown) as IEventStatus;
};

export const setEventStatus = function ( buffer: IBinaryBuffer, parameters: IEventStatus ) {
    buffer.setUint16(bitSet.fromObject(eventStatusMask, (parameters as unknown) as bitSet.TBooleanObject));
};

export const getExtendedCurrentValues2 = function ( buffer: IBinaryBuffer ): IExtendedCurrentValues2Parameters {
    const uBattery = buffer.getUint16();
    const relayStatus = bitSet.toObject(extendedCurrentValues2RelayStatusMask, buffer.getUint8()) as unknown as IExtendedCurrentValues2RelayStatus;
    const relayStatus2 = bitSet.toObject(extendedCurrentValues2RelayStatus2Mask, buffer.getUint8()) as unknown as IExtendedCurrentValues2RelayStatus2;
    const status1 = bitSet.toObject(extendedCurrentValues2Status1Mask, buffer.getUint8()) as unknown as IExtendedCurrentValues2Status1;
    const status2 = bitSet.toObject(extendedCurrentValues2Status2Mask, buffer.getUint8()) as unknown as IExtendedCurrentValues2Status2;
    const status3 = bitSet.toObject(extendedCurrentValues2Status3Mask, buffer.getUint8()) as unknown as IExtendedCurrentValues2Status3;

    return {
        uBattery,
        relayStatus,
        relayStatus2,
        status1,
        status2,
        status3
    };
};

export const setExtendedCurrentValues2 = function ( buffer: IBinaryBuffer, parameters: IExtendedCurrentValues2Parameters ) {
    const {
        uBattery,
        relayStatus,
        relayStatus2,
        status1,
        status2,
        status3
    } = parameters;

    buffer.setUint16(uBattery);
    buffer.setUint8(bitSet.fromObject(extendedCurrentValues2RelayStatusMask, (relayStatus as unknown) as bitSet.TBooleanObject));
    buffer.setUint8(bitSet.fromObject(extendedCurrentValues2RelayStatus2Mask, (relayStatus2 as unknown) as bitSet.TBooleanObject));
    buffer.setUint8(bitSet.fromObject(extendedCurrentValues2Status1Mask, (status1 as unknown) as bitSet.TBooleanObject));
    buffer.setUint8(bitSet.fromObject(extendedCurrentValues2Status2Mask, (status2 as unknown) as bitSet.TBooleanObject));
    buffer.setUint8(bitSet.fromObject(extendedCurrentValues2Status3Mask, (status3 as unknown) as bitSet.TBooleanObject));
};

export const getEvent = function ( buffer: IBinaryBuffer ): IEvent {
    const data: IEvent = {
        hours: buffer.getUint8(),
        minutes: buffer.getUint8(),
        seconds: buffer.getUint8(),
        event: buffer.getUint8()
    };
    const {event} = data;
    const {bytesLeft} = buffer;

    data.eventName = eventNames[event];

    switch ( event ) {
        case events.POWER_OVER_RELAY_OFF:
            if ( bytesLeft < 4 ) {
                return data;
            }

            data.power = [buffer.getUint8(), buffer.getUint8(), buffer.getUint8(), buffer.getUint8()];
            break;

        case events.CMD_SET_DATETIME:
        case events.TIME_CORRECT:
            if ( bytesLeft < 8 ) {
                return data;
            }

            data.newDate = getDateTime(buffer);
            break;

        default:
            break;
    }

    return data;
};

export const setEvent = function ( buffer: IBinaryBuffer, event: IEvent ) {
    buffer.setUint8(event.hours);
    buffer.setUint8(event.minutes);
    buffer.setUint8(event.seconds);
    buffer.setUint8(event.event);

    switch ( event.event ) {
        case events.POWER_OVER_RELAY_OFF:
            for ( const item of event.power ) {
                buffer.setUint8(item);
            }
            break;

        case events.CMD_SET_DATETIME:
        case events.TIME_CORRECT:
            setDateTime(buffer, event.newDate);
            break;

        default: break;
    }
};

export const getDemand = function ( buffer: IBinaryBuffer ): IGetDemandParameters {
    const date0 = buffer.getUint8();
    const date1 = buffer.getUint8();

    return {
        date: {
            year: date0 >> 1,
            month: ((date0 << 3) & 0x0f) | (date1 >> 5),
            date: date1 & 0x1f
        },
        demandType: buffer.getUint8(),
        firstIndex: buffer.getUint16(),
        count: buffer.getUint8(),
        period: buffer.getUint8()
    };
};

export const setDemand = function ( buffer: IBinaryBuffer, parameters: IGetDemandParameters ) {
    const date0 = (parameters.date.year << 1) | ((parameters.date.month >> 3) & 0x01);
    const date1 = ((parameters.date.month << 5) & 0xe0) | (parameters.date.date & 0x1f);

    buffer.setUint8(date0);
    buffer.setUint8(date1);
    buffer.setUint8(parameters.demandType);
    buffer.setUint16(parameters.firstIndex);
    buffer.setUint8(parameters.count);
    buffer.setUint8(parameters.period);
};

export const getDemandParameters = function ( buffer: IBinaryBuffer ): IGetDemandParametersResponseParameters {
    const channelParam1 = buffer.getUint8();
    const powerOffTrackingInterval = buffer.getUint8();
    const channelParam2 = buffer.getUint8();

    return {channelParam1, powerOffTrackingInterval, channelParam2};
};

export const setDemandParameters = function ( buffer: IBinaryBuffer, parameters: IGetDemandParametersResponseParameters ) {
    buffer.setUint8(parameters.channelParam1);
    buffer.setUint8(parameters.powerOffTrackingInterval);
    buffer.setUint8(parameters.channelParam2);

    // the last byte is reserved and not used for now
    buffer.setUint8(0);
};

export const getDayMaxDemandResponse = function ( buffer: IBinaryBuffer ): IGetDayMaxDemandResponseParameters {
    const date = getDate(buffer);

    // 4 tariffs
    const power = new Array(TARIFF_NUMBER).fill(0).map(() => ({
        hours: buffer.getUint8(),
        minutes: buffer.getUint8(),
        power: buffer.getUint32()
    }));

    return {date, power};
};

export const setDayMaxDemandResponse = function ( buffer: IBinaryBuffer, parameters: IGetDayMaxDemandResponseParameters ) {
    setDate(buffer, parameters.date);

    parameters.power.forEach(value => {
        buffer.setUint8(value.hours);
        buffer.setUint8(value.minutes);
        buffer.setUint32(value.power);
    });
};

export const getOperatorParametersExtended3 = function ( buffer: IBinaryBuffer ): IOperatorParametersExtended3 {
    return {
        pmaxMinusThreshold0: buffer.getUint32(),
        pmaxMinusThreshold1: buffer.getUint32(),
        pmaxMinusThreshold2: buffer.getUint32(),
        pmaxMinusThreshold3: buffer.getUint32(),
        relaySet: (bitSet.toObject(operatorParametersExtended3RelaySetMask, buffer.getUint8()) as unknown) as IOperatorParametersExtended3RelaySet
    };
};

export const setOperatorParametersExtended3 = function ( buffer: IBinaryBuffer, parameters: IOperatorParametersExtended3 ) {
    const {pmaxMinusThreshold0, pmaxMinusThreshold1, pmaxMinusThreshold2, pmaxMinusThreshold3, relaySet} = parameters;

    buffer.setUint32(pmaxMinusThreshold0);
    buffer.setUint32(pmaxMinusThreshold1);
    buffer.setUint32(pmaxMinusThreshold2);
    buffer.setUint32(pmaxMinusThreshold3);
    buffer.setUint8(bitSet.fromObject(operatorParametersExtended3RelaySetMask, (relaySet as unknown) as bitSet.TBooleanObject));
};

export const getMonthMaxPowerByTariffs = function ( buffer: IBinaryBuffer ): Array<IMonthMaxPower> {
    return new Array(TARIFF_NUMBER).fill(0).map(() => ({
        date: buffer.getUint8() as unknown as types.TMonthDay,
        hours: buffer.getUint8(),
        minutes: buffer.getUint8(),
        power: buffer.getUint32()
    }));
};

export const setMonthMaxPowerByTariffs = function ( buffer: IBinaryBuffer, tariffs: Array<IMonthMaxPower> ) {
    tariffs.forEach(tariff => {
        buffer.setUint8(tariff.date as unknown as types.TUint8);
        buffer.setUint8(tariff.hours);
        buffer.setUint8(tariff.minutes);
        buffer.setUint32(tariff.power);
    });
};


export const getDefaultTimeCorrectionParameters = (): ITimeCorrectionParameters => ({
    monthTransitionSummer: 3,
    dateTransitionSummer: 0,
    hoursTransitionSummer: 3,
    hoursCorrectSummer: 1,
    monthTransitionWinter: 10,
    dateTransitionWinter: 0,
    hoursTransitionWinter: 4,
    hoursCorrectWinter: 1,
    isCorrectionNeeded: true
});

export const getPackedEnergiesWithDateSize = ( parameters: IPackedEnergiesWithType ): number => {
    if ( parameters?.energyType ) {
        const energiesNumber = parameters.energies.filter(energy => energy !== null).length;

        return DATE_SIZE + PACKED_ENERGY_TYPE_SIZE + (energiesNumber * ENERGY_SIZE);
    }

    return DATE_SIZE + ENERGY_SIZE * TARIFF_NUMBER;
};

// export default CommandBinaryBuffer;
