/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import Command from '../../Command.js';
import {getSecondsFromDate, getDateFromSeconds} from '../../utils/time.js';
import CommandBinaryBuffer, {IChannelHourAbsoluteValue} from '../../CommandBinaryBuffer.js';
import roundNumber from '../../utils/roundNumber.js';
import {UPLINK} from '../../constants/directionTypes.js';


/**
 * GetArchiveHoursMC command parameters
 *
 * @example
 * // archive hours values from 001-03-10T12:00:00.000Z with 1-hour diff
 *
 * {
 *     seconds: 731764800,
 *     hours: 1,
 *     channelList: [
 *         {
 *             pulseCoefficient: 100,
 *             index: 0,
 *             value: 342457,
 *             meterValue: 3424.57,
 *             diff: [
 *                 {
 *                     value: 128,
 *                     seconds: 731764800,
 *                     meterValue: 3425.85
 *                 }
 *             ]
 *         }
 *     ]
 * }
 *
 */
interface IUplinkExAbsHourMCParameters {
    channelList: Array<IChannelHourAbsoluteValue>,
    seconds: number
    hours: number
}


const COMMAND_ID = 0x0a1f;
const COMMAND_TITLE = 'EX_ABS_HOUR_MC';

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
 *     seconds: 731764800,
 *     hours: 1,
 *     channelList: [
 *         {
 *             pulseCoefficient: 100,
 *             index: 0,
 *             value: 342457,
 *             meterValue: 3424.57,
 *             diff: [
 *                 {
 *                     value: 128,
 *                     seconds: 731764800,
 *                     meterValue: 3425.85
 *                 }
 *             ]
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

    static readonly title = COMMAND_TITLE;

    static fromBytes ( data: Uint8Array ): any {
        const buffer = new CommandBinaryBuffer(data);

        const date = buffer.getDate();
        const {hour, hours} = buffer.getHours();
        const channelArray = buffer.getChannels();
        const maxChannel = Math.max.apply(null, channelArray);

        date.setUTCHours(hour);

        const counterDate = new Date(date);
        let hourAmount = hours;

        const channelList: Array<any> = [];

        if ( hourAmount === 0 ) {
            // one hour
            hourAmount = 1;
        }

        for ( let channelIndex = 0; channelIndex <= maxChannel; ++channelIndex ) {
            // IPK_${channelIndex}
            const pulseCoefficient = buffer.getUint8();
            // decode hour value for channel
            const pulseValue = buffer.getExtendedValue();
            const diff: Array<any> = [];

            counterDate.setTime(date.getTime());

            for ( let hourIndex = 0; hourIndex < hourAmount; ++hourIndex ) {
                const value = buffer.getExtendedValue();

                counterDate.setUTCHours(counterDate.getUTCHours() + hourIndex);

                diff.push({
                    value,
                    seconds: getSecondsFromDate(counterDate),
                    meterValue: roundNumber((value + pulseValue) / pulseCoefficient)
                });
            }

            channelList.push({
                diff,
                pulseCoefficient,
                index: channelIndex,
                value: pulseValue,
                meterValue: roundNumber(pulseValue / pulseCoefficient)
            });
        }

        return new ExAbsHourMC({channelList, hours, seconds: getSecondsFromDate(date)});
    }

    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        const {hours, seconds, channelList} = this.parameters;

        const realDate = getDateFromSeconds(seconds);
        const hour = realDate.getUTCHours();
        let hourAmount = hours;

        // TODO: add link to doc
        if ( hourAmount === 1 ) {
            hourAmount = 0;
        }

        buffer.setDate(seconds);
        buffer.setHours(hour, hourAmount);
        buffer.setChannels(channelList);

        for ( const {value, diff, pulseCoefficient} of channelList ) {
            buffer.setUint8(pulseCoefficient);
            buffer.setExtendedValue(value);

            for ( const {value: diffValue} of diff ) {
                buffer.setExtendedValue(diffValue);
            }
        }

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default ExAbsHourMC;
