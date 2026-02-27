/**
 * Downlink command to get the OBIS code content from the specific metering device.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getObisContent from 'jooby-codec/obis-observer/commands/downlink/getObisContent.js';
 *
 * const parameters = {
 *     requestId: 3,
 *     meterId: 8,
 *     obis: {
 *         c: 0,
 *         d: 9,
 *         e: 1
 *     }
 * };
 *
 * const bytes = getObisContent.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * [78, 9, 3, 0, 0, 0, 8, 2, 0, 9, 1]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetContentByObis.md#request)
 */

import * as types from '../../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import {
    ICommandParameters,
    IObis,
    REQUEST_ID_SIZE,
    METER_ID_SIZE,
    getObisSize,
    getObis,
    setObis
} from '../../utils/binary/buffer.js';
import * as command from '../../utils/command.js';
import {getObisContent as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


/**
 * IGetObisContentParameters command parameters
 */
interface IGetObisContentParameters extends ICommandParameters {
    meterId: types.TUint32,
    obis: IObis
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'get content for OBIS code 0.9.1 - local time for meter 8': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 3,
            meterId: 8,
            obis: {
                c: 0,
                d: 9,
                e: 1
            }
        },
        bytes: [
            0x4e, 0x09,
            0x03, 0x00, 0x00, 0x00, 0x08, 0x02, 0x00, 0x09, 0x01
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetObisContentParameters => {
    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return {
        requestId: buffer.getUint8(),
        meterId: buffer.getUint32(),
        obis: getObis(buffer)
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetObisContentParameters ): types.TBytes => {
    const {requestId, meterId, obis} = parameters;
    const size = REQUEST_ID_SIZE + METER_ID_SIZE + getObisSize(obis);
    const buffer: IBinaryBuffer = new BinaryBuffer(size, false);

    buffer.setUint8(requestId);
    buffer.setUint32(meterId);
    setObis(buffer, obis);

    return command.toBytes(id, buffer.data);
};
