import Command from '../../Command.js';
import CommandBinaryBuffer, {IChannel} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directionTypes.js';
import {getDateFromSeconds, getSecondsFromDate} from '../../utils/time.js';


/**
 * GetArchiveDaysMC command parameters
 *
 * @example
 * // archive 2 days values from 2001-03-10T00:00:00.000Z
 * {
 *     channelList: [{index: 0, days: [{value: 234, day: 0}, {value: 332, day: 1}]}],
 *     date: '2001-03-10T12:00:00.000Z',
 *     days: 2
 * }
 */
interface IUplinkGetArchiveDaysMCParameters {
    channelList: Array<IArchiveChannel>,
    date: Date | undefined | string,
    days: number | undefined
}

/**
 * channel value by day
 */
export interface IArchiveDayValue {
    value: number,
    day: number,
    seconds: number,
    date: Date
}

interface IArchiveChannel extends IChannel {
    /**
     * channel number
     */
    index: number,

    /**
     * values by days
     */
    dayList: Array<IArchiveDayValue>,

    /** time */
    seconds: number,

    /**
     * Normal date in UTC.
     */
    date: Date
}


const COMMAND_ID = 0x1b;
const COMMAND_TITLE = 'GET_ARCHIVE_DAYS_MC';

// date 2 bytes, channelList 1 byte (max channelList: 4), days 1 byte (max days - 255)
// 4 + (4 channelList * 5 bytes of day values * 255 max days)
const COMMAND_BODY_MAX_SIZE = 5104;


/**
 * Uplink command
 *
 * @example
 * ```js
 * import GetArchiveDaysMC from 'jooby-codec/commands/uplink/GetArchiveDaysMC';
 *
 * const parameters = {
 *     channelList: [{index: 0, days: [{value: 234, day: 0}, {value: 332, day: 1}]}],
 *     date: '2001-03-10T12:00:00.000Z',
 *     days: 2
 * };
 *
 * const command = new GetArchiveDaysMC(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 1b 04 2f 97 0c 01
 * ```
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/GetArchiveDaysMC.md#response)
 */
class GetArchiveDaysMC extends Command {
    constructor ( public parameters: IUplinkGetArchiveDaysMCParameters ) {
        super();

        this.parameters.channelList = this.parameters.channelList.sort((a, b) => a.index - b.index);

        const {date, days, channelList} = this.parameters;

        if ( date === undefined ) {
            const [{seconds}] = channelList;

            if ( seconds ) {
                this.parameters.date = getDateFromSeconds(seconds);
            } else {
                throw new Error(`${GetArchiveDaysMC.getName()} can't recognize time`);
            }
        } else if ( typeof date === 'string' ) {
            this.parameters.date = new Date(date);
        }

        if ( days === undefined ) {
            this.parameters.days = channelList[0].dayList.length;
        }
    }

    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly title = COMMAND_TITLE;

    static fromBytes ( data: Uint8Array ): GetArchiveDaysMC {
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const channels = buffer.getChannels();
        const days = buffer.getUint8();
        const maxChannel = Math.max.apply(null, channels);
        const channelList: Array<IArchiveChannel> = [];
        const counterDate = new Date(date);

        let value;

        for ( let channelIndex = 0; channelIndex <= maxChannel; ++channelIndex ) {
            const dayList: Array<IArchiveDayValue> = [];

            counterDate.setTime(date.getTime());

            channelList.push({
                dayList,
                index: channelIndex,
                seconds: getSecondsFromDate(counterDate),
                date: new Date(counterDate)
            });

            for ( let day = 0; day < days; ++day ) {
                value = buffer.getExtendedValue();

                counterDate.setTime(date.getTime());
                counterDate.setUTCHours(counterDate.getUTCHours() + (day * 24));

                dayList.push({value, day, date: new Date(counterDate), seconds: getSecondsFromDate(counterDate)});
            }
        }

        return new GetArchiveDaysMC({channelList, date, days});
    }

    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        const {days, date, channelList} = this.parameters;

        buffer.setDate(date as Date);
        buffer.setChannels(channelList);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        buffer.setUint8(days!);

        channelList.forEach(({dayList}) => {
            dayList.forEach(({value}) => buffer.setExtendedValue(value));
        });

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default GetArchiveDaysMC;
