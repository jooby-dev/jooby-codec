import Command, {TCommandExampleList} from '../../Command.js';
import {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


const COMMAND_ID = 0x34;
const COMMAND_SIZE = REQUEST_ID_SIZE;

const examples: TCommandExampleList = [
    {
        name: 'simple request',
        parameters: {
            requestId: 33
        },
        hex: {header: '34 01', body: '21'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import UpdateRun from 'jooby-codec/obis-observer/commands/downlink/UpdateRun.js';
 *
 * const parameters = {
 *     requestId: 33
 * };
 * const command = new UpdateRun(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 34 01 21
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/UpdateRun.md#request)
 */
class UpdateRun extends Command {
    constructor ( public parameters: ICommandParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( [requestId]: Uint8Array ) {
        return new UpdateRun({requestId});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return Command.toBytes(
            COMMAND_ID,
            new Uint8Array([this.parameters.requestId])
        );
    }
}


export default UpdateRun;
