import Command from '../../Command.js';
import {getSecondsFromDate, getDateFromSeconds, TTime2000} from '../../utils/time.js';
import CommandBinaryBuffer, {IChannelHourAbsoluteValue} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


/**
 * GetArchiveHoursMC command parameters
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
// 4 + (4 channelList * (1 byte IPK + 5 bytes of hour value)) + (4 * 2 bytes of diff * 7 max hours diff)
const COMMAND_BODY_MAX_SIZE = 84;


/**
 * Uplink command
 *
 * @example
 * ```js
 * import ExAbsHourMC from 'jooby-codec/commands/uplink/GetArchiveHoursMC';
 *
 * const command = new ExAbsHourMC({
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
 * });
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 1a 0d 2f 97 0c 0f 83 01 0a 08 0a 08 0a 0c 0a
 * ```
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/uplink/ExAbsHourMC.md)
 */
class ExAbsHourMC extends Command {
    constructor ( public parameters: IUplinkExAbsHourMCParameters ) {
        super();

        this.parameters.channelList = this.parameters.channelList.sort((a, b) => a.index - b.index);
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

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
            const pulseCoefficient = buffer.getUint8();
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
            buffer.setUint8(pulseCoefficient);
            buffer.setExtendedValue(value);
            diff.forEach(diffValue => buffer.setExtendedValue(diffValue));
        }

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default ExAbsHourMC;
