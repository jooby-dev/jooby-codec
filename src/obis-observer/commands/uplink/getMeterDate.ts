/**
 * Uplink command to get the current date and time on the specific meter.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getMeterDate from 'jooby-codec/obis-observer/commands/uplink/getMeterDate.js';
 *
 * // response to getMeterDate with data
 * const bytes = [0x07, 0x2c, 0x2f, 0x0a, 0xf6];
 *
 * // decoded payload
 * const parameters = getMeterDate.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     requestId: 7,
 *     time2000: 741280502
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetMeterDate.md#response)
 */

import * as types from '../../../types.js';
import {TTime2000} from '../../../analog/utils/time.js';
import CommandBinaryBuffer, {ICommandParameters, ICommandBinaryBuffer, DATE_TIME_SIZE, REQUEST_ID_SIZE} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';


/**
 * IGetMeterDateResponseParameters command parameters
 */
interface IGetMeterDateResponseParameters extends ICommandParameters {
    time2000: TTime2000
}


export const id: types.TCommandId = 0x7a;
export const name: types.TCommandName = 'getMeterDate';
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'response to getMeterDate with data': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 7,
            time2000: 741280502
        },
        bytes: [
            0x7a, 0x05,
            0x07, 0x2c, 0x2f, 0x0a, 0xf6
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetMeterDateResponseParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    return {
        requestId: buffer.getUint8(),
        time2000: buffer.getUint32() as TTime2000
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetMeterDateResponseParameters ): types.TBytes => {
    const size = REQUEST_ID_SIZE + (parameters.time2000 ? DATE_TIME_SIZE : 0);
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(size);

    buffer.setUint8(parameters.requestId);
    buffer.setUint32(parameters.time2000);

    return command.toBytes(id, buffer.data);
};
