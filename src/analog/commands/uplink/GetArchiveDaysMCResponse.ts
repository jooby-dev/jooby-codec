import Command, {TCommandExampleList, ICommandBinary} from '../../Command.js';
import CommandBinaryBuffer, {IChannelDays} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../../constants/directions.js';
import {getTime2000FromDate, TTime2000} from '../../../utils/time.js';


/**
 * GetArchiveDaysMCResponse command parameters
 */
interface IGetArchiveDaysMCResponseParameters {
    channelList: Array<IChannelDays>,
    startTime2000: TTime2000,
    days: number
}


const COMMAND_ID = 0x1b;

// date 2 bytes, channelList 1 byte (max channelList: 4), days 1 byte (max days - 255)
// 4 + (4 channelList * 5 bytes of day values * 255 max days)
const COMMAND_BODY_MAX_SIZE = 5104;

const examples: TCommandExampleList = [
    {
        name: 'get day values from 2001.03.10 12:00:00 GMT for channel 1',
        parameters: {
            startTime2000: 2678227200,
            days: 2,
            channelList: [
                {
                    index: 1,
                    dayList: [234, 332]
                }
            ]
        },
        hex: {header: '1b 08', body: 'a9 6d 01 02 ea 01 cc 02'}
    },
    {
        name: 'empty result from 2010.10.09 00:00:00 GMT for channel 1',
        parameters: {
            startTime2000: 339897600,
            days: 1,
            channelList: [
                {
                    index: 1,
                    dayList: [0]
                }
            ]
        },
        hex: {header: '1b 05', body: '15 49 01 01 00'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetArchiveDaysMCResponse from 'jooby-codec/analog/commands/uplink/GetArchiveDaysMCResponse.js';
 *
 * const commandBody = new Uint8Array([
 *     0xa9, 0x6d, 0x01, 0x02, 0xea, 0x01, 0xcc, 0x02
 * ]);
 * const command = GetArchiveDaysMCResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     startTime2000: 2678227200,
 *     days: 2,
 *     channelList: [
 *         {
 *             index: 1,
 *             dayList: [234, 332]
 *         }
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetArchiveDaysMC.md#response)
 */
class GetArchiveDaysMCResponse extends Command {
    constructor ( public parameters: IGetArchiveDaysMCResponseParameters ) {
        super();

        this.parameters.channelList = this.parameters.channelList.sort((a, b) => a.index - b.index);
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ): GetArchiveDaysMCResponse {
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

        return new GetArchiveDaysMCResponse({startTime2000: getTime2000FromDate(date), days, channelList});
    }

    toBinary (): ICommandBinary {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        const {startTime2000, days, channelList} = this.parameters;

        buffer.setDate(startTime2000);
        buffer.setChannels(channelList);
        buffer.setUint8(days);

        channelList.forEach(({dayList}) => {
            dayList.forEach(value => buffer.setExtendedValue(value));
        });

        return Command.toBinary(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default GetArchiveDaysMCResponse;
