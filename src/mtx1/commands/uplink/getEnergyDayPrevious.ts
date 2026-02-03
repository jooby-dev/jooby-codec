/**
 * Uplink command to get active energy for a previous day by 4 tariffs (`T1`-`T4`).
 *
 * The corresponding downlink command: `getEnergyDayPrevious`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getEnergyDayPrevious from 'jooby-codec/mtx1/commands/uplink/getEnergyDayPrevious.js';
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
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetEnergyDayPrevious.md#response)
 */

import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import * as command from '../../utils/command.js';
import {
    IPackedEnergiesWithType,
    TEnergies,
    TARIFF_NUMBER,
    PACKED_ENERGY_TYPE_SIZE,
    getPackedEnergiesWithDateSize,
    getPackedEnergyWithType,
    setPackedEnergyWithType,
    getDate,
    setDate,
    getEnergies
} from '../../utils/CommandBinaryBuffer.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {getEnergyDayPrevious as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


interface IGetEnergyDayPreviousResponseParameters extends IPackedEnergiesWithType {
    date: types.IDate
}


const convertAPlusEnergyToObis = ( tariff: number = 0 ) => '1.8.x'.replace('x', tariff.toString(10));

const convertEnergiesToDlms = ( energy: TEnergies ) => {
    const dlms: Record<string, number> = {};

    for ( let tariff = 0; tariff < TARIFF_NUMBER; tariff++ ) {
        const value = energy[tariff];

        if ( value || value === 0 ) {
            dlms[convertAPlusEnergyToObis(tariff + 1)] = value;
        }
    }

    return dlms;
};

/** fixed size only for parameters without `energyType` parameter  */
const COMMAND_SIZE = 19;
const MAX_COMMAND_SIZE = COMMAND_SIZE + PACKED_ENERGY_TYPE_SIZE;

export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = MAX_COMMAND_SIZE;
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
    },
    'response with A- energy by T1, T4 only': {
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
            energyType: 2,
            energies: [40301230, null, null, 2145623]
        },
        bytes: [
            0x03, 0x0c,
            0x18, 0x03, 0x16, 0x92, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x20, 0xbd, 0x57
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
    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);
    let parameters: IGetEnergyDayPreviousResponseParameters;

    if ( bytes.length === COMMAND_SIZE ) {
        parameters = {
            date: getDate(buffer),
            energies: getEnergies(buffer)
        };
    } else {
        // new implementation
        parameters = {
            date: getDate(buffer),
            ...getPackedEnergyWithType(buffer)
        };
    }

    return parameters;
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetEnergyDayPreviousResponseParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(getPackedEnergiesWithDateSize(parameters), false);

    // body
    setDate(buffer, parameters.date);
    setPackedEnergyWithType(buffer, parameters);

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
