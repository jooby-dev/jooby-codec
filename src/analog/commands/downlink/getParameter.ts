/**
 * The command to read the parameter set in the sensor.
 *
 * In the body of the command, you must specify the type of the parameter.
 * In response, the sensor will transmit the current value of the requested parameter.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getParameter from 'jooby-codec/analog/commands/downlink/getParameter.js';
 *
 * const parameters = {id: 29, data: {channel: 1}};
 * const bytes = getParameter.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [4, 2, 29, 0]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetParameter.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../../types.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, IRequestParameter, getRequestParameterSize} from '../../utils/CommandBinaryBuffer.js';


export const id: types.TCommandId = 0x04;
export const name: types.TCommandName = 'getParameter';
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'request absolute data (not multichannel device)': {
        id,
        name,
        headerSize,
        parameters: {id: 23, data: null},
        bytes: [
            0x04, 0x01,
            0x17
        ]
    },
    'request for state of absolute data (not multichannel device)': {
        id,
        name,
        headerSize,
        parameters: {id: 24, data: null},
        bytes: [
            0x04, 0x01,
            0x18
        ]
    },
    'request for state of absolute for multichannel device (1 channel)': {
        id,
        name,
        headerSize,
        parameters: {id: 29, data: {channel: 1}},
        bytes: [
            0x04, 0x02,
            0x1d, 0x00
        ]
    },
    'request for state of absolute data for multichannel device (1 channel)': {
        id,
        name,
        headerSize,
        parameters: {id: 30, data: {channel: 1}},
        bytes: [
            0x04, 0x02,
            0x1e, 0x00
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param data - binary data containing command parameters
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): IRequestParameter => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(data);

    return buffer.getRequestParameter();
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IRequestParameter ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(getRequestParameterSize(parameters));

    buffer.setRequestParameter(parameters);

    return command.toBytes(id, buffer.data);
};
