import Command, {TCommandExampleList} from '../../Command.js';
import {UPLINK} from '../../../constants/directions.js';
import {READ_WRITE} from '../../constants/accessLevels.js';


const COMMAND_ID = 0x1c;
const COMMAND_SIZE = 0;

const examples: TCommandExampleList = [
    {
        name: 'simple response',
        hex: {header: '1c 00', body: ''}
    }
];


/**
 * Uplink command to set [DST](https://en.wikipedia.org/wiki/Daylight_saving_time)/Standard time transition options.
 *
 * The corresponding downlink command: `SetCorrectTime`.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import SetCorrectTimeResponse from 'jooby-codec/mtx/commands/uplink/SetCorrectTimeResponse.js';
 *
 * const command = SetCorrectTimeResponse.fromBytes();
 *
 * console.log(command.parameters);
 * // output:
 * undefined
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/SetCorrectTime.md#response)
 */
class SetCorrectTimeResponse extends Command {
    constructor () {
        super();

        this.size = COMMAND_SIZE;
    }


    static id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = false;

    static readonly accessLevel = READ_WRITE;

    static readonly maxSize = COMMAND_SIZE;


    // data - only body (without header)
    static fromBytes (): SetCorrectTimeResponse {
        return new SetCorrectTimeResponse();
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return new Uint8Array([COMMAND_ID, this.size]);
    }
}


export default SetCorrectTimeResponse;
