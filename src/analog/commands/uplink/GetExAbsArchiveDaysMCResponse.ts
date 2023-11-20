import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {IChannelArchiveDaysAbsolute} from '../../CommandBinaryBuffer.js';
import {getTime2000FromDate, TTime2000} from '../../../utils/time.js';
import {UPLINK} from '../../../constants/directions.js';


interface IGetExAbsArchiveDaysMCResponseParameters {
    channelList: Array<IChannelArchiveDaysAbsolute>,
    startTime2000: TTime2000,
    days: number
}


const COMMAND_ID = 0x0d1f;

// date 2 bytes, channelList 1 byte (max channelList: 4), days 1 byte (max days - 255)
// 4 + (4 channelList * (1 byte pulse coefficient + 5 bytes of day values) * 255 max days)
const COMMAND_BODY_MAX_SIZE = 6124;

const examples: TCommandExampleList = [
    {
        name: 'archive days values at 4 channel from 2023.03.10 00:00:00 GMT',
        parameters: {
            startTime2000: 731721600,
            days: 2,
            channelList: [
                {
                    pulseCoefficient: 100,
                    index: 4,
                    dayList: [5524, 5674]
                }
            ]
        },
        hex: {header: '1f 0d 09', body: '2e 6a 08 02 83 94 2b aa 2c'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetExAbsArchiveDaysMCResponse from 'jooby-codec/analog/commands/uplink/GetExAbsArchiveDaysMCResponse.js';
 *
 * const commandBody = new Uint8Array([
 *     0x2e, 0x6a, 0x08, 0x02, 0x83, 0x94, 0x2b, 0xaa, 0x2c
 * ]);
 * const command = GetExAbsArchiveDaysMCResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     startTime2000: 731721600,
 *     days: 2,
 *     channelList: [
 *         {
 *             pulseCoefficient: 100,
 *             index: 4,
 *             dayList: [5524, 5674]
 *         }
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetExAbsArchiveDaysMC.md#response)
 */
class GetExAbsArchiveDaysMCResponse extends Command {
    constructor ( public parameters: IGetExAbsArchiveDaysMCResponseParameters ) {
        super();

        this.parameters.channelList = this.parameters.channelList.sort((a, b) => a.index - b.index);
    }


    static id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ): GetExAbsArchiveDaysMCResponse {
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const channels = buffer.getChannels();
        const days = buffer.getUint8();
        const channelList: Array<IChannelArchiveDaysAbsolute> = [];

        channels.forEach(channelIndex => {
            const dayList: Array<number> = [];
            const pulseCoefficient = buffer.getPulseCoefficient();

            channelList.push({
                pulseCoefficient,
                dayList,
                index: channelIndex
            });

            for ( let day = 0; day < days; ++day ) {
                dayList.push(buffer.getExtendedValue());
            }
        });

        return new GetExAbsArchiveDaysMCResponse({channelList, days, startTime2000: getTime2000FromDate(date)});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        const {channelList, startTime2000, days} = this.parameters;

        buffer.setDate(startTime2000);
        buffer.setChannels(channelList);
        buffer.setUint8(days);

        channelList.forEach(({pulseCoefficient, dayList}) => {
            buffer.setPulseCoefficient(pulseCoefficient);
            dayList.forEach(value => buffer.setExtendedValue(value));
        });

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default GetExAbsArchiveDaysMCResponse;
