/**
 * Downlink command to get the information about memory settings.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getSettingsMemory from 'jooby-codec/obis-observer/commands/downlink/getSettingsMemory.js';
 *
 * const parameters = {
 *     requestId: 8,
 *     offset: 16,
 *     size: 4
 * };
 *
 * const bytes = getSettingsMemory.toBytes(parameters);
 *
 * // output command binary in hex representation
 * console.log(bytes);
 * // output
 * [144, 9, 5, 0, 0, 0, 16, 0, 0, 0, 4]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetSettingsMemory.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {ICommandParameters, REQUEST_ID_SIZE} from '../../utils/CommandBinaryBuffer.js';
import {getSettingsMemory as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


interface IGetSettingsMemoryParameters extends ICommandParameters {
    offset: number,
    size?: number
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'get settings memory block': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 5,
            offset: 16,
            size: 4
        },
        bytes: [
            0x90, 0x09,
            0x05, 0x00, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00, 0x04
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetSettingsMemoryParameters => {
    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);
    const requestId = buffer.getUint8();
    const offset = buffer.getUint32();

    if ( buffer.isEmpty ) {
        return {requestId, offset};
    }

    return {requestId, offset, size: buffer.getUint32()};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetSettingsMemoryParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(
        REQUEST_ID_SIZE + 4 + ((parameters.size && parameters.size !== 0) ? 4 : 0),
        false
    );

    buffer.setUint8(parameters.requestId);
    buffer.setUint32(parameters.offset);

    if ( parameters.size && parameters.size !== 0 ) {
        buffer.setUint32(parameters.size);
    }

    return command.toBytes(id, buffer.data);
};
