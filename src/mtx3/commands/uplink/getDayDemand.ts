/**
 * Uplink command to get day energies `A+`, `R+`, `R-` by default or selected energies (`A+`, `R+`, `R-` or `A-`, `R+`, `R-`) for 4 tariffs (`T1`-`T4`) for date.
 *
 * The corresponding downlink command: `getDayDemand`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getDayDemand from 'jooby-codec/mtx3/commands/uplink/getDayDemand.js';
 *
 * // default A+, R+, R- energies
 * const bytes = [
 *     0x18, 0x03, 0x16, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x00, 0x61, 0xa8, 0x00, 0x0f, 0x12, 0x06, 0x00,
 *     0x32, 0xe0, 0x64, 0x00, 0x12, 0xd6, 0x87, 0x00, 0x09, 0xfb, 0xf1, 0x00, 0x00, 0x3a, 0x98, 0x00,
 *     0x0c, 0x0b, 0xd0, 0x00, 0x01, 0xe2, 0x40, 0x00, 0x20, 0xbd, 0x57, 0x00, 0x96, 0xb4, 0x3f, 0x00,
 *     0x0c, 0x0a, 0x14
 * ];
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
 *     energies: {
 *         wh: [40301230, 3334244, 15000, 2145623],
 *         vari: [25000, 1234567, 789456, 9876543],
 *         vare: [987654, 654321, 123456, 789012]
 *     }
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx3/commands/GetDayDemand.md#response)
 */

import * as command from '../../../mtx1/utils/command.js';
import * as types from '../../types.js';
import {READ_ONLY} from '../../../mtx1/constants/accessLevels.js';
import * as dlms from '../../constants/dlms.js';
import mapEnergiesToObisCodes from '../../utils/mapEnergiesToObisCodes.js';
import CommandBinaryBuffer, {
    getPackedEnergiesWithDateSize,
    ICommandBinaryBuffer,
    IPackedEnergiesWithType,
    PACKED_ENERGY_TYPE_SIZE
} from '../../utils/CommandBinaryBuffer.js';
import {A_PLUS_R_PLUS_R_MINUS} from '../../constants/energyTypes.js';


interface IGetDayDemandResponseParameters extends IPackedEnergiesWithType {
    date: types.IDate
}


/** fixed size only for parameters without `energyType` parameter  */
const COMMAND_SIZE = 51;
const MAX_COMMAND_SIZE = COMMAND_SIZE + PACKED_ENERGY_TYPE_SIZE;


export const id: types.TCommandId = 0x16;
export const name: types.TCommandName = 'getDayDemand';
export const headerSize = 2;
export const maxSize = MAX_COMMAND_SIZE;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'default A+, R+, R- energies': {
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
            energies: {
                wh: [40301230, 3334244, 15000, 2145623],
                vari: [25000, 1234567, 789456, 9876543],
                vare: [987654, 654321, 123456, 789012]
            }
        },
        bytes: [
            0x16, 0x33,
            0x18, 0x03, 0x16, // date
            0x02, 0x66, 0xf2, 0xae, 0x00, 0x00, 0x61, 0xa8, 0x00, 0x0f, 0x12, 0x06, // tariff 1
            0x00, 0x32, 0xe0, 0x64, 0x00, 0x12, 0xd6, 0x87, 0x00, 0x09, 0xfb, 0xf1, // tariff 2
            0x00, 0x00, 0x3a, 0x98, 0x00, 0x0c, 0x0b, 0xd0, 0x00, 0x01, 0xe2, 0x40, // tariff 3
            0x00, 0x20, 0xbd, 0x57, 0x00, 0x96, 0xb4, 0x3f, 0x00, 0x0c, 0x0a, 0x14 // tariff 4
        ]
    },
    'received A-, R+, R- energies by T1, T4 only': {
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
            energies: {
                wh: [40301230, null, null, 2145623],
                vari: [25000, null, null, 9876543],
                vare: [987654, null, null, 789012]
            }
        },
        bytes: [
            0x16, 0x1c,
            0x18, 0x03, 0x16, // date
            0x92, // energy type and tariffs mask
            0x02, 0x66, 0xf2, 0xae, 0x00, 0x00, 0x61, 0xa8, 0x00, 0x0f, 0x12, 0x06, // tariff 1
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
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(getPackedEnergiesWithDateSize(parameters));

    // body
    buffer.setDate(parameters.date);
    buffer.setPackedEnergyWithType(parameters);

    return command.toBytes(id, buffer.data);
};


export const toJson = ( parameters: IGetDayDemandResponseParameters, options: dlms.IJsonOptions = dlms.defaultJsonOptions ) => {
    if ( !options.dlms ) {
        return JSON.stringify(parameters);
    }

    const {date, energyType, energies} = parameters;

    return JSON.stringify({
        date,
        ...mapEnergiesToObisCodes(energies, options.isGreen, energyType ?? A_PLUS_R_PLUS_R_MINUS)
    });
};
