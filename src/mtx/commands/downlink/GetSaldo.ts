import Command, {TCommandExampleList} from '../../Command.js';
import {DOWNLINK} from '../../../constants/directions.js';
import {READ_ONLY} from '../../constants/accessLevels.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import GetSaldoResponse from '../uplink/GetSaldoResponse.js';


const COMMAND_ID = 0x29;
const COMMAND_SIZE = 0;

const examples: TCommandExampleList = [
    {
        name: 'simple request',
        hex: {header: '29 00', body: ''}
    }
];


/**
 * Downlink command to get device current saldo information.
 *
 * The corresponding uplink command: {@link GetSaldoResponse}.
 *
 * @example
 * ```js
 * import GetSaldo from 'jooby-codec/mtx/commands/downlink/GetSaldo.js';
 *
 * const command = new GetSaldo();
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 29 00
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetSaldo.md#request)
 */
class GetSaldo extends Command {
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
        return new GetSaldo();
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return new Uint8Array([COMMAND_ID, this.size]);
    }
}


export default GetSaldo;
