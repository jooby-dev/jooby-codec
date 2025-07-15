/**
 * Downlink command to set access key.
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as setAccessKey from 'jooby-codec/mtx1/commands/downlink/setAccessKey.js';
 *
 * const parameters = {
 *     accessLevel: 3,
 *     key: [
 *         0, 1, 2, 3, 4, 5, 6, 7,
 *         7, 6, 5, 4, 3, 2, 1, 0
 *     ]
 * };
 *
 * const bytes = setAccessKey.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [9, 17, 3, 0, 1, 2, 3, 4, 5, 6, 7, 7, 6, 5, 4, 3, 2, 1, 0]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/SetAccessKey.md#request)
 */

import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import * as command from '../../utils/command.js';
import {READ_ONLY, READ_WRITE} from '../../constants/accessLevels.js';
import {setAccessKey as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


interface ISetAccessKeyParameters {
    /**
     * Access level from the list of {@link accessLevels | available levels}.
     */
    accessLevel: types.TUint8,

    /**
     * Access key binary data.
     *
     * @example
     * // default key
     * [...Array(16).keys()]
     */
    key: types.TBytes
}


const KEY_SIZE = 16;


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 1 + KEY_SIZE;
export const accessLevel: types.TAccessLevel = READ_WRITE;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'set key for READ_ONLY access level': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            accessLevel: READ_ONLY,
            key: [
                0, 1, 2, 3, 4, 5, 6, 7,
                7, 6, 5, 4, 3, 2, 1, 0
            ]
        },
        bytes: [
            0x09, 0x11,
            0x03, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x07, 0x06, 0x05, 0x04, 0x03, 0x02, 0x01, 0x00
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): ISetAccessKeyParameters => {
    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return {
        accessLevel: buffer.getUint8(),
        key: buffer.getBytes(KEY_SIZE)
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: ISetAccessKeyParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    // body
    buffer.setUint8(parameters.accessLevel);
    buffer.setBytes(parameters.key);

    return command.toBytes(id, buffer.data);
};
