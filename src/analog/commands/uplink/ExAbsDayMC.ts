import Command, {TCommandExampleList} from '../../Command.js';
import CurrentMC from './CurrentMC.js';
import CommandBinaryBuffer, {IChannelAbsoluteValue} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../../constants/directions.js';
import {getTime2000FromDate, TTime2000} from '../../../utils/time.js';


interface IExAbsDayMCParameters {
    channelList: Array<IChannelAbsoluteValue>,
    startTime2000: TTime2000
}


const COMMAND_ID = 0x0b1f;

// date 2 bytes, channelList 3 bytes (max channelList: 14)
// 5 + (14 channelList * (1 byte pulse coefficient + 5 bytes of day values))
const COMMAND_BODY_MAX_SIZE = 89;

const examples: TCommandExampleList = [
    {
        name: 'absolute day value for 2023.03.10 00:00:00 GMT',
        parameters: {
            startTime2000: 731721600,
            channelList: [
                {pulseCoefficient: 100, index: 1, value: 342}
            ]
        },
        hex: {header: '1f 0b 06', body: '2e 6a 01 83 d6 02'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import ExAbsDayMC from 'jooby-codec/analog/commands/uplink/ExAbsDayMC.js';
 *
 * const commandBody = new Uint8Array([0x2e, 0x6a, 0x01, 0x82, 0xd6, 0x02']);
 * const command = ExAbsDayMC.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     startTime2000: 731721600,
 *     channelList: [
 *         {
 *             pulseCoefficient: 100,
 *             index: 1,
 *             value: 342
 *         }
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/uplink/ExAbsDayMC.md)
 */
class ExAbsDayMC extends CurrentMC {
    constructor ( public parameters: IExAbsDayMCParameters ) {
        super(parameters);
    }


    static id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ): ExAbsDayMC {
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const channelList = buffer.getChannelsWithAbsoluteValues();

        return new ExAbsDayMC({startTime2000: getTime2000FromDate(date), channelList});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
        const {startTime2000, channelList} = this.parameters;

        buffer.setDate(startTime2000);
        buffer.setChannelsWithAbsoluteValues(channelList);

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default ExAbsDayMC;
