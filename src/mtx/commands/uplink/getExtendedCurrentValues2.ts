/**
 * Uplink command to get get additional current parameters.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getExtendedCurrentValues2 from 'jooby-codec/mtx/commands/uplink/getExtendedCurrentValues2.js';
 *
 * // simple response
 * const bytes = [0x01, 0x66, 0x61, 0x21, 0x59, 0x0a, 0x81];
 *
 * // decoded payload
 * const parameters = getExtendedCurrentValues2.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     uBattery: 358,
 *     relayStatus: {
 *         RELAY_STATE: true,
 *         RELAY_UBAD: false,
 *         RELAY_UNEQ_CURRENT: false,
 *         RELAY_OFF_CENTER: true,
 *         RELAY_IMAX: true,
 *         RELAY_PMAX: false
 *     },
 *     relayStatus2: {
 *         RELAY_COSFI: true,
 *         RELAY_SALDO_OFF_FLAG: false,
 *         RELAY_UNEQUIL_CURRENT_OFF: false,
 *         RELAY_BIPOLAR_POWER_OFF: false,
 *         RELAY_SALDO_OFF_ON_MAX_POWER: false,
 *         RELAY_HARD_ST1: true
 *     },
 *     status1: {
 *         MAXVA: true,
 *         MINVA: false,
 *         MAXT: false,
 *         MINT: true,
 *         MAXF: true,
 *         MINF: false,
 *         MAXIA: true,
 *         MAXP: false
 *     },
 *     status2: {
 *         MAX_POWER_SALDO: false,
 *         BATTERY_VBAT_BAD: true,
 *         CLOCK_UNSET: true,
 *         MIN_COS_FI: false
 *     },
 *     status3: {
 *         UNEQUIL_CURRENT: true,
 *         BIPOLAR_POWER: false,
 *         POWER_A_NEGATIVE: false,
 *         POWER_B_NEGATIVE: true
 *     }
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetExtendedCurrentValues2.md#response)
 */

import * as command from '../../utils/command.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, IExtendedCurrentValues2Parameters} from '../../utils/CommandBinaryBuffer.js';
import * as types from '../../types.js';
import {READ_ONLY} from '../../constants/accessLevels.js';


export const id: types.TCommandId = 0x2d;
export const name: types.TCommandName = 'getExtendedCurrentValues2';
export const headerSize = 2;
export const maxSize = 7;
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
            uBattery: 358,
            relayStatus: {
                RELAY_STATE: true,
                RELAY_UBAD: false,
                RELAY_UNEQ_CURRENT: false,
                RELAY_OFF_CENTER: true,
                RELAY_IMAX: true,
                RELAY_PMAX: false
            },
            relayStatus2: {
                RELAY_COSFI: true,
                RELAY_SALDO_OFF_FLAG: false,
                RELAY_UNEQUIL_CURRENT_OFF: false,
                RELAY_BIPOLAR_POWER_OFF: false,
                RELAY_SALDO_OFF_ON_MAX_POWER: false,
                RELAY_HARD_ST1: true
            },
            status1: {
                MAXVA: true,
                MINVA: false,
                MAXT: false,
                MINT: true,
                MAXF: true,
                MINF: false,
                MAXIA: true,
                MAXP: false
            },
            status2: {
                MAX_POWER_SALDO: false,
                BATTERY_VBAT_BAD: true,
                CLOCK_UNSET: true,
                MIN_COS_FI: false
            },
            status3: {
                UNEQUIL_CURRENT: true,
                BIPOLAR_POWER: false,
                POWER_A_NEGATIVE: false,
                POWER_B_NEGATIVE: true
            }
        },
        bytes: [
            0x2d, 0x07,
            0x01, 0x66, 0x61, 0x21, 0x59, 0x0a, 0x81
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): IExtendedCurrentValues2Parameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(data);

    return buffer.getExtendedCurrentValues2();
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IExtendedCurrentValues2Parameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    // body
    buffer.setExtendedCurrentValues2(parameters);

    return command.toBytes(id, buffer.data);
};
