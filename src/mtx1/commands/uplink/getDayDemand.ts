/**
 * Uplink command to get day active energy (`A+`) by default or selected active energy (`A+` or `A-`) for 4 tariffs (`T1`-`T4`) for date.
 *
 * The corresponding downlink command: `getDayDemand`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getDayDemand from 'jooby-codec/mtx1/commands/uplink/getDayDemand.js';
 *
 * // received A- energies
 * const bytes = [0x18, 0x03, 0x16, 0xd0, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x00, 0x09, 0x1d, 0x00, 0x20, 0xbd, 0x57];
 *
 * // decoded payload
 * const parameters = getDayDemand.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     date: {
 *         year: 24,
 *         month: 3,
 *         date: 22
 *     },
 *     energyType: 2,
 *     energies: [40301230, null, 2333, 2145623]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetDayDemand.md#response)
 */

import * as types from '../../types.js';
import * as command from '../../utils/command.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import CommandBinaryBuffer, {
    ICommandBinaryBuffer,
    IPackedEnergiesWithType,
    PACKED_ENERGY_TYPE_SIZE,
    DATE_SIZE,
    ENERGY_SIZE,
    TARIFF_NUMBER
} from '../../utils/CommandBinaryBuffer.js';
import getObisByEnergy from '../../utils/getObisByEnergy.js';
import {getDayDemand as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


interface IGetDayDemandResponseParameters extends IPackedEnergiesWithType {
    date: types.IDate
}


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
    'default A+ energy': {
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
            0x16, 0x13,
            0x18, 0x03, 0x16, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x32, 0xe0, 0x64, 0x00, 0x00, 0x09, 0x1d, 0x00, 0x20, 0xbd, 0x57
        ]
    },
    'received A- energies': {
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
            energies: [40301230, null, 2333, 2145623]
        },
        bytes: [
            0x16, 0x10,
            0x18, 0x03, 0x16, 0xd2, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x00, 0x09, 0x1d, 0x00, 0x20, 0xbd, 0x57
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetDayDemandResponseParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);
    let parameters: IGetDayDemandResponseParameters;

    if ( bytes.length === COMMAND_SIZE ) {
        parameters = {
            date: buffer.getDate(),
            energies: buffer.getEnergies()
        };
    } else {
        parameters = {
            date: buffer.getDate(),
            ...buffer.getPackedEnergyWithType()
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
export const toBytes = ( parameters: IGetDayDemandResponseParameters ): types.TBytes => {
    let size = COMMAND_SIZE;

    if ( parameters?.energyType ) {
        const energiesNumber = parameters.energies.filter(energy => energy !== null).length;
        size = DATE_SIZE + PACKED_ENERGY_TYPE_SIZE + (energiesNumber * ENERGY_SIZE);
    }

    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(size);

    // body
    buffer.setDate(parameters.date);
    buffer.setPackedEnergyWithType(parameters);

    return command.toBytes(id, buffer.data);
};


export const toJson = ( parameters: IGetDayDemandResponseParameters, {dlms}: command.IDlmsJsonOptions = command.defaultDlmsJsonOptions ) => {
    if ( !dlms ) {
        return JSON.stringify(parameters);
    }

    const {date, energyType, energies} = parameters;
    const result: Record<string, types.TUint32> = {};

    for ( let i = 0; i < TARIFF_NUMBER; i += 1 ) {
        if ( energies[i] || energies[i] === 0 ) {
            result[getObisByEnergy(energyType, i + 1)] = energies[i];
        }
    }

    return JSON.stringify({
        date,
        ...result
    });
};
