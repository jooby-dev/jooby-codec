import BinaryBuffer from './BinaryBuffer.js';
import {getDateFromSeconds, getSecondsFromDate} from './utils/time.js';


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

/**
 * Channel hour value diff.
 */
export interface IHourDiff {
    value: number,
    seconds: number
}

export interface IChannelHours extends IChannelValue {
    /**
     * values differences between hours
     */
    diff: Array<IHourDiff>
}

export interface IChannelHourAbsoluteValue extends IChannelHours {
    /**
     * Channel pulse coefficient - IPK in bytes.
     */
    pulseCoefficient: number,

    meterValue: number
}

/**
 * Channel day value.
 */
export interface IDayValue {
    value: number,
    day: number,
    seconds: number
}

export interface IChannelDays extends IChannel {
    daysList: Array<IDayValue>
}

/**
 * Channel absolute value by day.
 */
export interface IArchiveChannelDayAbsoluteValue {
    value: number,
    meterValue: number,
    day: number,
    seconds: number
}

export interface IChannelArchiveDaysAbsolute extends IChannel {
    /**
     * values by days
     */
    dayList: Array<IArchiveChannelDayAbsoluteValue>,

    /**
     * Channel pulse coefficient - IPK in bytes.
     */
    pulseCoefficient: number
}


const INITIAL_YEAR = 2000;
const MONTH_BIT_SIZE = 4;
const DATE_BIT_SIZE = 5;
const YEAR_START_INDEX = 1;
const UNKNOWN_BATTER_VOLTAGE = 4095;
const EXTENDED_BIT_MASK = 0x80;
const LAST_BIT_INDEX = 7;


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

            extended = byte & EXTENDED_BIT_MASK;
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
            data.push(EXTENDED_BIT_MASK | (encodedValue & 0x7f));
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
        // sort to correct order of channels
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

    getChannelsValuesWithHourDiff (): {hours: number, seconds: number, channelList: Array<IChannelHours>} {
        const date = this.getDate();
        const {hour, hours: hourAmount} = this.getHours();
        const channelArray = this.getChannels();
        const maxChannel = Math.max.apply(null, channelArray);
        const channelList: Array<IChannelHours> = [];
        let hours = hourAmount;
        let value;

        date.setUTCHours(hour);

        const counterDate = new Date(date);

        // TODO: add link to doc
        if ( hours === 0 ) {
            hours = 1;
        }

        for ( let channelIndex = 0; channelIndex <= maxChannel; ++channelIndex ) {
            const diff: Array<IHourDiff> = [];

            // decode hour value for channel
            value = this.getExtendedValue();
            counterDate.setTime(date.getTime());
            channelList.push({
                value,
                diff,
                index: channelIndex
            });

            for ( let diffHour = 0; diffHour < hours; ++diffHour ) {
                value = this.getExtendedValue();

                counterDate.setUTCHours(counterDate.getUTCHours() + diffHour);

                diff.push({value, seconds: getSecondsFromDate(counterDate)});
            }
        }

        return {channelList, hours, seconds: getSecondsFromDate(date)};
    }

    setChannelsValuesWithHourDiff ( hours: number, seconds: number, channelList: Array<IChannelHours> ): void {
        const date = getDateFromSeconds(seconds);
        const hour = date.getUTCHours();

        this.setDate(date);
        this.setHours(hour, hours);
        this.setChannels(channelList);

        channelList.forEach(({value, diff}) => {
            this.setExtendedValue(value);

            diff.forEach(({value: diffValue}) => this.setExtendedValue(diffValue));
        });
    }
}


export default CommandBinaryBuffer;
