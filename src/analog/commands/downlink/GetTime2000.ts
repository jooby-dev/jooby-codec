import Command, {TCommandExampleList, ICommandBinary} from '../../Command.js';
import {DOWNLINK} from '../../../constants/directions.js';


const COMMAND_ID = 0x09;

const examples: TCommandExampleList = [
    {
        name: 'simple request',
        hex: {header: '09 00', body: ''}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetTime2000 from 'jooby-codec/analog/commands/downlink/GetTime2000.js';
 *
 * const command = new GetTime2000();
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 09 00
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetTime2000.md#request)
 */
class GetTime2000 extends Command {
    constructor () {
        super();
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = false;


    // data - only body (without header)
    static fromBytes () {
        return new GetTime2000();
    }

    // eslint-disable-next-line class-methods-use-this
    toBinary (): ICommandBinary {
        return Command.toBinary(COMMAND_ID);
    }
}


export default GetTime2000;
