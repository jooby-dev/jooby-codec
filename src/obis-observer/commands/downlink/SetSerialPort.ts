import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * ISetSerialPortParameters command parameters
 */
interface ISetSerialPortParameters extends ICommandParameters {
    fixed: number,
    baudRate: number,
    dataBits: number,
    parity: number,
}


const COMMAND_ID = 0x13;
const COMMAND_SIZE = REQUEST_ID_SIZE + 4;

const examples: TCommandExampleList = [
    {
        name: 'set fixed settings: 9600, 8, odd',
        parameters: {
            requestId: 52,
            fixed: 1,
            baudRate: 5,
            dataBits: 8,
            parity: 1
        },
        hex: {header: '13', body: '34 01 05 08 01'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import SetSerialPort from 'jooby-codec/commands/obis-observer/downlink/SetSerialPort.js';
 * const parameters = {
 *     requestId: 52,
 *     fixed: 0,
 *     baudRate: 5,
 *     dataBits: 8,
 *     parity: 1
 * };
 * const command = new SetSerialPort(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 13 34 00 05 08 01
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/SetSerialPort.md#request)
 */
class SetSerialPort extends Command {
    constructor ( public parameters: ISetSerialPortParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new SetSerialPort({
            requestId: buffer.getUint8(),
            fixed: buffer.getUint8(),
            baudRate: buffer.getUint8(),
            dataBits: buffer.getUint8(),
            parity: buffer.getUint8()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_SIZE);
        const {
            requestId,
            fixed,
            baudRate,
            dataBits,
            parity
        } = this.parameters;

        buffer.setUint8(requestId);
        buffer.setUint8(fixed);
        buffer.setUint8(baudRate);
        buffer.setUint8(dataBits);
        buffer.setUint8(parity);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default SetSerialPort;
