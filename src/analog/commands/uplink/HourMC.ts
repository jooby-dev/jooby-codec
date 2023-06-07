import Command, {TCommandExampleList} from '../../Command.js';
import CurrentMC from './CurrentMC.js';
import {getTime2000FromDate, getDateFromTime2000, TTime2000} from '../../../utils/time.js';
import CommandBinaryBuffer, {IChannelHours} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


interface IHourMCParameters {
    channelList: Array<IChannelHours>,
    startTime2000: TTime2000
    hours: number
}


const COMMAND_ID = 0x17;

// date 2 bytes, hour 1 byte, channelList - 1 byte, so max channelList = 4
// max hours diff - 7 (3 bit value)
// 4 + (4 channelList * 5 bytes of hour values) + (4 * 5 bytes of diff * 7 max hours diff)
const COMMAND_BODY_MAX_SIZE = 164;

const examples: TCommandExampleList = [
    {
        name: '4 first channels at 2023.12.23 12:00:00 GMT',
        parameters: {
            startTime2000: 756648000,
            hours: 1,
            channelList: [
                {index: 1, value: 131, diff: [10]},
                {index: 2, value: 832, diff: [12]},
                {index: 3, value: 38, diff: [8]},
                {index: 4, value: 234, diff: [11]}
            ]
        },
        hex: {header: '17 0f', body: '2f 97 0c 0f 83 01 0a c0 06 0c 26 08 ea 01 0b'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import HourMC from 'jooby-codec/analog/commands/uplink/HourMC.js';
 *
 * const commandBody = new Uint8Array([
 *    0x2f, 0x97, 0x0c, 0x0f, 0x83, 0x01, 0x0a, 0xc0, 0x06, 0x0c, 0x26, 0x08, 0xea, 0x01, 0x0b
 * ]);
 * const command = HourMC.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     startTime2000: 756648000,
 *     hours: 1,
 *     channelList: [
 *         {value: 131, index: 1, diff: [10]},
 *         {value: 832, index: 2, diff: [12]},
 *         {value: 38, index: 3, diff: [8]},
 *         {value: 234, index: 4, diff: [11]}
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/uplink/HourMC.md)
 */
class HourMC extends CurrentMC {
    constructor ( public parameters: IHourMCParameters ) {
        super(parameters);
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ): HourMC {
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const {hour, hours} = buffer.getHours();
        const channels = buffer.getChannels();
        const channelList: Array<IChannelHours> = [];
        let value;

        date.setUTCHours(hour);

        channels.forEach(channelIndex => {
            // decode hour value for channel
            value = buffer.getExtendedValue();

            const diff: Array<number> = [];

            for ( let diffHour = 0; diffHour < hours; ++diffHour ) {
                diff.push(buffer.getExtendedValue());
            }

            channelList.push({value, index: channelIndex, diff});
        });

        return new HourMC({channelList, hours, startTime2000: getTime2000FromDate(date)});
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


export default HourMC;
