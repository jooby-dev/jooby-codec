import Command from '../../Command.js';
import CommandBinaryBuffer, {IChannelAbsoluteValue} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directionTypes.js';


interface IUplinkExAbsCurrentMCParameters {
    channelList: Array<IChannelAbsoluteValue>
}


const COMMAND_ID = 0x0f1f;
const COMMAND_TITLE = 'EX_ABS_CURRENT_MC';

// channelList 3 byte (max channelList: 14)
// 3 + (14 * (1 byte IPK + 5 bytes of day values))
const COMMAND_BODY_MAX_SIZE = 87;


class ExAbsCurrentMC extends Command {
    constructor ( public parameters: IUplinkExAbsCurrentMCParameters ) {
        super();

        this.parameters.channelList = this.parameters.channelList.sort((a, b) => a.index - b.index);
    }

    static id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static title = COMMAND_TITLE;

    static fromBytes ( data: Uint8Array ): ExAbsCurrentMC {
        const buffer = new CommandBinaryBuffer(data);

        return new ExAbsCurrentMC({channelList: buffer.getChannelsWithAbsoluteValues()});
    }

    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        const {channelList} = this.parameters;

        buffer.setChannelsWithAbsoluteValues(channelList);

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default ExAbsCurrentMC;
