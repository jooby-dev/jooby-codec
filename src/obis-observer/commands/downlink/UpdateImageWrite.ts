import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * IUpdateImageWriteParameters command parameters
 */
interface IUpdateImageWriteParameters extends ICommandParameters {
    offset: number,
    data: Uint8Array
}


const COMMAND_ID = 0x32;

// id + offset
const COMMAND_HEADER_SIZE = REQUEST_ID_SIZE + 4;

const examples: TCommandExampleList = [
    {
        name: 'write image data part',
        parameters: {
            requestId: 33,
            offset: 2112,
            data: new Uint8Array([
                0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
            ])
        },
        hex: {header: '32', body: '21 00 00 08 40 00 01 02 03 04 05 06 07 08 09 00 00 00 00 00 00'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import UpdateImageWrite from 'jooby-codec/obis-observer/commands/downlink/UpdateImageWrite.js';
 *
 * const parameters = {
 *     requestId: 33,
 *     offset: 2112,
 *     data: new Uint8Array([
 *         0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
 *     ])
 * };
 * const command = new UpdateImageWrite(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 32 15 21 00 00 08 40 00 01 02 03 04 05 06 07 08 09 00 00 00 00 00 00
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/UpdateImageWrite.md#request)
 */
class UpdateImageWrite extends Command {
    constructor ( public parameters: IUpdateImageWriteParameters ) {
        super();

        this.size = COMMAND_HEADER_SIZE + parameters.data.length;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);
        const requestId = buffer.getUint8();
        const offset = buffer.getUint32();
        const imageData = data.slice(COMMAND_HEADER_SIZE);

        return new UpdateImageWrite({requestId, offset, data: imageData});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const {requestId, offset, data} = this.parameters;
        const buffer = new CommandBinaryBuffer(COMMAND_HEADER_SIZE);
        const result = new Uint8Array(this.size);

        buffer.setUint8(requestId);
        buffer.setUint32(offset);

        // combine header and image data
        result.set(buffer.toUint8Array());
        result.set(data, COMMAND_HEADER_SIZE);

        return Command.toBytes(COMMAND_ID, result);
    }
}


export default UpdateImageWrite;
