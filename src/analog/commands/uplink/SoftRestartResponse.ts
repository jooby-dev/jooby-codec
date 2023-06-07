import Command, {TCommandExampleList} from '../../Command.js';
import {UPLINK} from '../../constants/directions.js';


const COMMAND_ID = 0x19;

const examples: TCommandExampleList = [
    {
        name: 'simple response',
        hex: {header: '19 00', body: ''}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import SoftRestartResponse from 'jooby-codec/analog/commands/uplink/SoftRestartResponse.js';
 *
 * const commandBody = new Uint8Array([]);
 * const command = SoftRestartResponse.fromBytes(commandBody);
 *
 * // this command doesn't have any parameters
 * console.log(command.parameters);
 * // output:
 * undefined
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/SoftRestart.md#response)
 */
class SoftRestartResponse extends Command {
    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = false;


    // data - only body (without header)
    static fromBytes () {
        return new SoftRestartResponse();
    }

    // returns full message - header with body
    // eslint-disable-next-line class-methods-use-this
    toBytes (): Uint8Array {
        return Command.toBytes(COMMAND_ID);
    }
}


export default SoftRestartResponse;
