import Command from '../../Command.js';
import CommandBinaryBuffer, {IChannelHours} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {TTime2000} from '../../utils/time.js';


/**
 * GetArchiveHoursMC command parameters
 *
 * @example
 * // archive hours values from 001-03-10T12:00:00.000Z with 1-hour diff
 * {
 *     channelList: [{value: 101, index: 0, diff: [1]}],
 *     startTime: 756648000,
 *     hours: 1
 * }
 */
interface IUplinkGetArchiveHoursMCParameters {
    channelList: Array<IChannelHours>,
    startTime: TTime2000
    hours: number
}


const COMMAND_ID = 0x1a;

// date 2 bytes, hour 1 byte, channelList - 1 byte, so max channelList = 4
// max hours diff - 7 (3 bit value)
// 4 + (4 channelList * 5 bytes of hour values) + (4 * 5 bytes of diff * 7 max hours diff)
const COMMAND_BODY_MAX_SIZE = 164;


/**
 * Uplink command
 *
 * @example
 * ```js
 * import GetArchiveHoursMC from 'jooby-codec/commands/uplink/GetArchiveHoursMC';
 *
 * const command = new GetArchiveHoursMC(
 *     startTime: 756648000,
 *     hours: 1,
 *     channelList: [
 *         {
 *             value: 131,
 *             index: 0,
 *             diff: [10]
 *         },
 *         {
 *             value: 8,
 *             index: 1,
 *             diff: [10]
 *         },
 *         {
 *             value: 8,
 *             index: 2,
 *             diff: [10]
 *         },
 *         {
 *             value: 12,
 *             index: 3,
 *             diff: [10]
 *         }
 *     ]
 * );
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 1a 0d 2f 97 0c 0f 83 01 0a 08 0a 08 0a 0c 0a
 * ```
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/GetArchiveHoursMC.md#response)
 */
class GetArchiveHoursMC extends Command {
    constructor ( public parameters: IUplinkGetArchiveHoursMCParameters ) {
        super();

        this.parameters.channelList = this.parameters.channelList.sort((a, b) => a.index - b.index);
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ): GetArchiveHoursMC {
        const buffer = new CommandBinaryBuffer(data);

        return new GetArchiveHoursMC(buffer.getChannelsValuesWithHourDiff());
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        const {hours, startTime, channelList} = this.parameters;

        buffer.setChannelsValuesWithHourDiff(hours, startTime, channelList);

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default GetArchiveHoursMC;
