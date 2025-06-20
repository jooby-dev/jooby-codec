/**
 * Time correction command.
 *
 * It is used when the time difference is more than `127` seconds.
 * A device should apply it immediately.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as setTime2000 from 'jooby-codec/analog/commands/downlink/setTime2000.js';
 *
 * // 240 seconds to the future
 * const parameters = {sequenceNumber: 78, seconds: 123456};
 * const bytes = setTime2000.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [2, 5, 78, 0, 1, 226, 64]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/SetTime2000.md#request)
 */

import * as types from '../../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import * as command from '../../utils/command.js';
import {setTime2000 as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


interface ISetTime2000Parameters {
    /** unique time manipulation operation number */
    sequenceNumber: types.TUint8;

    /** seconds */
    seconds: types.TInt32;
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

const COMMAND_BODY_SIZE = 5;

export const examples = {
    'set time to 2023.04.03 14:01:17 GMT': {
        id,
        headerSize,
        parameters: {
            sequenceNumber: 78,
            seconds: 733845677
        },
        bytes: [
            0x02, 0x05,
            0x4e, 0x2b, 0xbd, 0x98, 0xad
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): ISetTime2000Parameters => {
    if ( bytes.length !== COMMAND_BODY_SIZE ) {
        throw new Error(`Wrong buffer size: ${bytes.length}.`);
    }

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);
    const parameters = {
        sequenceNumber: buffer.getUint8(),
        seconds: buffer.getInt32()
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
export const toBytes = ( parameters: ISetTime2000Parameters ): types.TBytes => {
    const {sequenceNumber, seconds} = parameters;
    const buffer: IBinaryBuffer = new BinaryBuffer(COMMAND_BODY_SIZE, false);

    buffer.setUint8(sequenceNumber);
    buffer.setInt32(seconds);

    return command.toBytes(id, buffer.data);
};
