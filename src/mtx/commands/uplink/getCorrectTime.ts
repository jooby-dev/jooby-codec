/**
 * Uplink command to get [DST](https://en.wikipedia.org/wiki/Daylight_saving_time)/Standard time transition options.
 *
 * The corresponding downlink command: `getCorrectTime`.
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getCorrectTime from 'jooby-codec/mtx/commands/uplink/getCorrectTime.js';
 *
 * // default parameters
 * const bytes = [0x03, 0x00, 0x03, 0x01, 0x0a, 0x00, 0x04, 0x01, 0x01];
 *
 * // decoded payload
 * const parameters = getCorrectTime.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     monthTransitionSummer: 3,
 *     dateTransitionSummer: 0,
 *     hoursTransitionSummer: 3,
 *     hoursCorrectSummer: 1,
 *     monthTransitionWinter: 10,
 *     dateTransitionWinter: 0,
 *     hoursTransitionWinter: 4,
 *     hoursCorrectWinter: 1,
 *     isCorrectionNeeded: true
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetCorrectTime.md#response)
 */

import * as types from '../../types.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';
import {ITimeCorrectionParameters} from '../../utils/dateTime.js';
import * as command from '../../utils/command.js';
import {READ_ONLY} from '../../constants/accessLevels.js';


export const id: types.TCommandId = 0x3e;
export const name: types.TCommandName = 'getCorrectTime';
export const headerSize = 2;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const maxSize = 9;
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
            0x3e, 0x09,
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
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    return buffer.getTimeCorrectionParameters();
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: ITimeCorrectionParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    // body
    buffer.setTimeCorrectionParameters(parameters);

    return command.toBytes(id, buffer.data);
};
