import Command, {TCommandExampleList} from '../../Command.js';
import {DOWNLINK} from '../../../constants/directions.js';
import {READ_ONLY} from '../../constants/accessLevels.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import GetCorrectTimeResponse from '../uplink/GetCorrectTimeResponse.js';


const COMMAND_ID = 0x3e;
const COMMAND_SIZE = 0;

const examples: TCommandExampleList = [
    {
        name: 'simple request',
        hex: {header: '3e 00', body: ''}
    }
];


/**
 * Downlink command to get [DST](https://en.wikipedia.org/wiki/Daylight_saving_time)/Standard time transition options.
 *
 * The corresponding uplink command: {@link GetCorrectTimeResponse}.
 *
 * @example
 * ```js
 * import GetCorrectTime from 'jooby-codec/mtx/commands/downlink/GetCorrectTime.js';
 *
 * const command = new GetCorrectTime();
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 3e 00
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetCorrectTime.md#request)
 */
class GetCorrectTime extends Command {
    constructor () {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = false;

    static readonly accessLevel = READ_ONLY;

    static readonly maxSize = COMMAND_SIZE;


    // data - only body (without header)
    static fromBytes () {
        return new GetCorrectTime();
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return new Uint8Array([COMMAND_ID, this.size]);
    }
}


export default GetCorrectTime;
