import Command from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';


/**
 * GetCurrentMul command channel.
 */
export interface IChannel {
    index: number
    value: number
}

/**
 * GetCurrentMul command parameters.
 */
export interface IGetCurrentMulParameters {
    channels: Array<IChannel>
}


const COMMAND_ID = 0x18;
const COMMAND_TITLE = 'GET_CURRENT_MUL';

// 2 bytes for 7 channels + (7 channels * 5 byte for current value of channel)
const COMMAND_BODY_MAX_SIZE = 37;


class GetCurrentMul extends Command {
    constructor ( public parameters: IGetCurrentMulParameters ) {
        super();

        this.parameters.channels = this.parameters.channels.sort((a, b) => a.index - b.index);
    }

    static id = COMMAND_ID;

    static readonly isUplink = true;

    static title = COMMAND_TITLE;

    static fromBytes ( data: Uint8Array ): GetCurrentMul {
        const parameters: IGetCurrentMulParameters = {channels: []};

        const buffer = new CommandBinaryBuffer(data);

        const channels = buffer.getChannels(false);

        parameters.channels = channels.map(channelIndex => ({
            value: buffer.getExtendedValue(),
            index: channelIndex
        }));

        return new GetCurrentMul(parameters);
    }

    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        const {channels} = this.parameters;

        buffer.setChannels(channels.map(({index}) => index));
        channels.forEach(({value}) => buffer.setExtendedValue(value));

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default GetCurrentMul;
