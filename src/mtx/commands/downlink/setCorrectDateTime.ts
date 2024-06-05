/**
 * Downlink command for incremental time correction.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as setCorrectDateTime from 'jooby-codec/mtx/commands/downlink/setCorrectDateTime.js';
 *
 * const parameters = {
 *     seconds: 5
 * };
 * const bytes = setCorrectDateTime.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [92, 2, 0, 5]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/SetCorrectDateTime.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';


interface ISetCorrectDateTimeParameters {
    /**
     * Number of seconds to shift time.
     */
    seconds: types.TInt16;
}


export const id: types.TCommandId = 0x5c;
export const name: types.TCommandName = 'setCorrectDateTime';
export const headerSize = 2;
export const maxSize = 2;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'shift device time 5 seconds forward': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {seconds: 5},
        bytes: [
            0x5c, 0x02,
            0x00, 0x05
        ]
    },
    'shift device time 5 seconds backward': {
        id,
        name,
        headerSize,
        maxSize,
        parameters: {seconds: -5},
        bytes: [
            0x5c, 0x02,
            0xff, 0xfb
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( bytes: types.TBytes ): ISetCorrectDateTimeParameters => {
    if ( bytes.length !== maxSize ) {
        throw new Error(`Wrong buffer size: ${bytes.length}.`);
    }

    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    return {seconds: buffer.getInt16()};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: ISetCorrectDateTimeParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    buffer.setInt16(parameters.seconds);

    return command.toBytes(id, buffer.data);
};
