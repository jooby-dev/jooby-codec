/**
 * Downlink command to set device current saldo information.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as setSaldo from 'jooby-codec/mtx/commands/downlink/setSaldo.js';
 *
 * const parameters = {
 *     date: {
 *         month: 9,
 *         date: 23,
 *         hours: 6,
 *         minutes: 35
 *     },
 *     saldoNew: 2,
 *     saldoOld: 5
 * };
 * const bytes = setSaldo.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [42, 12, 9, 23, 6, 35, 0, 0, 0, 2, 0, 0, 0, 5]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/SetSaldo.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import {READ_WRITE} from '../../constants/accessLevels.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as getSaldoDownlink from './getSaldo.js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as getSaldoUplink from '../uplink/getSaldo.js';


interface ISetSaldoParameters {
    /**
     * Device date and time.
     */
    date: {
        month: types.TMonth;
        date: types.TMonthDay;
        hours: types.TUint8;
        minutes: types.TUint8;
    };

    /**
     * Enter new prepayment.
     */
    saldoNew: types.TInt32;

    /**
     * Saldo value obtained through {@link getSaldoDownlink | getSaldo downlink}/{@link getSaldoUplink | getSaldo uplink}.
     */
    saldoOld: types.TInt32;
}


export const id: types.TCommandId = 0x2a;
export const name: types.TCommandName = 'setSaldo';
export const headerSize = 2;
export const maxSize = 12;
export const accessLevel: types.TAccessLevel = READ_WRITE;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'test request': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            date: {
                month: 9,
                date: 23,
                hours: 6,
                minutes: 35
            },
            saldoNew: 2,
            saldoOld: 5
        },
        bytes: [
            0x2a, 0x0c,
            0x09, 0x17, 0x06, 0x23, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x05
        ]
    }
};

/**
 * Decode command parameters.
 *
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( bytes: types.TBytes ): ISetSaldoParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    return {
        date: {
            month: buffer.getUint8() as unknown as types.TMonth,
            date: buffer.getUint8() as unknown as types.TMonthDay,
            hours: buffer.getUint8(),
            minutes: buffer.getUint8()
        },
        saldoNew: buffer.getInt32(),
        saldoOld: buffer.getInt32()
    };
};

/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: ISetSaldoParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    buffer.setUint8(parameters.date.month as unknown as types.TUint8);
    buffer.setUint8(parameters.date.date as unknown as types.TUint8);
    buffer.setUint8(parameters.date.hours);
    buffer.setUint8(parameters.date.minutes);
    buffer.setInt32(parameters.saldoNew);
    buffer.setInt32(parameters.saldoOld);

    return command.toBytes(id, buffer.data);
};
