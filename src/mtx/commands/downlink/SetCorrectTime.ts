import Command, {TCommandExampleList, COMMAND_HEADER_SIZE} from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {ITimeCorrectionParameters} from '../../utils/dateTime.js';
import {READ_WRITE} from '../../constants/accessLevels.js';
import {UPLINK} from '../../../constants/directions.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import SetCorrectTimeResponse from '../uplink/SetCorrectTimeResponse.js';


const COMMAND_ID = 0x1c;
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
        hex: {header: '1c 09', body: '03 00 03 01 0a 00 04 01 01'}
    }
];


/**
 * Downlink command to set parameters for transitioning to winter/summer time.
 *
 * The corresponding uplink command: {@link SetCorrectTimeResponse}.
 *
 * @example
 * ```js
 * import SetCorrectTime from 'jooby-codec/mtx/commands/downlink/SetCorrectTime.js';
 *
 * const parameters = {
 *     monthTransitionSummer: 3,
 *     dateTransitionSummer: 0,
 *     hoursTransitionSummer: 3,
 *     hoursCorrectSummer: 1,
 *     monthTransitionWinter: 10,
 *     dateTransitionWinter: 0,
 *     hoursTransitionWinter: 4,
 *     hoursCorrectWinter: 1,
 *     isCorrectionNeeded: true
 * };
 * const command = new SetCorrectTime(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 1c 09 03 00 03 01 0a 00 04 01 01
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/SetCorrectTime.md#request)
 */
class SetCorrectTime extends Command {
    constructor ( public parameters: ITimeCorrectionParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;

    static readonly accessLevel = READ_WRITE;

    static readonly maxSize = COMMAND_SIZE;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new SetCorrectTime(buffer.getTimeCorrectionParameters());
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


export default SetCorrectTime;
