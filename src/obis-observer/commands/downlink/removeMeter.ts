/**
 * Request to remove specific meter device.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as removeMeter from 'jooby-codec/obis-observer/commands/downlink/removeMeter.js';
 *
 * const parameters = {
 *     requestId: 3,
 *     meterId: 17
 * };
 * const bytes = removeMeter.toBytes(parameters);
 *
 * // output command binary in hex representation
 * console.log(bytes);
 * // output
 * [114, 5, 3, 0, 0, 0, 17]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/RemoveMeter.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../../types.js';
import CommandBinaryBuffer, {
    ICommandBinaryBuffer, ICommandParameters, REQUEST_ID_SIZE, METER_ID_SIZE
} from '../../utils/CommandBinaryBuffer.js';


export interface IRemoveMeterParameters extends ICommandParameters {
    meterId: types.TUint32
}


export const id: types.TCommandId = 0x72;
export const name: types.TCommandName = 'removeMeter';
export const headerSize = 2;

const COMMAND_BODY_SIZE = REQUEST_ID_SIZE + METER_ID_SIZE;

export const examples: command.TCommandExamples = {
    'remove meter 17': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 3,
            meterId: 17
        },
        bytes: [
            0x72, 0x05,
            0x03, 0x00, 0x00, 0x00, 0x11
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( bytes: types.TBytes ): IRemoveMeterParameters => {
    if ( bytes.length !== COMMAND_BODY_SIZE ) {
        throw new Error(`Wrong buffer size: ${bytes.length}.`);
    }

    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);
    const requestId = buffer.getUint8();
    const meterId = buffer.getUint32();

    return {requestId, meterId};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IRemoveMeterParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);

    buffer.setUint8(parameters.requestId);
    buffer.setUint32(parameters.meterId);

    return command.toBytes(id, buffer.data);
};
