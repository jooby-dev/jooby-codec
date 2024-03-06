import Command, {TCommandExampleList} from '../../Command.js';
import {UPLINK} from '../../../constants/directions.js';
import {READ_ONLY} from '../../constants/accessLevels.js';


const COMMAND_ID = 0x08;
const COMMAND_SIZE = 0;

const examples: TCommandExampleList = [
    {
        name: 'simple response',
        hex: {header: '08 00', body: ''}
    }
];


/**
 * Uplink command to set full date and time on the meter.
 *
 * The corresponding downlink command: `SetDateTime`.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import SetDateTimeResponse from 'jooby-codec/mtx/commands/uplink/SetDateTimeResponse.js';
 *
 * const command = SetDateTimeResponse.fromBytes();
 *
 * console.log(command.parameters);
 * // output:
 * undefined
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/SetDateTime.md#response)
 */
class SetDateTimeResponse extends Command {
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
    static fromBytes (): SetDateTimeResponse {
        return new SetDateTimeResponse();
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return new Uint8Array([COMMAND_ID, this.size]);
    }
}


export default SetDateTimeResponse;
