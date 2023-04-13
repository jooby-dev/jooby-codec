/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import Command from '../../Command.js';
import GetCurrentMC from './GetCurrentMC.js';
import {getSecondsFromDate, getDateFromSeconds} from '../../utils/time.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import roundNumber from '../../utils/roundNumber.js';
import {UPLINK} from '../../constants/directionTypes.js';


// TODO: rework extended headers detection
const COMMAND_ID = 0x0c1f;
const COMMAND_TITLE = 'EX_ABS_ARCH_HOUR_MUL';

// date 2 bytes, hour 1 byte (max hours: 7), channelList 1 byte (max channelList: 4)
// 4 + (4 channelList * 1 byte pulse coefficient) + (4 channelList * 5 bytes of hour values) + (4 * 5 bytes of diff * 7 max hours diff)
const COMMAND_BODY_MAX_SIZE = 168;


class ExAbsArchiveHourMC extends GetCurrentMC {
    // TODO: add interface for parameters
    constructor ( public parameters: any ) {
        super(parameters);
    }

    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly title = COMMAND_TITLE;

    static fromBytes ( data: Uint8Array ): any {
        const buffer = new CommandBinaryBuffer(data);

        const date = buffer.getDate();
        const {hour, hours} = buffer.getHours();
        const channelArray = buffer.getChannels(true);
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
                    pulseCoefficient,
                    seconds: getSecondsFromDate(counterDate),
                    meterValue: roundNumber((value + pulseValue) / pulseCoefficient)
                });
            }

            channelList.push({
                diff,
                pulseCoefficient,
                index: channelIndex,
                value: pulseValue,
                seconds: getSecondsFromDate(date),
                meterValue: roundNumber(pulseValue / pulseCoefficient)
            });
        }

        return new ExAbsArchiveHourMC({channelList, date});
    }

    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        const {channelList} = this.parameters;

        const {seconds} = channelList[0];
        const realDate = getDateFromSeconds(seconds);
        const hour = realDate.getUTCHours();
        let hours = channelList[0].diff.length;

        // TODO: add link to doc
        if ( hours === 1 ) {
            hours = 0;
        }

        buffer.setDate(seconds);
        buffer.setHours(hour, hours);
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


export default ExAbsArchiveHourMC;
