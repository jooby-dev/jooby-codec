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
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import UpdateRunResponse from 'jooby-codec/analog/commands/uplink/UpdateRunResponse.js';
 *
 * const commandBody = new Uint8Array([
 *     0x1f, 0x2c, 0x00
 * ]);
 * const command = UpdateRunResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * undefined
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/UpdateRunResponse.md#response)
 */
class UpdateRunResponse extends Command {
    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = false;


    // data - only body (without header)
    static fromBytes () {
        return new UpdateRunResponse();
    }

    // eslint-disable-next-line class-methods-use-this
    toBinary (): ICommandBinary {
        return Command.toBinary(COMMAND_ID);
    }
}


export default UpdateRunResponse;
