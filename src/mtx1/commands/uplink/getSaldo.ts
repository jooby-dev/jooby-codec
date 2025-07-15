/**
 * Uplink command to get device current saldo information.
 *
 * The corresponding downlink command: `getSaldo`.
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getSaldo from 'jooby-codec/mtx1/commands/uplink/getSaldo.js';
 *
 * // response to getSaldo downlink command
 * const bytes = [
 *     0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00,
 *     0x00, 0x04, 0x00, 0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0x07, 0x09, 0x17, 0x06, 0x23
 * ];
 *
 * // decoded payload
 * const parameters = getSaldo.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     currentSaldo: 1,
 *     count: 0,
 *     energy: [2, 3, 4, 5],
 *     beginSaldoOfPeriod: 7,
 *     date: {
 *         month: 9,
 *         date: 23,
 *         hours: 6,
 *         minutes: 35
 *     }
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetSaldo.md#response)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {getSaldo as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 29;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;


export interface IGetSaldoResponseParameters {
    /**
     * Current device saldo.
     */
    currentSaldo: types.TInt32,

    /**
     * Counter for saldo installations.
     */
    count: types.TUint8,

    /**
     * Energy for tariffs `1`-`4` at the moment of setting a new saldo.
     */
    energy: Array<types.TInt32>,

    /**
     * Current saldo after setting the saldo.
     */
    beginSaldoOfPeriod: types.TInt32,

    /**
     * Last saldo installations time.
     */
    date: {
        month: types.TMonth,
        date: types.TMonthDay,
        hours: types.TUint8,
        minutes: types.TUint8
    }
}


export const examples: command.TCommandExamples = {
    'test response': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            currentSaldo: 1,
            count: 0,
            energy: [2, 3, 4, 5],
            beginSaldoOfPeriod: 7,
            date: {
                month: 9,
                date: 23,
                hours: 6,
                minutes: 35
            }
        },
        bytes: [
            0x29, 0x1d,
            0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00,
            0x00, 0x04, 0x00, 0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0x07, 0x09, 0x17, 0x06, 0x23
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetSaldoResponseParameters => {
    if ( bytes.length !== maxSize ) {
        throw new Error('Invalid getSaldo data size.');
    }

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return {
        currentSaldo: buffer.getInt32(),
        count: buffer.getUint8(),
        energy: new Array(4).fill(0).map(() => buffer.getInt32()),
        beginSaldoOfPeriod: buffer.getInt32(),
        date: {
            month: buffer.getUint8() as unknown as types.TMonth,
            date: buffer.getUint8() as unknown as types.TMonthDay,
            hours: buffer.getUint8(),
            minutes: buffer.getUint8()
        }
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetSaldoResponseParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    buffer.setInt32(parameters.currentSaldo);
    buffer.setUint8(parameters.count);
    parameters.energy.forEach(value => buffer.setInt32(value));
    buffer.setInt32(parameters.beginSaldoOfPeriod);
    buffer.setUint8(parameters.date.month as unknown as types.TUint8);
    buffer.setUint8(parameters.date.date as unknown as types.TUint8);
    buffer.setUint8(parameters.date.hours);
    buffer.setUint8(parameters.date.minutes);

    return command.toBytes(id, buffer.data);
};
