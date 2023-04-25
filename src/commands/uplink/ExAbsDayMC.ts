import Command from '../../Command.js';
import CurrentMC from './CurrentMC.js';
import CommandBinaryBuffer, {IChannelAbsoluteValue} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {getSecondsFromDate, TTime2000} from '../../utils/time.js';


interface IExAbsDayMCParameters {
    channelList: Array<IChannelAbsoluteValue>,
    startTime: TTime2000
}


const COMMAND_ID = 0x0b1f;

// date 2 bytes, channelList 3 bytes (max channelList: 14)
// 5 + (14 channelList * (1 byte IPK + 5 bytes of day values))
const COMMAND_BODY_MAX_SIZE = 89;


class ExAbsDayMC extends CurrentMC {
    constructor ( public parameters: IExAbsDayMCParameters ) {
        super(parameters);
    }


    static id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ): ExAbsDayMC {
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const channelList = buffer.getChannelsWithAbsoluteValues();

        return new ExAbsDayMC({channelList, startTime: getSecondsFromDate(date)});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        const {channelList, startTime} = this.parameters;

        buffer.setDate(startTime);
        buffer.setChannelsWithAbsoluteValues(channelList);

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default ExAbsDayMC;
