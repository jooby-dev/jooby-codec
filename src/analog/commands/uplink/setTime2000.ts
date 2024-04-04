/**
 * Time set command response.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as setTime2000 from 'jooby-codec/analog/commands/uplink/setTime2000.js';
 *
 * // success response
 * const bytes = [0x01];
 *
 * // decoded payload
 * const parameters = setTime2000.fromBytes(bytes);
 *
 * console.log(parameters);
 * // {status: 1}
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/SetTime2000.md#response)
 */

import {TBytes, TUint8, TCommandId} from '../../../types.js';
import * as command from '../../utils/command.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';

/**
 * SetTime2000Response command parameters
 *
 * @example
 * {status: 1}
 */
interface ISetTime2000ResponseParameters {
    status: TUint8;
}

export const id: TCommandId = 0x02;
export const headerSize = 2;

const COMMAND_BODY_SIZE = 1;

export const examples: command.TCommandExamples = {
    success: {
        id,
        headerSize,
        parameters: {status: 1},
        bytes: [
            0x02, 0x01,
            0x01
        ]
    }
};

/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( data: TBytes ): ISetTime2000ResponseParameters => {
    if ( data.length !== COMMAND_BODY_SIZE ) {
        throw new Error(`Wrong buffer size: ${data.length}.`);
    }

    const buffer: IBinaryBuffer = new BinaryBuffer(data, false);
    const parameters = {
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
export const toBytes = ( parameters: ISetTime2000ResponseParameters ): TBytes => {
    const {status} = parameters;
    const buffer: IBinaryBuffer = new BinaryBuffer(COMMAND_BODY_SIZE, false);

    buffer.setUint8(status);

    return command.toBytes(id, buffer.data);
};
