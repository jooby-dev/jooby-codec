/**
 * Uplink command to get day energies by 4 tariffs (T1-T4).
 *
 * This command can be transmitted only via Lora.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getDayEnergies from 'jooby-codec/mtx/commands/uplink/getDayEnergies.js';
 *
 * const bytes = [0x2a, 0x43, 0x11, 0x11, 0x10, 0x00, 0x20, 0x00];
 * const command = getDayEnergies.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     date: {
 *         year: 21,
 *         month: 2,
 *         date: 3
 *     },
 *     energies: [
 *          {
 *              'A+': 0x1000,
 *              'A-R+': 0x2000
 *          }
 *     ]
 * }
 * ```
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, TTariffsEnergies} from '../../utils/LoraCommandBinaryBuffer.js';
import {UNENCRYPTED} from '../../constants/accessLevels.js';


interface IGetDayEnergiesResponseParameters {
    date: types.IDate,
    energies: TTariffsEnergies
}


const DATE_SIZE = 3; // year, month, date
const MAX_TARIFFS_ENERGIES_SIZE = 5 * 4 * 4; // 5 energy types, 4 tariffs, 4 bytes - energy value

export const id: types.TCommandId = 0x78;
export const name: types.TCommandName = 'getDayEnergies';
export const headerSize = 2;
export const maxSize = DATE_SIZE + MAX_TARIFFS_ENERGIES_SIZE;
export const accessLevel: types.TAccessLevel = UNENCRYPTED;
export const isLoraOnly = true;

export const examples: command.TCommandExamples = {
    'get day energies': {
        id,
        headerSize,
        name,
        maxSize,
        parameters: {
            date: {
                year: 21,
                month: 2,
                date: 3
            },
            energies: [
                {
                    'A+': 0x1000,
                    'A-R+': 0x2000
                }
            ]
        },
        bytes: [
            0x78, 0x08,
            0x2a, 0x43, 0x11, 0x11, 0x10, 0x00, 0x20, 0x00
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( bytes: types.TBytes ): IGetDayEnergiesResponseParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    return {
        date: buffer.getDate(),
        energies: buffer.getTariffsEnergies()
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - parameters to encode
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetDayEnergiesResponseParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    // body
    buffer.setDate(parameters.date);
    buffer.setTariffsEnergies(parameters.energies);

    return command.toBytes(id, buffer.getBytesToOffset());
};
