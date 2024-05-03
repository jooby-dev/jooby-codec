/**
 * Uplink command to get day max power by 4 tariffs (T1-T4).
 *
 * **This command can be transmitted only via Lora.**
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getDayMaxPower from 'jooby-codec/mtx/commands/uplink/getDayMaxPower.js';
 *
 * const bytes = [0x2a, 0x43, 0x11, 0x11, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00, 0x20, 0x00];
 * const command = getDayMaxPower.fromBytes(bytes);
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
import CommandBinaryBuffer, {ICommandBinaryBuffer, TTariffsPowerMax, TARIFF_NUMBER} from '../../utils/LoraCommandBinaryBuffer.js';
import {UNENCRYPTED} from '../../constants/accessLevels.js';


interface IGetDayMaxPowerResponseParameters {
    date: types.IDate,
    tariffs: TTariffsPowerMax
}


const DATE_SIZE = 3; // year, month, date
const MAX_TARIFFS_ENERGIES_SIZE = 5 * 4 * (1 + 1 + 4); // 5 energy types, 4 tariffs, 1 hours, 1 minutes, 4 bytes - energy value

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
            for ( const [energy, value] of Object.entries(tariffEnergies) ) {
                if ( value || value === 0 ) {
                    dlms[convertEnergyToObis(energy, tariff + 1)] = value;
                }
            }
        }
    }

    return dlms;
};


export const id: types.TCommandId = 0x79;
export const name: types.TCommandName = 'getDayMaxPower';
export const headerSize = 2;
export const maxSize = DATE_SIZE + MAX_TARIFFS_ENERGIES_SIZE;
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
                }
            ]
        },
        bytes: [
            0x79, 0x10,
            0x2a, 0x43, 0x11, 0x11, 0x02, 0x03, 0x00, 0x00, 0x10, 0x00, 0x04, 0x05, 0x00, 0x00, 0x20, 0x00
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( bytes: types.TBytes ): IGetDayMaxPowerResponseParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    return {
        date: buffer.getDate(),
        tariffs: buffer.getTariffsPowerMax()
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - parameters to encode
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetDayMaxPowerResponseParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    // body
    buffer.setDate(parameters.date);
    buffer.setTariffsPowerMax(parameters.tariffs);

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
