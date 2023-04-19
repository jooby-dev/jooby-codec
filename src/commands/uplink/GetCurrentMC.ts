import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {IChannelValue} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';

/**
 * GetCurrentMC command parameters.
 */
export interface IGetCurrentMCParameters {
    channelList: Array<IChannelValue>
}


const COMMAND_ID = 0x18;
const COMMAND_TITLE = 'GET_CURRENT_MC';

// 2 bytes for 7 channelList + (7 channelList * 5 byte for current value of channel)
const COMMAND_BODY_MAX_SIZE = 37;

const examples: TCommandExampleList = [
    {
        name: '4 first channels',
        parameters: {
            channelList: [
                {index: 0, value: 131},
                {index: 1, value: 8},
                {index: 2, value: 10},
                {index: 3, value: 12}
            ]
        },
        hex: {header: '18 06', body: '0f 8301 08 0a 0c'}
    },
    {
        name: 'single channel #2',
        parameters: {
            channelList: [
                {index: 2, value: 50}
            ]
        },
        hex: {header: '18 02', body: '04 32'}
    },
    {
        name: 'channels #5 #6 #12',
        parameters: {
            channelList: [
                {index: 5, value: 8146},
                {index: 6, value: 164},
                {index: 12, value: 75}
            ]
        },
        hex: {header: '18 07', body: 'e020 d23f a401 4b'}
    }
];


/**
 * Uplink command
 *
 * @example
 * ```js
 * import GetCurrentMC from 'jooby-codec/commands/uplink/GetCurrentMC';
 *
 * const parameters = {
 *     channelList: [
 *         {index: 1, value: 50}
 *     ]
 * };
 * const command = new GetCurrentMC(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 18 02 01 32
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/GetCurrentMC.md#response)
 */
class GetCurrentMC extends Command {
    constructor ( public parameters: IGetCurrentMCParameters ) {
        super();

        this.parameters.channelList = this.parameters.channelList.sort((a: IChannelValue, b: IChannelValue) => a.index - b.index);
    }

    static id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static title = COMMAND_TITLE;

    static readonly examples = examples;

    static fromBytes ( data: Uint8Array ): GetCurrentMC {
        const parameters: IGetCurrentMCParameters = {channelList: []};

        const buffer = new CommandBinaryBuffer(data);

        const channelList = buffer.getChannels();

        parameters.channelList = channelList.map(channelIndex => ({
            value: buffer.getExtendedValue(),
            index: channelIndex
        }) as IChannelValue);

        return new GetCurrentMC(parameters);
    }

    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        const {channelList} = this.parameters;

        buffer.setChannels(channelList);
        channelList.forEach(({value}) => buffer.setExtendedValue(value));

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default GetCurrentMC;
