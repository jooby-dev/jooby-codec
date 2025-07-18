/**
 * Time correction command.
 *
 * It is used when the time difference is up to 127 seconds.
 * A device may apply it with a delay.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as correctTime2000 from 'jooby-codec/analog/commands/uplink/correctTime2000.js';
 *
 * // failure response
 * const bytes = [0x00];
 *
 * // decoded payload
 * const parameters = correctTime2000.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {status: 0}
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/CorrectTime2000.md#response)
 */

import * as types from '../../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import * as command from '../../utils/command.js';
import {correctTime2000 as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


/**
 * CorrectTime2000 response command parameters
 *
 * @example
 * {status: 1}
 */
interface ICorrectTime2000ResponseParameters {
    /**
     * `1` - the time setting was successful <br>
     * `0` - time setting failed (the `sequence number` parameter was not changed)
     */
    status: types.TUint8
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

const COMMAND_BODY_SIZE = 1;

export const examples: command.TCommandExamples = {
    'time correction failure': {
        id,
        name,
        headerSize,
        parameters: {status: 0},
        bytes: [
            0x0c, 0x01,
            0x00
        ]
    },
    'time correction success': {
        id,
        name,
        headerSize,
        parameters: {status: 1},
        bytes: [
            0x0c, 0x01,
            0x01
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): ICorrectTime2000ResponseParameters => {
    if ( bytes.length !== COMMAND_BODY_SIZE ) {
        throw new Error(`Wrong buffer size: ${bytes.length}.`);
    }

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);
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
export const toBytes = ( parameters: ICorrectTime2000ResponseParameters ): types.TBytes => {
    const {status} = parameters;
    const buffer: IBinaryBuffer = new BinaryBuffer(COMMAND_BODY_SIZE, false);

    buffer.setUint8(status);

    return command.toBytes(id, buffer.data);
};
