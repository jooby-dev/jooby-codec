/**
 * Time correction command.
 *
 * It is used when the time difference is more than `127` seconds.
 * A device should apply it immediately.
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
 * // output:
 * {status: 1}
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/SetTime2000.md#response)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {setTime2000 as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


/**
 * SetTime2000Response command parameters
 *
 * @example
 * {status: 1}
 */
interface ISetTime2000ResponseParameters {
    /**
     * `1` - the time setting was successful<br>
     * `0` - time setting failed (the `sequence number` parameter was not changed)
     */
    status: types.TUint8;
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

const COMMAND_BODY_SIZE = 1;

export const examples: command.TCommandExamples = {
    success: {
        id,
        name,
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
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): ISetTime2000ResponseParameters => {
    validateCommandPayload(name, bytes, COMMAND_BODY_SIZE);

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
export const toBytes = ( parameters: ISetTime2000ResponseParameters ): types.TBytes => {
    const {status} = parameters;
    const buffer: IBinaryBuffer = new BinaryBuffer(COMMAND_BODY_SIZE, false);

    buffer.setUint8(status);

    return command.toBytes(id, buffer.data);
};
