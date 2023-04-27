import BinaryBuffer from './BinaryBuffer.js';
import * as bitSet from './utils/bitSet.js';
import {getDateFromSeconds, getSecondsFromDate, TTime2000} from './utils/time.js';
import getHexFromBytes from './utils/getHexFromBytes.js';
import getBytesFromHex from './utils/getBytesFromHex.js';
import roundNumber from './utils/roundNumber.js';
import * as hardwareTypes from './constants/hardwareTypes.js';
import * as deviceParameters from './constants/deviceParameters.js';


export interface IBatteryVoltage {
    /**
     * battery voltage value at low consumption, in mV
     *
     * `4095` - unknown value and becomes `undefined`
     */
    low: number | undefined,

    /**
     * battery voltage value at hight consumption, in mV
     *
     * `4095` - unknown value and becomes `undefined`
     */
    high: number | undefined
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
    /** channel pulse coefficient - IPK in bytes */
    pulseCoefficient: number
}

export interface IChannelDays extends IChannel {
    dayList: Array<number>
}

export interface IChannelAbsoluteValue extends IChannelValue {
    /** channel pulse coefficient - IPK in bytes */
    pulseCoefficient: number
}

export interface IChannelArchiveDaysAbsolute extends IChannel {
    /** values by days */
    dayList: Array<number>,

    /** Channel pulse coefficient - IPK in bytes */
    pulseCoefficient: number
}

export interface IChannelArchiveDays extends IChannel {
    /** values by days */
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
 * deviceParameters.DATA_SENDING_INTERVAL = `1`.
 */
interface IParameterDataSendingInterval {
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
 * deviceParameters.OUTPUT_DATA_TYPE = `5`.
 */
interface IParameterOutputDataType {
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
 * deviceParameters.DELIVERY_TYPE_OF_PRIORITY_DATA = `8`.
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
     * `0` - delivery with confirmation
     * `1` - delivery without confirmation
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
 * Initial values for pulse devices.
 * deviceParameters.INITIAL_DATA = `23`.
 */
interface IParameterInitialData {
    /** 4 byte int BE */
    value: number,

    /** 4 byte int BE */
    meterValue: number,
    pulseCoefficient: number
}

/**
 * Data type sending from device - absolute or not.
 * deviceParameters.ABSOLUTE_DATA_STATUS = `24`
 */
interface IParameterAbsoluteDataStatus {
    /**
     * `1` - absolute data sending enabled
     * `0` - disabled, device send pulse counter
     */
    status: number
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
    attitude: number
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
 * Initial values for multi-channel devices.
 * deviceParameters.INITIAL_DATA_MULTI_CHANNEL = `29`.
 */
interface IParameterInitialDataMC extends IParameterInitialData {
    /** channel that accept initial values */
    channel: number
}

/**
 * Data type sending from device - absolute or not, multi-channel devices.
 * deviceParameters.ABSOLUTE_DATA_STATUS_MULTI_CHANNEL = `30`
 */
interface IParameterAbsoluteDataStatusMC extends IParameterAbsoluteDataStatus {
    /** channel that accept status changing */
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
    //IEventWaterStatus |
    IEvent4ChannelStatus |
    IEventMtxStatus;

/* sorted by parameter id */
type TParameterData =
    IParameterDataSendingInterval |
    IParameterOutputDataType |
    IParameterDayCheckoutHour |
    IParameterDeliveryTypeOfPriorityData |
    IParameterActivationMethod |
    IParameterBatteryDepassivationInfo |
    IParameterBatteryMinimalLoadTime |
    IParameterRx2Config |
    IParameterInitialData |
    IParameterAbsoluteDataStatus |
    IParameterSerialNumber |
    IParameterGeolocation |
    IParameterInitialDataMC |
    IParameterAbsoluteDataStatusMC;


const INITIAL_YEAR = 2000;
const MONTH_BIT_SIZE = 4;
const DATE_BIT_SIZE = 5;
const YEAR_START_INDEX = 1;
const UNKNOWN_BATTERY_VOLTAGE = 4095;
const EXTEND_BIT_MASK = 0x80;
const LAST_BIT_INDEX = 7;
const DATA_SENDING_INTERVAL_SECONDS_COEFFICIENT = 600;
const PARAMETER_RX2_FREQUENCY_COEFFICIENT = 100;
const INT12_SIZE = 3;
const SERIAL_NUMBER_SIZE = 6;

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
    [deviceParameters.DATA_SENDING_INTERVAL, 1 + 3],
    [deviceParameters.DAY_CHECKOUT_HOUR, 1 + 1],
    [deviceParameters.OUTPUT_DATA_TYPE, 1 + 1],
    [deviceParameters.DELIVERY_TYPE_OF_PRIORITY_DATA, 1 + 1],
    [deviceParameters.ACTIVATION_METHOD, 1 + 1],
    [deviceParameters.BATTERY_DEPASSIVATION_INFO, 1 + 6],
    [deviceParameters.BATTERY_MINIMAL_LOAD_TIME, 1 + 4],
    [deviceParameters.RX2_CONFIG, 1 + 4],
    [deviceParameters.INITIAL_DATA, 1 + 9],
    [deviceParameters.ABSOLUTE_DATA_STATUS, 1 + 1],
    [deviceParameters.SERIAL_NUMBER, 1 + 6],
    [deviceParameters.GEOLOCATION, 1 + 10],
    [deviceParameters.EXTRA_FRAME_INTERVAL, 1 + 2],
    [deviceParameters.INITIAL_DATA_MULTI_CHANNEL, 1 + 10],
    [deviceParameters.ABSOLUTE_DATA_STATUS_MULTI_CHANNEL, 1 + 2]
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

    setInt12 ( value: number, isLittleEndian = this.isLittleEndian ): void {
        const view = new DataView(this.data, this.offset, INT12_SIZE);

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

        this.offset += INT12_SIZE;
    }

    getInt12 ( isLittleEndian = this.isLittleEndian ): number {
        const view = new DataView(this.data, this.offset, INT12_SIZE);
        let byte0;
        let byte1;
        let byte2;

        this.offset += INT12_SIZE;

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

    setUint12 ( value: number, isLittleEndian = this.isLittleEndian ): void {
        const view = new DataView(this.data, this.offset, INT12_SIZE);

        if ( isLittleEndian ) {
            view.setUint8(2, (value >> 16) & 0xFF);
            view.setUint8(1, (value >> 8) & 0xFF);
            view.setUint8(0, value & 0xFF);
        } else {
            view.setUint8(0, (value >> 16) & 0xFF);
            view.setUint8(1, (value >> 8) & 0xFF);
            view.setUint8(2, value & 0xFF);
        }

        this.offset += INT12_SIZE;
    }

    getUint12 ( isLittleEndian = this.isLittleEndian ): number {
        const view = new DataView(this.data, this.offset, INT12_SIZE);
        const byte0 = view.getUint8(0);
        const byte1 = view.getUint8(1);
        const byte2 = view.getUint8(2);

        this.offset += INT12_SIZE;

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
        // sort channels by index
        channelList.sort((a, b) => a.index - b.index);

        // find max channel index from 0 to detect amount of bytes
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

    getBatteryVoltage (): IBatteryVoltage {
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

    setBatteryVoltage ( batteryVoltage: IBatteryVoltage ): void {
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

    private getParameterDataSendingInterval (): IParameterDataSendingInterval {
        // skip 'reserved' parameter which not used
        this.seek(this.offset + 2);

        return {
            value: this.getUint8() * DATA_SENDING_INTERVAL_SECONDS_COEFFICIENT
        };
    }

    private setParameterDataSendingInterval ( parameter: IParameterDataSendingInterval ) {
        // skip 'reserved' parameter
        this.seek(this.offset + 2);

        this.setUint8(parameter.value / DATA_SENDING_INTERVAL_SECONDS_COEFFICIENT);
    }

    private getParameterDeliveryTypeOfPriorityData (): IParameterDeliveryTypeOfPriorityData {
        return {value: this.getUint8()};
    }

    private setParameterDeliveryTypeOfPriorityData ( parameter: IParameterDeliveryTypeOfPriorityData ): void {
        this.setUint8(parameter.value);
    }

    private getParameterRx2Config (): IParameterRx2Config {
        return {
            spreadFactor: this.getUint8(),
            frequency: this.getUint12(false) * PARAMETER_RX2_FREQUENCY_COEFFICIENT
        };
    }

    private setParameterRx2Config ( parameter: IParameterRx2Config ): void {
        this.setUint8(parameter.spreadFactor);
        this.setUint12(parameter.frequency / PARAMETER_RX2_FREQUENCY_COEFFICIENT, false);
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
            attitude: roundNumber(this.getUint16())
        };
    }

    private setParameterGeolocation ( parameter: IParameterGeolocation ): void {
        this.setFloat32(roundNumber(parameter.latitude));
        this.setFloat32(roundNumber(parameter.longitude));
        this.setUint16(roundNumber(parameter.attitude));
    }

    getParameter (): IParameter {
        const id = this.getUint8();
        let data;

        switch ( id ) {
            case deviceParameters.DATA_SENDING_INTERVAL:
                data = this.getParameterDataSendingInterval();
                break;

            case deviceParameters.OUTPUT_DATA_TYPE:
                data = this.getOutputDataType();
                break;

            case deviceParameters.DAY_CHECKOUT_HOUR:
                data = this.getParameterDayCheckoutHour();
                break;

            case deviceParameters.DELIVERY_TYPE_OF_PRIORITY_DATA:
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

            case deviceParameters.RX2_CONFIG:
                data = this.getParameterRx2Config();
                break;

            case deviceParameters.INITIAL_DATA:
                data = this.getParameterInitialData();
                break;

            case deviceParameters.ABSOLUTE_DATA_STATUS:
                data = this.getParameterAbsoluteDataStatus();
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

            case deviceParameters.INITIAL_DATA_MULTI_CHANNEL:
                data = this.getParameterInitialDataMC();
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
            case deviceParameters.DATA_SENDING_INTERVAL:
                this.setParameterDataSendingInterval(data as IParameterDataSendingInterval);
                break;

            case deviceParameters.OUTPUT_DATA_TYPE:
                this.setOutputDataType(data as IParameterOutputDataType);
                break;

            case deviceParameters.DAY_CHECKOUT_HOUR:
                this.setParameterDayCheckoutHour(data as IParameterDayCheckoutHour);
                break;

            case deviceParameters.DELIVERY_TYPE_OF_PRIORITY_DATA:
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

            case deviceParameters.RX2_CONFIG:
                this.setParameterRx2Config(data as IParameterRx2Config);
                break;

            case deviceParameters.INITIAL_DATA:
                this.setParameterInitialData(data as IParameterInitialData);
                break;

            case deviceParameters.ABSOLUTE_DATA_STATUS:
                this.setParameterAbsoluteDataStatus(data as IParameterAbsoluteDataStatus);
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

            case deviceParameters.INITIAL_DATA_MULTI_CHANNEL:
                this.setParameterInitialDataMC(data as IParameterInitialDataMC);
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
