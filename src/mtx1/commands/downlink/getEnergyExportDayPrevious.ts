/**
 * Downlink command to get active energy for a previous day by 4 tariffs (`T1`-`T4`).
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getEnergyExportDayPrevious from 'jooby-codec/mtx1/commands/downlink/getEnergyExportDayPrevious.js';
 *
 * const bytes = getEnergyExportDayPrevious.toBytes();
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [80, 0]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetEnergyExportDayPrevious.md#request)
 */

import * as types from '../../types.js';
import * as command from '../../utils/command.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import * as energyTypes from '../../constants/energyTypes.js';
import {getEnergyExportDayPrevious as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


interface IGetEnergyExportDayPreviousParameters {
    energyType?: types.TEnergyType
}

const MIN_COMMAND_SIZE = 0;
const MAX_COMMAND_SIZE = 1;

export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = MAX_COMMAND_SIZE;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'simple request': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {},
        bytes: [
            0x50, 0x00
        ]
    },
    'request A- energy': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            energyType: energyTypes.A_MINUS
        },
        bytes: [
            0x50, 0x01,
            0x02
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetEnergyExportDayPreviousParameters => {
    const {length} = bytes;

    if ( length !== MAX_COMMAND_SIZE && length !== MIN_COMMAND_SIZE ) {
        throw new Error(`Wrong buffer size: ${bytes.length}.`);
    }

    if ( length === MAX_COMMAND_SIZE ) {
        return {energyType: bytes[0]};
    }

    // no parameters to decode
    return {};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetEnergyExportDayPreviousParameters ): types.TBytes => {
    if ( parameters.energyType ) {
        return command.toBytes(id, [parameters.energyType]);
    }

    return command.toBytes(id);
};
