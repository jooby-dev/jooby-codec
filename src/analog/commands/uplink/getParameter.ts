/**
 * The command to read the parameter set in the sensor.
 *
 * @packageDocumentation
 *
 * @example
 * ```typescript
 * import * as getParameter from 'jooby-codec/analog/commands/uplink/getParameter.js';
 *
 * const bytes = [0x01, 0x00, 0x00, 0x00, 0x04];
 *
 * // decoded payload
 * const parameters = getParameter.fromBytes(commandBody);
 *
 * console.log(parameters);
 * // output:
 * {
 *     id: 1,
 *     data: {value: 2400}
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetParameter.md#response)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import CommandBinaryBuffer, {IResponseParameter, getResponseParameterSize, ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';


export const id: types.TCommandId = 0x04;
export const name: types.TCommandName = 'getParameter';
export const headerSize: number = 2;

export const examples: command.TCommandExamples = {
    'reporting data interval': {
        id,
        name,
        headerSize,
        parameters: {
            id: 1,
            data: {value: 2400}
        },
        bytes: [
            0x04, 0x05,
            0x01, 0x00, 0x00, 0x00, 0x04
        ]
    }
    // 'absolute data (not multichannel device)': {
    //     id,
    //     name,
    //     headerSize,
    //     parameters: {
    //         id: 23,
    //         data: null
    //     },
    //     bytes: [
    //         0x04, 0x01,
    //         0x17
    //     ]
    // },
    // 'state of absolute data (not multichannel device)': {
    //     id,
    //     name,
    //     headerSize,
    //     parameters: {
    //         id: 24,
    //         data: null
    //     },
    //     bytes: [
    //         0x04, 0x01,
    //         0x18
    //     ]
    // },
    // 'state of absolute for multichannel device (1 channel)': {
    //     id,
    //     name,
    //     headerSize,
    //     parameters: {
    //         id: 29,
    //         data: {channel: 1}
    //     },
    //     bytes: [
    //         0x04, 0x02,
    //         0x1d, 0x00
    //     ]
    // },
    // 'state of absolute data for multichannel device (1 channel)': {
    //     id,
    //     name,
    //     headerSize,
    //     parameters: {
    //         id: 30,
    //         data: {channel: 1}
    //     },
    //     bytes: [
    //         0x04, 0x02,
    //         0x1e, 0x00
    //     ]
    // }
};


/**
 * Decode command parameters.
 *
 * @param data - binary data containing command parameters
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): IResponseParameter => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(data);

    return buffer.getResponseParameter();
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IResponseParameter ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(getResponseParameterSize(parameters));

    buffer.setResponseParameter(parameters);

    return command.toBytes(id, buffer.data);
};
