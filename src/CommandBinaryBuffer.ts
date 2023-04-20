import BinaryBuffer from './BinaryBuffer.js';
import * as bitSet from './utils/bitSet.js';
import {getDateFromSeconds, getSecondsFromDate, TTime2000} from './utils/time.js';
import * as hardwareTypes from './constants/hardwareTypes.js';
import * as deviceParameters from './constants/deviceParameters.js';


export interface IBatteryVoltage {
    /**
     * battery voltage value at low consumption, in mV;
     *
     * 4095 === undefined
     */
    low: number | undefined,

    /**
     * battery voltage value at hight consumption, in mV;
     *
     * 4095 === undefined
     */
    high: number | undefined
}

export interface IChannel {
    /**
     * Channel number.
     */
    index: number
}

export interface IChannelValue extends IChannel {
    /**
     * Pulse counter or absolute value of device channel.
     */
    value: number
}

export interface IChannelHours extends IChannelValue {
    /**
     * values differences between hours
     */
    diff: Array<number>
}

export interface IChannelHourAbsoluteValue extends IChannelHours {
    /**
     * Channel pulse coefficient - IPK in bytes.
     */
    pulseCoefficient: number
}

export interface IChannelDays extends IChannel {
    dayList: Array<number>
}

export interface IChannelAbsoluteValue extends IChannelValue {

    /**
     * Channel pulse coefficient - IPK in bytes.
     */
    pulseCoefficient: number
}

export interface IChannelArchiveDaysAbsolute extends IChannel {
    /**
     * values by days
     */
    dayList: Array<number>,

    /**
     * Channel pulse coefficient - IPK in bytes.
     */
    pulseCoefficient: number
}

export interface IChannelArchiveDays extends IChannel {
    /**
     * values by days
     */
    dayList: Array<number>
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

export interface IEventWaterStatus {
    /** the battery voltage has dropped below the set threshold */
    isBatteryLow?: boolean,
    /** the device has detected a loss of connection to the server */
    isConnectionLost?: boolean
}

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
 * TODO:
 */
// interface IParameterDataSendingInterval {
//     seconds: number
// }

/**
 * The parameter defines the hour of the day by which the daily consumption is calculated.
 * deviceParameters.DAY_CHECKOUT_HOUR = `4`.
 */
interface IParameterDayCheckoutHour {
    value: number
}

/**
 * Type of data from device.
 * deviceParameters.OUTPUT_DATA_TYPE = `5`.
 */
interface IParameterOutputDataType {
    /**
     * | value | type              |
     * |-------|-------------------|
     * | 0     | hour (by default) |
     * | 1     | day               |
     * | 2     | current           |
     * | 3     | hour + day        |
     *
     */
    type: number
}

/**
 * Device activation method in LoRaWAN network.
 * deviceParameters.ACTIVATION_METHOD = `9`.
 */
interface IParameterActivationMethod {
    /**
     * `0` (by default) - OTAA, `1` - ABP
     * | value | type               |
     * |-------|--------------------|
     * | 0     | OTAA ( by default) |
     * | 1     | ABP                |
     *
     */
    type: number
}

/**
 * Initial values for pulse devices.
 * deviceParameters.INITIAL_DATA = `23`.
 */
interface IParameterInitialData {
    /**
     * 4 byte int BE
     */
    value: number

    /**
     * 4 byte int BE
     */
    meterValue: number,

    pulseCoefficient: number
}

/**
 * Data type sending from device - absolute or not.
 * deviceParameters.ABSOLUTE_DATA_STATUS = `24`
 */
interface IParameterAbsoluteDataStatus {
    /* 1 - absolute data sending enabled, 0 - disabled, device send pulse counter  */
    status: number
}

/**
 * Initial values for multi-channel devices.
 * deviceParameters.INITIAL_DATA_MULTI_CHANNEL = `29`.
 */
interface IParameterInitialDataMC extends IParameterInitialData {
    /**
     * Channel that accept initial values.
     */
    channel: number
}

/**
 * Data type sending from device - absolute or not, multi-channel devices.
 * deviceParameters.ABSOLUTE_DATA_STATUS_MULTI_CHANNEL = `30`
 */
interface IParameterAbsoluteDataStatusMC extends IParameterAbsoluteDataStatus {
    /**
     * Channel that accept status changing.
     */
    channel: number
}

export interface IParameter {
    id: number,
    data: TParameterData
}

export type TEventStatus =
    IEventGasStatus |
    IEvent2ChannelStatus |
    IEventElimpStatus |
    IEventWaterStatus |
    IEvent4ChannelStatus |
    IEventMtxStatus;

/* sorted by parameter id */
type TParameterData =
    IParameterOutputDataType |
    IParameterDayCheckoutHour |
    IParameterActivationMethod |
    IParameterInitialData |
    IParameterAbsoluteDataStatus |
    IParameterInitialDataMC |
    IParameterAbsoluteDataStatusMC;


const INITIAL_YEAR = 2000;
const MONTH_BIT_SIZE = 4;
const DATE_BIT_SIZE = 5;
const YEAR_START_INDEX = 1;
const UNKNOWN_BATTERY_VOLTAGE = 4095;
const EXTEND_BIT_MASK = 0x80;
const LAST_BIT_INDEX = 7;

const GAS_HARDWARE_TYPES = [
    hardwareTypes.GAZM0,
    hardwareTypes.GAZM0NEW,
    hardwareTypes.GAZM3,
    hardwareTypes.GAZWLE
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
const WATER_HARDWARE_TYPES = [
    hardwareTypes.WATER
];
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
const waterBitMask = {
    isBatteryLow: 2 ** 0,
    isConnectionLost: 2 ** 3
};
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
    [deviceParameters.INITIAL_DATA, 9 + 1],
    [deviceParameters.ABSOLUTE_DATA_STATUS, 1 + 1],
    [deviceParameters.INITIAL_DATA_MULTI_CHANNEL, 10 + 1],
    [deviceParameters.ABSOLUTE_DATA_STATUS_MULTI_CHANNEL, 2 + 1]
]);

const byteToPulseCoefficientMap = new Map([
    [0x80, 1000],
    [0x81, 5000],
    [0x82, 100],
    [0x83, 10],
    [0x84, 1],
    [0x85, 0.1],
    [0x86, 0.01]
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
     * Get amount of bytes necessary to store an extended value.
     *
     * @param bits - amount of bits of original value
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
        const size = parametersSizeMap.get(parameter.id);

        if ( size === undefined ) {
            throw new Error('unknown parameter id');
        }

        return size;
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
        let channelIndex = 0;

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
        // sort channels by index
        channelList.sort((a, b) => a.index - b.index);

        // find max channel to detect amount of bytes
        const maxChannel = Math.max(...channelList.map(({index}) => index));
        const size = (maxChannel - (maxChannel % LAST_BIT_INDEX)) / LAST_BIT_INDEX;
        const data = new Array(size + 1).fill(0);

        let byte = 0;

        data.forEach((_, byteIndex) => {
            // max channel index in one byte - 6
            let channelIndex = byteIndex * LAST_BIT_INDEX;
            const maxChannelIndex = channelIndex + LAST_BIT_INDEX;

            while ( channelIndex < maxChannelIndex ) {
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                const channel = channelList.find((item => item.index === channelIndex));

                if ( channel !== undefined ) {
                    // set channel bit
                    byte |= 1 << (channel.index % LAST_BIT_INDEX);
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
            date = getDateFromSeconds(dateOrTime);
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
     * Retrieve device time from byte array.
     *
     * @example
     * 0xb8 = 0b10111000 will be {hours: 0b101, hour: 0b11000} i.e. {hours: 5, hour: 24}
     */
    getHours () {
        const byte = this.getUint8();

        let hours = (byte & 0xe0) >> 5;
        const hour = byte & 0x1f;

        // TODO: add link to doc
        hours = hours === 0 ? 1 : hours;

        return {hours, hour};
    }

    setHours ( hour: number, hours: number ): void {
        let hourAmount = hours;

        // TODO: add link to doc
        if ( hourAmount === 1 ) {
            hourAmount = 0;
        }

        this.setUint8(((hourAmount & 0x07) << 5) | (hour & 0x1f));
    }

    getTime (): TTime2000 {
        return this.getUint32(false);
    }

    setTime ( value: TTime2000 ): void {
        return this.setUint32(value, false);
    }

    getBatterVoltage (): IBatteryVoltage {
        let high;
        let low;

        const lowVoltageByte = this.getUint8();
        const lowAndHightVoltageByte = this.getUint8();
        const highVoltageByte = this.getUint8();

        low = lowVoltageByte << 4;
        low |= (lowAndHightVoltageByte & 0xf0) >> 4;

        high = ((lowAndHightVoltageByte & 0x0f) << 8) | highVoltageByte;

        if ( high === UNKNOWN_BATTERY_VOLTAGE ) {
            high = undefined;
        }

        if ( low === UNKNOWN_BATTERY_VOLTAGE ) {
            low = undefined;
        }

        return {low, high};
    }

    setBatterVoltage ( batteryVoltage: IBatteryVoltage ): void {
        let {low, high} = batteryVoltage;

        if ( low === undefined ) {
            low = UNKNOWN_BATTERY_VOLTAGE;
        }

        if ( high === undefined ) {
            high = UNKNOWN_BATTERY_VOLTAGE;
        }

        const lowVoltageByte = (low >> 4) & 0xff;
        const lowAndHighVoltageByte = ((low & 0x0f) << 4) | ((high >> 8) & 0x0f);
        const highVoltageByte = high & 0xff;

        [lowVoltageByte, lowAndHighVoltageByte, highVoltageByte].forEach(byte => this.setUint8(byte));
    }

    getChannelsValuesWithHourDiff (): {hours: number, startTime: TTime2000, channelList: Array<IChannelHours>} {
        const date = this.getDate();
        const {hour, hours} = this.getHours();
        const channels = this.getChannels();
        const channelList: Array<IChannelHours> = [];

        date.setUTCHours(hour);

        channels.forEach(channelIndex => {
            const diff: Array<number> = [];

            // decode hour value for channel
            const value = this.getExtendedValue();

            for ( let diffHour = 0; diffHour < hours; ++diffHour ) {
                diff.push(this.getExtendedValue());
            }

            channelList.push({
                value,
                diff,
                index: channelIndex
            });
        });

        return {channelList, hours, startTime: getSecondsFromDate(date)};
    }

    setChannelsValuesWithHourDiff ( hours: number, startTime: TTime2000, channelList: Array<IChannelHours> ): void {
        const date = getDateFromSeconds(startTime);
        const hour = date.getUTCHours();

        this.setDate(date);
        this.setHours(hour, hours);
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
                // IPK_${channelIndex}
                pulseCoefficient: this.getUint8(),
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
            this.setUint8(pulseCoefficient);
            this.setExtendedValue(value);
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
        } else if ( WATER_HARDWARE_TYPES.includes(hardwareType) ) {
            status = bitSet.toObject(waterBitMask, this.getUint8());
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
        } else if ( WATER_HARDWARE_TYPES.includes(hardwareType) ) {
            this.setUint8(bitSet.fromObject(waterBitMask, status as bitSet.TBooleanObject));
        } else if ( FOUR_CHANNELS_HARDWARE_TYPES.includes(hardwareType) ) {
            this.setExtendedValue(bitSet.fromObject(fourChannelBitMask, status as bitSet.TBooleanObject));
        } else if ( MTX_HARDWARE_TYPES.includes(hardwareType) ) {
            this.setUint16(bitSet.fromObject(mtxBitMask, status as bitSet.TBooleanObject));
        } else {
            throw new Error('wrong hardwareType');
        }
    }

    private getPulseCoefficient (): number {
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

    private setPulseCoefficient ( value: number ): void {
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

    private getParameterInitialData (): IParameterInitialData {
        return {
            meterValue: this.getUint32(false),
            pulseCoefficient: this.getPulseCoefficient(),
            value: this.getUint32(false)
        };
    }

    private setParameterInitialData ( parameter: IParameterInitialData ): void {
        this.setUint32(parameter.meterValue, false);
        this.setPulseCoefficient(parameter.pulseCoefficient);
        this.setUint32(parameter.value, false);
    }

    private getParameterInitialDataMC (): IParameterInitialDataMC {
        return {
            channel: this.getUint8(),
            meterValue: this.getUint32(false),
            pulseCoefficient: this.getPulseCoefficient(),
            value: this.getUint32(false)
        };
    }

    private setParameterInitialDataMC ( parameter: IParameterInitialDataMC ): void {
        this.setUint8(parameter.channel);
        this.setUint32(parameter.meterValue, false);
        this.setPulseCoefficient(parameter.pulseCoefficient);
        this.setUint32(parameter.value, false);
    }

    private getParameterAbsoluteDataStatus (): IParameterAbsoluteDataStatus {
        return {status: this.getUint8()};
    }

    private setParameterAbsoluteDataStatus ( parameter: IParameterAbsoluteDataStatus ): void {
        this.setUint8(parameter.status);
    }

    private getParameterAbsoluteDataStatusMC (): IParameterAbsoluteDataStatusMC {
        return {
            channel: this.getUint8(),
            status: this.getUint8()
        };
    }

    private setParameterAbsoluteDataStatusMC ( parameter: IParameterAbsoluteDataStatusMC ): void {
        this.setUint8(parameter.channel);
        this.setUint8(parameter.status);
    }

    private getParameterActivationMethod (): IParameterActivationMethod {
        return {
            type: this.getUint8()
        };
    }

    private setParameterActivationMethod ( parameter: IParameterActivationMethod ): void {
        this.setUint8(parameter.type);
    }

    private getOutputDataType (): IParameterOutputDataType {
        return {
            type: this.getUint8()
        };
    }

    private setOutputDataType ( parameter: IParameterOutputDataType ): void {
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

    getParameter (): IParameter {
        const id = this.getUint8();
        let data;

        switch ( id ) {
            case deviceParameters.OUTPUT_DATA_TYPE:
                data = this.getOutputDataType();
                break;

            case deviceParameters.DAY_CHECKOUT_HOUR:
                data = this.getParameterDayCheckoutHour();
                break;

            case deviceParameters.ACTIVATION_METHOD:
                data = this.getParameterActivationMethod();
                break;

            case deviceParameters.INITIAL_DATA:
                data = this.getParameterInitialData();
                break;

            case deviceParameters.INITIAL_DATA_MULTI_CHANNEL:
                data = this.getParameterInitialDataMC();
                break;

            case deviceParameters.ABSOLUTE_DATA_STATUS:
                data = this.getParameterAbsoluteDataStatus();
                break;

            case deviceParameters.ABSOLUTE_DATA_STATUS_MULTI_CHANNEL:
                data = this.getParameterAbsoluteDataStatusMC();
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
            case deviceParameters.OUTPUT_DATA_TYPE:
                this.setOutputDataType(data as IParameterOutputDataType);
                break;

            case deviceParameters.DAY_CHECKOUT_HOUR:
                this.setParameterDayCheckoutHour(data as IParameterDayCheckoutHour);
                break;

            case deviceParameters.ACTIVATION_METHOD:
                this.setParameterActivationMethod(data as IParameterActivationMethod);
                break;

            case deviceParameters.INITIAL_DATA:
                this.setParameterInitialData(data as IParameterInitialData);
                break;

            case deviceParameters.INITIAL_DATA_MULTI_CHANNEL:
                this.setParameterInitialDataMC(data as IParameterInitialDataMC);
                break;

            case deviceParameters.ABSOLUTE_DATA_STATUS:
                this.setParameterAbsoluteDataStatus(data as IParameterAbsoluteDataStatus);
                break;

            case deviceParameters.ABSOLUTE_DATA_STATUS_MULTI_CHANNEL:
                this.setParameterAbsoluteDataStatusMC(data as IParameterAbsoluteDataStatusMC);
                break;

            default:
                throw new Error(`parameter ${id} is not supported`);
        }
    }
}


export default CommandBinaryBuffer;
