/**
 * Downlink command to get the OBIS code content from the specific metering device.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getObisContentById from 'jooby-codec/obis-observer/commands/downlink/getObisContentById.js';
 *
 * const parameters = {
 *     requestId: 121,
 *     meterId: 4,
 *     obisId: 50
 * };
 *
 * const bytes = getObisContentById.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * [80, 6, 121, 0, 0, 0, 4, 50]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetObisContentById.md#request)
 */

import * as types from '../../../types.js';
import CommandBinaryBuffer, {ICommandParameters, ICommandBinaryBuffer, REQUEST_ID_SIZE, METER_ID_SIZE} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';
import {getObisContentById as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


/**
 * IGetObisContentByIdParameters command parameters
 */
interface IGetObisContentByIdParameters extends ICommandParameters {
    meterId: types.TUint32,
    obisId: types.TUint8
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'get content for obisId 53 for meter 4': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 121,
            meterId: 4,
            obisId: 50
        },
        bytes: [
            0x50, 0x06,
            0x79, 0x00, 0x00, 0x00, 0x04, 0x32
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetObisContentByIdParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    return {
        requestId: buffer.getUint8(),
        meterId: buffer.getUint32(),
        obisId: buffer.getUint8()
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetObisContentByIdParameters ): types.TBytes => {
    const {requestId, meterId, obisId} = parameters;
    // request id size + meterId size + obisId 1 byte
    const size = REQUEST_ID_SIZE + METER_ID_SIZE + 1;
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(size);

    buffer.setUint8(requestId);
    buffer.setUint32(meterId);
    buffer.setUint8(obisId);

    return command.toBytes(id, buffer.data);
};
