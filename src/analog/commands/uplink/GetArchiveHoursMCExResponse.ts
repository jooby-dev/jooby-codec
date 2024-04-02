import Command, {TCommandExampleList, ICommandBinary} from '../../Command.js';
import CommandBinaryBuffer, {IChannelHours} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../../constants/directions.js';
import {TTime2000} from '../../../utils/time.js';
import {TUint8} from '../../../types.js';


/**
 * GetArchiveHoursMCExResponse command parameters
 */
interface IGetArchiveHoursMCExResponseParameters {
    channelList: Array<IChannelHours>,
    startTime2000: TTime2000
    hour: TUint8,
    hours: TUint8
}


// TODO: rework extended headers detection
const COMMAND_ID = 0x301f;

// date 2 bytes, hour 2 byte, channelList - 1 byte, so max channelList = 5
// max hours diff - 7 (3 bit value)
// 5 + (4 channelList * 5 bytes of hour values) + (4 * 5 bytes of diff * 255 max hours diff)
const COMMAND_BODY_MAX_SIZE = 5125;

const examples: TCommandExampleList = [
    {
        name: '4 channels at 2023.12.23 12:00:00 GMT',
        parameters: {
            startTime2000: 756648000,
            hour: 12,
            hours: 2,
            channelList: [
                {index: 1, value: 131, diff: [10]},
                {index: 2, value: 8, diff: [10]},
                {index: 3, value: 8, diff: [10]},
                {index: 4, value: 12, diff: [10]}
            ]
        },
        hex: {header: '1f 30 0e', body: '2f 97 0c 02 0f 83 01 0a 08 0a 08 0a 0c 0a'}
    },
    {
        name: 'empty result at 2023.11.19 00:00:00 GMT',
        parameters: {
            startTime2000: 752889600,
            hour: 0,
            hours: 0,
            channelList: []
        },
        hex: {header: '1f 30 05', body: '2f 6a 00 00 00'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetArchiveHoursMCExResponse from 'jooby-codec/analog/commands/uplink/GetArchiveHoursMCExResponse.js';
 *
 * const commandBody = new Uint8Array([
 *     0x2f, 0x97, 0x0c, 0x02, 0x0f, 0x83, 0x01, 0x0a, 0x08, 0x0a, 0x08, 0x0a, 0x0c, 0x0a
 * ]);
 * const command = GetArchiveHoursMCExResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     startTime2000: 756648000,
 *     hour: 16,
 *     hours: 2,
 *     channelList: [
 *         {index: 1, value: 131, diff: [10]},
 *         {index: 2, value: 8, diff: [10]},
 *         {index: 3, value: 8, diff: [10]},
 *         {index: 4, value: 12, diff: [10]}
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetArchiveHoursMCEx.md#response)
 */
class GetArchiveHoursMCExResponse extends Command {
    constructor ( public parameters: IGetArchiveHoursMCExResponseParameters ) {
        super();

        this.parameters.channelList = this.parameters.channelList.sort((a, b) => a.index - b.index);
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ): GetArchiveHoursMCExResponse {
        const buffer = new CommandBinaryBuffer(data);

        return new GetArchiveHoursMCExResponse(buffer.getChannelsValuesWithHourDiffExtended());
    }

    toBinary (): ICommandBinary {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        const {hour, hours, startTime2000, channelList} = this.parameters;

        buffer.setChannelsValuesWithHourDiffExtended(hour, hours, startTime2000, channelList);

        return Command.toBinary(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default GetArchiveHoursMCExResponse;
