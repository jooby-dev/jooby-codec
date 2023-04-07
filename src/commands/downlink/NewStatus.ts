import Command from '../../Command.js';


const COMMAND_ID = 0x14;
const COMMAND_TITLE = 'NEW_STATUS';


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import NewStatus from 'jooby-codec/commands/downlink/NewStatus';
 *
 * const command = new NewStatus();
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 14 00
 * ```
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/NewStatus.md#request)
 */
class NewStatus extends Command {
    constructor () {
        super();
    }

    static readonly id = COMMAND_ID;

    static readonly isUplink = false;

    static readonly title = COMMAND_TITLE;

    // data - only body (without header)
    static fromBytes () {
        return new NewStatus();
    }

    // eslint-disable-next-line class-methods-use-this
    toBytes (): Uint8Array {
        return Command.toBytes(COMMAND_ID);
    }
}


export default NewStatus;
