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
 * const bytes = [0x07, 0x22, 0x18, 0xc0, 0x5d, 0x20, 0x4e];
 *
 * // decoded payload
 * const parameters = usWaterMeterCommand.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {data: [7, 34, 24, 192, 93, 32, 78]}
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/USWaterMeterCommand.md#response)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import {getStringFromBytes, IBytesConversionFormatOptions} from '../../../utils/bytesConversion.js';
import {usWaterMeterCommand as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';
import {IUSWaterMeterCommandParameters} from '../downlink/usWaterMeterCommand.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 3;

export const examples: command.TCommandExamples = {
    'response for getDepassivationConfig command': {
        id,
        name,
        headerSize,
        parameters: {
            data: [0x07, 0x22, 0x18, 0xc0, 0x5d, 0x20, 0x4e]
        },
        bytes: [
            0x1f, 0x07, 0x07,
            0x07, 0x22, 0x18, 0xc0, 0x5d, 0x20, 0x4e
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
