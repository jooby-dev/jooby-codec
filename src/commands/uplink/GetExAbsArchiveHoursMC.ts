import Command from '../../Command.js';
import {getSecondsFromDate, getDateFromSeconds, TTime2000} from '../../utils/time.js';
import CommandBinaryBuffer, {IChannelHours} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


interface IUplinkGetExAbsArchiveHoursMCParameters {
    channelList: Array<IChannelHours>,
    startTime: TTime2000
    hours: number
}


// TODO: rework extended headers detection
const COMMAND_ID = 0x0c1f;

// date 2 bytes, hour 1 byte (max hours: 7), channelList 1 byte (max channelList: 4)
// 4 + (4 channelList * 1 byte pulse coefficient) + (4 channelList * 5 bytes of hour values) + (4 * 5 bytes of diff * 7 max hours diff)
const COMMAND_BODY_MAX_SIZE = 168;


class GetExAbsArchiveHoursMC extends Command {
    constructor ( public parameters: IUplinkGetExAbsArchiveHoursMCParameters ) {
        super();

        this.parameters.channelList = this.parameters.channelList.sort((a, b) => a.index - b.index);
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ): GetExAbsArchiveHoursMC {
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const {hour, hours} = buffer.getHours();
        const channels = buffer.getChannels();
        const channelList: Array<IChannelHours> = [];

        date.setUTCHours(hour);

        channels.forEach(channelIndex => {
            const value = buffer.getExtendedValue();
            const diff: Array<number> = [];

            for ( let hourIndex = 0; hourIndex < hours; ++hourIndex ) {
                diff.push(buffer.getExtendedValue());
            }

            channelList.push({
                diff,
                value,
                index: channelIndex
            });
        });

        return new GetExAbsArchiveHoursMC({channelList, hours, startTime: getSecondsFromDate(date)});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        const {channelList, startTime, hours} = this.parameters;

        const date = getDateFromSeconds(startTime);
        const hour = date.getUTCHours();

        buffer.setDate(date);
        buffer.setHours(hour, hours);
        buffer.setChannels(channelList);

        for ( const {value, diff} of channelList ) {
            buffer.setExtendedValue(value);
            diff.forEach(diffValue => buffer.setExtendedValue(diffValue));
        }

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default GetExAbsArchiveHoursMC;
