/**
 * Uplink command to get energies (`A-` for `MTX1` and `A-`, `R+`, `R-` (`II` - `III` quadrant) for `MTX3`) for 4 tariffs (`T1`-`T4`) for a given month.
 *
 * The corresponding downlink command: `getMonthDemandExport`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getMonthDemandExport from 'jooby-codec/mtx3/commands/uplink/getMonthDemandExport.js';
 *
 * // received energies
 * const bytes = [
 *     0x02, 0x66, 0xf2, 0xae, 0x00, 0x00, 0x61, 0xa8, 0x00, 0x0f, 0x12, 0x06,
 *     0x00, 0x32, 0xe0, 0x64, 0x00, 0x12, 0xd6, 0x87, 0x00, 0x09, 0xfb, 0xf1,
 *     0x00, 0x00, 0x3a, 0x98, 0x00, 0x0c, 0x0b, 0xd0, 0x00, 0x01, 0xe2, 0x40,
 *     0x00, 0x20, 0xbd, 0x57, 0x00, 0x96, 0xb4, 0x3f, 0x00, 0x0c, 0x0a, 0x14
 * ];
 *
 * // decoded payload
 * const parameters = getMonthDemandExport.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     wh: [40301230, 3334244, 15000, 2145623],
 *     vari: [25000, 1234567, 789456, 9876543],
 *     vare: [987654, 654321, 123456, 789012]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx3/commands/GetMonthDemandExport.md#response)
 */

import * as command from '../../../mtx/utils/command.js';
import * as types from '../../types.js';
import {READ_ONLY} from '../../../mtx/constants/accessLevels.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, IEnergies} from '../../utils/CommandBinaryBuffer.js';


export const id: types.TCommandId = 0x52;
export const name: types.TCommandName = 'getMonthDemandExport';
export const headerSize = 2;
export const maxSize = 48;
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
            wh: [40301230, 3334244, 15000, 2145623],
            vari: [25000, 1234567, 789456, 9876543],
            vare: [987654, 654321, 123456, 789012]
        },
        bytes: [
            0x52, 0x30,
            0x02, 0x66, 0xf2, 0xae, 0x00, 0x00, 0x61, 0xa8, 0x00, 0x0f, 0x12, 0x06, // tariff 1
            0x00, 0x32, 0xe0, 0x64, 0x00, 0x12, 0xd6, 0x87, 0x00, 0x09, 0xfb, 0xf1, // tariff 2
            0x00, 0x00, 0x3a, 0x98, 0x00, 0x0c, 0x0b, 0xd0, 0x00, 0x01, 0xe2, 0x40, // tariff 3
            0x00, 0x20, 0xbd, 0x57, 0x00, 0x96, 0xb4, 0x3f, 0x00, 0x0c, 0x0a, 0x14 // tariff 4
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IEnergies => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    return buffer.getEnergies();
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IEnergies ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    buffer.setEnergies(parameters);

    return command.toBytes(id, buffer.data);
};
