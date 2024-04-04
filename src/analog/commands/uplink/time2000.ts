/**
 * Sensor current time.
 *
 * It's a mandatory confirmation to getTime2000 request.
 * It is sent immediately after device power on. After it a device sends it periodically (once per 24 hours).
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import Time2000 from 'jooby-codec/analog/commands/uplink/Time2000.js';
 *
 * // failure
 * const commandBody = new Uint8Array([0x4d, 0x2b, 0xbd, 0x98, 0xad]);
 * const command = Time2000.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {sequenceNumber: 77, time2000: 733845677}
 * ```
 * ```js
 * import * as time2000 from 'jooby-codec/analog/commands/uplink/correctime2000tTime2000.js';
 *
 * // device time is 2023.04.03 14:01:17 GMT
 * const bytes = [0x4d, 0x2b, 0xbd, 0x98, 0xad];
 *
 * // decoded payload
 * const parameters = time2000.fromBytes(bytes);
 *
 * console.log(parameters);
 * // {sequenceNumber: 77, time2000: 733845677}
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetTime2000.md#response)
 */

import * as command from '../../utils/command.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';
import {TTime2000} from '../../utils/time.js';
import {TBytes, TCommandId} from '../../../types.js';


/**
 * Time2000 command parameters
 */
interface ITime2000Parameters {
    /** unique time manipulation operation number */
    sequenceNumber: number;
    time2000: TTime2000;
}


export const id: TCommandId = 0x09;
export const headerSize = 2;
const COMMAND_BODY_SIZE = 5;

export const examples: command.TCommandExamples = {
    'time is 2023.04.03 14:01:17 GMT': {
        id,
        headerSize,
        parameters: {sequenceNumber: 77, time2000: 733845677},
        bytes: [
            0x09, 0x05,
            0x4d, 0x2b, 0xbd, 0x98, 0xad
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( data: TBytes ): ITime2000Parameters => {
    if ( data.length !== COMMAND_BODY_SIZE ) {
        throw new Error(`Wrong buffer size: ${data.length}.`);
    }

    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(data);
    const parameters = {
        sequenceNumber: buffer.getUint8(),
        time2000: buffer.getTime()
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
export function toBytes ( parameters: ITime2000Parameters ): TBytes {
    const {sequenceNumber, time2000} = parameters;
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);

    buffer.setUint8(sequenceNumber);
    buffer.setTime(time2000);

    return command.toBytes(id, buffer.data);
}
