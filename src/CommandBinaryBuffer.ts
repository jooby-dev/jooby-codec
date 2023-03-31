import BinaryBuffer from './BinaryBuffer.js';
import {getDateFromSeconds} from './utils/time.js';

const INITIAL_YEAR = 2000;
const MONTH_BIT_SIZE = 4;
const DATE_BIT_SIZE = 5;
const YEAR_START_INDEX = 1;
const CHANNELS_FULL_MASK = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40];
const CHANNELS_SHORT_MASK = [0x01, 0x02, 0x04, 0x08];

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

    getHours () {
        const byte = this.getUint8();

        const hours = (byte & 0xe0) >> 5;
        const hour = byte & 0x1f;

        return {hours, hour};
    }

    setHours ( hour: number, hours: number ): void {
        this.setUint8(((hours & 0x07) << 5) | (hour & 0x1f));
    }

    /**
     * Get array of bytes.
     *
     * @param filter - filter zero values or not
     * @returns - array of bytes
     */
    toUint8Array ( filter = true ): Uint8Array {
        const uInt8Array = super.toUint8Array();

        if ( filter ) {
            return uInt8Array.filter(Boolean);
        }

        return uInt8Array;
    }
}


export default CommandBinaryBuffer;
