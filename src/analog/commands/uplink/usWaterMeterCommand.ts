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

import * as command from '../../utils/command.js';
import * as types from '../../../types.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';
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
            length: 4,
            data: [0x04, 0x22, 0x35, 0x28]
        },
        bytes: [
            0x1f, 0x07, 0x05,
            0x04, 0x04, 0x22, 0x35, 0x28
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): IUSWaterMeterCommandResponseParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(data);
    const length = buffer.getUint8();

    return {length, data: data.slice(1)};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IUSWaterMeterCommandResponseParameters ): types.TBytes => {
    const {data, length} = parameters;
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(length);

    buffer.setUint8(length);
    buffer.setBytes(data);

    return command.toBytes(id, buffer.data);
};
