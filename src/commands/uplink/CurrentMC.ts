import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {IChannelValue} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';

/**
 * CurrentMC command parameters.
 */
export interface ICurrentMCParameters {
    channelList: Array<IChannelValue>
}


const COMMAND_ID = 0x18;

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
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import CurrentMC from 'jooby-codec/commands/uplink/CurrentMC';
 *
 * // failure
 * const commandBody = new Uint8Array([0x01, 0x32]);
 * const command = CurrentMC.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     channelList: [
 *         {index: 1, value: 50}
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/GetCurrentMC.md#response)
 */
class CurrentMC extends Command {
    constructor ( public parameters: ICurrentMCParameters ) {
        super();

        this.parameters.channelList = this.parameters.channelList.sort((a: IChannelValue, b: IChannelValue) => a.index - b.index);
    }


    static id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ): CurrentMC {
        const parameters: ICurrentMCParameters = {channelList: []};
        const buffer = new CommandBinaryBuffer(data);
        const channelList = buffer.getChannels();

        parameters.channelList = channelList.map(channelIndex => ({
            value: buffer.getExtendedValue(),
            index: channelIndex
        }) as IChannelValue);

        return new CurrentMC(parameters);
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        const {channelList} = this.parameters;

        buffer.setChannels(channelList);
        channelList.forEach(({value}) => buffer.setExtendedValue(value));

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default CurrentMC;
