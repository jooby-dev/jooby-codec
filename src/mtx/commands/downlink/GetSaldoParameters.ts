import Command, {TCommandExampleList} from '../../Command.js';
import {DOWNLINK} from '../../../constants/directions.js';
import {READ_ONLY} from '../../constants/accessLevels.js';


const COMMAND_ID = 0x2e;
const COMMAND_SIZE = 0;

const examples: TCommandExampleList = [
    {
        name: 'simple request',
        hex: {header: '2e 00', body: ''}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetSaldoParameters from 'jooby-codec/mtx/commands/downlink/GetSaldoParameters.js';
 *
 * const command = new GetSaldoParameters();
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 2e 00
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetSaldoParameters.md#request)
 */
class GetSaldoParameters extends Command {
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
        return new GetSaldoParameters();
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return new Uint8Array([COMMAND_ID, this.size]);
    }
}


export default GetSaldoParameters;
