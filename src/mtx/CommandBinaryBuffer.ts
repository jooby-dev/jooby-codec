import BinaryBuffer from '../utils/BinaryBuffer.js';
import * as bitSet from '../utils/bitSet.js';
import {IDeviceType} from './utils/deviceType.js';
import * as DeviceType from './utils/deviceType.js';
import getHexFromBytes from '../utils/getHexFromBytes.js';
import getBytesFromHex from '../utils/getBytesFromHex.js';
import {IDateTime, ITimeCorrectionParameters} from './utils/dateTime.js';


export const frameHeaderSize = 5;

export interface IFrameHeader {
    type: number,
    source: number,
    destination: number
}

export interface ITariffPlan {
    id: number,
    tariffSet: number,
    activateYear: number,
    activateMonth: number,
    activateDay: number,
    specialProfilesArraySize: number,
    seasonProfilesArraySize: number,
    dayProfilesArraySize: number
}

export interface IDisplaySetBaseOperatorParameter {
    TEST_D: boolean,
    VERSION_D: boolean,
    WH_D: boolean,
    WH_T1_D: boolean,
    WH_T2_D: boolean,
    WH_T3_D: boolean,
    WH_T4_D: boolean,
    POWER_D: boolean,
    POWERB_D: boolean,
    IRMS_D: boolean,
    IRMSB_D: boolean,
    VRMS_D: boolean,
    TIME_D: boolean,
    DATE_D: boolean,
    WH_EXP_D: boolean,
    WH_EXP_T1_D: boolean,
    WH_EXP_T2_D: boolean,
    WH_EXP_T3_D: boolean,
    WH_EXP_T4_D: boolean,
    PF_A: boolean,
    PF_B: boolean,
    VBAT: boolean,
    POWER_THRESHOLD_T0: boolean,
    POWER_THRESHOLD_T1: boolean,
    POWER_THRESHOLD_T2: boolean,
    POWER_THRESHOLD_T3: boolean,
    SALDO_D: boolean,
}

export interface IDisplaySetOperatorParameter extends IDisplaySetBaseOperatorParameter {
    SCROLL_D: boolean
}

export interface IDisplaySetExtOperatorParameter extends IDisplaySetBaseOperatorParameter {
    MAGNET_TESLA: boolean,
    SPEED_D: boolean,
    NEW_SORT_DISPLAY: boolean
}

export interface IRelaySet1OperatorParameter {
    RELAY_ON_Y: boolean,
    RELAY_ON_CENTER: boolean,
    RELAY_ON_PB: boolean,
    RELAY_ON_TARIFF_0: boolean,
    RELAY_ON_TARIFF_1: boolean,
    RELAY_ON_TARIFF_2: boolean,
    RELAY_ON_TARIFF_3: boolean,
    RELAY_ON_V_GOOD: boolean
}

export interface IRelaySet2OperatorParameter {
    RELAY_OFF_Y: boolean,
    RELAY_OFF_CENTER: boolean,
    RELAY_OFF_TARIFF_0: boolean,
    RELAY_OFF_TARIFF_1: boolean,
    RELAY_OFF_TARIFF_2: boolean,
    RELAY_OFF_TARIFF_3: boolean,
    RELAY_OFF_I_LIMIT: boolean,
    RELAY_OFF_V_BAD: boolean
}

export interface IRelaySet3OperatorParameter {
    RELAY_OFF_LIM_TARIFF_0: boolean,
    RELAY_OFF_LIM_TARIFF_1: boolean,
    RELAY_OFF_LIM_TARIFF_2: boolean,
    RELAY_OFF_LIM_TARIFF_3: boolean,
    RELAY_OFF_PF_MIN: boolean
}

export interface IRelaySet4OperatorParameter {
    RELAY_ON_TIMEOUT: boolean,
    RELAY_ON_SALDO: boolean,
    RELAY_OFF_SALDO: boolean,
    RELAY_OFF_SALDO_SOFT: boolean,
    RELAY_OFF_MAGNET: boolean,
    RELAY_ON_MAGNET_TIMEOUT: boolean,
    RELAY_ON_MAGNET_AUTO: boolean
}

export interface IRelaySet5OperatorParameter {
    RELAY_OFF_UNEQUAL_CURRENT: boolean,
    RELAY_ON_UNEQUAL_CURRENT: boolean,
    RELAY_OFF_BIPOLAR_POWER: boolean,
    RELAY_ON_BIPOLAR_POWER: boolean
}

export interface IDefine1OperatorParameter {
    BLOCK_KEY_OPTOPORT: boolean,
    MAGNET_SCREEN_CONST: boolean
}

export interface IOperatorParameters {
    vpThreshold: number,
    vThreshold: number,
    ipThreshold: number,
    pmaxThreshold0: number,
    pmaxThreshold1: number,
    pmaxThreshold2: number,
    pmaxThreshold3: number,
    speedOptoPort: number,
    tint: number,
    calcPeriodDate: number,
    timeoutDisplay: number,
    timeoutScreen: number,
    displaySet: IDisplaySetOperatorParameter,
    relaySet4: IRelaySet4OperatorParameter,
    relaySet3: IRelaySet3OperatorParameter,
    relaySet2: IRelaySet2OperatorParameter,
    relaySet1: IRelaySet1OperatorParameter,
    displayType: number,
    ten: number,
    timeoutRefresh: number,
    deltaCorMin: number,
    timeoutMagnetOff: number,
    timeoutMagnetOn: number,
    define1: IDefine1OperatorParameter,
    timeoutRelayOn: number,
    timeoutRelayKey: number,
    timeoutRelayAuto: number,
    timeoutBadVAVB: number,
    freqMax: number,
    freqMin: number,
    phMin: number,
    year: number,
    month: number,
    date: number,
    energyDecimalPoint: number,
    typeMeter: number,
    timeoutIMax: number,
    timeoutPMax: number,
    timeoutCos: number,
    pMaxDef: number,
    displaySetExt: IDisplaySetExtOperatorParameter,
    timeoutUneqCurrent: number,
    timeoutBipolarPower: number,
    relaySet5: IRelaySet5OperatorParameter,
    timeCorrectPeriod: number,
    timeCorrectPassHalfhour: boolean,
}

export interface IDayProfile {
    hour: number,
    isFirstHalfHour: boolean,
    tariff: number
}

export interface ISeasonProfile {
    month: number,
    date: number,
    /** index 0 is for Sunday */
    dayIndexes: Array<number>
}

export interface ISpecialDay {
    month: number,
    date: number,
    dayIndex: number,
    isPeriodic: boolean
}

export interface IDeviceId {
    /** 001a79 */
    manufacturer: string,
    /**
     * 01 – MTX 1;
     * 02 – MTX 3 direct (old);
     * 03 – MTX 3 transformer (old);
     * 04 – MTX 3 direct;
     * 05 – MTX 3 transformer;
     * 11 – MTX 1 new (two shunts);
     * 12 – MTX 3 direct new (shunts);
     * 13 – MTX 3 transformer new;
     * 14 – MTX 1 pole;
     * 15 – MTX RD remote display;
     * 16 – MTX RR repeater;
     * 21 – MTX 1 new, current transformers;
     * 22 – MTX 3 direct new, current transformers;
     * 80 – RF module
     * 81 - water meter
     */
    type: number,
    year: number,
    /** length is 6, for example 1b1d6a */
    serial: string
}

export {IDeviceType};

export interface ISaldoParameters {
    coefficients: Array<number>,
    decimalPointTariff: number,
    indicationThreshold: number,
    relayThreshold: number,
    mode: number,
    saldoOffTimeBegin: number,
    saldoOffTimeEnd: number,
    decimalPointIndication: number,
    powerThreshold: number,
    creditThreshold: number
}

export const TARIFF_PLAN_SIZE = 11;
export const OPERATOR_PARAMETERS_SIZE = 74;
export const SEASON_PROFILE_DAYS_NUMBER = 7;
export const SEASON_PROFILE_SIZE = 2 + SEASON_PROFILE_DAYS_NUMBER;


const displaySetMask = {
    TEST_D: 0x0001,
    VERSION_D: 0x0002,
    WH_D: 0x0004,
    WH_T1_D: 0x0008,
    WH_T2_D: 0x0010,
    WH_T3_D: 0x0020,
    WH_T4_D: 0x0040,
    POWER_D: 0x0080,
    POWERB_D: 0x0100,
    IRMS_D: 0x0200,
    IRMSB_D: 0x0400,
    VRMS_D: 0x0800,
    TIME_D: 0x1000,
    DATE_D: 0x2000,
    WH_EXP_D: 0x4000,
    WH_EXP_T1_D: 0x8000,
    WH_EXP_T2_D: 0x00010000,
    WH_EXP_T3_D: 0x00020000,
    WH_EXP_T4_D: 0x00040000,
    PF_A: 0x00080000,
    PF_B: 0x00100000,
    VBAT: 0x00200000,
    POWER_THRESHOLD_T0: 0x00400000,
    POWER_THRESHOLD_T1: 0x00800000,
    POWER_THRESHOLD_T2: 0x01000000,
    POWER_THRESHOLD_T3: 0x02000000,
    SALDO_D: 0x20000000,
    SCROLL_D: 0x80000000
};

const displaySetExtMask = {
    TEST_D: 0x0001,
    VERSION_D: 0x0002,
    WH_D: 0x0004,
    WH_T1_D: 0x0008,
    WH_T2_D: 0x0010,
    WH_T3_D: 0x0020,
    WH_T4_D: 0x0040,
    POWER_D: 0x0080,
    POWERB_D: 0x0100,
    IRMS_D: 0x0200,
    IRMSB_D: 0x0400,
    VRMS_D: 0x0800,
    TIME_D: 0x1000,
    DATE_D: 0x2000,
    WH_EXP_D: 0x4000,
    WH_EXP_T1_D: 0x8000,
    WH_EXP_T2_D: 0x00010000,
    WH_EXP_T3_D: 0x00020000,
    WH_EXP_T4_D: 0x00040000,
    PF_A: 0x00080000,
    PF_B: 0x00100000,
    VBAT: 0x00200000,
    POWER_THRESHOLD_T0: 0x00400000,
    POWER_THRESHOLD_T1: 0x00800000,
    POWER_THRESHOLD_T2: 0x01000000,
    POWER_THRESHOLD_T3: 0x02000000,
    MAGNET_TESLA: 0x08000000,
    SALDO_D: 0x20000000,
    SPEED_D: 0x40000000,
    NEW_SORT_DISPLAY: 0x80000000
};

const relaySet1Mask = {
    RELAY_ON_Y: 0x01,
    RELAY_ON_CENTER: 0x02,
    RELAY_ON_PB: 0x04,
    RELAY_ON_TARIFF_0: 0x08,
    RELAY_ON_TARIFF_1: 0x10,
    RELAY_ON_TARIFF_2: 0x20,
    RELAY_ON_TARIFF_3: 0x40,
    RELAY_ON_V_GOOD: 0x80
};

const relaySet2Mask = {
    RELAY_OFF_Y: 0x01,
    RELAY_OFF_CENTER: 0x02,
    RELAY_OFF_TARIFF_0: 0x04,
    RELAY_OFF_TARIFF_1: 0x08,
    RELAY_OFF_TARIFF_2: 0x10,
    RELAY_OFF_TARIFF_3: 0x20,
    RELAY_OFF_I_LIMIT: 0x40,
    RELAY_OFF_V_BAD: 0x80
};

const relaySet3Mask = {
    RELAY_OFF_LIM_TARIFF_0: 0x02,
    RELAY_OFF_LIM_TARIFF_1: 0x04,
    RELAY_OFF_LIM_TARIFF_2: 0x08,
    RELAY_OFF_LIM_TARIFF_3: 0x10,
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

/**
 * Command specific byte array manipulation.
 */
class CommandBinaryBuffer extends BinaryBuffer {
    constructor ( dataOrLength: Uint8Array | number | string ) {
        // force BE for all numbers
        super(dataOrLength, false);
    }

    getFrameHeader (): IFrameHeader {
        return {
            type: this.getUint8(),
            destination: this.getUint16(),
            source: this.getUint16()
        };
    }

    setFrameHeader ( frameHeader: IFrameHeader ) {
        this.setUint8(frameHeader.type);
        this.setUint16(frameHeader.destination);
        this.setUint16(frameHeader.source);
    }

    getDateTime (): IDateTime {
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
    }

    setDateTime ( dateTime: IDateTime ) {
        this.setUint8(dateTime.isSummerTime ? 1 : 0);
        this.setUint8(dateTime.seconds);
        this.setUint8(dateTime.minutes);
        this.setUint8(dateTime.hours);
        this.setUint8(dateTime.day || 0);
        this.setUint8(dateTime.date);
        this.setUint8(dateTime.month);
        this.setUint8(dateTime.year);
    }

    getTariffPlan (): ITariffPlan {
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
    }

    setTariffPlan ( tariffPlan: ITariffPlan ) {
        this.setUint32(tariffPlan.id);
        this.setUint8(tariffPlan.tariffSet);
        this.setUint8(tariffPlan.activateYear);
        this.setUint8(tariffPlan.activateMonth);
        this.setUint8(tariffPlan.activateDay);
        this.setUint8(tariffPlan.specialProfilesArraySize);
        this.setUint8(tariffPlan.seasonProfilesArraySize);
        this.setUint8(tariffPlan.dayProfilesArraySize);
    }

    static getDefaultOperatorParameters (): IOperatorParameters {
        return {
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
        };
    }

    getOperatorParameters (): IOperatorParameters {
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
            timeoutRefresh: this.getInt16(),
            deltaCorMin: this.getUint8(),
            timeoutMagnetOff: this.getUint8(),
            timeoutMagnetOn: this.getUint8(),
            define1: (bitSet.toObject(define1Mask, this.getUint8()) as unknown) as IDefine1OperatorParameter,
            timeoutRelayOn: this.getUint8(),
            timeoutRelayKey: this.getUint8(),
            timeoutRelayAuto: this.getUint8(),
            timeoutBadVAVB: this.getUint8(),
            freqMax: this.getInt8(),
            freqMin: this.getInt8(),
            phMin: this.getInt16(),
            year: this.getInt8(),
            month: this.getInt8(),
            date: this.getInt8(),
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
    }

    setOperatorParameters ( operatorParameters: IOperatorParameters ) {
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
        this.setInt8(operatorParameters.freqMax);
        this.setInt8(operatorParameters.freqMin);
        this.setInt16(operatorParameters.phMin);
        this.setInt8(operatorParameters.year);
        this.setInt8(operatorParameters.month);
        this.setInt8(operatorParameters.date);
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
    }

    static getDayProfileFromByte ( value: number ): IDayProfile {
        return {
            tariff: bitSet.extractBits(value, 2, 1),
            isFirstHalfHour: !bitSet.extractBits(value, 1, 3),
            hour: bitSet.extractBits(value, 5, 4)
        };
    }

    static getByteFromDayProfile ( dayProfile: IDayProfile ): number {
        let value = 0;

        value = bitSet.fillBits(value, 2, 1, dayProfile.tariff);
        value = bitSet.fillBits(value, 1, 3, +!dayProfile.isFirstHalfHour);
        value = bitSet.fillBits(value, 5, 4, dayProfile.hour);

        return value;
    }

    getDayProfile (): IDayProfile {
        return CommandBinaryBuffer.getDayProfileFromByte(this.getUint8());
    }

    setDayProfile ( dayProfile: IDayProfile ) {
        this.setUint8(CommandBinaryBuffer.getByteFromDayProfile(dayProfile));
    }

    static getDefaultSeasonProfile (): ISeasonProfile {
        return {
            month: 1,
            date: 1,
            dayIndexes: [0, 0, 0, 0, 0, 0, 0]
        };
    }

    getSeasonProfile (): ISeasonProfile {
        return {
            month: this.getUint8(),
            date: this.getUint8(),
            dayIndexes: Array.from(
                {length: SEASON_PROFILE_DAYS_NUMBER},
                () => this.getUint8()
            )
        };
    }

    setSeasonProfile ( seasonProfile: ISeasonProfile ) {
        this.setUint8(seasonProfile.month);
        this.setUint8(seasonProfile.date);
        seasonProfile.dayIndexes.forEach(value => this.setUint8(value));
    }

    getSpecialDay (): ISpecialDay {
        return {
            month: this.getUint8(),
            date: this.getUint8(),
            dayIndex: this.getUint8(),
            isPeriodic: this.getUint8() === 0
        };
    }

    setSpecialDay ( specialDay: ISpecialDay ) {
        this.setUint8(specialDay.month);
        this.setUint8(specialDay.date);
        this.setUint8(specialDay.dayIndex);
        this.setUint8(+!specialDay.isPeriodic);
    }

    // https://gitlab.infomir.dev/electric_meters/emdoc/-/blob/master/src/deviceInfo/deviceId.md
    getDeviceId (): IDeviceId {
        const manufacturer = getHexFromBytes(this.getBytes(3), {separator: ''});
        const type = this.getUint8();
        const year = this.getUint8() + 2000;
        const serial = getHexFromBytes(this.getBytes(3), {separator: ''});

        return {manufacturer, type, year, serial};
    }

    setDeviceId ( {manufacturer, type, year, serial}: IDeviceId ) {
        this.setBytes(getBytesFromHex(manufacturer));
        this.setUint8(type);
        this.setUint8(year - 2000);
        this.setBytes(getBytesFromHex(serial));
    }

    // https://gitlab.infomir.dev/electric_meters/emdoc/-/blob/master/src/deviceInfo/deviceType.md
    getDeviceType (): IDeviceType {
        return DeviceType.fromBytes(this.getBytes(9));
    }

    setDeviceType ( deviceType: IDeviceType ) {
        this.setBytes(DeviceType.toBytes(deviceType));
    }

    static getDefaultTimeCorrectionParameters (): ITimeCorrectionParameters {
        return {
            monthTransitionSummer: 3,
            dateTransitionSummer: 0,
            hoursTransitionSummer: 3,
            hoursCorrectSummer: 1,
            monthTransitionWinter: 10,
            dateTransitionWinter: 0,
            hoursTransitionWinter: 4,
            hoursCorrectWinter: 1,
            isCorrectionNeeded: true
        };
    }

    getTimeCorrectionParameters (): ITimeCorrectionParameters {
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
    }

    setTimeCorrectionParameters ( parameters: ITimeCorrectionParameters ) {
        this.setUint8(parameters.monthTransitionSummer);
        this.setUint8(parameters.dateTransitionSummer);
        this.setUint8(parameters.hoursTransitionSummer);
        this.setUint8(parameters.hoursCorrectSummer);
        this.setUint8(parameters.monthTransitionWinter);
        this.setUint8(parameters.dateTransitionWinter);
        this.setUint8(parameters.hoursTransitionWinter);
        this.setUint8(parameters.hoursCorrectWinter);
        this.setUint8(+parameters.isCorrectionNeeded);
    }

    getSaldoParameters (): ISaldoParameters {
        return {
            coefficients: Array.from({length: 4}, () => this.getUint32()),
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
    }

    setSaldoParameters ( saldoParameters: ISaldoParameters ) {
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
    }
}


export default CommandBinaryBuffer;
