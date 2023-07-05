import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {ILegacyCounter} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {getTime2000FromDate, TTime2000} from '../../../utils/time.js';


/**
 * GetArchiveDaysResponse command parameters
 */
interface IGetArchiveDaysResponseParameters {
    startTime2000: TTime2000,
    dayList: Array<ILegacyCounter>
}


const COMMAND_ID = 0x06;

// date 2 bytes
const COMMAND_BODY_MIN_SIZE = 2;
const DAY_COUNTER_SIZE = 4;

const examples: TCommandExampleList = [
    {
        name: 'get day values from 2001.03.10',
        parameters: {
            startTime2000: 2678227200,
            dayList: [
                {isMagneticInfluence: true, value: 234}
            ]
        },
        hex: {header: '06 06', body: 'a9 6d 80 00 00 ea'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetArchiveDaysResponse from 'jooby-codec/analog/commands/uplink/GetArchiveDaysResponse.js';
 *
 * const commandBody = new Uint8Array([0xa9, 0x6d, 0x80, 0x00, 0x00, 0xea]);
 * const command = GetArchiveDaysResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     startTime2000: 2678227200,
 *     dayList: [
 *         {isMagneticInfluence: true, value: 234}
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetArchiveDays.md#response)
 */
class GetArchiveDaysResponse extends Command {
    constructor ( public parameters: IGetArchiveDaysResponseParameters ) {
        super();
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ): GetArchiveDaysResponse {
        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const dayList = [];

        while ( buffer.offset < buffer.data.byteLength ) {
            dayList.push(buffer.getLegacyCounter());
        }

        return new GetArchiveDaysResponse({startTime2000: getTime2000FromDate(date), dayList});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {startTime2000, dayList} = this.parameters;
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_MIN_SIZE + (dayList.length * DAY_COUNTER_SIZE));

        buffer.setDate(startTime2000);

        dayList.forEach(dayCounter => buffer.setLegacyCounter(dayCounter));

        return Command.toBytes(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default GetArchiveDaysResponse;
