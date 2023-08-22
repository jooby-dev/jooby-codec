import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


const COMMAND_ID = 0x30;
const COMMAND_SIZE = REQUEST_ID_SIZE;

const examples: TCommandExampleList = [
    {
        name: 'simple request',
        parameters: {
            requestId: 33
        },
        hex: {header: '30', body: '21'}
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
 * // 30 01 21
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
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new UpdateImageVerify({requestId: buffer.getUint8()});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const buffer = new CommandBinaryBuffer(this.size);

        buffer.setUint8(this.parameters.requestId);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default UpdateImageVerify;
