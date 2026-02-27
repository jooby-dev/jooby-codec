/**
 * Uplink command to get the OBIS code content from the specific metering device.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getObisContentById from 'jooby-codec/obis-observer/commands/uplink/getObisContentById.js';
 *
 * // response to getObisContentById
 * const bytes = [0x79, 0x43, 0xac, 0x1d, 0x71];
 *
 * // decoded payload
 * const parameters = getObisContentById.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     requestId: 121,
 *     content: 344.23
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetObisContentById.md#response-with-float-content)
 */

import * as types from '../../../types.js';
import roundNumber from '../../../utils/roundNumber.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import {ICommandParameters, REQUEST_ID_SIZE} from '../../utils/binary/buffer.js';
import * as command from '../../utils/command.js';
import {getObisContentById as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


/**
 * IGetObisContentByIdResponseParameters command parameters
 */
interface IGetObisContentByIdResponseParameters extends ICommandParameters {
    /** obis code content from the metering device */
    content?: types.TFloat32
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'response to getObisContentById': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 121,
            content: 344.23
        },
        bytes: [
            0x51, 0x05,
            0x79, 0x43, 0xac, 0x1d, 0x71
        ]
    },
    'response to GetObisContentById without content': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 122
        },
        bytes: [
            0x51, 0x01,
            0x7a
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetObisContentByIdResponseParameters => {
    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);
    const requestId = buffer.getUint8();

    return buffer.isEmpty
        ? {requestId}
        : {requestId, content: roundNumber(buffer.getFloat32())};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetObisContentByIdResponseParameters ): types.TBytes => {
    // request id byte + obis float32 content 4 bytes
    const size = REQUEST_ID_SIZE + (parameters.content ? 4 : 0);
    const buffer: IBinaryBuffer = new BinaryBuffer(size, false);
    const {requestId, content} = parameters;

    buffer.setUint8(requestId);

    if ( content ) {
        buffer.setFloat32(roundNumber(content));
    }

    return command.toBytes(id, buffer.data);
};
