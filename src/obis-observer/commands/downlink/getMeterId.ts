/**
 * Downlink command to get the meter id by the meter address.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getMeterId from 'jooby-codec/obis-observer/commands/downlink/getMeterId.js';
 *
 * const parameters = {
 *     requestId: 0,
 *     address: 'ma2375'
 * };
 *
 * const bytes = getMeterId.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [118, 8, 0, 6, 109, 97, 50, 51, 55, 53]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetMeterId.md#request)
 */

import * as types from '../../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {ICommandParameters, REQUEST_ID_SIZE} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';
import {getMeterId as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


/**
 * IGetMeterIdParameters command parameters
 */
interface IGetMeterIdParameters extends ICommandParameters {
    address: string
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'get meter id for meter with address ma3275': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 0,
            address: 'ma2375'
        },
        bytes: [
            0x76, 0x08,
            0x00, 0x06, 0x6d, 0x61, 0x32, 0x33, 0x37, 0x35
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetMeterIdParameters => {
    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return {
        requestId: buffer.getUint8(),
        address: buffer.getString()
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetMeterIdParameters ): types.TBytes => {
    const size = REQUEST_ID_SIZE + 1 + parameters.address.length;
    const buffer: IBinaryBuffer = new BinaryBuffer(size, false);

    buffer.setUint8(parameters.requestId);
    buffer.setString(parameters.address);

    return command.toBytes(id, buffer.data);
};
