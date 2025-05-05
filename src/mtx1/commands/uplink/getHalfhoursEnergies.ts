/**
 * Uplink command to get halfhours energies by 4 tariffs (`T1`-`T4`).
 *
 * **This command can be transmitted only via Lora.**
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getHalfhoursEnergies from 'jooby-codec/mtx1/commands/uplink/getHalfhoursEnergies.js';
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
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetHalfhoursEnergies.md#response)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, THalfhoursEnergies, TARIFF_NUMBER} from '../../utils/LoraCommandBinaryBuffer.js';
import {UNENCRYPTED} from '../../constants/accessLevels.js';
import {getHalfhoursEnergies as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export interface IGetHalfhoursEnergiesResponseParameters {
    date: types.IDate;
    firstHalfhour: number;
    halfhoursNumber: number;
    energies: THalfhoursEnergies;
}


const DATE_SIZE = 2;
const ENERGY_FLAGS_SIZE = 1;
const START_HALFHOUR_SIZE = 1;
const HALFHOURS_NUMBER_SIZE = 1;
const MAX_HALFHOURS_ENERGY_SIZE = 247; // 6 * n * 2 * 3 <= 247 (6 energy types, n - halfhours number, 2 bytes - energy value, 3 channels)

const energiesToObis: Record<string, string> = {
    'A+': '1.5.x',
    'A+R+': '3.5.x',
    'A+R-': '4.5.x',
    'A-': '2.5.x',
    'A-R+': '6.5.x',
    'A-R-': '7.5.x'
};

const convertEnergyToObis = ( energy: string, tariff: number = 0 ) => {
    const obis = energiesToObis[energy];

    return obis ? obis.replace('x', tariff.toString(10)) : '';
};

const convertHalfhoursEnergiesToDlms = ( energies: THalfhoursEnergies ) => {
    const dlms: Record<string, number> = {};

    Object.keys(energies).forEach(energy => {
        const values = energies[energy];

        for ( let tariff = 0; tariff < TARIFF_NUMBER; tariff++ ) {
            const value = (values as Array<number | undefined>)[tariff];

            if ( value || value === 0 ) {
                dlms[convertEnergyToObis(energy, tariff + 1)] = value;
            }
        }
    });

    return dlms;
};


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = DATE_SIZE + ENERGY_FLAGS_SIZE + START_HALFHOUR_SIZE + HALFHOURS_NUMBER_SIZE + MAX_HALFHOURS_ENERGY_SIZE;
export const accessLevel: types.TAccessLevel = UNENCRYPTED;
export const isLoraOnly = true;

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
                'A+': [
                    {tariff: 1, energy: 0},
                    {tariff: 2, energy: 47}
                ],
                'A-R+': [
                    {tariff: 1, energy: 1234},
                    {tariff: 2, energy: 12345}
                ]
            }
        },
        bytes: [
            0x6f, 0x0d,
            // date
            0x2a, 0x43, 0x11,
            0x01, 0x02,
            // A+
            0x40, 0x00,
            0x80, 0x2f,
            // A-R+
            0x44, 0xd2,
            0xb0, 0x39
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
        energies: buffer.getHalfhoursEnergies(energiesFlags, halfhoursNumber)
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
    buffer.setHalfhoursEnergies(energies);

    return command.toBytes(id, buffer.getBytesToOffset());
};


export const toJson = ( parameters: IGetHalfhoursEnergiesResponseParameters, {dlms}: command.IDlmsJsonOptions = command.defaultDlmsJsonOptions ) => {
    const {date, firstHalfhour, halfhoursNumber, energies} = parameters;
    const result = dlms
        ? {
            date,
            firstHalfhour,
            halfhoursNumber,
            ...convertHalfhoursEnergiesToDlms(energies)
        }
        : parameters;

    return JSON.stringify(result);
};
