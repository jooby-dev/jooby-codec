/**
 * Downlink command to get the meter profile id and meter address for the specific meter.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getMeterInfo from 'jooby-codec/obis-observer/commands/downlink/getMeterInfo.js';
 *
 * const parameters = {
 *     requestId: 8,
 *     meterId: 1
 * };
 *
 * const bytes = getMeterInfo.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * [120, 5, 8, 0, 0, 0, 1]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetMeterInfo.md#request)
 */

import * as types from '../../../types.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, ICommandParameters, METER_ID_SIZE, REQUEST_ID_SIZE} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';
import {getMeterInfo as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


/**
 * IGetMeterInfoParameters command parameters
 */
interface IGetMeterInfoParameters extends ICommandParameters {
    meterId: types.TUint32
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'get meter info for meter 1': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 8,
            meterId: 1
        },
        bytes: [
            0x78, 0x05,
            0x08, 0x00, 0x00, 0x00, 0x01
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetMeterInfoParameters => {
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
export const toBytes = ( parameters: IGetMeterInfoParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(REQUEST_ID_SIZE + METER_ID_SIZE);

    buffer.setUint8(parameters.requestId);
    buffer.setUint32(parameters.meterId);

    return command.toBytes(id, buffer.data);
};
