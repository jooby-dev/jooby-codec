/**
 * Uplink command to get day max power by 4 tariffs (`T1`-`T4`).
 *
 * **This command can be transmitted only via Lora.**
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getDayMaxPower from 'jooby-codec/mtx1/commands/uplink/getDayMaxPower.js';
 *
 * // response to getDayMaxPower downlink command
 * const bytes = [0x2a, 0x43, 0x11, 0x44, 0x02, 0x03, 0x00, 0x00, 0x10, 0x00, 0x04, 0x05, 0x00, 0x00, 0x20, 0x00];
 *
 * // decoded payload
 * const parameters = getDayMaxPower.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     date: {
 *         year: 21,
 *         month: 2,
 *         date: 3
 *     },
 *     tariffs: [
 *         null,
 *         null,
 *         {
 *             'A+': {
 *                 hours: 2,
 *                 minutes: 3,
 *                 power: 0x1000
 *             },
 *             'A-R+': {
 *                 hours: 4,
 *                 minutes: 5,
 *                 power: 0x2000
 *             }
 *         },
 *         null
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetDayMaxPower.md#response)
 */

import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import * as command from '../../utils/command.js';
import {
    TTariffsPowerMax,
    TARIFF_NUMBER,
    getTariffsPowerMax,
    setTariffsPowerMax,
    getDate,
    setDate
} from '../../utils/LoraCommandBinaryBuffer.js';
import {UNENCRYPTED} from '../../constants/accessLevels.js';
import {getDayMaxPower as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


interface IGetDayMaxPowerResponseParameters {
    date: types.IDate,
    tariffs: TTariffsPowerMax
}


const DATE_SIZE = 2;
const ENERGY_FLAGS_SIZE = 1;
const TARIFF_FLAGS_SIZE = 1;
const MAX_TARIFFS_ENERGIES_SIZE = 6 * 4 * (1 + 1 + 4); // 6 energy types, 4 tariffs, 1 hours, 1 minutes, 4 bytes - energy value

const energiesToObis: Record<string, string> = {
    'A+': '1.6.x',
    'A+R+': '3.6.x',
    'A+R-': '4.6.x',
    'A-': '2.6.x',
    'A-R+': '7.6.x',
    'A-R-': '8.6.x'
};

const convertEnergyToObis = ( energy: string, tariff: number = 0 ) => {
    const obis = energiesToObis[energy];

    return obis ? obis.replace('x', tariff.toString(10)) : '';
};

const convertTariffsPowerMaxToDlms = ( energies: TTariffsPowerMax ) => {
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
    'get day max power': {
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
            tariffs: [
                null,
                null,
                {
                    'A+': {
                        hours: 2,
                        minutes: 3,
                        power: 0x1000
                    },
                    'A-R+': {
                        hours: 4,
                        minutes: 5,
                        power: 0x2000
                    }
                },
                null
            ]
        },
        bytes: [
            0x79, 0x10,
            0x2a, 0x43, 0x11, 0x44, 0x02, 0x03, 0x00, 0x00, 0x10, 0x00, 0x04, 0x05, 0x00, 0x00, 0x20, 0x00
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetDayMaxPowerResponseParameters => {
    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return {
        date: getDate(buffer),
        tariffs: getTariffsPowerMax(buffer)
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - parameters to encode
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetDayMaxPowerResponseParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    // body
    setDate(buffer, parameters.date);
    setTariffsPowerMax(buffer, parameters.tariffs);

    return command.toBytes(id, buffer.getBytesToOffset());
};


export const toJson = ( parameters: IGetDayMaxPowerResponseParameters, {dlms}: command.IDlmsJsonOptions = command.defaultDlmsJsonOptions ) => {
    const {date, tariffs} = parameters;
    const result = dlms
        ? {
            date,
            ...convertTariffsPowerMaxToDlms(tariffs)
        }
        : parameters;

    return JSON.stringify(result);
};
