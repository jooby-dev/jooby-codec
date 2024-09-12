/**
 * Uplink command to get season profile information for the given tariff table.
 *
 * The corresponding downlink command: `getSeasonProfile`.
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getSeasonProfile from 'jooby-codec/mtx1/commands/uplink/getSeasonProfile.js';
 *
 * // simple response
 * const bytes = [0x01, 0x02, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01, 0x00];
 *
 * // decoded payload
 * const parameters = getSeasonProfile.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     month: 1,
 *     date: 2,
 *     dayIndexes: [0, 1, 0, 1, 0, 1, 0]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetSeasonProfile.md#response)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, ISeasonProfile} from '../../utils/CommandBinaryBuffer.js';


export const id: types.TCommandId = 0x3c;
export const name: types.TCommandName = 'getSeasonProfile';
export const headerSize = 2;
export const maxSize = 9;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'simple response': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            month: 1,
            date: 2,
            dayIndexes: [0, 1, 0, 1, 0, 1, 0]
        },
        bytes: [
            0x3c, 0x09,
            0x01, 0x02, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01, 0x00
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( bytes: types.TBytes ): ISeasonProfile => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    return buffer.getSeasonProfile();
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: ISeasonProfile ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    buffer.setSeasonProfile(parameters);

    return command.toBytes(id, buffer.data);
};
