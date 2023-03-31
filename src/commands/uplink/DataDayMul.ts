/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Command from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {getSecondsFromDate, getDateFromSeconds} from '../../utils/time.js';
import {GetCurrentMul, IGetCurrentMulParameters} from './GetCurrentMul.js';

const COMMAND_ID = 0x16;
const COMMAND_TITLE = 'DATA_DAY_MUL';
const COMMAND_BODY_MAX_SIZE = 32;
const MONTH_BIT_SIZE = 4;
const DATE_BIT_SIZE = 5;
const YEAR_START_INDEX = 1;
const INITIAL_YEAR = 2000;


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
            date = getDateFromSeconds(time);
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

        const buffer = new CommandBinaryBuffer(data);

        const date = buffer.getDate();
        const channelArray = buffer.getChannels(false);

        parameters.channels = channelArray.map(channelIndex => ({
            value: buffer.getExtendedValue(),
            index: channelIndex
        }));

        parameters.time = getSecondsFromDate(date);

        return new DataDayMul(parameters);
    }

    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE, false);
        const {channels, time} = this.parameters;

        buffer.setDate(time);
        buffer.setChannels(channels.map(({index}) => index));
        channels.forEach(({value}) => buffer.setExtendedValue(value));

        return Command.toBytes(COMMAND_ID, buffer.crop());
    }
}


export default DataDayMul;
