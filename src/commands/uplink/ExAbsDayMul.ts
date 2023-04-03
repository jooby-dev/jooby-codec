/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import Command from '../../Command.js';
import GetCurrentMul from './GetCurrentMul.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';

// 0x1f + 0x0b
const COMMAND_ID = 0x2a;
const COMMAND_TITLE = 'EX_ABS_DAY_MUL';

// date 2 bytes, channels - 1 byte (max channels: 4)
// 3 + (4 channels * (1 byte IPK + 5 bytes of day values))
const COMMAND_BODY_MAX_SIZE = 27;


class ExAbsDayMul extends GetCurrentMul {
    constructor ( public parameters: any ) {
        super(parameters);
    }

    static id = COMMAND_ID;

    static readonly isUplink = true;

    static title = COMMAND_TITLE;

    protected static getMeterValue ( value: number, pulseCoefficient: number ): number {
        return value * pulseCoefficient;
    }

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
                meterValue: this.getMeterValue(value, pulseCoefficient)
            });
        }

        return new ExAbsDayMul({channels, date});
    }

    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE, false);
        const {channels} = this.parameters;

        const {time} = channels[0];

        buffer.setDate(time);
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


export default ExAbsDayMul;
