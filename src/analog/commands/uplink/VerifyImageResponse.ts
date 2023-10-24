import Command, {TCommandExampleList} from '../../Command.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * VerifyImage command parameters
 */
interface IVerifyImageParameters {
    status: number
}


// TODO: rework extended headers detection
const COMMAND_ID = 0x2b1f;

const examples: TCommandExampleList = [
    {
        name: 'Verify image response',
        parameters: {status: 1},
        hex: {header: '1f 2b 01', body: '01'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import VerifyImageResponse from 'jooby-codec/analog/commands/uplink/VerifyImageResponse.js';
 *
 * const commandBody = new Uint8Array([
 *     0x1f, 0x2b, 0x01, 0x01
 * ]);
 * const command = UpdateRunResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     status: 1
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/VerifyImageResponse.md#response)
 */
class VerifyImageResponse extends Command {
    constructor ( public parameters: IVerifyImageParameters ) {
        super();
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( [status]: Uint8Array ) {
        return new VerifyImageResponse({status});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {parameters} = this;

        return Command.toBytes(
            COMMAND_ID,
            new Uint8Array([parameters.status])
        );
    }
}


export default VerifyImageResponse;
