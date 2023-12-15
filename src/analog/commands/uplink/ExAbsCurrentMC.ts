import Command, {TCommandExampleList, ICommandBinary} from '../../Command.js';
import CommandBinaryBuffer, {IChannelAbsoluteValue} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../../constants/directions.js';


interface IExAbsCurrentMCParameters {
    channelList: Array<IChannelAbsoluteValue>
}

const COMMAND_ID = 0x0f1f;

// channelList 3 byte (max channelList: 14)
// 3 + (14 * (1 byte pulse coefficient + 5 bytes of day values))
const COMMAND_BODY_MAX_SIZE = 87;

const examples: TCommandExampleList = [
    {
        name: 'absolute current value from channel 3',
        parameters: {
            channelList: [
                {pulseCoefficient: 100, index: 3, value: 342}
            ]
        },
        hex: {header: '1f 0f 04', body: '04 83 d6 02'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import ExAbsCurrentMC from 'jooby-codec/analog/commands/uplink/ExAbsCurrentMC.js';
 *
 * const commandBody = new Uint8Array([0x04, 0x82, 0xd6, 0x02']);
 * const command = ExAbsCurrentMC.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     channelList: [
 *         {
 *             pulseCoefficient: 100,
 *             index: 3,
 *             value: 342
 *         }
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/uplink/ExAbsCurrentMC.md)
 */
class ExAbsCurrentMC extends Command {
    constructor ( public parameters: IExAbsCurrentMCParameters ) {
        super();

        this.parameters.channelList = this.parameters.channelList.sort((a, b) => a.index - b.index);
    }


    static id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ): ExAbsCurrentMC {
        const buffer = new CommandBinaryBuffer(data);

        return new ExAbsCurrentMC({channelList: buffer.getChannelsWithAbsoluteValues()});
    }

    toBinary (): ICommandBinary {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        const {channelList} = this.parameters;

        buffer.setChannelsWithAbsoluteValues(channelList);

        return Command.toBinary(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default ExAbsCurrentMC;
