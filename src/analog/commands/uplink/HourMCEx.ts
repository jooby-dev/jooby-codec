import Command, {TCommandExampleList, ICommandBinary} from '../../Command.js';
import CurrentMC from './CurrentMC.js';
import {TTime2000} from '../../../utils/time.js';
import CommandBinaryBuffer, {IChannelHours} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../../constants/directions.js';
import {TUint8} from "../../../types";


interface IHourMCExParameters {
    channelList: Array<IChannelHours>,
    startTime2000: TTime2000,
    hour: TUint8,
    hours: TUint8
}


const COMMAND_ID = 0x311f;

// date 2 bytes, hour 2 byte, channelList - 1 byte, so max channelList = 5
// max hours diff - 7 (3 bit value)
// 5 + (4 channelList * 5 bytes of hour values) + (4 * 5 bytes of diff * 255 max hours diff)
const COMMAND_BODY_MAX_SIZE = 5125;

const examples: TCommandExampleList = [
    {
        name: '4 first channels at 2023.12.23 12:00:00 GMT',
        parameters: {
            startTime2000: 756648000,
            hour: 12,
            hours: 2,
            channelList: [
                {index: 1, value: 131, diff: [10]},
                {index: 2, value: 832, diff: [12]},
                {index: 3, value: 38, diff: [8]},
                {index: 4, value: 234, diff: [11]}
            ]
        },

        hex: {header: '1f 31 10', body: '2f 97 0c 02 0f 83 01 0a c0 06 0c 26 08 ea 01 0b'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import HourMCEx from 'jooby-codec/analog/commands/uplink/HourMCEx.js';
 *
 * const commandBody = new Uint8Array([
 *    0x2f, 0x97, 0x0c, 0x02, 0x0f, 0x83, 0x01, 0x0a, 0xc0, 0x06, 0x0c, 0x26, 0x08, 0xea, 0x01, 0x0b
 * ]);
 * const command = HourMCEx.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     startTime2000: 756648000,
 *     hour: 12,
 *     hours: 2,
 *     channelList: [
 *         {value: 131, index: 1, diff: [10]},
 *         {value: 832, index: 2, diff: [12]},
 *         {value: 38, index: 3, diff: [8]},
 *         {value: 234, index: 4, diff: [11]}
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/uplink/HourMCEx.md)
 */
class HourMCEx extends CurrentMC {
    constructor ( public parameters: IHourMCExParameters ) {
        super(parameters);
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ): HourMCEx {
        const buffer = new CommandBinaryBuffer(data);

        return new HourMCEx(buffer.getChannelsValuesWithHourDiffExtended());
    }

    toBinary (): ICommandBinary {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        const {startTime2000, hour, hours, channelList} = this.parameters;

        buffer.setChannelsValuesWithHourDiffExtended(hour, hours, startTime2000, channelList);

        return Command.toBinary(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default HourMCEx;
