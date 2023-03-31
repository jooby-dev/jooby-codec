import Command from '../../Command.js';
import GetCurrentMul, {IGetCurrentMulParameters, IChannel} from './GetCurrentMul.js';


const COMMAND_ID = 0x16;
const COMMAND_TITLE = 'DATA_DAY_MUL';
const INITIAL_YEAR = 2000;
const INITIAL_YEAR_TIMESTAMP = 946684800000;
const MILLISECONDS_IN_SECONDS = 1000;
const MONTH_BIT_SIZE = 4;
const DATE_BIT_SIZE = 5;
const YEAR_START_INDEX = 1;


/**
 * DataDayMul command parameters.
 */
interface IDataDayMulParameters extends IGetCurrentMulParameters {
    /**
     * Seconds since year 2000, i.e. timestamp (in seconds) - 946684800
     */
    time: number
}


class DataDayMul extends GetCurrentMul {
    constructor ( public parameters: IDataDayMulParameters ) {
        super(parameters);
    }

    static id = COMMAND_ID;

    static readonly isUplink = true;

    static title = COMMAND_TITLE;

    /**
     * Retrieve device time from byte array.
     *
     * @example
     * '2023-12-23' will be 0010111-1100-10111, so bytes: ['00101111', '10010111'] -> [47, 151]
     *
     * @param data - array of bytes
     */
    protected static getDate ( data: Uint8Array ) {
        // two bytes from start
        const position = 2;

        const year = data[0] >> YEAR_START_INDEX;
        const month = ((data[0] & 0x01) << MONTH_BIT_SIZE - YEAR_START_INDEX) | (data[1] >> DATE_BIT_SIZE);
        const monthDay = data[1] & 0x1f;

        return {
            position,
            date: new Date(Date.UTC(year + INITIAL_YEAR, month - 1, monthDay, 0, 0, 0, 0))
        };
    }

    /**
     * Convert device time to array of numbers.
     * '2023-12-23' will be 0010111-1100-10111, so bytes: ['00101111', '10010111'] -> [47, 151]
     *
     * @param time - device time in seconds
     * @param realDate - already converted to normal date
     *
     * @returns array of numbers
     */
    protected static setDate ( time: number, realDate?: Date ): Array<number> {
        let date;

        if ( realDate ) {
            date = realDate;
        } else {
            date = this.getRealDate(time);
        }

        const year = date.getUTCFullYear() - INITIAL_YEAR;
        const month = date.getUTCMonth() + 1;
        const day = date.getUTCDate();

        // create year and month bytes
        const yearMonthByte = (year << YEAR_START_INDEX) | (month >> MONTH_BIT_SIZE - YEAR_START_INDEX);
        const monthDateByte = ((month & 0x07) << DATE_BIT_SIZE) | day;

        return [yearMonthByte, monthDateByte];
    }


    static fromBytes ( data: Uint8Array ): DataDayMul {
        const parameters: IDataDayMulParameters = {channels: [], time: 0};

        const {date, position: channelsPosition} = this.getDate(data);
        const {channels, position: valuesPosition} = GetCurrentMul.getChannels(data, channelsPosition);
        const channelMap = GetCurrentMul.getChannelMap(channels, data, valuesPosition);

        channels.forEach((channelIndex: number) => {
            const channel = channelMap.get(channelIndex);

            if ( channel ) {
                parameters.channels.push(channel);
            }
        });

        parameters.time = this.getDeviceSeconds(date);

        return new DataDayMul(parameters);
    }

    /**
     * Convert seconds from 2000 year to normal Date object.
     *
     * @param time seconds from 2000 year
     * @returns normal date
     */
    protected static getRealDate ( time: number ): Date {
        return new Date(INITIAL_YEAR_TIMESTAMP + (time * MILLISECONDS_IN_SECONDS));
    }

    protected static getDeviceSeconds ( date: Date ): number {
        return (date.getTime() - INITIAL_YEAR_TIMESTAMP) / MILLISECONDS_IN_SECONDS;
    }

    toBytes (): Uint8Array {
        const {channels, time} = this.parameters;
        // eslint-disable-next-line @typescript-eslint/consistent-generic-constructors
        const channelMap: Map<number, number> = new Map(
            channels.map((channel: IChannel) => [channel.index, channel.value])
        );

        let data = DataDayMul.setDate(time);
        data = data.concat(GetCurrentMul.setChannels(channelMap));
        GetCurrentMul.setValues(channelMap, data);

        return Command.toBytes(COMMAND_ID, new Uint8Array(data));
    }
}


export default DataDayMul;
