/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import Command from '../../Command.js';
import ExAbsDayMul from './ExAbsDayMul.js';
import {getSecondsFromDate, getDateFromSeconds} from '../../utils/time.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';

// 0x1f + 0x0a
const COMMAND_ID = 0x29;
const COMMAND_TITLE = 'EX_ABS_HOUR_MUL';

// date 2 bytes, hour 1 byte, channels - 1 byte, so max channels = 4
// max hours diff - 7 (3 bit value)
// 4 + (4 channels * (1 byte IPK + 5 bytes of hour value)) + (4 * 2 bytes of diff * 7 max hours diff)
const COMMAND_BODY_MAX_SIZE = 84;


class ExAbsHourMul extends ExAbsDayMul {
    constructor ( public parameters: any ) {
        super(parameters);
    }

    static readonly id = COMMAND_ID;

    static readonly isUplink = true;

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

        const channels: Array<any> = [];

        if ( hourAmount === 0 ) {
            // one hour
            hourAmount = 1;
        }

        for ( let channelIndex = 0; channelIndex <= maxChannel; ++channelIndex ) {
            // IPK_${channelIndex}
            const pulseCoefficient = buffer.getUint8();
            // decode hour value for channel
            const pulseValue = buffer.getExtendedValue();
            counterDate.setTime(date.getTime());

            const diff: Array<any> = [];
            const channel = {
                diff,
                pulseCoefficient,
                index: channelIndex,
                value: pulseValue,
                meterValue: this.getMeterValue(pulseValue, pulseCoefficient)
            };

            channels.push(channel);

            for ( let hourIndex = 0; hourIndex < hourAmount; ++hourIndex ) {
                const value = buffer.getExtendedValue();

                counterDate.setUTCHours(counterDate.getUTCHours() + hourIndex);

                diff.push({
                    value,
                    pulseCoefficient,
                    time: getSecondsFromDate(counterDate),
                    meterValue: this.getMeterValue(value + pulseValue, pulseCoefficient)
                });
            }
        }

        return new ExAbsHourMul({channels, date});
    }

    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE, false);
        const {channels} = this.parameters;

        const {time} = channels[0];
        const realDate = getDateFromSeconds(time);
        const hour = realDate.getUTCHours();
        let hourAmount = channels[0].diff.length;

        if ( hourAmount === 1 ) {
            hourAmount = 0;
        }

        buffer.setDate(time);
        buffer.setHours(hour, hourAmount);
        buffer.setChannels(channels);

        for ( const {value, diff, pulseCoefficient} of channels ) {
            buffer.setExtendedValue(value);
            buffer.setUint8(pulseCoefficient);

            for ( const {value: diffValue} of diff ) {
                buffer.setExtendedValue(diffValue);
            }
        }

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default ExAbsHourMul;
