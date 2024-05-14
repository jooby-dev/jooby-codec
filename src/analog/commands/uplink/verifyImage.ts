/**
 * Command to verify the update image on the device.
 * This command is part of update procedure.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as verifyImage from 'jooby-codec/analog/commands/uplink/verifyImage.js';
 *
 * // empty response
 * const bytes = [0x01];
 *
 * // decoded payload
 * const parameters = verifyImage.fromBytes(bytes);
 *
 * // this command doesn't have any parameters
 * console.log(parameters);
 * // output:
 * {status: 1}
 * ```
 *
 * [https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/VerifyImage.md#response)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';


interface IVerifyImageResponseParameters {
    /**
     * `1` - the image is correct <br>
     * `0` - the image is incorrect
     */
    status: types.TUint8
}


export const id: types.TCommandId = 0x2b1f;
export const name: types.TCommandName = 'verifyImage';
export const headerSize = 3;

const COMMAND_BODY_SIZE = 1;

export const examples: command.TCommandExamples = {
    'image is valid': {
        id,
        name,
        headerSize,
        parameters: {status: 1},
        bytes: [
            0x1f, 0x2b, 0x01,
            0x01
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): IVerifyImageResponseParameters => {
    if ( data.length !== COMMAND_BODY_SIZE ) {
        throw new Error(`Wrong buffer size: ${data.length}.`);
    }

    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(data);

    return {status: buffer.getUint8()};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IVerifyImageResponseParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);

    buffer.setUint8(parameters.status);

    return command.toBytes(id, buffer.data);
};
