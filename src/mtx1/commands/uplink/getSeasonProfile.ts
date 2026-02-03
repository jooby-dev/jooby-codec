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
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {
    ISeasonProfile,
    getSeasonProfile,
    setSeasonProfile
} from '../../utils/CommandBinaryBuffer.js';
import {getSeasonProfile as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
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
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): ISeasonProfile => {
    validateCommandPayload(name, bytes, maxSize);

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return getSeasonProfile(buffer);
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: ISeasonProfile ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    setSeasonProfile(buffer, parameters);

    return command.toBytes(id, buffer.data);
};
