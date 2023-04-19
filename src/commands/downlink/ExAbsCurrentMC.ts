import Command from '../../Command.js';
import {DOWNLINK} from '../../constants/directions.js';


// TODO: rework extended headers detection
const COMMAND_ID = 0x0f1f;


/**
 * Downlink command
 *
 * @example
 * ```js
 * import ExAbsCurrentMC from 'jooby-codec/commands/downlink/ExAbsCurrentMC';
 *
 * const command = new ExAbsCurrentMC();
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 1f 0f 00
 * ```
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/ExAbsCurrentMC.md#request)
 */
class ExAbsCurrentMC extends Command {
    constructor () {
        super();
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly hasParameters = false;


    // data - only body (without header)
    static fromBytes () {
        return new ExAbsCurrentMC();
    }

    // returns full message - header with body
    // eslint-disable-next-line class-methods-use-this
    toBytes (): Uint8Array {
        return Command.toBytes(COMMAND_ID);
    }
}


export default ExAbsCurrentMC;
