/**
 * Downlink command.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getArchiveState from 'jooby-codec/obis-observer/commands/downlink/getArchiveState.js';
 *
 * const parameters = {
 *     requestId: 5,
 *     archiveType: 1,
 *     meterId: 3
 * };
 *
 * const bytes = getArchiveState.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * // [15, 6, 5, 1, 0, 0, 0, 3]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetArchiveState.md#request)
 */

import * as types from '../../../types.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, ICommandParameters, METER_ID_SIZE, REQUEST_ID_SIZE} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';


/**
 * IGetArchiveStateParameters command parameters
 */
interface IGetArchiveStateParameters extends ICommandParameters {
    meterId?: types.TUint32,
    archiveType: types.TUint8
}


export const id: types.TCommandId = 0x0f;
export const name: types.TCommandName = 'getArchiveState';
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'get archive state': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 5,
            archiveType: 1
        },
        bytes: [
            0x0f, 0x02,
            0x05, 0x01
        ]
    },
    'get archive state for meter 3': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 5,
            archiveType: 1,
            meterId: 3
        },
        bytes: [
            0x0f, 0x06,
            0x05, 0x01, 0x00, 0x00, 0x00, 0x03
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetArchiveStateParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    const requestId = buffer.getUint8();
    const archiveType = buffer.getUint8();

    return buffer.isEmpty
        ? {requestId, archiveType}
        : {requestId, archiveType, meterId: buffer.getUint32()};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetArchiveStateParameters ): types.TBytes => {
    const {requestId, archiveType, meterId} = parameters;
    const size = REQUEST_ID_SIZE + 1 + (parameters.meterId ? METER_ID_SIZE : 0);
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(size);

    buffer.setUint8(requestId);
    buffer.setUint8(archiveType);

    if ( meterId ) {
        buffer.setUint32(meterId);
    }

    return command.toBytes(id, buffer.data);
};
