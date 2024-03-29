import Command, {TCommandExampleList} from '../../Command.js';
import {DOWNLINK} from '../../../constants/directions.js';
import {READ_ONLY} from '../../constants/accessLevels.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import GetVersionResponse from '../uplink/GetVersionResponse.js';


const COMMAND_ID = 0x28;
const COMMAND_SIZE = 0;

const examples: TCommandExampleList = [
    {
        name: 'simple request',
        hex: {header: '28 00', body: ''}
    }
];


/**
 * Downlink command to get device version information.
 *
 * The corresponding uplink command: {@link GetVersionResponse}.
 *
 * @example
 * ```js
 * import GetVersion from 'jooby-codec/mtx/commands/downlink/GetVersion.js';
 *
 * const command = new GetVersion();
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 28 00
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetVersion.md#request)
 */
class GetVersion extends Command {
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
        return new GetVersion();
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return new Uint8Array([COMMAND_ID, this.size]);
    }
}


export default GetVersion;
