import Command from '../../Command.js';
import CommandBinaryBuffer, {IChannelArchiveDaysAbsolute} from '../../CommandBinaryBuffer.js';
import {getSecondsFromDate} from '../../utils/time.js';
import {UPLINK} from '../../constants/directionTypes.js';


interface IUplinkExAbsArchiveDayMCParameters {
    channelList: Array<IChannelArchiveDaysAbsolute>,
    startTime: number,
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
        const channelArray = buffer.getChannels();
        const days = buffer.getUint8();
        const maxChannel = Math.max.apply(null, channelArray);
        const channelList: Array<IChannelArchiveDaysAbsolute> = [];

        for ( let channelIndex = 0; channelIndex <= maxChannel; ++channelIndex ) {
            // IPK_${channelIndex}
            const pulseCoefficient = buffer.getUint8();
            const dayList: Array<number> = [];

            channelList.push({
                dayList,
                pulseCoefficient,
                index: channelIndex
            });

            for ( let day = 0; day < days; ++day ) {
                dayList.push(buffer.getExtendedValue());
            }
        }

        return new ExAbsArchiveDayMC({channelList, days, startTime: getSecondsFromDate(date)});
    }

    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        const {channelList, startTime, days} = this.parameters;

        buffer.setDate(startTime);
        buffer.setChannels(channelList);
        buffer.setUint8(days);

        channelList.forEach(({dayList, pulseCoefficient}) => {
            buffer.setUint8(pulseCoefficient);
            dayList.forEach(value => buffer.setExtendedValue(value));
        });

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default ExAbsArchiveDayMC;
