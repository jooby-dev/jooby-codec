import Command, {TCommandExampleList} from '../../Command.js';
import {DOWNLINK} from '../../constants/directions.js';


const COMMAND_ID = 0x021f;
const COMMAND_TITLE = 'GET_LMIC_VERSION';

const examples: TCommandExampleList = [
    {
        name: 'simple request',
        hex: {header: '1f 02 00', body: ''}
    }
];

/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetLmicVersion from 'jooby-codec/commands/downlink/GetLMICVersion';
 *
 * const command = new GetLmicVersion();
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 1f 02 00
 * ```
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/GetLmicVersion.md#request)
 */
class GetLmicVersion extends Command {
    static readonly id = COMMAND_ID;

    static readonly direction = DOWNLINK;

    static readonly title = COMMAND_TITLE;

    static readonly examples = examples;

    // data - only body (without header)
    static fromBytes () {
        return new GetLmicVersion();
    }

    // eslint-disable-next-line class-methods-use-this
    toBytes (): Uint8Array {
        return Command.toBytes(COMMAND_ID);
    }
}


export default GetLmicVersion;
