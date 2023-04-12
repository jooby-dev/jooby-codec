import Command from '../../Command.js';
import CommandBinaryBuffer, {Seconds} from '../../CommandBinaryBuffer.js';
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
    time: Seconds,
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
    days: Array<IArchiveChannelDayAbsoluteValue>,

    /**
     * Channel pulse coefficient - IPK in bytes.
     */
    pulseCoefficient: number


    /**
     * value time
     */
    time: Seconds,


    /**
     * Normal date in UTC.
     */
    date: Date,
}

interface IUplinkExAbsArchiveDayMulParameters {
    channels: Array<IArchiveChannelDayAbsolute>,
    date: Date,
    dayAmount: number
}


const COMMAND_ID = 0x0d1f;
const COMMAND_TITLE = 'EX_ABS_ARCH_DAYS_MUL';

// date 2 bytes, channels 1 byte (max channels: 4), days 1 byte (max days - 255)
// 4 + (4 channels * (1 byte pulse coefficient + 5 bytes of day values) * 255 max days)
const COMMAND_BODY_MAX_SIZE = 6124;


class ExAbsArchiveDayMul extends Command {
    constructor ( public parameters: IUplinkExAbsArchiveDayMulParameters ) {
        super();

        this.parameters.channels = this.parameters.channels.sort((a, b) => a.index - b.index);
    }

    static id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static title = COMMAND_TITLE;

    static fromBytes ( data: Uint8Array ): ExAbsArchiveDayMul {
        const buffer = new CommandBinaryBuffer(data);

        const date = buffer.getDate();
        const channelArray = buffer.getChannels(true);
        const dayAmount = buffer.getUint8();
        const maxChannel = Math.max.apply(null, channelArray);
        const counterDate = new Date(date);

        let value;

        const channels: Array<IArchiveChannelDayAbsolute> = [];

        for ( let channelIndex = 0; channelIndex <= maxChannel; ++channelIndex ) {
            // IPK_${channelIndex}
            const pulseCoefficient = buffer.getUint8();
            const days: Array<IArchiveChannelDayAbsoluteValue> = [];

            counterDate.setTime(date.getTime());

            channels.push({
                days,
                pulseCoefficient,
                index: channelIndex,
                time: getSecondsFromDate(counterDate),
                date: new Date(counterDate)
            });

            for ( let day = 0; day < dayAmount; ++day ) {
                value = buffer.getExtendedValue();

                counterDate.setTime(date.getTime());
                counterDate.setUTCHours(counterDate.getUTCHours() + (day * 24));

                days.push({
                    value,
                    day,
                    meterValue: roundNumber(value / pulseCoefficient),
                    date: new Date(counterDate),
                    time: getSecondsFromDate(counterDate)
                });
            }
        }

        return new ExAbsArchiveDayMul({channels, date, dayAmount});
    }

    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        const {channels, date, dayAmount} = this.parameters;

        buffer.setDate(date);
        buffer.setChannels(channels);
        buffer.setUint8(dayAmount);

        channels.forEach(({days, pulseCoefficient}) => {
            buffer.setUint8(pulseCoefficient);

            days.forEach(({value}) => {
                buffer.setExtendedValue(value);
            });
        });

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default ExAbsArchiveDayMul;
