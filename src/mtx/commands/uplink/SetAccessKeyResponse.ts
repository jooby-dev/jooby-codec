import Command, {TCommandExampleList} from '../../Command.js';
import {UPLINK} from '../../../constants/directions.js';
import {READ_WRITE} from '../../constants/accessLevels.js';


const COMMAND_ID = 0x09;
const COMMAND_SIZE = 0;

const examples: TCommandExampleList = [
    {
        name: 'simple response',
        hex: {header: '09 00', body: ''}
    }
];


/**
 * Uplink command to set access key.
 *
 * The corresponding downlink command: `SetAccessKey`.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import SetAccessKeyResponse from 'jooby-codec/mtx/commands/uplink/SetAccessKeyResponse.js';
 *
 * const command = SetAccessKeyResponse.fromBytes();
 *
 * console.log(command.parameters);
 * // output:
 * undefined
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/SetAccessKey.md#response)
 */
class SetAccessKeyResponse extends Command {
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
    static fromBytes (): SetAccessKeyResponse {
        return new SetAccessKeyResponse();
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return new Uint8Array([COMMAND_ID, this.size]);
    }
}


export default SetAccessKeyResponse;
