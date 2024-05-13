/**
 * Downlink command to get the readout related state and statistic from the specific meter.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getMeterReadoutState from 'jooby-codec/obis-observer/commands/downlink/getMeterReadoutState.js';
 *
 * const parameters = {
 *     requestId: 8,
 *     meterId: 3
 * };
 *
 * const bytes = getMeterReadoutState.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * [129, 5, 9, 0, 0, 0, 3]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetMeterReadoutState.md#request)
 */

import * as types from '../../../types.js';
import CommandBinaryBuffer, {ICommandParameters, ICommandBinaryBuffer, REQUEST_ID_SIZE, METER_ID_SIZE} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';


/**
 * IGetMeterReadoutStateParameters command parameters
 */
interface IGetMeterReadoutStateParameters extends ICommandParameters {
    meterId: types.TUint32
}


export const id: types.TCommandId = 0x81;
export const name: types.TCommandName = 'getMeterReadoutState';
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'get readout state for meter 3': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 9,
            meterId: 3
        },
        bytes: [
            0x81, 0x05,
            0x09, 0x00, 0x00, 0x00, 0x03
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetMeterReadoutStateParameters => {
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
export const toBytes = ( parameters: IGetMeterReadoutStateParameters ): types.TBytes => {
    const {requestId, meterId} = parameters;
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(REQUEST_ID_SIZE + METER_ID_SIZE);

    buffer.setUint8(requestId);
    buffer.setUint32(meterId);

    return command.toBytes(id, buffer.data);
};
