/**
 * Downlink command to set DST/Standard time transition options.
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as setCorrectTime from 'jooby-codec/mtx1/commands/downlink/setCorrectTime.js';
 *
 * const parameters = {
 *     monthTransitionSummer: 3,
 *     dateTransitionSummer: 0,
 *     hoursTransitionSummer: 3,
 *     hoursCorrectSummer: 1,
 *     monthTransitionWinter: 10,
 *     dateTransitionWinter: 0,
 *     hoursTransitionWinter: 4,
 *     hoursCorrectWinter: 1,
 *     isCorrectionNeeded: true
 * };
 *
 * const bytes = setCorrectTime.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [28, 9, 3, 0, 3, 1, 10, 0, 4, 1, 1]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/SetCorrectTime.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {
    getTimeCorrectionParameters,
    setTimeCorrectionParameters
} from '../../utils/CommandBinaryBuffer.js';
import {READ_WRITE} from '../../constants/accessLevels.js';
import {ITimeCorrectionParameters} from '../../utils/dateTime.js';
import {setCorrectTime as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 9;
export const accessLevel: types.TAccessLevel = READ_WRITE;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'default parameters': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            monthTransitionSummer: 3,
            dateTransitionSummer: 0,
            hoursTransitionSummer: 3,
            hoursCorrectSummer: 1,
            monthTransitionWinter: 10,
            dateTransitionWinter: 0,
            hoursTransitionWinter: 4,
            hoursCorrectWinter: 1,
            isCorrectionNeeded: true
        },
        bytes: [
            0x1c, 0x09,
            0x03, 0x00, 0x03, 0x01, 0x0a, 0x00, 0x04, 0x01, 0x01
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): ITimeCorrectionParameters => {
    if ( bytes.length !== maxSize ) {
        throw new Error(`Wrong buffer size: ${bytes.length}.`);
    }

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return getTimeCorrectionParameters(buffer);
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: ITimeCorrectionParameters): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    setTimeCorrectionParameters(buffer, parameters);

    return command.toBytes(id, buffer.data);
};
