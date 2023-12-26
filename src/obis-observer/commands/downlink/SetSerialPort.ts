import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ISerialPortParameters, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../../constants/directions.js';
import * as parityTypes from '../../constants/parityTypes.js';


const COMMAND_ID = 0x09;
const COMMAND_SIZE = REQUEST_ID_SIZE + 3;

const examples: TCommandExampleList = [
    {
        name: 'set fixed settings: 9600, 8, odd',
        parameters: {
            requestId: 52,
            baudRate: 5,
            dataBits: 8,
            parity: parityTypes.ODD
        },
        hex: {header: '09 04', body: '34 05 08 01'}
    },
    {
        name: 'set settings: 115200, 7, none',
        parameters: {
            requestId: 52,
            baudRate: 12,
            dataBits: 7,
            parity: parityTypes.NONE
        },
        hex: {header: '09 04', body: '34 0c 07 00'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import SetSerialPort from 'jooby-codec/obis-observer/commands/downlink/SetSerialPort.js';
 * import * as parityTypes from 'jooby-codec/obis-observer/constants/parityTypes.js';
 * const parameters = {
 *     requestId: 52,
 *     baudRate: 5,
 *     dataBits: 8,
 *     parity: parityTypes.ODD
 * };
 * const command = new SetSerialPort(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 09 04 34 05 08 01
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/SetSerialPort.md#request)
 */
class SetSerialPort extends Command {
    constructor ( public parameters: ISerialPortParameters & ICommandParameters ) {
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
            ...buffer.getSerialPortParameters()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_SIZE);

        buffer.setUint8(this.parameters.requestId);
        buffer.setSerialPortParameters(this.parameters);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default SetSerialPort;
