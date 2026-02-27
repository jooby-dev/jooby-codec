/**
 * Downlink command to get the meter archive data.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as readArchive from 'jooby-codec/obis-observer/commands/downlink/readArchive.js';
 *
 * const parameters = {
 *     requestId: 3,
 *     archiveType: 1,
 *     index: 4,
 * };
 *
 * const bytes = readArchive.toBytes(parameters);
 *
 * // output command binary in hex representation
 * console.log(bytes);
 * // output
 * [21, 6, 3, 1, 0, 0, 0, 4]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/ReadArchive.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import {ICommandParameters, REQUEST_ID_SIZE} from '../../utils/binary/buffer.js';
import {readArchive as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


export interface IReadArchiveParameters extends ICommandParameters {
    archiveType: number,
    index: number
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

const COMMAND_BODY_SIZE = REQUEST_ID_SIZE + 5;

export const examples: command.TCommandExamples = {
    'request to read all archive 1 starts with index 4': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 3,
            archiveType: 1,
            index: 4
        },
        bytes: [
            0x15, 0x06,
            0x03, 0x01, 0x00, 0x00, 0x00, 0x04
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IReadArchiveParameters => {
    if ( bytes.length !== COMMAND_BODY_SIZE ) {
        throw new Error(`Wrong buffer size: ${bytes.length}.`);
    }

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);
    const requestId = buffer.getUint8();
    const archiveType = buffer.getUint8();
    const index = buffer.getUint32();

    return {requestId, archiveType, index};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IReadArchiveParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(COMMAND_BODY_SIZE, false);

    buffer.setUint8(parameters.requestId);
    buffer.setUint8(parameters.archiveType);
    buffer.setUint32(parameters.index);

    return command.toBytes(id, buffer.data);
};
