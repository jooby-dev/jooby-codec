/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Command from '../../Command.js';
import DataDayMul from './DataDayMul.js';
import decodeExtendedBytes from '../../utils/decodeExtendedBytes.js';
import encodeExtendedBytes from '../../utils/encodeExtendedBytes.js';


const COMMAND_ID = 0x17;
const COMMAND_TITLE = 'DATA_HOUR_MUL';
const CHANNELS_MASK = [0x01, 0x02, 0x04, 0x08];


class DataHourMul extends DataDayMul {
    constructor ( public parameters: any ) {
        super(parameters);
    }

    static readonly id = COMMAND_ID;

    static readonly isUplink = true;

    static readonly title = COMMAND_TITLE;

    /**
     * Retrieve device time from byte array.
     *
     * @example
     * 0xb8 = 0b10111000 will be {hours: 0b101, hour: 0b11000} i.e. {hours: 5, hour: 24}
     *
     * @param data - array of bytes
     */
    protected static getHours ( data: Uint8Array, date: Date, startPosition: number ): any {
        const hours = (data[startPosition] & 0xe0) >> 5;
        const hour = data[startPosition] & 0x1f;

        date.setUTCHours(hour);

        const position = startPosition + 1;

        return {hours, position};
    }

    protected static setHours ( hours: number, hour: number ): any {
        return [((hours & 0x07) << 5) | (hour & 0x1f)];
    }

    protected static getChannels ( data: Uint8Array, startPosition = 0 ) {
        const channels = [];

        let extended = 1;
        let channelIndex = 0;

        let position = startPosition;

        for ( ; extended && position < data.length; position++ ) {
            extended = data[position] & 0x80;

            for ( let index = 0; index < CHANNELS_MASK.length; index++ ) {
                if ( data[position] & CHANNELS_MASK[index] ) {
                    channels.push((channelIndex * 7) + index);
                }
            }

            ++channelIndex;
        }

        return {channels, position};
    }

    protected static fillChannels ( data: Uint8Array, channels: Array<number>, date: Date, hours: any, startPosition: number ): Array<any> {
        const channelsArray: Array<any> = [];
        const maxChannel = Math.max.apply(null, channels);
        const counterDate = date;
        let hourAmount = hours;
        let value;
        let position = startPosition;

        if ( hourAmount === 0 ) {
            // one hour
            hourAmount = 1;
        }

        for ( let channelIndex = 0; channelIndex <= maxChannel; ++channelIndex ) {
            // decode hour value for channel
            ({value, position} = decodeExtendedBytes(data, position));

            counterDate.setUTCHours(date.getUTCHours());

            const diff: Array<any> = [];

            const channel = {value, index: channelIndex, time: DataDayMul.getDeviceSeconds(counterDate), diff};

            channelsArray.push(channel);

            for ( let hourIndex = 0; hourIndex < hourAmount; ++hourIndex ) {
                ({value, position} = decodeExtendedBytes(data, position));

                counterDate.setUTCHours(counterDate.getUTCHours() + hourIndex);

                diff.push({value, time: DataDayMul.getDeviceSeconds(counterDate)});
            }
        }

        return channelsArray;
    }

    protected static setCounters ( channels: number | Array<any> ) {
        if ( !Array.isArray(channels) ) {
            throw new Error('channels is not an array');
        }

        const data = [];

        for ( const {value, diff} of channels ) {
            data.push(...encodeExtendedBytes(value));

            for ( const {value: diffValue} of diff ) {
                data.push(...encodeExtendedBytes(diffValue));
            }
        }

        return data;
    }

    static fromBytes ( data: Uint8Array ): any {
        const {date, position: datePosition} = DataDayMul.getDate(data);
        const {hours, position: hoursPosition} = this.getHours(data, date, datePosition);
        const {channels: channelArray, position} = this.getChannels(data, hoursPosition);
        const channels = this.fillChannels(data, channelArray, date, hours, position);

        return new DataHourMul({channels});
    }

    toBytes () {
        const {channels} = this.parameters;

        const {time} = channels[0];
        const realDate = DataHourMul.getRealDate(time);
        const hour = realDate.getUTCHours();
        let hourAmount = channels[0].diff.length;

        if ( hourAmount === 1 ) {
            hourAmount = 0;
        }

        const data = [];

        const date = DataDayMul.setDate(time, realDate);
        const hours = DataHourMul.setHours(hourAmount, hour);
        // to reuse method DataDayMul.setChannels needs channel map, on that command i refuse to use Map as structure
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
        const channelsData = DataDayMul.setChannels(new Map(channels.map((channel: {index: any}) => [
            channel.index,
            channel
        ])));
        const counters = DataHourMul.setCounters(channels);

        data.push(...date, ...hours, ...channelsData, ...counters);

        return Command.toBytes(COMMAND_ID, new Uint8Array(data));
    }
}


export default DataHourMul;
