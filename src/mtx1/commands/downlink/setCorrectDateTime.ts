/**
 * Downlink command for incremental time correction.
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as setCorrectDateTime from 'jooby-codec/mtx1/commands/downlink/setCorrectDateTime.js';
 *
 * const parameters = {seconds: 5};
 * const bytes = setCorrectDateTime.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [92, 2, 0, 5]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/SetCorrectDateTime.md#request)
 */

import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {setCorrectDateTime as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


interface ISetCorrectDateTimeParameters {
    /**
     * Number of seconds to shift time.
     */
    seconds: types.TInt16;
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
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
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): ISetCorrectDateTimeParameters => {
    validateCommandPayload(name, bytes, maxSize);

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return {seconds: buffer.getInt16()};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: ISetCorrectDateTimeParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    buffer.setInt16(parameters.seconds);

    return command.toBytes(id, buffer.data);
};
