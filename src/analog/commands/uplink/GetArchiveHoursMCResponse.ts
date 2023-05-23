import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {IChannelHours} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {TTime2000} from '../../../utils/time.js';


/**
 * GetArchiveHoursMCResponse command parameters
 */
interface IGetArchiveHoursMCResponseParameters {
    channelList: Array<IChannelHours>,
    startTime2000: TTime2000
    hours: number
}


const COMMAND_ID = 0x1a;

// date 2 bytes, hour 1 byte, channelList - 1 byte, so max channelList = 4
// max hours diff - 7 (3 bit value)
// 4 + (4 channelList * 5 bytes of hour values) + (4 * 5 bytes of diff * 7 max hours diff)
const COMMAND_BODY_MAX_SIZE = 164;

const examples: TCommandExampleList = [
    {
        name: '4 channels at 2023.12.23 12:00:00 GMT',
        parameters: {
            startTime2000: 756648000,
            hours: 1,
            channelList: [
                {index: 1, value: 131, diff: [10]},
                {index: 2, value: 8, diff: [10]},
                {index: 3, value: 8, diff: [10]},
                {index: 4, value: 12, diff: [10]}
            ]
        },
        hex: {header: '1a 0d', body: '2f 97 0c 0f 83 01 0a 08 0a 08 0a 0c 0a'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetArchiveHoursMCResponse from 'jooby-codec/analog/commands/uplink/GetArchiveHoursMCResponse.js';
 *
 * const commandBody = new Uint8Array([
 *     0x2f, 0x97, 0x0c, 0x0f, 0x83, 0x01, 0x0a, 0x08, 0x0a, 0x08, 0x0a, 0x0c, 0x0a
 * ]);
 * const command = GetArchiveHoursMCResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     startTime2000: 756648000,
 *     hours: 1,
 *     channelList: [
 *         {index: 1, value: 131, diff: [10]},
 *         {index: 2, value: 8, diff: [10]},
 *         {index: 3, value: 8, diff: [10]},
 *         {index: 4, value: 12, diff: [10]}
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/GetArchiveHoursMC.md#response)
 */
class GetArchiveHoursMCResponse extends Command {
    constructor ( public parameters: IGetArchiveHoursMCResponseParameters ) {
        super();

        this.parameters.channelList = this.parameters.channelList.sort((a, b) => a.index - b.index);
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ): GetArchiveHoursMCResponse {
        const buffer = new CommandBinaryBuffer(data);

        return new GetArchiveHoursMCResponse(buffer.getChannelsValuesWithHourDiff());
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        const {hours, startTime2000, channelList} = this.parameters;

        buffer.setChannelsValuesWithHourDiff(hours, startTime2000, channelList);

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default GetArchiveHoursMCResponse;
