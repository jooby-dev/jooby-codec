/**
 * Downlink command to get the current date and time on the specific meter.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getMeterDate from 'jooby-codec/obis-observer/commands/downlink/getMeterDate.js';
 *
 * const parameters = {
 *     requestId: 4,
 *     meterId: 3
 * };
 *
 * const bytes = getMeterDate.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [122, 5, 4, 0, 0, 0, 3]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetMeterDate.md#request)
 */

import * as types from '../../../types.js';
import CommandBinaryBuffer, {ICommandParameters, ICommandBinaryBuffer, METER_ID_SIZE, REQUEST_ID_SIZE} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';
import {getMeterDate as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


/**
 * IGetMeterDateParameters command parameters
 */
interface IGetMeterDateParameters extends ICommandParameters {
    meterId: types.TUint32
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'get date for meter 3': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 4,
            meterId: 3
        },
        bytes: [
            0x7a, 0x05,
            0x04, 0x00, 0x00, 0x00, 0x03
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetMeterDateParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    return {
        requestId: buffer.getUint8(),
        meterId: buffer.getUint32()
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetMeterDateParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(REQUEST_ID_SIZE + METER_ID_SIZE);

    buffer.setUint8(parameters.requestId);
    buffer.setUint32(parameters.meterId);

    return command.toBytes(id, buffer.data);
};
