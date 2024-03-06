import Command, {TCommandExampleList} from '../../Command.js';
import {UPLINK} from '../../../constants/directions.js';
import {READ_ONLY} from '../../constants/accessLevels.js';


const COMMAND_ID = 0x5c;
const COMMAND_SIZE = 0;

const examples: TCommandExampleList = [
    {
        name: 'simple response',
        hex: {header: '5c 00', body: ''}
    }
];


/**
 * Uplink command for incremental time correction.
 *
 * The corresponding downlink command: `SetCorrectDateTime`.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import SetCorrectDateTimeResponse from 'jooby-codec/mtx/commands/uplink/SetCorrectDateTimeResponse.js';
 *
 * const command = SetCorrectDateTimeResponse.fromBytes();
 *
 * console.log(command.parameters);
 * // output:
 * undefined
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/SetCorrectDateTime.md#response)
 */
class SetCorrectDateTimeResponse extends Command {
    constructor () {
        super();

        this.size = COMMAND_SIZE;
    }


    static id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = false;

    static readonly accessLevel = READ_ONLY;

    static readonly maxSize = COMMAND_SIZE;


    // data - only body (without header)
    static fromBytes (): SetCorrectDateTimeResponse {
        return new SetCorrectDateTimeResponse();
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return new Uint8Array([COMMAND_ID, this.size]);
    }
}


export default SetCorrectDateTimeResponse;
