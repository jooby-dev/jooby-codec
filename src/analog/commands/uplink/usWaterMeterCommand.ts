/**
 * Command to receive data frame from Ultrasound water meter.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as usWaterMeterCommand from 'jooby-codec/analog/commands/downlink/usWaterMeterCommand.js';
 *
 * // response to usWaterMeterCommand downlink command
 * const bytes = [0x04, 0x04, 0x22, 0x35, 0x28];
 *
 * // decoded payload
 * const parameters = usWaterMeterCommand.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {length: 4, data: [4, 34, 53, 40]}
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/USWaterMeterCommand.md#response)
 */

import * as types from '../../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import * as command from '../../utils/command.js';
import {getStringFromBytes, IBytesConversionFormatOptions} from '../../../utils/bytesConversion.js';
import {usWaterMeterCommand as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export interface IUSWaterMeterCommandResponseParameters {
    /** frame data length including length byte */
    length: types.TUint8,

    /** response frame from water meter */
    data: types.TBytes
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 3;

export const examples: command.TCommandExamples = {
    'response for current values': {
        id,
        name,
        headerSize,
        parameters: {
            length: 11,
            data: [0x21, 0x02, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x04]
        },
        bytes: [
            0x1f, 0x07, 0x0b,
            0x0b, 0x21, 0x02, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x04
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IUSWaterMeterCommandResponseParameters => {
    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);
    const length = buffer.getUint8();

    return {length, data: bytes.slice(1)};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IUSWaterMeterCommandResponseParameters ): types.TBytes => {
    const {data, length} = parameters;
    const buffer: IBinaryBuffer = new BinaryBuffer(length, false);

    buffer.setUint8(length);
    buffer.setBytes(data);

    return command.toBytes(id, buffer.data);
};


/**
 * Convert command parameters to JSON.
 *
 * @param parameters - command payload
 * @returns JSON representation of command parameters
 */
export const toJson = ( parameters: IUSWaterMeterCommandResponseParameters, options: IBytesConversionFormatOptions ): string => JSON.stringify({
    ...parameters,
    data: getStringFromBytes(parameters.data, options)
});
