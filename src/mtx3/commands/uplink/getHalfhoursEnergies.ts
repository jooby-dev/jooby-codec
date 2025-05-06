/**
 * Uplink command to get halfhours energies by 4 tariffs (`T1`-`T4`).
 *
 * **This command can be transmitted only via Lora.**
 *
 * Supported in MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getHalfhoursEnergies from 'jooby-codec/mtx3/commands/uplink/getHalfhoursEnergies.js';
 *
 * // response to getHalfhoursEnergies downlink command
 * const bytes = [0x2a, 0x43, 0x11, 0x01, 0x02, 0x40, 0x00, 0x80, 0x2f, 0x44, 0xd2, 0xb0, 0x39];
 *
 * // decoded payload
 * const parameters = getHalfhoursEnergies.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     date: {
 *         year: 21,
 *         month: 2,
 *         date: 3
 *     },
 *     firstHalfhour: 1,
 *     halfhoursNumber: 2,
 *     energies: {
 *         'A+': [
 *             {tariff: 1, energy: 0},
 *             {tariff: 2, energy: 47}
 *         ],
 *         'A-R+': [
 *             {tariff: 1, energy: 1234},
 *             {tariff: 2, energy: 12345}
 *         ]
 *     }
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx3/commands/GetHalfhoursEnergies.md#response)
 */

import * as command from '../../../mtx1/utils/command.js';
import * as types from '../../types.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, THalfhoursEnergies3} from '../../../mtx1/utils/LoraCommandBinaryBuffer.js';
import {
    id,
    name,
    headerSize,
    maxSize,
    accessLevel,
    isLoraOnly,
    toJson
} from '../../../mtx1/commands/uplink/getHalfhoursEnergies.js';


export interface IGetHalfhoursEnergiesResponseParameters {
    date: types.IDate;
    firstHalfhour: number;
    halfhoursNumber: number;
    energies: THalfhoursEnergies3;
}


export const examples: command.TCommandExamples = {
    'get halfhours energies': {
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
            firstHalfhour: 1,
            halfhoursNumber: 2,
            energies: {
                'A+': [0x1000, 0x2000],
                'A-R+': [0x3000, 0x4000]
            }
        },
        bytes: [
            0x6f, 0x0d,
            // date
            0x2a, 0x43, 0x11,
            0x01, 0x02,
            // A+
            0x10, 0x00, 0x20, 0x00,
            // A-R+
            0x30, 0x00, 0x40, 0x00
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( bytes: types.TBytes ): IGetHalfhoursEnergiesResponseParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);
    const date = buffer.getDate();
    const energiesFlags = buffer.getEnergiesFlags();
    const firstHalfhour = buffer.getUint8();
    const halfhoursNumber = buffer.getUint8();

    return {
        date,
        firstHalfhour,
        halfhoursNumber,
        energies: buffer.getHalfhoursEnergies3(energiesFlags, halfhoursNumber)
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - parameters to encode
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetHalfhoursEnergiesResponseParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);
    const {date, firstHalfhour, halfhoursNumber, energies} = parameters;

    buffer.setDate(date);
    buffer.setEnergiesFlags(energies);
    buffer.setUint8(firstHalfhour);
    buffer.setUint8(halfhoursNumber);
    buffer.setHalfhoursEnergies3(energies);

    return command.toBytes(id, buffer.getBytesToOffset());
};


export {
    id,
    name,
    headerSize,
    maxSize,
    accessLevel,
    isLoraOnly,
    toJson
};
