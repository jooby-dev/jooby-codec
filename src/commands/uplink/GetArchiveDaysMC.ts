import Command from '../../Command.js';
import CommandBinaryBuffer, {IChannelDays} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {getSecondsFromDate, TTime2000} from '../../utils/time.js';


/**
 * GetArchiveDaysMC command parameters
 *
 * @example
 * // archive 2 days values from 2001-03-10T00:00:00.000Z
 * {
 *     channelList: [{index: 0, days: [{value: 234, day: 0}, {value: 332, day: 1}]}],
 *     date: '2001-03-10T12:00:00.000Z',
 *     days: 2
 * }
 */
interface IUplinkGetArchiveDaysMCParameters {
    channelList: Array<IChannelDays>,
    startTime: TTime2000,
    days: number
}


const COMMAND_ID = 0x1b;

// date 2 bytes, channelList 1 byte (max channelList: 4), days 1 byte (max days - 255)
// 4 + (4 channelList * 5 bytes of day values * 255 max days)
const COMMAND_BODY_MAX_SIZE = 5104;


/**
 * Uplink command
 *
 * @example
 * ```js
 * import GetArchiveDaysMC from 'jooby-codec/commands/uplink/GetArchiveDaysMC';
 *
 * const parameters = {
 *     channelList: [{index: 0, days: [{value: 234, day: 0}, {value: 332, day: 1}]}],
 *     date: '2001-03-10T12:00:00.000Z',
 *     days: 2
 * };
 *
 * const command = new GetArchiveDaysMC(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 1b 04 2f 97 0c 01
 * ```
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/GetArchiveDaysMC.md#response)
 */
class GetArchiveDaysMC extends Command {
    constructor ( public parameters: IUplinkGetArchiveDaysMCParameters ) {
        super();

        this.parameters.channelList = this.parameters.channelList.sort((a, b) => a.index - b.index);
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ): GetArchiveDaysMC {
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const channels = buffer.getChannels();
        const days = buffer.getUint8();
        const channelList: Array<IChannelDays> = [];

        channels.forEach(channelIndex => {
            const dayList: Array<number> = [];

            channelList.push({
                dayList,
                index: channelIndex
            });

            for ( let day = 0; day < days; ++day ) {
                dayList.push(buffer.getExtendedValue());
            }
        });

        return new GetArchiveDaysMC({channelList, days, startTime: getSecondsFromDate(date)});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        const {days, startTime, channelList} = this.parameters;

        buffer.setDate(startTime);
        buffer.setChannels(channelList);
        buffer.setUint8(days);

        channelList.forEach(({dayList}) => {
            dayList.forEach(value => buffer.setExtendedValue(value));
        });

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default GetArchiveDaysMC;
