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
 *     data: [0x03, 0x21, 0x01]
 * };
 *
 * const bytes = usWaterMeterCommand.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [31, 7, 3, 3, 33, 1]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/USWaterMeterCommand.md#request)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import {getStringFromBytes, IBytesConversionFormatOptions} from '../../../utils/bytesConversion.js';
import {usWaterMeterCommand as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


export interface IUSWaterMeterCommandParameters {
    /** frame for water meter (analog-ultrasound command payload) */
    data: types.TBytes
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 3;

export const examples = {
    'request with getInfo command': {
        id,
        headerSize,
        parameters: {
            data: [0x03, 0x21, 0x01]
        },
        bytes: [
            0x1f, 0x07, 0x03,
            0x03, 0x21, 0x01
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IUSWaterMeterCommandParameters => ({data: bytes});


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IUSWaterMeterCommandParameters ): types.TBytes => command.toBytes(id, parameters.data);


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
