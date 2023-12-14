import Command, {TCommandExampleList, ICommandBinary} from '../../Command.js';
import {DOWNLINK} from '../../../constants/directions.js';


const COMMAND_ID = 0x2c1f;

const examples: TCommandExampleList = [
    {
        name: 'simple request',
        hex: {header: '1f 2c 00', body: ''}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import UpdateRun from 'jooby-codec/analog/commands/downlink/UpdateRun.js';
 *
 * const command = new UpdateRun();
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 1f 2c 00
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/UpdateRun.md#request)
 */
class UpdateRun extends Command {
    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = false;


    // data - only body (without header)
    static fromBytes () {
        return new UpdateRun();
    }

    // eslint-disable-next-line class-methods-use-this
    toBinary (): ICommandBinary {
        return Command.toBinary(COMMAND_ID);
    }
}


export default UpdateRun;
