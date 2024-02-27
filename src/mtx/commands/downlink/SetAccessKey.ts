import Command, {TCommandExampleList, COMMAND_HEADER_SIZE} from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../../constants/directions.js';
import * as accessLevels from '../../constants/accessLevels.js';
import {TUint8} from '../../../types.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import SetAccessKeyResponse from '../uplink/SetAccessKeyResponse.js';


interface ISetAccessKeyParameters {
    /**
     * Access level from the list of {@link accessLevels | available levels}.
     */
    accessLevel: TUint8,

    /**
     * Access key binary data.
     *
     * @example
     * // default key
     * new Uint8Array([...Array(16).keys()])
     */
    key: Uint8Array
}


const COMMAND_ID = 0x09;
const KEY_SIZE = 16;
const COMMAND_SIZE = 1 + KEY_SIZE;

const examples: TCommandExampleList = [
    {
        name: 'set key for READ_ONLY access level',
        parameters: {
            accessLevel: accessLevels.READ_ONLY,
            key: new Uint8Array([
                0, 1, 2, 3, 4, 5, 6, 7,
                7, 6, 5, 4, 3, 2, 1, 0
            ])
        },
        hex: {header: '09 11', body: '03 00 01 02 03 04 05 06 07 07 06 05 04 03 02 01 00'}
    }
];


/**
 * Downlink command to set access key.
 *
 * The corresponding uplink command: {@link SetAccessKeyResponse}.
 *
 * @example
 * ```js
 * import SetAccessKey from 'jooby-codec/mtx/commands/downlink/SetAccessKey.js';
 *
 * const parameters = {
 *      accessLevel: 3,
 *      key: new Uint8Array([
 *          0, 1, 2, 3, 4, 5, 6, 7,
 *          7, 6, 5, 4, 3, 2, 1, 0
 *      ])
 * };
 * const command = new SetAccessKey(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 09 11 03 00 01 02 03 04 05 06 07 07 06 05 04 03 02 01 00
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/SetAccessKey.md#request)
 */
class SetAccessKey extends Command {
    constructor ( public parameters: ISetAccessKeyParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;

    static readonly accessLevel = accessLevels.READ_WRITE;

    static readonly maxSize = COMMAND_SIZE;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new SetAccessKey({
            accessLevel: buffer.getUint8(),
            key: buffer.getBytes(KEY_SIZE)
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {size, parameters} = this;
        const buffer = new CommandBinaryBuffer(COMMAND_HEADER_SIZE + size);

        // header + size
        buffer.setUint8(COMMAND_ID);
        buffer.setUint8(size);

        // body
        buffer.setUint8(parameters.accessLevel);
        buffer.setBytes(parameters.key);

        return buffer.toUint8Array();
    }
}


export default SetAccessKey;
