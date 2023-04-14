import Command from '../../Command.js';
import GetCurrentMC from './GetCurrentMC.js';
import {getSecondsFromDate, getDateFromSeconds} from '../../utils/time.js';
import CommandBinaryBuffer, {IChannelHourAbsoluteValue} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directionTypes.js';


interface IUplinkExAbsArchiveHoursMCParameters {
    channelList: Array<IChannelHourAbsoluteValue>,
    startTime: number
    hours: number
}


// TODO: rework extended headers detection
const COMMAND_ID = 0x0c1f;
const COMMAND_TITLE = 'EX_ABS_ARCH_HOUR_MC';

// date 2 bytes, hour 1 byte (max hours: 7), channelList 1 byte (max channelList: 4)
// 4 + (4 channelList * 1 byte pulse coefficient) + (4 channelList * 5 bytes of hour values) + (4 * 5 bytes of diff * 7 max hours diff)
const COMMAND_BODY_MAX_SIZE = 168;


class ExAbsArchiveHoursMC extends GetCurrentMC {
    // TODO: add interface for parameters
    constructor ( public parameters: IUplinkExAbsArchiveHoursMCParameters ) {
        super(parameters);
    }

    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly title = COMMAND_TITLE;

    static fromBytes ( data: Uint8Array ): ExAbsArchiveHoursMC {
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const {hour, hours} = buffer.getHours();
        const channelArray = buffer.getChannels();
        const maxChannel = Math.max.apply(null, channelArray);
        const channelList: Array<IChannelHourAbsoluteValue> = [];

        date.setUTCHours(hour);

        for ( let channelIndex = 0; channelIndex <= maxChannel; ++channelIndex ) {
            // IPK_${channelIndex}
            const pulseCoefficient = buffer.getUint8();
            const pulseValue = buffer.getExtendedValue();
            const diff: Array<number> = [];

            for ( let hourIndex = 0; hourIndex < hours; ++hourIndex ) {
                diff.push(buffer.getExtendedValue());
            }

            channelList.push({
                diff,
                pulseCoefficient,
                index: channelIndex,
                value: pulseValue
            });
        }

        return new ExAbsArchiveHoursMC({channelList, hours, startTime: getSecondsFromDate(date)});
    }

    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        const {channelList, startTime, hours} = this.parameters;

        const realDate = getDateFromSeconds(startTime);
        const hour = realDate.getUTCHours();

        buffer.setDate(realDate);
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


export default ExAbsArchiveHoursMC;
