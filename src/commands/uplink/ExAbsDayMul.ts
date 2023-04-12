/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import Command from '../../Command.js';
import GetCurrentMul from './GetCurrentMul.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import roundNumber from '../../utils/roundNumber.js';
import {getSecondsFromDate} from '../../utils/time.js';
import {DIRECTION_TYPE_UPLINK} from '../../constants/directionTypes.js';


const COMMAND_ID = 0x0b1f;
const COMMAND_TITLE = 'EX_ABS_DAY_MUL';

// date 2 bytes, channels - 1 byte (max channels: 4)
// 3 + (4 channels * (1 byte IPK + 5 bytes of day values))
const COMMAND_BODY_MAX_SIZE = 27;


class ExAbsDayMul extends GetCurrentMul {
    constructor ( public parameters: any ) {
        super(parameters);
    }

    static id = COMMAND_ID;

    static readonly directionType = DIRECTION_TYPE_UPLINK;

    static title = COMMAND_TITLE;

    static fromBytes ( data: Uint8Array ): any {
        const buffer = new CommandBinaryBuffer(data);

        const date = buffer.getDate();
        const channelArray = buffer.getChannels(true);
        const maxChannel = Math.max.apply(null, channelArray);

        let value;

        const channels: Array<any> = [];

        for ( let channelIndex = 0; channelIndex <= maxChannel; ++channelIndex ) {
            // IPK_${channelIndex}
            const pulseCoefficient = buffer.getUint8();
            // day value
            value = buffer.getExtendedValue();
            channels.push({
                value,
                pulseCoefficient,
                index: channelIndex,
                time: getSecondsFromDate(date),
                meterValue: roundNumber(value / pulseCoefficient)
            });
        }

        return new ExAbsDayMul({channels, date});
    }

    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        const {channels} = this.parameters;

        const {time} = channels[0];

        buffer.setDate(time);
        buffer.setChannels(channels);

        for ( const {value, pulseCoefficient} of channels ) {
            buffer.setUint8(pulseCoefficient);
            buffer.setExtendedValue(value);
        }

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default ExAbsDayMul;
