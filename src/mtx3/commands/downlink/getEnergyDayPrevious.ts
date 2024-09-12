/**
 * Downlink command to get energies `A+`, `R+`, `R-` by default or selected energies (`A+`, `R+`, `R-` or `A-`, `R+`, `R-`) for a previous day by 4 tariffs (`T1`-`T4`).
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getEnergyDayPrevious from 'jooby-codec/mtx3/commands/downlink/getEnergyDayPrevious.js';
 *
 * const bytes = getEnergyDayPrevious.toBytes();
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [3, 0]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx3/commands/GetEnergyDayPrevious.md#request)
 */

import * as command from '../../../mtx1/utils/command.js';
import * as types from '../../types.js';
import {READ_ONLY} from '../../../mtx1/constants/accessLevels.js';
import * as energyTypes from '../../constants/energyTypes.js';


interface IGetEnergyDayPreviousParameters {
    energyType?: types.TEnergyType
}

const MIN_COMMAND_SIZE = 0;
const MAX_COMMAND_SIZE = 1;

export const id: types.TCommandId = 0x03;
export const name: types.TCommandName = 'getEnergyDayPrevious';
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
            0x03, 0x00
        ]
    },
    'request A-R+R- energy': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            energyType: energyTypes.A_MINUS_R_PLUS_R_MINUS
        },
        bytes: [
            0x03, 0x01,
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
export const fromBytes = ( bytes: types.TBytes ): IGetEnergyDayPreviousParameters => {
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
export const toBytes = ( parameters: IGetEnergyDayPreviousParameters ): types.TBytes => {
    if ( parameters.energyType ) {
        return command.toBytes(id, [parameters.energyType]);
    }

    return command.toBytes(id);
};
