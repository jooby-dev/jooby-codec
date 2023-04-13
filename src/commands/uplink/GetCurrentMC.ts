import Command from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directionTypes.js';


/**
 * GetCurrentMC command channel.
 */
export interface IChannel {
    index: number,
    value: number
}

/**
 * GetCurrentMC command parameters.
 */
export interface IGetCurrentMCParameters {
    channelList: Array<IChannel>
}


const COMMAND_ID = 0x18;
const COMMAND_TITLE = 'GET_CURRENT_MC';

// 2 bytes for 7 channelList + (7 channelList * 5 byte for current value of channel)
const COMMAND_BODY_MAX_SIZE = 37;


class GetCurrentMC extends Command {
    constructor ( public parameters: IGetCurrentMCParameters ) {
        super();

        this.parameters.channelList = this.parameters.channelList.sort((a, b) => a.index - b.index);
    }

    static id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static title = COMMAND_TITLE;

    static fromBytes ( data: Uint8Array ): GetCurrentMC {
        const parameters: IGetCurrentMCParameters = {channelList: []};

        const buffer = new CommandBinaryBuffer(data);

        const channelList = buffer.getChannels(false);

        parameters.channelList = channelList.map(channelIndex => ({
            value: buffer.getExtendedValue(),
            index: channelIndex
        }));

        return new GetCurrentMC(parameters);
    }

    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        const {channelList} = this.parameters;

        buffer.setChannels(channelList.map(({index}) => index));
        channelList.forEach(({value}) => buffer.setExtendedValue(value));

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default GetCurrentMC;
