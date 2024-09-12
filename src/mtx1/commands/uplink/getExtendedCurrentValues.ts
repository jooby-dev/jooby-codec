/**
 * Uplink command to get extended current values like temperature and frequency.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getExtendedCurrentValues from 'jooby-codec/mtx1/commands/uplink/getExtendedCurrentValues.js';
 *
 * // simple response
 * const bytes = [0x00, 0x43, 0x00, 0x3c];
 *
 * // decoded payload
 * const parameters = getExtendedCurrentValues.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     temperature: 67,
 *     frequency: 60
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetExtendedCurrentValues.md#response)
 */

import * as command from '../../utils/command.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';
import * as types from '../../types.js';
import {READ_ONLY} from '../../constants/accessLevels.js';


interface IGetExtendedCurrentValuesResponseParameters {
    /** device temperature */
    temperature: types.TInt16,

    /** the frequency of voltage in the power grid */
    frequency: types.TInt16
}


export const id: types.TCommandId = 0x3a;
export const name: types.TCommandName = 'getExtendedCurrentValues';
export const headerSize = 2;
export const maxSize = 4;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'simple response': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            temperature: 67,
            frequency: 60
        },
        bytes: [
            0x3a, 0x04,
            0x00, 0x43, 0x00, 0x3c
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): IGetExtendedCurrentValuesResponseParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(data);

    return {
        temperature: buffer.getInt16(),
        frequency: buffer.getInt16()
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetExtendedCurrentValuesResponseParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    // body
    buffer.setInt16(parameters.temperature);
    buffer.setInt16(parameters.frequency);

    return command.toBytes(id, buffer.data);
};


export const toJson = ( parameters: IGetExtendedCurrentValuesResponseParameters, {dlms}: command.IDlmsJsonOptions = command.defaultDlmsJsonOptions ) => {
    const {temperature, frequency} = parameters;

    const result = dlms
        ? {
            '0.11.0': temperature,
            '14.7.0': frequency
        }
        : parameters;

    return JSON.stringify(result);
};
