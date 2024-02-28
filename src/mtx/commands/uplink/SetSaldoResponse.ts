import Command, {TCommandExampleList} from '../../Command.js';
import {UPLINK} from '../../../constants/directions.js';
import {READ_WRITE} from '../../constants/accessLevels.js';


const COMMAND_ID = 0x2a;
const COMMAND_SIZE = 0;

const examples: TCommandExampleList = [
    {
        name: 'simple response',
        hex: {header: '2a 00', body: ''}
    }
];


/**
 * Uplink command to set device current saldo information.
 *
 * The corresponding downlink command: `SetSaldo`.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import SetSaldoResponse from 'jooby-codec/mtx/commands/uplink/SetSaldoResponse.js';
 *
 * const command = SetSaldoResponse.fromBytes();
 *
 * console.log(command.parameters);
 * // output:
 * undefined
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/SetSaldo.md#response)
 */
class SetSaldoResponse extends Command {
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
    static fromBytes (): SetSaldoResponse {
        return new SetSaldoResponse();
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return new Uint8Array([COMMAND_ID, this.size]);
    }
}


export default SetSaldoResponse;
