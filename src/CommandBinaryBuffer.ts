import BinaryBuffer from './BinaryBuffer.js';
import {getDateFromSeconds, getSecondsFromDate} from './utils/time.js';


/**
 * Time from UTC 2000-01-01 00:00:00 in seconds.
 */
export type Seconds = number;


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


/**
 * Hour channel
 */
export interface IHourDiff {
    value: number,
    hour: number,
    time: Seconds,
    date: Date
}

export interface IChannel {
    /**
     * Channel number.
     */
    index: number,

    /**
     * Pulse counter or absolute value of device channel.
     */
    value: number,

    /**
     * Values differences between hours.
     */
    diff: Array<IHourDiff>,


    /**
     * Value time.
     */
    time: Seconds | undefined,


    /**
     * Normal date in UTC.
     */
    date: Date | undefined,
}


const INITIAL_YEAR = 2000;
const MONTH_BIT_SIZE = 4;
const DATE_BIT_SIZE = 5;
const YEAR_START_INDEX = 1;
const CHANNELS_FULL_MASK = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40];
const CHANNELS_SHORT_MASK = [0x01, 0x02, 0x04, 0x08];
const UNKNOWN_BATTER_VOLTAGE = 4095;


/**
 * Command specific byte array manipulation.
 */
class CommandBinaryBuffer extends BinaryBuffer {
    getExtendedValue (): number {
        let value = 0;
        let extended = 1;
        // byte offset
        let position = 0;

        while ( extended && this.offset <= this.data.byteLength ) {
            const byte = this.getUint8();

            extended = byte & 0x80;
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
            data.push(0x80 | (encodedValue & 0x7f));
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
     *
     * @param short - get 4 channels or more
     */
    getChannels ( short: boolean ): Array<number> {
        const channels = [];

        let extended = 1;
        let channelIndex = 0;
        const MASK = short ? CHANNELS_SHORT_MASK : CHANNELS_FULL_MASK;

        while ( extended ) {
            const byte = this.getUint8();

            extended = byte & 0x80;

            for ( let index = 0; index < MASK.length; index++ ) {
                if ( byte & MASK[index] ) {
                    channels.push((channelIndex * 7) + index);
                }
            }

            ++channelIndex;
        }

        return channels.sort((a, b) => a - b);
    }


    /**
     * Set array of channel indexes.
     *
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setChannels ( channels: Array<any> ) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return
        const maxChannel = Math.max(...channels.map(({index}) => index));

        const size = (Math.ceil(maxChannel / 7) + (maxChannel % 7)) ? 1 : 0;
        const data = Array(size).fill(0x80);

        channels.forEach((_, channelIndex) => {
            data[Math.floor(channelIndex / 7)] |= CHANNELS_FULL_MASK[channelIndex % 7];
        });

        data[data.length - 1] &= 0x7f;

        data.forEach((byte: number) => this.setUint8(byte));
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
    setDate ( dateOrTime: Date | number ): void {
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

        const hours = (byte & 0xe0) >> 5;
        const hour = byte & 0x1f;

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

    getTime (): number {
        return this.getUint32(false);
    }

    setTime ( value: number ): void {
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

        if ( high === UNKNOWN_BATTER_VOLTAGE ) {
            high = undefined;
        }

        if ( low === UNKNOWN_BATTER_VOLTAGE ) {
            low = undefined;
        }

        return {low, high};
    }

    setBatterVoltage ( batteryVoltage: IBatteryVoltage ): void {
        let {low, high} = batteryVoltage;

        if ( low === undefined ) {
            low = UNKNOWN_BATTER_VOLTAGE;
        }

        if ( high === undefined ) {
            high = UNKNOWN_BATTER_VOLTAGE;
        }

        const lowVoltageByte = (low >> 4) & 0xff;
        const lowAndHighVoltageByte = ((low & 0x0f) << 4) | ((high >> 8) & 0x0f);
        const highVoltageByte = high & 0xff;

        [lowVoltageByte, lowAndHighVoltageByte, highVoltageByte].forEach(byte => this.setUint8(byte));
    }

    getChannelsValuesWithHourDiff (): {hourAmount: number, channels: Array<IChannel>, date: Date} {
        const date = this.getDate();
        const {hour, hours} = this.getHours();
        const channelArray = this.getChannels(true);
        const maxChannel = Math.max.apply(null, channelArray);
        const channels: Array<IChannel> = [];
        let hourAmount = hours;
        let value;

        date.setUTCHours(hour);

        const counterDate = new Date(date);

        // TODO: add link to doc
        if ( hourAmount === 0 ) {
            hourAmount = 1;
        }

        for ( let channelIndex = 0; channelIndex <= maxChannel; ++channelIndex ) {
            // decode hour value for channel
            value = this.getExtendedValue();
            counterDate.setTime(date.getTime());

            const diff: Array<IHourDiff> = [];
            const channel = {value, index: channelIndex, time: getSecondsFromDate(counterDate), date: new Date(counterDate), diff};

            channels.push(channel);

            for ( let diffHour = 0; diffHour < hourAmount; ++diffHour ) {
                value = this.getExtendedValue();

                counterDate.setUTCHours(counterDate.getUTCHours() + diffHour);

                diff.push({value, hour: diffHour, date: new Date(counterDate), time: getSecondsFromDate(counterDate)});
            }
        }

        return {channels, date, hourAmount};
    }

    setChannelsValuesWithHourDiff ( hourAmount: number, date: Date, channels: Array<IChannel> ): void {
        const hour = date.getUTCHours();

        this.setDate(date);
        this.setHours(hour, hourAmount);
        this.setChannels(channels);

        channels.forEach(({value, diff}) => {
            this.setExtendedValue(value);

            diff.forEach(({value: diffValue}) => this.setExtendedValue(diffValue));
        });
    }
}


export default CommandBinaryBuffer;
