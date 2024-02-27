import Command, {TCommandExampleList, COMMAND_HEADER_SIZE} from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../../constants/directions.js';
import {READ_WRITE} from '../../constants/accessLevels.js';
import {TMonth, TMonthDay, TUint8, TInt32} from '../../../types.js';

/* eslint-disable */
import GetSaldo from '../downlink/GetSaldo.js';
import SetSaldoResponse from '../uplink/SetSaldoResponse.js';
import GetSaldoResponse from '../uplink/GetSaldoResponse.js';
/* eslint-enable */


interface ISetSaldoParameters {
    /**
     * Device date and time.
     */
    date: {
        month: TMonth,
        date: TMonthDay,
        hours: TUint8,
        minutes: TUint8
    },

    /**
     * Enter new prepayment.
     */
    saldoNew: TInt32,

    /**
     * Saldo value obtained through {@link GetSaldo}/{@link GetSaldoResponse}.
     */
    saldoOld: TInt32
}


const COMMAND_ID = 0x2a;
const COMMAND_SIZE = 12;

const examples: TCommandExampleList = [
    {
        name: 'test request',
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
        hex: {header: '2a 0c', body: '09 17 06 23 00 00 00 02 00 00 00 05'}
    }
];


/**
 * Downlink command to set device current saldo information.
 *
 * The corresponding uplink command: {@link SetSaldoResponse}.
 *
 * @example
 * ```js
 * import SetSaldo from 'jooby-codec/mtx/commands/downlink/SetSaldo.js';
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
 * const command = new SetSaldo(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 2a 0c 09 17 06 23 00 00 00 02 00 00 00 05
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/SetSaldo.md#request)
 */
class SetSaldo extends Command {
    constructor ( public parameters: ISetSaldoParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;

    static readonly accessLevel = READ_WRITE;

    static readonly maxSize = COMMAND_SIZE;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new SetSaldo({
            date: {
                month: buffer.getUint8(),
                date: buffer.getUint8(),
                hours: buffer.getUint8(),
                minutes: buffer.getUint8()
            },
            saldoNew: buffer.getInt32(),
            saldoOld: buffer.getInt32()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {size, parameters} = this;
        const buffer = new CommandBinaryBuffer(COMMAND_HEADER_SIZE + this.size);

        // header + size
        buffer.setUint8(COMMAND_ID);
        buffer.setUint8(size);

        // body
        buffer.setUint8(parameters.date.month);
        buffer.setUint8(parameters.date.date);
        buffer.setUint8(parameters.date.hours);
        buffer.setUint8(parameters.date.minutes);
        buffer.setInt32(parameters.saldoNew);
        buffer.setInt32(parameters.saldoOld);

        return buffer.toUint8Array();
    }
}


export default SetSaldo;
