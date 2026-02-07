/**
 * Downlink command to get power-off information for a specific year and month.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getQuality from 'jooby-codec/mtx1/commands/downlink/getQuality.js';
 *
 * const parameters = {
 *     year: 24,
 *     month: 3
 * };
 *
 * const bytes = getQuality.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [115, 2, 24, 3]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetQuality.md#request)
 */

import * as types from '../../types.js';
import * as command from '../../utils/command.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {getQuality as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


interface IGetQualityParameters {
    year: types.TYear2000,
    month: types.TMonth
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 2;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'power-off information for 2026.01': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            year: 26,
            month: 1
        },
        bytes: [
            0x73, 0x02,
            0x1a, 0x01
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetQualityParameters => {
    validateCommandPayload(name, bytes, maxSize);

    const [year, month] = bytes;

    return {year, month};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( {year, month}: IGetQualityParameters ): types.TBytes => (
    command.toBytes(id, [year, month])
);
