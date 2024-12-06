/**
 * Downlink command to write the block of the new image to the device. This command is part of update procedure.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as updateImageWrite from 'jooby-codec/obis-observer/commands/downlink/updateImageWrite.js';
 *
 * const parameters = {
 *     requestId: 33,
 *     offset: 2112,
 *     data: [
 *         0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
 *     ]
 * };
 * const bytes = updateImageWrite.toBytes(parameters);
 *
 * // output command binary in hex representation
 * console.log(bytes);
 * // output
 * [48, 21, 33, 0, 0, 8, 64, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0, 0, 0, 0, 0]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/UpdateImageWrite.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../../types.js';
import CommandBinaryBuffer, {
    ICommandBinaryBuffer, ICommandParameters, REQUEST_ID_SIZE
} from '../../utils/CommandBinaryBuffer.js';
import {updateImageWrite as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


interface IUpdateImageWriteParameters extends ICommandParameters {
    offset: types.TUint32,
    data: types.TBytes
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

const COMMAND_BODY_WITHOUT_DATA_SIZE = REQUEST_ID_SIZE + 4;

export const examples: command.TCommandExamples = {
    'write image data part': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 33,
            offset: 2112,
            data: [
                0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
            ]
        },
        bytes: [
            0x30, 0x15,
            0x21, 0x00, 0x00, 0x08, 0x40, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( bytes: types.TBytes ): IUpdateImageWriteParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);
    const requestId = buffer.getUint8();
    const offset = buffer.getUint32();
    const data = bytes.slice(COMMAND_BODY_WITHOUT_DATA_SIZE);

    return {requestId, offset, data};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IUpdateImageWriteParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(COMMAND_BODY_WITHOUT_DATA_SIZE);
    const {requestId, offset, data} = parameters;

    buffer.setUint8(requestId);
    buffer.setUint32(offset);

    return command.toBytes(id, [...buffer.data, ...data]);
};
