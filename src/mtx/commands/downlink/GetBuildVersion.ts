import Command, {TCommandExampleList} from '../../Command.js';
import {DOWNLINK} from '../../../constants/directions.js';
import {READ_ONLY} from '../../constants/accessLevels.js';


const COMMAND_ID = 0x70;
const COMMAND_SIZE = 0;

const examples: TCommandExampleList = [
    {
        name: 'simple request',
        hex: {header: '70 00', body: ''}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetBuildVersion from 'jooby-codec/mtx/commands/downlink/GetBuildVersion.js';
 *
 * const command = new GetBuildVersion();
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 70 00
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetBuildVersion.md#request)
 */
class GetBuildVersion extends Command {
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
        return new GetBuildVersion();
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return new Uint8Array([COMMAND_ID, this.size]);
    }
}


export default GetBuildVersion;
