/**
 * Uplink command to get active energy for a previous day by 4 tariffs (`T1`-`T4`).
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getEnergyDayPrevious from 'jooby-codec/mtx/commands/uplink/getEnergyDayPrevious.js';
 *
 * // simple response
 * const bytes = [0x18, 0x03, 0x16, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x32, 0xe0, 0x64, 0x00, 0x00, 0x09, 0x1d, 0x00, 0x20, 0xbd, 0x57];
 *
 * // decoded payload
 * const parameters = getEnergyDayPrevious.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     date: {
 *         year: 24,
 *         month: 3,
 *         date: 22
 *     },
 *     energies: [40301230, 3334244, 2333, 2145623]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetEnergyDayPrevious.md#response)
 */

import * as types from '../../types.js';
import * as command from '../../utils/command.js';
import CommandBinaryBuffer, {IEnergies, ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';
import {READ_ONLY} from '../../constants/accessLevels.js';


interface IGetEnergyDayPreviousResponseParameters {
    date: types.IDate,
    energies: IEnergies
}


const TARIFF_NUMBER = 4;

const convertAPlusEnergyToObis = ( tariff: number = 0 ) => '1.8.x'.replace('x', tariff.toString(10));

const convertEnergiesToDlms = ( energy: IEnergies ) => {
    const dlms: Record<string, number> = {};

    for ( let tariff = 0; tariff < TARIFF_NUMBER; tariff++ ) {
        const value = energy[tariff];

        if ( value || value === 0 ) {
            dlms[convertAPlusEnergyToObis(tariff + 1)] = value;
        }
    }

    return dlms;
};


export const id: types.TCommandId = 0x03;
export const name: types.TCommandName = 'getEnergyDayPrevious';
export const headerSize = 2;
export const maxSize = 19;
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
            date: {
                year: 24,
                month: 3,
                date: 22
            },
            energies: [40301230, 3334244, 2333, 2145623]
        },
        bytes: [
            0x03, 0x13,
            0x18, 0x03, 0x16, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x32, 0xe0, 0x64, 0x00, 0x00, 0x09, 0x1d, 0x00, 0x20, 0xbd, 0x57
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetEnergyDayPreviousResponseParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    return {
        date: buffer.getDate(),
        energies: buffer.getEnergies()
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetEnergyDayPreviousResponseParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    // body
    buffer.setDate(parameters.date);
    buffer.setEnergies(parameters.energies);

    return command.toBytes(id, buffer.data);
};


export const toJson = ( parameters: IGetEnergyDayPreviousResponseParameters, {dlms}: command.IDlmsJsonOptions = command.defaultDlmsJsonOptions ) => {
    const {date, energies} = parameters;
    const result = dlms
        ? {
            date,
            ...convertEnergiesToDlms(energies)
        }
        : parameters;

    return JSON.stringify(result);
};
