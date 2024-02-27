import Command, {TCommandExampleList, COMMAND_HEADER_SIZE} from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {UPLINK} from '../../../constants/directions.js';
import {TMonth, TMonthDay, TInt32, TUint8} from '../../../types.js';


interface IGetSaldoResponseParameters {
    /**
     * Current device saldo.
     */
    currentSaldo: TInt32,

    /**
     * Counter for saldo installations.
     */
    count: TUint8,

    /**
     * Energy for tariffs `1`-`4` at the moment of setting a new saldo.
     */
    energy: Array<TInt32>,

    /**
     * Current saldo after setting the saldo.
     */
    beginSaldoOfPeriod: TInt32,

    /**
     * Last saldo installations time.
     */
    date: {
        month: TMonth,
        date: TMonthDay,
        hours: TUint8,
        minutes: TUint8
    }
}


const COMMAND_ID = 0x29;
const COMMAND_SIZE = 29;

const examples: TCommandExampleList = [
    {
        name: 'test response',
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
        hex: {
            header: '29 1d',
            body: '00 00 00 01 00 00 00 00 02 00 00 00 03 00 00 00 04 00 00 00 05 00 00 00 07 09 17 06 23'
        }
    }
];


/**
 * Uplink command to get device current saldo information.
 *
 * The corresponding downlink command: `GetSaldo`.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetSaldoResponse from 'jooby-codec/obis-observer/commands/uplink/GetSaldoResponse.js';
 *
 * const commandBody = new Uint8Array([
 *     0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00,
 *     0x00, 0x04, 0x00, 0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0x07, 0x09, 0x17, 0x06, 0x23
 * ]);
 * const command = GetSaldoResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
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
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/uplink/GetSaldo.md#response)
 */
class GetSaldoResponse extends Command {
    constructor ( public parameters: IGetSaldoResponseParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;

    static readonly accessLevel = READ_ONLY;

    static readonly maxSize = COMMAND_SIZE;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new GetSaldoResponse({
            currentSaldo: buffer.getInt32(),
            count: buffer.getUint8(),
            energy: Array.from({length: 4}, () => buffer.getInt32()),
            beginSaldoOfPeriod: buffer.getInt32(),
            date: {
                month: buffer.getUint8(),
                date: buffer.getUint8(),
                hours: buffer.getUint8(),
                minutes: buffer.getUint8()
            }
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
        buffer.setInt32(parameters.currentSaldo);
        buffer.setUint8(parameters.count);
        parameters.energy.forEach(value => buffer.setInt32(value));
        buffer.setInt32(parameters.beginSaldoOfPeriod);
        buffer.setUint8(parameters.date.month);
        buffer.setUint8(parameters.date.date);
        buffer.setUint8(parameters.date.hours);
        buffer.setUint8(parameters.date.minutes);

        return buffer.toUint8Array();
    }
}


export default GetSaldoResponse;
