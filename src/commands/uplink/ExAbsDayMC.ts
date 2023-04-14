import Command from '../../Command.js';
import GetCurrentMC from './GetCurrentMC.js';
import CommandBinaryBuffer, {IChannelArchiveDaysAbsoluteValue} from '../../CommandBinaryBuffer.js';
import {getSecondsFromDate} from '../../utils/time.js';
import {UPLINK} from '../../constants/directionTypes.js';


interface IExAbsDayMCParameters {
    channelList: Array<IChannelArchiveDaysAbsoluteValue>,
    startTime: number
}


const COMMAND_ID = 0x0b1f;
const COMMAND_TITLE = 'EX_ABS_DAY_MC';

// date 2 bytes, channelList - 1 byte (max channelList: 4)
// 3 + (4 channelList * (1 byte IPK + 5 bytes of day values))
const COMMAND_BODY_MAX_SIZE = 27;


class ExAbsDayMC extends GetCurrentMC {
    constructor ( public parameters: IExAbsDayMCParameters ) {
        super(parameters);
    }

    static id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static title = COMMAND_TITLE;

    static fromBytes ( data: Uint8Array ): ExAbsDayMC {
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const channelArray = buffer.getChannels();
        const maxChannel = Math.max.apply(null, channelArray);
        const channelList: Array<IChannelArchiveDaysAbsoluteValue> = [];

        for ( let channelIndex = 0; channelIndex <= maxChannel; ++channelIndex ) {
            channelList.push({
                // IPK_${channelIndex}
                pulseCoefficient: buffer.getUint8(),
                // day value
                value: buffer.getExtendedValue(),
                index: channelIndex
            });
        }

        return new ExAbsDayMC({channelList, startTime: getSecondsFromDate(date)});
    }

    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        const {channelList, startTime} = this.parameters;

        buffer.setDate(startTime);
        buffer.setChannels(channelList);

        for ( const {value, pulseCoefficient} of channelList ) {
            buffer.setUint8(pulseCoefficient);
            buffer.setExtendedValue(value);
        }

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default ExAbsDayMC;
