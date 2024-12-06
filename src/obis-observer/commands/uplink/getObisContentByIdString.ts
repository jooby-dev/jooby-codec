/**
 * Uplink command to get the OBIS code content from the specific metering device.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getObisContentByIdString from 'jooby-codec/obis-observer/commands/uplink/getObisContentByIdString.js';
 *
 * // response to getObisContentById with string result
 * const bytes = [0x79, 0x0c, 0x54, 0x6f, 0x74, 0x61, 0x6c, 0x20, 0x65, 0x6e, 0x65, 0x72, 0x67, 0x79];
 *
 * // decoded payload
 * const parameters = getObisContentByIdString.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     requestId: 121,
 *     content: 'Total energy'
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetObisContentByIdString.md#response-with-string-content)
 */

import * as types from '../../../types.js';
import CommandBinaryBuffer, {ICommandParameters, ICommandBinaryBuffer, REQUEST_ID_SIZE} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';
import {getObisContentByIdString as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


/**
 * IGetObisContentByIdStringResponseParameters command parameters
 */
interface IGetObisContentByIdStringResponseParameters extends ICommandParameters {
    /** obis code content from the metering device */
    content: string
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'response to getObisContentById with string result': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 121,
            content: 'Total energy'
        },
        bytes: [
            0x52, 0x0e,
            0x79, 0x0c, 0x54, 0x6f, 0x74, 0x61, 0x6c, 0x20, 0x65, 0x6e, 0x65, 0x72, 0x67, 0x79
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetObisContentByIdStringResponseParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);
    const requestId = buffer.getUint8();
    const content = buffer.getString();

    return {requestId, content};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetObisContentByIdStringResponseParameters ): types.TBytes => {
    // request id byte + obis string content 2-n bytes
    const size = REQUEST_ID_SIZE + parameters.content.length + 1;
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(size);
    const {requestId, content} = parameters;

    buffer.setUint8(requestId);
    buffer.setString(content);

    return command.toBytes(id, buffer.data);
};
