import Command, {TCommandExampleList} from '../../Command.js';
import {getTime2000FromDate, getDateFromTime2000, TTime2000} from '../../../utils/time.js';
import CommandBinaryBuffer, {IChannelHours} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


interface IGetExAbsArchiveHoursMCResponseParameters {
    channelList: Array<IChannelHours>,
    startTime2000: TTime2000
    hours: number
}


// TODO: rework extended headers detection
const COMMAND_ID = 0x0c1f;

// date 2 bytes, hour 1 byte (max hours: 7), channelList 1 byte (max channelList: 4)
// 4 + (4 channelList * 1 byte pulse coefficient) + (4 channelList * 5 bytes of hour values) + (4 * 5 bytes of diff * 7 max hours diff)
const COMMAND_BODY_MAX_SIZE = 168;

const examples: TCommandExampleList = [
    {
        name: '1 channel at 2023.12.23 12:00:00 GMT',
        parameters: {
            startTime2000: 756648000,
            hours: 1,
            channelList: [
                {value: 234, index: 2, diff: [2]}
            ]
        },
        hex: {header: '1f 0c 07', body: '2f 97 0c 02 ea 01 02'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetExAbsArchiveHoursMCResponse from 'jooby-codec/analog/commands/uplink/GetExAbsArchiveHoursMCResponse.js';
 *
 * const commandBody = new Uint8Array([
 *     0x2f, 0x97, 0x0c, 0x04, 0xea, 0x01, 0x02
 * ]);
 * const command = GetExAbsArchiveHoursMCResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     startTime2000: 756648000,
 *     hours: 1,
 *     channelList: [
 *         {value: 234, index: 2, diff: [2]}
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/GetExAbsArchiveHoursMC.md#response)
 */
class GetExAbsArchiveHoursMCResponse extends Command {
    constructor ( public parameters: IGetExAbsArchiveHoursMCResponseParameters ) {
        super();

        this.parameters.channelList = this.parameters.channelList.sort((a, b) => a.index - b.index);
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ): GetExAbsArchiveHoursMCResponse {
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const {hour, hours} = buffer.getHours();
        const channels = buffer.getChannels();
        const channelList: Array<IChannelHours> = [];

        date.setUTCHours(hour);

        channels.forEach(channelIndex => {
            const value = buffer.getExtendedValue();
            const diff: Array<number> = [];

            for ( let hourIndex = 0; hourIndex < hours; ++hourIndex ) {
                diff.push(buffer.getExtendedValue());
            }

            channelList.push({
                diff,
                value,
                index: channelIndex
            });
        });

        return new GetExAbsArchiveHoursMCResponse({channelList, hours, startTime2000: getTime2000FromDate(date)});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        const {channelList, startTime2000, hours} = this.parameters;
        const date = getDateFromTime2000(startTime2000);
        const hour = date.getUTCHours();

        buffer.setDate(date);
        buffer.setHours(hour, hours);
        buffer.setChannels(channelList);

        for ( const {value, diff} of channelList ) {
            buffer.setExtendedValue(value);
            diff.forEach(diffValue => buffer.setExtendedValue(diffValue));
        }

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default GetExAbsArchiveHoursMCResponse;
