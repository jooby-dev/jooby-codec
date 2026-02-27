/**
 * Uplink command to get max power of active energy (A+) for 4 tariffs (`T1`-`T4`) for a given month.
 *
 * The corresponding downlink command: `getMonthMaxDemand`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getMonthMaxDemand from 'jooby-codec/mtx1/commands/uplink/getMonthMaxDemand.js';
 *
 * // received max power
 * const bytes = [
 *     0x18, 0x03,
 *     0x16, 0x0c, 0x30, 0x00, 0x00, 0x09, 0x78
 *     0x0c, 0x0c, 0x21, 0x00, 0x00, 0x0e, 0x3c
 *     0x19, 0x0f, 0x04, 0x00, 0x00, 0x04, 0xdc
 *     0x08, 0x11, 0x20, 0x00, 0x00, 0x14, 0x7c
 * ];
 *
 * // decoded payload
 * const parameters = getMonthMaxDemand.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     year: 24,
 *     month: 3,
 *     tariffs: [
 *         {
 *             date: 22,
 *             hours: 12,
 *             minutes: 48,
 *             power: 2424
 *         },
 *         {
 *             date: 12,
 *             hours: 12,
 *             minutes: 33,
 *             power: 3644
 *         },
 *         {
 *             date: 25,
 *             hours: 15,
 *             minutes: 4,
 *             power: 1244
 *         },
 *         {
 *             date: 8,
 *             hours: 17,
 *             minutes: 32,
 *             power: 5244
 *         }
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetMonthMaxDemand.md#response)
 */

import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import * as command from '../../utils/command.js';
import {
    IMonthMaxPower,
    TARIFF_NUMBER,
    getMonthMaxPowerByTariffs,
    setMonthMaxPowerByTariffs
} from '../../utils/binary/buffer.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {getMonthMaxDemand as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


interface IGetMonthDemandResponseParameters {
    year: types.TYear2000,
    month: types.TMonth,
    tariffs: Array<IMonthMaxPower>
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const maxSize = 2 + TARIFF_NUMBER * 7;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'response max power for 2024.03': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            year: 24,
            month: 3,
            tariffs: [
                {
                    date: 22,
                    hours: 12,
                    minutes: 48,
                    power: 2424
                },
                {
                    date: 12,
                    hours: 12,
                    minutes: 33,
                    power: 3644
                },
                {
                    date: 25,
                    hours: 15,
                    minutes: 4,
                    power: 1244
                },
                {
                    date: 8,
                    hours: 17,
                    minutes: 32,
                    power: 5244
                }
            ]
        },
        bytes: [
            0x32, 0x1e,
            0x18, 0x03,
            0x16, 0x0c, 0x30, 0x00, 0x00, 0x09, 0x78,
            0x0c, 0x0c, 0x21, 0x00, 0x00, 0x0e, 0x3c,
            0x19, 0x0f, 0x04, 0x00, 0x00, 0x04, 0xdc,
            0x08, 0x11, 0x20, 0x00, 0x00, 0x14, 0x7c
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetMonthDemandResponseParameters => {
    validateCommandPayload(name, bytes, maxSize);

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return {
        year: buffer.getUint8() as unknown as types.TYear2000,
        month: buffer.getUint8() as unknown as types.TMonth,
        tariffs: getMonthMaxPowerByTariffs(buffer)
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetMonthDemandResponseParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    // body
    buffer.setUint8(parameters.year as unknown as types.TUint8);
    buffer.setUint8(parameters.month as unknown as types.TUint8);
    setMonthMaxPowerByTariffs(buffer, parameters.tariffs);

    return command.toBytes(id, buffer.data);
};
