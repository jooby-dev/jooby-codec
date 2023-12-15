import Command, {TCommandExampleList, ICommandBinary} from '../../Command.js';
import {DOWNLINK} from '../../../constants/directions.js';


const COMMAND_ID = 0x14;

const examples: TCommandExampleList = [
    {
        name: 'simple request',
        hex: {header: '14 00', body: ''}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetStatus from 'jooby-codec/analog/commands/downlink/GetStatus.js';
 *
 * const command = new GetStatus();
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 14 00
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetStatus.md#request)
 */
class GetStatus extends Command {
    constructor () {
        super();
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = false;


    // data - only body (without header)
    static fromBytes () {
        return new GetStatus();
    }

    // returns full message - header with body
    // eslint-disable-next-line class-methods-use-this
    toBinary (): ICommandBinary {
        return Command.toBinary(COMMAND_ID);
    }
}


export default GetStatus;
