/**
 * Downlink command to get the meter archive data.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as readMeterArchive from 'jooby-codec/obis-observer/commands/downlink/readMeterArchive.js';
 *
 * const parameters = {
 *     requestId: 3,
 *     archiveType: 1,
 *     index: 4,
 *     meterId: 2
 * };
 *
 * const bytes = readMeterArchive.toBytes(parameters);
 *
 * // output command binary in hex representation
 * console.log(bytes);
 * // output
 * [17, 10, 3, 1, 0, 0, 0, 4, 0, 0, 0, 2]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/ReadMeterArchive.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import {
    ICommandParameters, REQUEST_ID_SIZE, METER_ID_SIZE
} from '../../utils/binary/buffer.js';
import {readMeterArchive as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


export interface IReadMeterArchiveParameters extends ICommandParameters {
    archiveType: types.TUint8,
    index: types.TUint32,
    meterId: types.TUint32
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

const COMMAND_BODY_SIZE = REQUEST_ID_SIZE + METER_ID_SIZE + 5;

export const examples: command.TCommandExamples = {
    'request to read all archive 1 for the meter 2 starts with index 4': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 3,
            archiveType: 1,
            index: 4,
            meterId: 2
        },
        bytes: [
            0x11, 0x0a,
            0x03, 0x01, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x02
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IReadMeterArchiveParameters => {
    if ( bytes.length !== COMMAND_BODY_SIZE ) {
        throw new Error(`Wrong buffer size: ${bytes.length}.`);
    }

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);
    const requestId = buffer.getUint8();
    const archiveType = buffer.getUint8();
    const index = buffer.getUint32();
    const meterId = buffer.getUint32();

    return {
        requestId,
        archiveType,
        index,
        meterId
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IReadMeterArchiveParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(COMMAND_BODY_SIZE, false);

    buffer.setUint8(parameters.requestId);
    buffer.setUint8(parameters.archiveType);
    buffer.setUint32(parameters.index);
    buffer.setUint32(parameters.meterId);

    return command.toBytes(id, buffer.data);
};
