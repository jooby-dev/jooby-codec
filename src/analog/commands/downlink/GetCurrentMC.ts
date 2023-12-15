import Command, {TCommandExampleList, ICommandBinary} from '../../Command.js';
import {DOWNLINK} from '../../../constants/directions.js';


const COMMAND_ID = 0x18;

const examples: TCommandExampleList = [
    {
        name: 'simple request',
        hex: {header: '18 00', body: ''}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetCurrentMC from 'jooby-codec/analog/commands/downlink/GetCurrentMC.js';
 *
 * const command = new GetCurrentMC();
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 18 00
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetCurrentMC.md#request)
 */
class GetCurrentMC extends Command {
    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = false;


    // data - only body (without header)
    static fromBytes () {
        return new GetCurrentMC();
    }

    // eslint-disable-next-line class-methods-use-this
    toBinary (): ICommandBinary {
        return Command.toBinary(COMMAND_ID);
    }
}


export default GetCurrentMC;
