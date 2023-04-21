import Command, {TCommandExampleList} from '../../Command.js';
import {DOWNLINK} from '../../constants/directions.js';


const COMMAND_ID = 0x021f;

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
 * import GetLmicInfo from 'jooby-codec/commands/downlink/GetLmicInfo';
 *
 * const command = new GetLmicInfo();
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 1f 02 00
 * ```
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/GetLmicInfo.md#request)
 */
class GetLmicInfo extends Command {
    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = false;


    // data - only body (without header)
    static fromBytes () {
        return new GetLmicInfo();
    }

    // returns full message - header with body
    // eslint-disable-next-line class-methods-use-this
    toBytes (): Uint8Array {
        return Command.toBytes(COMMAND_ID);
    }
}


export default GetLmicInfo;
