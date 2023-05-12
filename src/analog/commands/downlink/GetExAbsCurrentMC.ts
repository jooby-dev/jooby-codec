import Command, {TCommandExampleList} from '../../Command.js';
import {DOWNLINK} from '../../constants/directions.js';


// TODO: rework extended headers detection
const COMMAND_ID = 0x0f1f;

const examples: TCommandExampleList = [
    {
        name: 'simple request',
        hex: {header: '1f 0f 00', body: ''}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetExAbsCurrentMC from 'jooby-codec/analog/commands/downlink/GetExAbsCurrentMC.js';
 *
 * const command = new GetExAbsCurrentMC();
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 1f 0f 00
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/GetExAbsCurrentMC.md#request)
 */
class GetExAbsCurrentMC extends Command {
    constructor () {
        super();
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = false;


    // data - only body (without header)
    static fromBytes () {
        return new GetExAbsCurrentMC();
    }

    // returns full message - header with body
    // eslint-disable-next-line class-methods-use-this
    toBytes (): Uint8Array {
        return Command.toBytes(COMMAND_ID);
    }
}


export default GetExAbsCurrentMC;
