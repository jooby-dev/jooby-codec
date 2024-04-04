/**
 * Time correction command.
 *
 * It is used when the time difference is up to 127 seconds. A device may apply it with a delay.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as correctTime2000 from 'jooby-codec/analog/commands/downlink/correctTime2000.js';
 *
 * // 120 seconds to the past
 * const parameters = {sequenceNumber: 45, seconds: -120};
 * const bytes = correctTime2000.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [12, 2, 45, 136]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/CorrectTime2000.md#request)
 */

import * as types from '../../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import * as command from '../../utils/command.js';


/**
 * CorrectTime2000 command parameters
 *
 * @example
 * // 120 seconds to the past
 * {sequenceNumber: 45, seconds: -120}
 */
interface ICorrectTime2000Parameters extends command.ICommandParameters {
    /** unique time manipulation operation number */
    sequenceNumber: types.TUint8,

    /**
     * seconds
     * range: [-127..+127]
     */
    seconds: types.TInt8
}


export const id: types.TCommandId = 0x0c;
export const headerSize = 2;

const COMMAND_BODY_SIZE = 2;

export const examples: command.TCommandExamples = {
    'correct time 120 seconds to the past': {
        id,
        headerSize,
        parameters: {sequenceNumber: 45, seconds: -120},
        bytes: [
            0x0c, 0x02,
            0x2d, 0x88
        ]
    },
    'correct time 95 seconds to the future': {
        id,
        headerSize,
        parameters: {sequenceNumber: 46, seconds: 95},
        bytes: [
            0x0c, 0x02,
            0x2e, 0x5f
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): ICorrectTime2000Parameters => {
    if ( data.length !== COMMAND_BODY_SIZE ) {
        throw new Error(`Wrong buffer size: ${data.length}.`);
    }

    const buffer: IBinaryBuffer = new BinaryBuffer(data, false);
    const parameters = {
        sequenceNumber: buffer.getUint8(),
        seconds: buffer.getInt8()
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
export const toBytes = ( parameters: ICorrectTime2000Parameters ): types.TBytes => {
    const {sequenceNumber, seconds} = parameters;
    const buffer: IBinaryBuffer = new BinaryBuffer(COMMAND_BODY_SIZE, false);

    buffer.setUint8(sequenceNumber);
    buffer.setInt8(seconds);

    return command.toBytes(id, buffer.data);
};
