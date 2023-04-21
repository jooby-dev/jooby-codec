import Command from '../../Command.js';
import CommandBinaryBuffer, {IChannelAbsoluteValue} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


interface IUplinkGetExAbsCurrentMCParameters {
    channelList: Array<IChannelAbsoluteValue>
}


const COMMAND_ID = 0x0f1f;

// channelList 3 byte (max channelList: 14)
// 3 + (14 * (1 byte IPK + 5 bytes of day values))
const COMMAND_BODY_MAX_SIZE = 87;


class GetExAbsCurrentMC extends Command {
    constructor ( public parameters: IUplinkGetExAbsCurrentMCParameters ) {
        super();

        this.parameters.channelList = this.parameters.channelList.sort((a, b) => a.index - b.index);
    }


    static id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ): GetExAbsCurrentMC {
        const buffer = new CommandBinaryBuffer(data);

        return new GetExAbsCurrentMC({channelList: buffer.getChannelsWithAbsoluteValues()});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        const {channelList} = this.parameters;

        buffer.setChannelsWithAbsoluteValues(channelList);

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default GetExAbsCurrentMC;
