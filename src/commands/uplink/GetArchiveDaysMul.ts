import Command from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directionTypes.js';
import {getDateFromSeconds, getSecondsFromDate} from '../../utils/time.js';


/**
 * GetArchiveDaysMul command parameters
 *
 * @example
 * // archive 2 days values from 2001-03-10T00:00:00.000Z
 * {
 *     channels: [{index: 0, days: [{value: 234, day: 0}, {value: 332, day: 1}]}],
 *     date: '2001-03-10T12:00:00.000Z',
 *     dayAmount: 2
 * }
 */
interface IUplinkGetArchiveDaysMulParameters {
    channels: Array<IArchiveChannel>,
    date: Date | undefined | string,
    dayAmount: number | undefined
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

interface IArchiveChannel {
    /**
     * channel number
     */
    index: number,

    /**
     * values by days
     */
    days: Array<IArchiveDayValue>,

    /** time */
    seconds: number,

    /**
     * Normal date in UTC.
     */
    date: Date
}


const COMMAND_ID = 0x1b;
const COMMAND_TITLE = 'GET_ARCHIVE_DAYS_MUL';

// date 2 bytes, channels 1 byte (max channels: 4), days 1 byte (max days - 255)
// 4 + (4 channels * 5 bytes of day values * 255 max days)
const COMMAND_BODY_MAX_SIZE = 5104;


/**
 * Uplink command
 *
 * @example
 * ```js
 * import GetArchiveDaysMul from 'jooby-codec/commands/uplink/GetArchiveDaysMul';
 *
 * const parameters = {
 *     channels: [{index: 0, days: [{value: 234, day: 0}, {value: 332, day: 1}]}],
 *     date: '2001-03-10T12:00:00.000Z',
 *     dayAmount: 2
 * };
 *
 * const command = new GetArchiveDaysMul(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 1b 04 2f 97 0c 01
 * ```
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/GetArchiveDaysMul.md#response)
 */
class GetArchiveDaysMul extends Command {
    constructor ( public parameters: IUplinkGetArchiveDaysMulParameters ) {
        super();

        this.parameters.channels = this.parameters.channels.sort((a, b) => a.index - b.index);

        const {date, dayAmount, channels} = this.parameters;

        if ( date === undefined ) {
            const [{seconds}] = channels;

            if ( seconds ) {
                this.parameters.date = getDateFromSeconds(seconds);
            } else {
                throw new Error(`${GetArchiveDaysMul.getName()} can't recognize time`);
            }
        } else if ( typeof date === 'string' ) {
            this.parameters.date = new Date(date);
        }

        if ( dayAmount === undefined ) {
            this.parameters.dayAmount = channels[0].days.length;
        }
    }

    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly title = COMMAND_TITLE;

    static fromBytes ( data: Uint8Array ): GetArchiveDaysMul {
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const channelArray = buffer.getChannels(true);
        const dayAmount = buffer.getUint8();
        const maxChannel = Math.max.apply(null, channelArray);
        const channels: Array<IArchiveChannel> = [];
        const counterDate = new Date(date);

        let value;

        for ( let channelIndex = 0; channelIndex <= maxChannel; ++channelIndex ) {
            const days: Array<IArchiveDayValue> = [];

            counterDate.setTime(date.getTime());

            channels.push({
                days,
                index: channelIndex,
                seconds: getSecondsFromDate(counterDate),
                date: new Date(counterDate)
            });

            for ( let day = 0; day < dayAmount; ++day ) {
                value = buffer.getExtendedValue();

                counterDate.setTime(date.getTime());
                counterDate.setUTCHours(counterDate.getUTCHours() + (day * 24));

                days.push({value, day, date: new Date(counterDate), seconds: getSecondsFromDate(counterDate)});
            }
        }

        return new GetArchiveDaysMul({channels, date, dayAmount});
    }

    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        const {dayAmount, date, channels} = this.parameters;

        buffer.setDate(date as Date);
        buffer.setChannels(channels);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        buffer.setUint8(dayAmount!);

        channels.forEach(({days}) => {
            days.forEach(({value}) => buffer.setExtendedValue(value));
        });

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default GetArchiveDaysMul;
