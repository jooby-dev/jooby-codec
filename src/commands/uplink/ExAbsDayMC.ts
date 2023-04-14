/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import Command from '../../Command.js';
import GetCurrentMC from './GetCurrentMC.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import roundNumber from '../../utils/roundNumber.js';
import {getSecondsFromDate} from '../../utils/time.js';
import {UPLINK} from '../../constants/directionTypes.js';


const COMMAND_ID = 0x0b1f;
const COMMAND_TITLE = 'EX_ABS_DAY_MC';

// date 2 bytes, channelList - 1 byte (max channelList: 4)
// 3 + (4 channelList * (1 byte IPK + 5 bytes of day values))
const COMMAND_BODY_MAX_SIZE = 27;


class ExAbsDayMC extends GetCurrentMC {
    constructor ( public parameters: any ) {
        super(parameters);
    }

    static id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static title = COMMAND_TITLE;

    static fromBytes ( data: Uint8Array ): any {
        const buffer = new CommandBinaryBuffer(data);

        const date = buffer.getDate();
        const channelArray = buffer.getChannels();
        const maxChannel = Math.max.apply(null, channelArray);

        let value;

        const channelList: Array<any> = [];

        for ( let channelIndex = 0; channelIndex <= maxChannel; ++channelIndex ) {
            // IPK_${channelIndex}
            const pulseCoefficient = buffer.getUint8();
            // day value
            value = buffer.getExtendedValue();
            channelList.push({
                value,
                pulseCoefficient,
                index: channelIndex,
                meterValue: roundNumber(value / pulseCoefficient)
            });
        }

        return new ExAbsDayMC({channelList, seconds: getSecondsFromDate(date)});
    }

    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        const {channelList, seconds} = this.parameters;

        buffer.setDate(seconds);
        buffer.setChannels(channelList);

        for ( const {value, pulseCoefficient} of channelList ) {
            buffer.setUint8(pulseCoefficient);
            buffer.setExtendedValue(value);
        }

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default ExAbsDayMC;
