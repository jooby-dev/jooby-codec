import Command from '../../Command.js';
import GetCurrentMC from './GetCurrentMC.js';
import {getSecondsFromDate, getDateFromSeconds, TTime2000} from '../../utils/time.js';
import CommandBinaryBuffer, {IChannelHours} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


interface IDataHourMCParameters {
    channelList: Array<IChannelHours>,
    startTime: TTime2000
    hours: number
}


const COMMAND_ID = 0x17;
const COMMAND_TITLE = 'DATA_HOUR_MC';

// date 2 bytes, hour 1 byte, channelList - 1 byte, so max channelList = 4
// max hours diff - 7 (3 bit value)
// 4 + (4 channelList * 5 bytes of hour values) + (4 * 5 bytes of diff * 7 max hours diff)
const COMMAND_BODY_MAX_SIZE = 164;


class DataHourMC extends GetCurrentMC {
    constructor ( public parameters: IDataHourMCParameters ) {
        super(parameters);
    }

    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly title = COMMAND_TITLE;

    static fromBytes ( data: Uint8Array ): DataHourMC {
        const buffer = new CommandBinaryBuffer(data);

        const date = buffer.getDate();
        const {hour, hours} = buffer.getHours();
        const channels = buffer.getChannels();

        date.setUTCHours(hour);

        let value;

        const channelList: Array<IChannelHours> = [];

        channels.forEach(channelIndex => {
            // decode hour value for channel
            value = buffer.getExtendedValue();

            const diff: Array<number> = [];

            for ( let diffHour = 0; diffHour < hours; ++diffHour ) {
                diff.push(buffer.getExtendedValue());
            }

            channelList.push({value, index: channelIndex, diff});
        });

        return new DataHourMC({channelList, hours, startTime: getSecondsFromDate(date)});
    }

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


export default DataHourMC;
