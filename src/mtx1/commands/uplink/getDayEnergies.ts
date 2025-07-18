/**
 * Uplink command to get day energies by 4 tariffs (`T1`-`T4`).
 *
 * **This command can be transmitted only via Lora.**
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getDayEnergies from 'jooby-codec/mtx1/commands/uplink/getDayEnergies.js';
 *
 * // response to getDayEnergies downlink command
 * const bytes = [0x2a, 0x43, 0x11, 0x22, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00, 0x20, 0x00];
 *
 * // decoded payload
 * const parameters = getDayEnergies.fromBytes(bytes);
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
 *         null,
 *         {
 *             'A+': 0x1000,
 *             'A-R+': 0x2000
 *         },
 *         null,
 *         null
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetDayEnergies.md)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {
    TTariffsEnergies,
    TARIFF_NUMBER,
    getTariffsEnergies,
    setTariffsEnergies,
    getDate,
    setDate
} from '../../utils/LoraCommandBinaryBuffer.js';
import {UNENCRYPTED} from '../../constants/accessLevels.js';
import {getDayEnergies as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


interface IGetDayEnergiesResponseParameters {
    date: types.IDate,
    energies: TTariffsEnergies
}


const DATE_SIZE = 2;
const ENERGY_FLAGS_SIZE = 1;
const TARIFF_FLAGS_SIZE = 1;
const MAX_TARIFFS_ENERGIES_SIZE = 6 * 4 * 4; // 6 energy types, 4 tariffs, 4 bytes - energy value


const energiesToObis: Record<string, string> = {
    'A+': '1.8.x',
    'A+R+': '3.8.x',
    'A+R-': '4.8.x',
    'A-': '2.8.x',
    'A-R+': '7.8.x',
    'A-R-': '8.8.x'
};

const convertEnergyToObis = ( energy: string, tariff: number = 0 ) => {
    const obis = energiesToObis[energy];

    return obis ? obis.replace('x', tariff.toString(10)) : '';
};

const convertTariffsEnergiesToDlms = ( energies: TTariffsEnergies ) => {
    const dlms: Record<string, number> = {};

    for ( let tariff = 0; tariff < TARIFF_NUMBER; tariff++ ) {
        const tariffEnergies = energies[tariff];

        if ( tariffEnergies ) {
            Object.keys(tariffEnergies).forEach(energy => {
                const value = tariffEnergies[energy];

                if ( value || value === 0 ) {
                    dlms[convertEnergyToObis(energy, tariff + 1)] = value;
                }
            });
        }
    }

    return dlms;
};


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = DATE_SIZE + ENERGY_FLAGS_SIZE + TARIFF_FLAGS_SIZE + MAX_TARIFFS_ENERGIES_SIZE;
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
                null,
                {
                    'A+': 0x1000,
                    'A-R+': 0x2000
                },
                null,
                null
            ]
        },
        bytes: [
            0x78, 0x0c,
            0x2a, 0x43, 0x11, 0x22, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00, 0x20, 0x00
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetDayEnergiesResponseParameters => {
    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return {
        date: getDate(buffer),
        energies: getTariffsEnergies(buffer)
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - parameters to encode
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetDayEnergiesResponseParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    // body
    setDate(buffer, parameters.date);
    setTariffsEnergies(buffer, parameters.energies);

    return command.toBytes(id, buffer.getBytesToOffset());
};


export const toJson = ( parameters: IGetDayEnergiesResponseParameters, {dlms}: command.IDlmsJsonOptions = command.defaultDlmsJsonOptions ) => {
    const {date, energies} = parameters;
    const result = dlms
        ? {
            date,
            ...convertTariffsEnergiesToDlms(energies)
        }
        : parameters;

    return JSON.stringify(result);
};
