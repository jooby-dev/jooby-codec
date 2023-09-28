import Command, {TCommandExampleList} from '../../Command.js';
import {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


const COMMAND_ID = 0x32;
const COMMAND_SIZE = REQUEST_ID_SIZE;

const examples: TCommandExampleList = [
    {
        name: 'simple request',
        parameters: {
            requestId: 33
        },
        hex: {header: '32 01', body: '21'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import UpdateImageVerify from 'jooby-codec/obis-observer/commands/downlink/UpdateImageVerify.js';
 *
 * const parameters = {
 *     requestId: 33
 * };
 * const command = new UpdateImageVerify(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 32 01 21
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/UpdateImageVerify.md#request)
 */
class UpdateImageVerify extends Command {
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
        return new UpdateImageVerify({requestId});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return Command.toBytes(
            COMMAND_ID,
            new Uint8Array([this.parameters.requestId])
        );
    }
}


export default UpdateImageVerify;
