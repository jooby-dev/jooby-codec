/**
 * Command to send data frame to Ultrasound water meter.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as usWaterMeterCommand from 'jooby-codec/analog/commands/downlink/usWaterMeterCommand.js';
 *
 * // request current values
 * const parameters = {
 *     length: 3,
 *     data: [0x21, 0x02]
 * };
 *
 * const bytes = usWaterMeterCommand.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [31, 7, 3, 3, 33, 2]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/USWaterMeterCommand.md#request)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {getStringFromBytes, IBytesConversionFormatOptions} from '../../../utils/bytesConversion.js';
import {usWaterMeterCommand as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


interface IUSWaterMeterCommandParameters {
    /** frame data length including length byte */
    length: types.TUint8,

    /** frame for water meter */
    data: types.TBytes
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 3;

export const examples = {
    'request for current values': {
        id,
        headerSize,
        parameters: {
            length: 3,
            data: [0x21, 0x02]
        },
        bytes: [
            0x1f, 0x07, 0x03,
            0x03, 0x21, 0x02
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IUSWaterMeterCommandParameters => {
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
export const toBytes = ( parameters: IUSWaterMeterCommandParameters ): types.TBytes => {
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
export const toJson = ( parameters: IUSWaterMeterCommandParameters, options: IBytesConversionFormatOptions ): string => JSON.stringify({
    ...parameters,
    data: getStringFromBytes(parameters.data, options)
});
