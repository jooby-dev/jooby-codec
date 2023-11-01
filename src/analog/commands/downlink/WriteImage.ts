import Command, {TCommandExampleList} from '../../Command.js';
import {DOWNLINK} from '../../../constants/directions.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import mergeUint8Arrays from '../../../utils/mergeUint8Arrays.js';


/**
 * WriteImage command parameters
 */
interface IWriteImageParameters {
    offset: number,
    data: Uint8Array
}


const COMMAND_ID = 0x2a1f;
const COMMAND_MIN_SIZE = 4;


const examples: TCommandExampleList = [
    {
        name: 'write image',
        parameters: {
            offset: 64,
            data: new Uint8Array([
                0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f
            ])
        },
        hex: {header: '1f 2a 14', body: '00 00 00 40 00 01 02 03 04 05 06 07 08 09 0a 0b 0c 0d 0e 0f'}
    }
];

/**
 * Downlink command.
 *
 * @example
 * ```js
 * import WriteImage from 'jooby-codec/analog/commands/downlink/WriteImage.js';
 * const parameters = {
 *     offset: 64,
 *     data: new Uint8Array([
 *         0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f
 *     ])
 * };
 * const command = new WriteImage();
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 1f 2a 14 00 00 00 40 01 02 03 04 05 06 07 08 09 0a 0b 0c 0d 0e 0f
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/WriteImage.md#request)
 */
class WriteImage extends Command {
    constructor (public parameters: IWriteImageParameters) {
        super();
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = false;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        if ( data.byteLength < COMMAND_MIN_SIZE ) {
            throw new Error(`Wrong buffer size: ${data.byteLength}.`);
        }

        const buffer = new CommandBinaryBuffer(data);
        const offset = buffer.getUint32(false);
        const imageData = data.slice(COMMAND_MIN_SIZE);

        return new WriteImage({offset, data: imageData});
    }

    // returns full message - header with body
    // eslint-disable-next-line class-methods-use-this
    toBytes (): Uint8Array {
        const {offset, data} = this.parameters;
        const buffer = new CommandBinaryBuffer(COMMAND_MIN_SIZE);

        buffer.setUint32(offset, false);

        return Command.toBytes(
            COMMAND_ID,
            // combine header and image data
            mergeUint8Arrays(buffer.toUint8Array(), data)
        );
    }
}


export default WriteImage;
