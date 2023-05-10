import Command, {TCommandExampleList} from '../../Command.js';
import {getSecondsFromDate, getDateFromSeconds, TTime2000} from '../../../utils/time.js';
import CommandBinaryBuffer, {IChannelHourAbsoluteValue} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


/**
 * ExAbsHourMC command parameters
 *
 * @example
 * // archive hours values from 001-03-10T12:00:00.000Z with 1-hour diff
 *
 * {
 *     startTime: 731764800,
 *     hours: 1,
 *     channelList: [
 *         {
 *             pulseCoefficient: 100,
 *             index: 0,
 *             value: 342457,
 *             diff: [128]
 *         }
 *     ]
 * }
 *
 */
interface IUplinkExAbsHourMCParameters {
    channelList: Array<IChannelHourAbsoluteValue>,
    startTime: TTime2000
    hours: number
}


const COMMAND_ID = 0x0a1f;

// date 2 bytes, hour 1 byte, channelList - 1 byte (max channelList: 4)
// max hours diff - 7 (3 bit value)
// 4 + (4 channelList * (1 byte pulse coefficient + 5 bytes of hour value)) + (4 * 2 bytes of diff * 7 max hours diff)
const COMMAND_BODY_MAX_SIZE = 84;

const examples: TCommandExampleList = [
    {
        name: '1 channel at 2023.03.10 12:00:00 GMT',
        parameters: {
            startTime: 731764800,
            hours: 1,
            channelList: [
                {
                    pulseCoefficient: 100,
                    index: 1,
                    value: 342457,
                    diff: [128]
                }
            ]
        },
        hex: {header: '1f 0a 0a', body: '2e 6a 0c 01 83 b9 f3 14 80 01'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import ExAbsHourMC from 'jooby-codec/analog/commands/uplink/ExAbsHourMC';
 *
 * const commandBody = new Uint8Array([
 *     0x2e, 0x6a, 0x0c, 0x01, 0x82, 0xb9, 0xf3, 0x14, 0x80, 0x01
 * ]);
 * const command = ExAbsHourMC.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     startTime: 731764800,
 *     hours: 1,
 *     channelList: [
 *         {
 *             pulseCoefficient: 100,
 *             index: 1,
 *             value: 342457,
 *             diff: [128]
 *         }
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/uplink/ExAbsHourMC.md)
 */
class ExAbsHourMC extends Command {
    constructor ( public parameters: IUplinkExAbsHourMCParameters ) {
        super();

        this.parameters.channelList = this.parameters.channelList.sort((a, b) => a.index - b.index);
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ): ExAbsHourMC {
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const {hour, hours} = buffer.getHours();
        const channels = buffer.getChannels();
        const channelList: Array<IChannelHourAbsoluteValue> = [];
        const hourAmount = hours === 0 ? 1 : hours;

        date.setUTCHours(hour);

        channels.forEach(channelIndex => {
            const pulseCoefficient = buffer.getPulseCoefficient();
            const value = buffer.getExtendedValue();
            const diff: Array<number> = [];

            for ( let hourIndex = 0; hourIndex < hourAmount; ++hourIndex ) {
                diff.push(buffer.getExtendedValue());
            }

            channelList.push({
                diff,
                value,
                pulseCoefficient,
                index: channelIndex
            });
        });

        return new ExAbsHourMC({channelList, hours: hourAmount, startTime: getSecondsFromDate(date)});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        const {hours, startTime, channelList} = this.parameters;

        const date = getDateFromSeconds(startTime);
        const hour = date.getUTCHours();

        buffer.setDate(startTime);
        buffer.setHours(hour, hours);
        buffer.setChannels(channelList);

        for ( const {value, diff, pulseCoefficient} of channelList ) {
            buffer.setPulseCoefficient(pulseCoefficient);
            buffer.setExtendedValue(value);
            diff.forEach(diffValue => buffer.setExtendedValue(diffValue));
        }

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default ExAbsHourMC;
