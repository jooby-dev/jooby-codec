import Command from '../../Command.js';
import CommandBinaryBuffer, {IChannelArchiveDays} from '../../CommandBinaryBuffer.js';
import {getSecondsFromDate} from '../../utils/time.js';
import {UPLINK} from '../../constants/directionTypes.js';


interface IUplinkExAbsArchiveDaysMCParameters {
    channelList: Array<IChannelArchiveDays>,
    startTime: number,
    days: number
}


const COMMAND_ID = 0x0d1f;
const COMMAND_TITLE = 'EX_ABS_ARCHIVE_DAYS_MC';

// date 2 bytes, channelList 1 byte (max channelList: 4), days 1 byte (max days - 255)
// 4 + (4 channelList * (1 byte pulse coefficient + 5 bytes of day values) * 255 max days)
const COMMAND_BODY_MAX_SIZE = 6124;


class ExAbsArchiveDaysMC extends Command {
    constructor ( public parameters: IUplinkExAbsArchiveDaysMCParameters ) {
        super();

        this.parameters.channelList = this.parameters.channelList.sort((a, b) => a.index - b.index);
    }

    static id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static title = COMMAND_TITLE;

    static fromBytes ( data: Uint8Array ): ExAbsArchiveDaysMC {
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const channels = buffer.getChannels();
        const days = buffer.getUint8();
        const channelList: Array<IChannelArchiveDays> = [];

        channels.forEach(channelIndex => {
            const dayList: Array<number> = [];

            channelList.push({
                dayList,
                index: channelIndex
            });

            for ( let day = 0; day < days; ++day ) {
                dayList.push(buffer.getExtendedValue());
            }
        });

        return new ExAbsArchiveDaysMC({channelList, days, startTime: getSecondsFromDate(date)});
    }

    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        const {channelList, startTime, days} = this.parameters;

        buffer.setDate(startTime);
        buffer.setChannels(channelList);
        buffer.setUint8(days);

        channelList.forEach(({dayList}) => {
            dayList.forEach(value => buffer.setExtendedValue(value));
        });

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default ExAbsArchiveDaysMC;
