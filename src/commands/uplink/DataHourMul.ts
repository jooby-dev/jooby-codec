/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import Command from '../../Command.js';
import GetCurrentMul from './GetCurrentMul.js';
import {getSecondsFromDate, getDateFromSeconds} from '../../utils/time.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {DIRECTION_TYPE_UPLINK} from '../../constants/directionTypes.js';


const COMMAND_ID = 0x17;
const COMMAND_TITLE = 'DATA_HOUR_MUL';

// date 2 bytes, hour 1 byte, channels - 1 byte, so max channels = 4
// max hours diff - 7 (3 bit value)
// 4 + (4 channels * 3 bytes of hour values) + (4 * 2 bytes of diff * 7 max hours diff)
const COMMAND_BODY_MAX_SIZE = 72;


class DataHourMul extends GetCurrentMul {
    constructor ( public parameters: any ) {
        super(parameters);
    }

    static readonly id = COMMAND_ID;

    static readonly directionType = DIRECTION_TYPE_UPLINK;

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
        let value;

        const channels: Array<any> = [];

        if ( hourAmount === 0 ) {
            // one hour
            hourAmount = 1;
        }

        for ( let channelIndex = 0; channelIndex <= maxChannel; ++channelIndex ) {
            // decode hour value for channel
            value = buffer.getExtendedValue();
            counterDate.setTime(date.getTime());

            const diff: Array<any> = [];
            const channel = {value, index: channelIndex, time: getSecondsFromDate(counterDate), diff};

            channels.push(channel);

            for ( let hourIndex = 0; hourIndex < hourAmount; ++hourIndex ) {
                value = buffer.getExtendedValue();

                counterDate.setUTCHours(counterDate.getUTCHours() + hourIndex);

                diff.push({value, time: getSecondsFromDate(counterDate)});
            }
        }

        return new DataHourMul({channels});
    }

    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
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

        for ( const {value, diff} of channels ) {
            buffer.setExtendedValue(value);

            for ( const {value: diffValue} of diff ) {
                buffer.setExtendedValue(diffValue);
            }
        }

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default DataHourMul;
