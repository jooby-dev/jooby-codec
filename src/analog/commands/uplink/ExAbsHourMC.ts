import Command, {TCommandExampleList, ICommandBinary} from '../../Command.js';
import {getTime2000FromDate, getDateFromTime2000, TTime2000} from '../../../utils/time.js';
import CommandBinaryBuffer, {IChannelHourAbsoluteValue} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../../constants/directions.js';


/**
 * ExAbsHourMC command parameters
 */
interface IUplinkExAbsHourMCParameters {
    channelList: Array<IChannelHourAbsoluteValue>,
    startTime2000: TTime2000
    hours: number
}


const COMMAND_ID = 0x0a1f;

// date 2 bytes, hour 1 byte (max hours: 7), channelList 1 byte (max channelList: 4)
// 4 + (4 channelList * 1 byte pulse coefficient) + (4 channelList * 5 bytes of hour values) + (4 * 5 bytes of diff * 7 max hours diff)
const COMMAND_BODY_MAX_SIZE = 168;

const examples: TCommandExampleList = [
    {
        name: '1 channel at 2023.03.10 12:00:00 GMT',
        parameters: {
            startTime2000: 731764800,
            hours: 2,
            channelList: [
                {
                    pulseCoefficient: 100,
                    index: 1,
                    value: 342457,
                    diff: [128]
                }
            ]
        },
        hex: {header: '1f 0a 0a', body: '2e 6a 2c 01 83 b9 f3 14 80 01'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import ExAbsHourMC from 'jooby-codec/analog/commands/uplink/ExAbsHourMC.js';
 *
 * const commandBody = new Uint8Array([
 *     0x2e, 0x6a, 0x2c, 0x01, 0x82, 0xb9, 0xf3, 0x14, 0x80, 0x01
 * ]);
 * const command = ExAbsHourMC.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     startTime2000: 731764800,
 *     hours: 2,
 *     channelList: [
 *         {
 *             pulseCoefficient: 100,
 *             index: 1,
 *             value: 342457,
 *             diff: [128]
 *         }
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/uplink/ExAbsHourMC.md)
 */
class ExAbsHourMC extends Command {
    constructor ( public parameters: IUplinkExAbsHourMCParameters ) {
        super();

        this.parameters.channelList = this.parameters.channelList.sort((a, b) => a.index - b.index);
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ): ExAbsHourMC {
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const {hour, hours} = buffer.getHours();
        const channelList = buffer.getChannelsAbsoluteValuesWithHourDiff(hours);

        date.setUTCHours(hour);

        return new ExAbsHourMC({startTime2000: getTime2000FromDate(date), hours, channelList});
    }

    toBinary (): ICommandBinary {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        const {startTime2000, hours, channelList} = this.parameters;

        const date = getDateFromTime2000(startTime2000);
        const hour = date.getUTCHours();

        buffer.setDate(startTime2000);
        buffer.setHours(hour, hours);
        buffer.setChannelsAbsoluteValuesWithHourDiff(channelList);

        return Command.toBinary(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default ExAbsHourMC;
