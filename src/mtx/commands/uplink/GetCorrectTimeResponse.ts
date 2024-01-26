import Command, {TCommandExampleList, COMMAND_HEADER_SIZE} from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {ITimeCorrectionParameters} from '../../utils/dateTime.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {UPLINK} from '../../../constants/directions.js';


const COMMAND_ID = 0x3e;
const COMMAND_SIZE = 9;

const examples: TCommandExampleList = [
    {
        name: 'default parameters',
        parameters: {
            monthTransitionSummer: 3,
            dateTransitionSummer: 0,
            hoursTransitionSummer: 3,
            hoursCorrectSummer: 1,
            monthTransitionWinter: 10,
            dateTransitionWinter: 0,
            hoursTransitionWinter: 4,
            hoursCorrectWinter: 1,
            isCorrectionNeeded: true
        },
        hex: {header: '3e 09', body: '03 00 03 01 0a 00 04 01 01'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetCorrectTimeResponse from 'jooby-codec/obis-observer/commands/uplink/GetCorrectTimeResponse.js';
 *
 * const commandBody = new Uint8Array([0x03, 0x00, 0x03, 0x01, 0x0a, 0x00, 0x04, 0x01, 0x01]);
 * const command = GetCorrectTimeResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     monthTransitionSummer: 3,
 *     dateTransitionSummer: 0,
 *     hoursTransitionSummer: 3,
 *     hoursCorrectSummer: 1,
 *     monthTransitionWinter: 10,
 *     dateTransitionWinter: 0,
 *     hoursTransitionWinter: 4,
 *     hoursCorrectWinter: 1,
 *     isCorrectionNeeded: true
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/uplink/GetCorrectTime.md#response)
 */
class GetCorrectTimeResponse extends Command {
    constructor ( public parameters: ITimeCorrectionParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;

    static readonly accessLevel = READ_ONLY;

    static readonly maxSize = COMMAND_SIZE;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new GetCorrectTimeResponse(buffer.getTimeCorrectionParameters());
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_HEADER_SIZE + this.size);

        // header + size
        buffer.setUint8(COMMAND_ID);
        buffer.setUint8(this.size);

        // body
        buffer.setTimeCorrectionParameters(this.parameters);

        return buffer.toUint8Array();
    }
}


export default GetCorrectTimeResponse;
