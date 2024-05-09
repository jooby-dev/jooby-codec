/**
 * Uplink command.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getMeterId from 'jooby-codec/obis-observer/commands/uplink/getMeterId.js';
 *
 * // get meter id response
 * const bytes = [0x02, 0x00, 0x00, 0x00, 0x01];
 *
 * // decoded payload
 * const parameters = getMeterId.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     requestId: 2,
 *     meterId: 1
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetMeterId.md#response)
 */

import * as types from '../../../types.js';
import CommandBinaryBuffer, {ICommandParameters, ICommandBinaryBuffer, METER_ID_SIZE, REQUEST_ID_SIZE} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';


/**
 * IGetMeterIdResponseParameters command parameters
 */
interface IGetMeterIdResponseParameters extends ICommandParameters {
    meterId: types.TUint32
}


const COMMAND_SIZE = REQUEST_ID_SIZE + METER_ID_SIZE;


export const id: types.TCommandId = 0x77;
export const name: types.TCommandName = 'getMeterId';
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'get meter id response': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 2,
            meterId: 1
        },
        bytes: [
            0x77, 0x05,
            0x02, 0x00, 0x00, 0x00, 0x01
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetMeterIdResponseParameters => {
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
export const toBytes = ( parameters: IGetMeterIdResponseParameters ): types.TBytes => {
    const size = parameters.meterId ? COMMAND_SIZE : REQUEST_ID_SIZE;
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(size);

    buffer.setUint8(parameters.requestId);
    buffer.setUint32(parameters.meterId);

    return command.toBytes(id, buffer.data);
};
