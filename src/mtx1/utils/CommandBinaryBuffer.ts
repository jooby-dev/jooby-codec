/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import * as types from '../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../utils/BinaryBuffer.js';
import * as bitSet from '../../utils/bitSet.js';
import {IDeviceType} from './deviceType.js';
import * as DeviceType from './deviceType.js';
import getHexFromBytes from '../../utils/getHexFromBytes.js';
import getBytesFromHex from '../../utils/getBytesFromHex.js';
import {IDateTime, ITimeCorrectionParameters} from './dateTime.js';
import * as screenIds from '../constants/screenIds.js';
import * as frameTypes from '../constants/frameTypes.js';
import frameNames from '../constants/frameNames.js';
import * as events from '../constants/events.js';
import eventNames from '../constants/eventNames.js';
//import * as energyTypes from '../constants/energyTypes.js';

import * as demandTypes from '../constants/demandTypes.js';


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
    CURRENT_BALANCE: boolean,
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
     * Reserved byte.
     */
    speedOptoPort: types.TUint8,

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
     * Reserved byte.
     */
    timeoutRefresh: types.TUint8,

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
     * Is it periodic or not.
     */
    isPeriodic: boolean
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
export type TEnergies = Array<types.TUint32 | null>;

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
     * since build `104.23.001` (`MTX1`), `302.37.001` (`MTX3`)
     */
    PROTECTION_RESET_EM: boolean;

    /**
     * Magnetic influence screen reset.
     *
     * since build `104.23.001` (`MTX1`), `302.37.001` (`MTX3`)
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
    RELAY_HARD_ST1: boolean
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
    energyType: types.TUint8,

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
    RELAY_HARD_ST1: 2 ** 5
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


function getPackedEnergies ( buffer: ICommandBinaryBuffer, energyType: types.TEnergyType, tariffMapByte: number ): TEnergies {
    const byte = tariffMapByte >> TARIFF_NUMBER;
    const energies = new Array(TARIFF_NUMBER).fill(0) as TEnergies;

    energies.forEach((energy, index) => {
        // read flags by one bit
        const isTariffExists = !!bitSet.extractBits(byte, 1, index + 1);

        if ( isTariffExists ) {
            energies[index] = buffer.getUint32();
        } else {
            energies[index] = null;
        }
    });

    return energies;
}

function setPackedEnergyType ( buffer: ICommandBinaryBuffer, energyType: types.TEnergyType, energies: TEnergies ) {
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

function setEnergyPeriod ( buffer: ICommandBinaryBuffer, {tariff, energy}: IEnergyPeriod ) {
    if ( tariff !== undefined && energy !== undefined ) {
        buffer.setUint16((tariff << 14) | (energy & 0x3fff));
    } else {
        buffer.setUint16(0xffff);
    }
}

export interface ICommandBinaryBuffer extends IBinaryBuffer {
    // static methods
    getDayProfileFromByte ( value: number ): IDayProfile,
    getByteFromDayProfile ( dayProfile: IDayProfile ): number,

    getDefaultSeasonProfile (): ISeasonProfile,

    getDefaultOperatorParameters (): IOperatorParameters,

    getDefaultOperatorParametersExtended3 (): IOperatorParametersExtended3,

    // instance methods
    getFrameHeader (): IFrameHeader,
    setFrameHeader ( frameHeader: IFrameHeader ),

    getDeviceId (): IDeviceId,
    setDeviceId ( {manufacturer, type, year, serial}: IDeviceId ),

    getDateTime (): IDateTime,
    setDateTime ( dateTime: IDateTime ),

    getTariffPlan(): ITariffPlan,
    setTariffPlan ( tariffPlan: ITariffPlan ),

    getTimeCorrectionParameters (): ITimeCorrectionParameters,
    setTimeCorrectionParameters ( parameters: ITimeCorrectionParameters ),

    getDayProfile (): IDayProfile,
    setDayProfile ( dayProfile: IDayProfile ),

    getSeasonProfile (): ISeasonProfile,
    setSeasonProfile ( seasonProfile: ISeasonProfile ),

    getSpecialDay (): ISpecialDay,
    setSpecialDay ( specialDay: ISpecialDay ),

    getDeviceType (): IDeviceType,
    setDeviceType ( deviceType: IDeviceType ),

    getPackedEnergyWithType (): IPackedEnergiesWithType,
    setPackedEnergyWithType ( {energyType, energies}: IPackedEnergiesWithType ),

    getEnergies(): TEnergies,
    setEnergies ( energies: TEnergies ),

    getDate (): types.IDate,
    setDate ( date: types.IDate ),

    getOperatorParameters (): IOperatorParameters,
    setOperatorParameters ( operatorParameters: IOperatorParameters),

    getSaldoParameters (): ISaldoParameters,
    setSaldoParameters ( saldoParameters: ISaldoParameters ),

    getEnergyPeriods ( periodsNumber: number ): Array<IEnergyPeriod>,
    setEnergyPeriods ( periods: Array<IEnergyPeriod> ),

    getExtendedCurrentValues2 (): IExtendedCurrentValues2Parameters,
    setExtendedCurrentValues2 ( parameters: IExtendedCurrentValues2Parameters ),

    getEventStatus (): IEventStatus,
    setEventStatus ( parameters: IEventStatus ),

    getEvent (): IEvent,
    setEvent ( event: IEvent ),

    getDemand (): IGetDemandParameters,
    setDemand ( parameters: IGetDemandParameters ),

    getDayMaxDemandResponse (): IGetDayMaxDemandResponseParameters,
    setDayMaxDemandResponse ( event: IGetDayMaxDemandResponseParameters ),

    getOperatorParametersExtended3 (): IOperatorParametersExtended3,
    setOperatorParametersExtended3 ( operatorParameters: IOperatorParametersExtended3 ),

    getMonthMaxPowerByTariffs (): Array<IMonthMaxPower>,
    setMonthMaxPowerByTariffs ( tariffs: Array<IMonthMaxPower> )
}

function CommandBinaryBuffer ( this: ICommandBinaryBuffer, dataOrLength: types.TBytes | number, isLittleEndian = false ) {
    BinaryBuffer.call(this, dataOrLength, isLittleEndian);
}

// extending
CommandBinaryBuffer.prototype = Object.create(BinaryBuffer.prototype);
CommandBinaryBuffer.prototype.constructor = CommandBinaryBuffer;

CommandBinaryBuffer.getDayProfileFromByte = ( value: number ): IDayProfile => ({
    tariff: bitSet.extractBits(value, 2, 1),
    isFirstHalfHour: !bitSet.extractBits(value, 1, 3),
    hour: bitSet.extractBits(value, 5, 4)
});

CommandBinaryBuffer.getByteFromDayProfile = ( dayProfile: IDayProfile ): number => {
    let value = 0;

    value = bitSet.fillBits(value, 2, 1, dayProfile.tariff);
    value = bitSet.fillBits(value, 1, 3, +!dayProfile.isFirstHalfHour);
    value = bitSet.fillBits(value, 5, 4, dayProfile.hour);

    return value;
};

CommandBinaryBuffer.getDefaultSeasonProfile = (): ISeasonProfile => ({
    month: 1,
    date: 1,
    dayIndexes: [0, 0, 0, 0, 0, 0, 0]
});

CommandBinaryBuffer.getDefaultOperatorParameters = (): IOperatorParameters => ({
    vpThreshold: 265000,
    vThreshold: 156000,
    ipThreshold: 120000,
    pmaxThreshold0: 31800,
    pmaxThreshold1: 31800,
    pmaxThreshold2: 31800,
    pmaxThreshold3: 31800,
    speedOptoPort: 0,
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
    timeoutRefresh: 240,
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

CommandBinaryBuffer.getDefaultOperatorParametersExtended3 = (): IOperatorParametersExtended3 => ({
    pmaxMinusThreshold0: 0,
    pmaxMinusThreshold1: 0,
    pmaxMinusThreshold2: 0,
    pmaxMinusThreshold3: 0,
    relaySet: (bitSet.toObject(operatorParametersExtended3RelaySetMask, 0) as unknown) as IOperatorParametersExtended3RelaySet
});


CommandBinaryBuffer.prototype.getFrameHeader = function (): IFrameHeader {
    const type = this.getUint8();
    const typeName = frameNames[type];
    const destination = this.getUint16();
    const source = this.getUint16();

    return {
        type,
        typeName,
        destination,
        source
    };
};

CommandBinaryBuffer.prototype.setFrameHeader = function ( {
    type = defaultFrameHeader.type,
    destination = defaultFrameHeader.destination,
    source = defaultFrameHeader.source
}: IFrameHeader ) {
    this.setUint8(type);
    this.setUint16(destination);
    this.setUint16(source);
};


// https://gitlab.infomir.dev/electric_meters/emdoc/-/blob/master/src/deviceInfo/deviceId.md
CommandBinaryBuffer.prototype.getDeviceId = function (): IDeviceId {
    const manufacturer = getHexFromBytes(this.getBytes(3), {separator: ''});
    const type = this.getUint8();
    const year = this.getUint8();
    const serial = getHexFromBytes(this.getBytes(3), {separator: ''});

    return {manufacturer, type, year, serial};
};

CommandBinaryBuffer.prototype.setDeviceId = function ( {manufacturer, type, year, serial}: IDeviceId ) {
    this.setBytes(getBytesFromHex(manufacturer));
    this.setUint8(type);
    this.setUint8(year);
    this.setBytes(getBytesFromHex(serial));
};

CommandBinaryBuffer.prototype.getDateTime = function (): IDateTime {
    return {
        isSummerTime: !!this.getUint8(),
        seconds: this.getUint8(),
        minutes: this.getUint8(),
        hours: this.getUint8(),
        day: this.getUint8(),
        date: this.getUint8(),
        month: this.getUint8(),
        year: this.getUint8()
    };
};

CommandBinaryBuffer.prototype.setDateTime = function ( dateTime: IDateTime ) {
    this.setUint8(dateTime.isSummerTime ? 1 : 0);
    this.setUint8(dateTime.seconds);
    this.setUint8(dateTime.minutes);
    this.setUint8(dateTime.hours);
    this.setUint8(dateTime.day || 0);
    this.setUint8(dateTime.date);
    this.setUint8(dateTime.month);
    this.setUint8(dateTime.year);
};

CommandBinaryBuffer.prototype.getTariffPlan = function (): ITariffPlan {
    return {
        id: this.getUint32(),
        tariffSet: this.getUint8(),
        activateYear: this.getUint8(),
        activateMonth: this.getUint8(),
        activateDay: this.getUint8(),
        specialProfilesArraySize: this.getUint8(),
        seasonProfilesArraySize: this.getUint8(),
        dayProfilesArraySize: this.getUint8()
    };
};

CommandBinaryBuffer.prototype.setTariffPlan = function ( tariffPlan: ITariffPlan ) {
    this.setUint32(tariffPlan.id);
    this.setUint8(tariffPlan.tariffSet);
    this.setUint8(tariffPlan.activateYear);
    this.setUint8(tariffPlan.activateMonth);
    this.setUint8(tariffPlan.activateDay);
    this.setUint8(tariffPlan.specialProfilesArraySize);
    this.setUint8(tariffPlan.seasonProfilesArraySize);
    this.setUint8(tariffPlan.dayProfilesArraySize);
};

CommandBinaryBuffer.prototype.getTimeCorrectionParameters = function (): ITimeCorrectionParameters {
    return {
        monthTransitionSummer: this.getUint8(),
        dateTransitionSummer: this.getUint8(),
        hoursTransitionSummer: this.getUint8(),
        hoursCorrectSummer: this.getUint8(),
        monthTransitionWinter: this.getUint8(),
        dateTransitionWinter: this.getUint8(),
        hoursTransitionWinter: this.getUint8(),
        hoursCorrectWinter: this.getUint8(),
        isCorrectionNeeded: this.getUint8() === 1
    };
};

CommandBinaryBuffer.prototype.setTimeCorrectionParameters = function ( parameters: ITimeCorrectionParameters ) {
    this.setUint8(parameters.monthTransitionSummer);
    this.setUint8(parameters.dateTransitionSummer);
    this.setUint8(parameters.hoursTransitionSummer);
    this.setUint8(parameters.hoursCorrectSummer);
    this.setUint8(parameters.monthTransitionWinter);
    this.setUint8(parameters.dateTransitionWinter);
    this.setUint8(parameters.hoursTransitionWinter);
    this.setUint8(parameters.hoursCorrectWinter);
    this.setUint8(+parameters.isCorrectionNeeded);
};

CommandBinaryBuffer.prototype.getDayProfile = function (): IDayProfile {
    return CommandBinaryBuffer.getDayProfileFromByte(this.getUint8());
};

CommandBinaryBuffer.prototype.setDayProfile = function ( dayProfile: IDayProfile ) {
    this.setUint8(CommandBinaryBuffer.getByteFromDayProfile(dayProfile));
};


CommandBinaryBuffer.prototype.getSeasonProfile = function (): ISeasonProfile {
    return {
        month: this.getUint8(),
        date: this.getUint8(),
        dayIndexes: new Array(SEASON_PROFILE_DAYS_NUMBER).fill(0).map(() => this.getUint8())
    };
};

CommandBinaryBuffer.prototype.setSeasonProfile = function ( seasonProfile: ISeasonProfile ) {
    this.setUint8(seasonProfile.month);
    this.setUint8(seasonProfile.date);
    seasonProfile.dayIndexes.forEach(value => this.setUint8(value));
};

CommandBinaryBuffer.prototype.getSpecialDay = function (): ISpecialDay {
    return {
        month: this.getUint8(),
        date: this.getUint8(),
        dayIndex: this.getUint8(),
        isPeriodic: this.getUint8() === 0
    };
};

CommandBinaryBuffer.prototype.setSpecialDay = function ( specialDay: ISpecialDay ) {
    this.setUint8(specialDay.month);
    this.setUint8(specialDay.date);
    this.setUint8(specialDay.dayIndex);
    this.setUint8(+!specialDay.isPeriodic);
};

// https://gitlab.infomir.dev/electric_meters/emdoc/-/blob/master/src/deviceInfo/deviceType.md
CommandBinaryBuffer.prototype.getDeviceType = function (): IDeviceType {
    return DeviceType.fromBytes(this.getBytes(9));
};

CommandBinaryBuffer.prototype.setDeviceType = function ( deviceType: IDeviceType ) {
    this.setBytes(DeviceType.toBytes(deviceType));
};

CommandBinaryBuffer.prototype.getOperatorParameters = function (): IOperatorParameters {
    const operatorParameters = {
        vpThreshold: this.getUint32(),
        vThreshold: this.getUint32(),
        ipThreshold: this.getUint32(),
        pmaxThreshold0: this.getUint32(),
        pmaxThreshold1: this.getUint32(),
        pmaxThreshold2: this.getUint32(),
        pmaxThreshold3: this.getUint32(),
        speedOptoPort: this.getUint8(),
        tint: this.getUint8(),
        calcPeriodDate: this.getUint8(),
        timeoutDisplay: this.getUint8(),
        timeoutScreen: this.getUint8(),
        displaySet: (bitSet.toObject(displaySetMask, this.getUint32()) as unknown) as IDisplaySetOperatorParameter,
        relaySet4: (bitSet.toObject(relaySet4Mask, this.getUint8()) as unknown) as IRelaySet4OperatorParameter,
        relaySet3: (bitSet.toObject(relaySet3Mask, this.getUint8()) as unknown) as IRelaySet3OperatorParameter,
        relaySet2: (bitSet.toObject(relaySet2Mask, this.getUint8()) as unknown) as IRelaySet2OperatorParameter,
        relaySet1: (bitSet.toObject(relaySet1Mask, this.getUint8()) as unknown) as IRelaySet1OperatorParameter,
        displayType: this.getUint8(),
        ten: this.getUint8(),
        timeoutRefresh: this.getUint16(),
        deltaCorMin: this.getUint8(),
        timeoutMagnetOff: this.getUint8(),
        timeoutMagnetOn: this.getUint8(),
        define1: (bitSet.toObject(define1Mask, this.getUint8()) as unknown) as IDefine1OperatorParameter,
        timeoutRelayOn: this.getUint8(),
        timeoutRelayKey: this.getUint8(),
        timeoutRelayAuto: this.getUint8(),
        timeoutBadVAVB: this.getUint8(),
        freqMax: this.getUint8(),
        freqMin: this.getUint8(),
        phMin: this.getUint16(),
        year: this.getUint8(),
        month: this.getUint8(),
        date: this.getUint8(),
        energyDecimalPoint: this.getUint8(),
        typeMeter: this.getUint8(),
        timeoutIMax: this.getUint8(),
        timeoutPMax: this.getUint8(),
        timeoutCos: this.getUint8(),
        pMaxDef: this.getUint8(),
        displaySetExt: (bitSet.toObject(displaySetExtMask, this.getUint32()) as unknown) as IDisplaySetExtOperatorParameter,
        timeoutUneqCurrent: this.getUint8(),
        timeoutBipolarPower: this.getUint8(),
        relaySet5: (bitSet.toObject(relaySet5Mask, this.getUint8()) as unknown) as IRelaySet5OperatorParameter,
        timeCorrectPeriod: 0,
        timeCorrectPassHalfhour: false
    };

    const timeCorrectPeriod = this.getUint8();

    operatorParameters.timeCorrectPeriod = timeCorrectPeriod & 0x7f;
    operatorParameters.timeCorrectPassHalfhour = !!(timeCorrectPeriod & 0x80);

    return operatorParameters as IOperatorParameters;
};

CommandBinaryBuffer.prototype.setOperatorParameters = function ( operatorParameters: IOperatorParameters ) {
    const timeCorrectPeriod = operatorParameters.timeCorrectPeriod
        | (operatorParameters.timeCorrectPassHalfhour ? 0x80 : 0);

    this.setUint32(operatorParameters.vpThreshold);
    this.setUint32(operatorParameters.vThreshold);
    this.setUint32(operatorParameters.ipThreshold);
    this.setUint32(operatorParameters.pmaxThreshold0);
    this.setUint32(operatorParameters.pmaxThreshold1);
    this.setUint32(operatorParameters.pmaxThreshold2);
    this.setUint32(operatorParameters.pmaxThreshold3);
    this.setUint8(operatorParameters.speedOptoPort);
    this.setUint8(operatorParameters.tint);
    this.setUint8(operatorParameters.calcPeriodDate);
    this.setUint8(operatorParameters.timeoutDisplay);
    this.setUint8(operatorParameters.timeoutScreen);
    this.setUint32(bitSet.fromObject(displaySetMask, (operatorParameters.displaySet as unknown) as bitSet.TBooleanObject));
    this.setUint8(bitSet.fromObject(relaySet4Mask, (operatorParameters.relaySet4 as unknown) as bitSet.TBooleanObject));
    this.setUint8(bitSet.fromObject(relaySet3Mask, (operatorParameters.relaySet3 as unknown) as bitSet.TBooleanObject));
    this.setUint8(bitSet.fromObject(relaySet2Mask, (operatorParameters.relaySet2 as unknown) as bitSet.TBooleanObject));
    this.setUint8(bitSet.fromObject(relaySet1Mask, (operatorParameters.relaySet1 as unknown) as bitSet.TBooleanObject));
    this.setUint8(operatorParameters.displayType);
    this.setUint8(operatorParameters.ten);
    this.setUint16(operatorParameters.timeoutRefresh);
    this.setUint8(operatorParameters.deltaCorMin);
    this.setUint8(operatorParameters.timeoutMagnetOff);
    this.setUint8(operatorParameters.timeoutMagnetOn);
    this.setUint8(bitSet.fromObject(define1Mask, (operatorParameters.define1 as unknown) as bitSet.TBooleanObject));
    this.setUint8(operatorParameters.timeoutRelayOn);
    this.setUint8(operatorParameters.timeoutRelayKey);
    this.setUint8(operatorParameters.timeoutRelayAuto);
    this.setUint8(operatorParameters.timeoutBadVAVB);
    this.setUint8(operatorParameters.freqMax);
    this.setUint8(operatorParameters.freqMin);
    this.setUint16(operatorParameters.phMin);
    this.setUint8(operatorParameters.year);
    this.setUint8(operatorParameters.month);
    this.setUint8(operatorParameters.date);
    this.setUint8(operatorParameters.energyDecimalPoint);
    this.setUint8(operatorParameters.typeMeter);
    this.setUint8(operatorParameters.timeoutIMax);
    this.setUint8(operatorParameters.timeoutPMax);
    this.setUint8(operatorParameters.timeoutCos);
    this.setUint8(operatorParameters.pMaxDef);
    this.setUint32(bitSet.fromObject(displaySetExtMask, (operatorParameters.displaySetExt as unknown) as bitSet.TBooleanObject));
    this.setUint8(operatorParameters.timeoutUneqCurrent);
    this.setUint8(operatorParameters.timeoutBipolarPower);
    this.setUint8(bitSet.fromObject(relaySet5Mask, (operatorParameters.relaySet5 as unknown) as bitSet.TBooleanObject));
    this.setUint8(timeCorrectPeriod);
};

CommandBinaryBuffer.prototype.getPackedEnergyWithType = function (): IPackedEnergiesWithType {
    const byte = this.getUint8();
    const energyType = bitSet.extractBits(byte, TARIFF_NUMBER, 1);
    const energies = getPackedEnergies(this, energyType, byte);

    return {
        energyType,
        energies
    };
};

CommandBinaryBuffer.prototype.setPackedEnergyWithType = function ( {energyType, energies}: IPackedEnergiesWithType ) {
    if ( energyType ) {
        setPackedEnergyType(this, energyType, energies);
    }

    energies.forEach(energy => {
        if ( energy !== null ) {
            this.setUint32(energy);
        }
    });
};

CommandBinaryBuffer.prototype.getEnergies = function (): TEnergies {
    return new Array(TARIFF_NUMBER).fill(0).map(() => this.getInt32());
};

CommandBinaryBuffer.prototype.setEnergies = function ( energies: TEnergies ) {
    energies.forEach(value => this.setUint32(value));
};

CommandBinaryBuffer.prototype.getDate = function (): types.IDate {
    return {
        year: this.getUint8(),
        month: this.getUint8(),
        date: this.getUint8()
    };
};

CommandBinaryBuffer.prototype.setDate = function ( date: types.IDate ) {
    this.setUint8(date.year);
    this.setUint8(date.month);
    this.setUint8(date.date);
};

CommandBinaryBuffer.prototype.getSaldoParameters = function (): ISaldoParameters {
    return {
        coefficients: new Array(4).fill(0).map(() => this.getUint32()),
        decimalPointTariff: this.getUint8(),
        indicationThreshold: this.getInt32(),
        relayThreshold: this.getInt32(),
        mode: this.getUint8(),
        saldoOffTimeBegin: this.getUint8(),
        saldoOffTimeEnd: this.getUint8(),
        decimalPointIndication: this.getUint8(),
        powerThreshold: this.getUint32(),
        creditThreshold: this.getInt32()
    };
};

CommandBinaryBuffer.prototype.setSaldoParameters = function ( saldoParameters: ISaldoParameters ) {
    saldoParameters.coefficients.forEach(value => this.setUint32(value));
    this.setUint8(saldoParameters.decimalPointTariff);
    this.setInt32(saldoParameters.indicationThreshold);
    this.setInt32(saldoParameters.relayThreshold);
    this.setUint8(saldoParameters.mode);
    this.setUint8(saldoParameters.saldoOffTimeBegin);
    this.setUint8(saldoParameters.saldoOffTimeEnd);
    this.setUint8(saldoParameters.decimalPointIndication);
    this.setUint32(saldoParameters.powerThreshold);
    this.setInt32(saldoParameters.creditThreshold);
};

CommandBinaryBuffer.prototype.getEnergyPeriods = function ( periodsNumber: number ): Array<IEnergyPeriod> {
    const periods = new Array(periodsNumber).fill(0).map(() => this.getUint16());

    return periods.map(period => getEnergyPeriod(period));
};

CommandBinaryBuffer.prototype.setEnergyPeriods = function ( periods: Array<IEnergyPeriod> ) {
    periods.forEach(period => setEnergyPeriod(this, period));
};

CommandBinaryBuffer.prototype.getEventStatus = function (): IEventStatus {
    const eventStatus = this.getUint16();

    return (bitSet.toObject(eventStatusMask, eventStatus) as unknown) as IEventStatus;
};

CommandBinaryBuffer.prototype.setEventStatus = function ( parameters: IEventStatus ) {
    this.setUint16(bitSet.fromObject(eventStatusMask, (parameters as unknown) as bitSet.TBooleanObject));
};

CommandBinaryBuffer.prototype.getExtendedCurrentValues2 = function (): IExtendedCurrentValues2Parameters {
    const uBattery = this.getUint16();
    const relayStatus = bitSet.toObject(extendedCurrentValues2RelayStatusMask, this.getUint8()) as unknown as IExtendedCurrentValues2RelayStatus;
    const relayStatus2 = bitSet.toObject(extendedCurrentValues2RelayStatus2Mask, this.getUint8()) as unknown as IExtendedCurrentValues2RelayStatus2;
    const status1 = bitSet.toObject(extendedCurrentValues2Status1Mask, this.getUint8()) as unknown as IExtendedCurrentValues2Status1;
    const status2 = bitSet.toObject(extendedCurrentValues2Status2Mask, this.getUint8()) as unknown as IExtendedCurrentValues2Status2;
    const status3 = bitSet.toObject(extendedCurrentValues2Status3Mask, this.getUint8()) as unknown as IExtendedCurrentValues2Status3;

    return {
        uBattery,
        relayStatus,
        relayStatus2,
        status1,
        status2,
        status3
    };
};

CommandBinaryBuffer.prototype.setExtendedCurrentValues2 = function ( parameters: IExtendedCurrentValues2Parameters ) {
    const {
        uBattery,
        relayStatus,
        relayStatus2,
        status1,
        status2,
        status3
    } = parameters;

    this.setUint16(uBattery);
    this.setUint8(bitSet.fromObject(extendedCurrentValues2RelayStatusMask, (relayStatus as unknown) as bitSet.TBooleanObject));
    this.setUint8(bitSet.fromObject(extendedCurrentValues2RelayStatus2Mask, (relayStatus2 as unknown) as bitSet.TBooleanObject));
    this.setUint8(bitSet.fromObject(extendedCurrentValues2Status1Mask, (status1 as unknown) as bitSet.TBooleanObject));
    this.setUint8(bitSet.fromObject(extendedCurrentValues2Status2Mask, (status2 as unknown) as bitSet.TBooleanObject));
    this.setUint8(bitSet.fromObject(extendedCurrentValues2Status3Mask, (status3 as unknown) as bitSet.TBooleanObject));
};

CommandBinaryBuffer.prototype.getEvent = function (): IEvent {
    const data: IEvent = {
        hours: this.getUint8(),
        minutes: this.getUint8(),
        seconds: this.getUint8(),
        event: this.getUint8()
    };
    const {event} = data;
    const {bytesLeft} = this;

    data.eventName = eventNames[event];

    switch ( event ) {
        case events.POWER_OVER_RELAY_OFF:
            if ( bytesLeft < 4 ) {
                return data;
            }

            data.power = [this.getUint8(), this.getUint8(), this.getUint8(), this.getUint8()];
            break;

        case events.CMD_CHANGE_TIME:
        case events.TIME_CORRECT:
            if ( bytesLeft < 8 ) {
                return data;
            }

            data.newDate = this.getDateTime();
            break;

        default:
            break;
    }

    return data;
};

CommandBinaryBuffer.prototype.setEvent = function ( event: IEvent ) {
    this.setUint8(event.hours);
    this.setUint8(event.minutes);
    this.setUint8(event.seconds);
    this.setUint8(event.event);

    switch ( event.event ) {
        case events.POWER_OVER_RELAY_OFF:
            for ( const item of event.power ) {
                this.setUint8(item);
            }
            break;

        case events.CMD_CHANGE_TIME:
        case events.TIME_CORRECT:
            this.setDateTime(event.newDate);
            break;

        default: break;
    }
};

CommandBinaryBuffer.prototype.getDemand = function (): IGetDemandParameters {
    const date0 = this.getUint8();
    const date1 = this.getUint8();

    return {
        date: {
            year: date0 >> 1,
            month: ((date0 << 3) & 0x0f) | (date1 >> 5),
            date: date1 & 0x1f
        },
        energyType: this.getUint8(),
        firstIndex: this.getUint16(),
        count: this.getUint8(),
        period: this.getUint8()
    };
};

CommandBinaryBuffer.prototype.setDemand = function ( parameters: IGetDemandParameters ) {
    const date0 = (parameters.date.year << 1) | ((parameters.date.month >> 3) & 0x01);
    const date1 = ((parameters.date.month << 5) & 0xe0) | (parameters.date.date & 0x1f);

    this.setUint8(date0);
    this.setUint8(date1);
    this.setUint8(parameters.energyType);
    this.setUint16(parameters.firstIndex);
    this.setUint8(parameters.count);
    this.setUint8(parameters.period);
};

CommandBinaryBuffer.prototype.getDayMaxDemandResponse = function (): IGetDayMaxDemandResponseParameters {
    const date = this.getDate();

    // 4 tariffs
    const power = new Array(TARIFF_NUMBER).fill(0).map(() => ({
        hours: this.getUint8(),
        minutes: this.getUint8(),
        power: this.getUint32()
    }));

    return {date, power};
};

CommandBinaryBuffer.prototype.setDayMaxDemandResponse = function ( parameters: IGetDayMaxDemandResponseParameters ) {
    this.setDate(parameters.date);

    parameters.power.forEach(value => {
        this.setUint8(value.hours);
        this.setUint8(value.minutes);
        this.setUint32(value.power);
    });
};

CommandBinaryBuffer.prototype.getOperatorParametersExtended3 = function (): IOperatorParametersExtended3 {
    return {
        pmaxMinusThreshold0: this.getUint32(),
        pmaxMinusThreshold1: this.getUint32(),
        pmaxMinusThreshold2: this.getUint32(),
        pmaxMinusThreshold3: this.getUint32(),
        relaySet: (bitSet.toObject(operatorParametersExtended3RelaySetMask, this.getUint8()) as unknown) as IOperatorParametersExtended3RelaySet
    };
};

CommandBinaryBuffer.prototype.setOperatorParametersExtended3 = function ( parameters: IOperatorParametersExtended3 ) {
    const {pmaxMinusThreshold0, pmaxMinusThreshold1, pmaxMinusThreshold2, pmaxMinusThreshold3, relaySet} = parameters;

    this.setUint32(pmaxMinusThreshold0);
    this.setUint32(pmaxMinusThreshold1);
    this.setUint32(pmaxMinusThreshold2);
    this.setUint32(pmaxMinusThreshold3);
    this.setUint8(bitSet.fromObject(operatorParametersExtended3RelaySetMask, (relaySet as unknown) as bitSet.TBooleanObject));
};

CommandBinaryBuffer.prototype.getMonthMaxPowerByTariffs = function () {
    return new Array(TARIFF_NUMBER).fill(0).map(() => ({
        date: this.getUint8(),
        hours: this.getUint8(),
        minutes: this.getUint8(),
        power: this.getUint32()
    }));
};

CommandBinaryBuffer.prototype.setMonthMaxPowerByTariffs = function ( tariffs: Array<IMonthMaxPower> ) {
    tariffs.forEach(tariff => {
        this.setUint8(tariff.date);
        this.setUint8(tariff.hours);
        this.setUint8(tariff.minutes);
        this.setUint32(tariff.power);
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

export default CommandBinaryBuffer;
