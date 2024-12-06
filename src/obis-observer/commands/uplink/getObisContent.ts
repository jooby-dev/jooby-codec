/**
 * Uplink command to get the OBIS code content from the specific metering device.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getObisContent from 'jooby-codec/obis-observer/commands/uplink/getObisContent.js';
 *
 * // response to getObisContent
 * const bytes = [0x02, 0x08, 0x35, 0x37, 0x39, 0x30, 0x36, 0x36, 0x33, 0x35];
 *
 * // decoded payload
 * const parameters = getObisContent.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     requestId: 2,
 *     content: '57906635'
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/uplink/GetContentByObis.md)
 */

import * as types from '../../../types.js';
import CommandBinaryBuffer, {ICommandParameters, ICommandBinaryBuffer, REQUEST_ID_SIZE} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';
import {getObisContent as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


/**
 * IGetObisContentResponseParameters command parameters
 */
interface IGetObisContentResponseParameters extends ICommandParameters {
    content: string
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'response to getObisContent': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 2,
            content: '57906635'
        },
        bytes: [
            0x4f, 0x0a,
            0x02, 0x08, 0x35, 0x37, 0x39, 0x30, 0x36, 0x36, 0x33, 0x35
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetObisContentResponseParameters => {
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
export const toBytes = ( parameters: IGetObisContentResponseParameters ): types.TBytes => {
    // request id size + 1 content size byte + content size
    const size = REQUEST_ID_SIZE + 1 + parameters.content.length;
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(size);
    const {requestId, content} = parameters;

    buffer.setUint8(requestId);
    buffer.setString(content);

    return command.toBytes(id, buffer.data);
};
