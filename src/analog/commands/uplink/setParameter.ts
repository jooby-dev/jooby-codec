/**
 * Command for reporting new events.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as setParameter from 'jooby-codec/analog/commands/uplink/setParameter.js';
 *
 * // configuration for battery depassivation set successfully
 * const bytes = [0x03, 0x02, 0x21, 0x01];
 *
 * // decoded payload
 * const parameters = newEvent.setParameter(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     id: 33,
 *     status: 1,
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/SetParameter.md#response)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';


interface ISetParameterResponseParameters {
    id: number;
    status: number;
}


export const id: number = 0x03;
export const name: string = 'setParameterResponse';
export const headerSize = 2;

const COMMAND_BODY_SIZE = 2;

export const examples: command.TCommandExamples = {
    'activation method set successfully': {
        id,
        name,
        headerSize,
        parameters: {id: 9, status: 1},
        bytes: [
            0x03, 0x02,
            0x09, 0x01
        ]
    },
    'configuration for battery depassivation set successfully': {
        id,
        name,
        headerSize,
        parameters: {id: 33, status: 1},
        bytes: [
            0x03, 0x02,
            0x21, 0x01
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param data - binary data containing command parameters
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): ISetParameterResponseParameters => {
    if ( data.length !== COMMAND_BODY_SIZE ) {
        throw new Error(`Wrong buffer size: ${data.length}.`);
    }

    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(data);
    const parameters: ISetParameterResponseParameters = {
        id: buffer.getUint8(),
        status: buffer.getUint8()
    };

    if ( !buffer.isEmpty ) {
        throw new Error('BinaryBuffer is not empty.');
    }

    return parameters;
};

/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: ISetParameterResponseParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);

    buffer.setUint8(parameters.id);
    buffer.setUint8(parameters.status);

    return command.toBytes(id, buffer.data);
};
