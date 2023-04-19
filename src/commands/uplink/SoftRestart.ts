import Command from '../../Command.js';
import {UPLINK} from '../../constants/directions.js';


const COMMAND_ID = 0x19;
const COMMAND_TITLE = 'SOFT_RESTART';


/**
 * Uplink command.
 *
 * @example
 * ```js
 * import SoftRestart from 'jooby-codec/commands/uplink/SoftRestart';
 *
 * const command = new SoftRestart();
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 19 00
 * ```
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/SoftRestart.md#response)
 */
class SoftRestart extends Command {
    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly title = COMMAND_TITLE;

    // data - only body (without header)
    static fromBytes () {
        return new SoftRestart();
    }

    // eslint-disable-next-line class-methods-use-this
    toBytes (): Uint8Array {
        return Command.toBytes(COMMAND_ID);
    }
}


export default SoftRestart;
