import Command from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import roundNumber from '../../utils/roundNumber.js';
import {getSecondsFromDate} from '../../utils/time.js';
import {UPLINK} from '../../constants/directionTypes.js';


/**
 * Channel absolute value by day.
 */
interface IArchiveChannelDayAbsoluteValue {
    value: number,
    meterValue: number,
    day: number,
    seconds: number,
    date: Date,
}

interface IArchiveChannelDayAbsolute {
    /**
     * channel number
     */
    index: number,

    /**
     * values by days
     */
    dayList: Array<IArchiveChannelDayAbsoluteValue>,

    /**
     * Channel pulse coefficient - IPK in bytes.
     */
    pulseCoefficient: number

    /** time */
    seconds: number,

    /**
     * Normal date in UTC.
     */
    date: Date
}

interface IUplinkExAbsArchiveDayMCParameters {
    channelList: Array<IArchiveChannelDayAbsolute>,
    date: Date,
    days: number
}


const COMMAND_ID = 0x0d1f;
const COMMAND_TITLE = 'EX_ABS_ARCH_DAYS_MC';

// date 2 bytes, channelList 1 byte (max channelList: 4), days 1 byte (max days - 255)
// 4 + (4 channelList * (1 byte pulse coefficient + 5 bytes of day values) * 255 max days)
const COMMAND_BODY_MAX_SIZE = 6124;


class ExAbsArchiveDayMC extends Command {
    constructor ( public parameters: IUplinkExAbsArchiveDayMCParameters ) {
        super();

        this.parameters.channelList = this.parameters.channelList.sort((a, b) => a.index - b.index);
    }

    static id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static title = COMMAND_TITLE;

    static fromBytes ( data: Uint8Array ): ExAbsArchiveDayMC {
        const buffer = new CommandBinaryBuffer(data);

        const date = buffer.getDate();
        const channelArray = buffer.getChannels(true);
        const days = buffer.getUint8();
        const maxChannel = Math.max.apply(null, channelArray);
        const counterDate = new Date(date);

        let value;

        const channelList: Array<IArchiveChannelDayAbsolute> = [];

        for ( let channelIndex = 0; channelIndex <= maxChannel; ++channelIndex ) {
            // IPK_${channelIndex}
            const pulseCoefficient = buffer.getUint8();
            const dayList: Array<IArchiveChannelDayAbsoluteValue> = [];

            counterDate.setTime(date.getTime());

            channelList.push({
                dayList,
                pulseCoefficient,
                index: channelIndex,
                seconds: getSecondsFromDate(counterDate),
                date: new Date(counterDate)
            });

            for ( let day = 0; day < days; ++day ) {
                value = buffer.getExtendedValue();

                counterDate.setTime(date.getTime());
                counterDate.setUTCHours(counterDate.getUTCHours() + (day * 24));

                dayList.push({
                    value,
                    day,
                    meterValue: roundNumber(value / pulseCoefficient),
                    date: new Date(counterDate),
                    seconds: getSecondsFromDate(counterDate)
                });
            }
        }

        return new ExAbsArchiveDayMC({channelList, date, days});
    }

    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        const {channelList, date, days} = this.parameters;

        buffer.setDate(date);
        buffer.setChannels(channelList);
        buffer.setUint8(days);

        channelList.forEach(({dayList, pulseCoefficient}) => {
            buffer.setUint8(pulseCoefficient);

            dayList.forEach(({value}) => {
                buffer.setExtendedValue(value);
            });
        });

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default ExAbsArchiveDayMC;
