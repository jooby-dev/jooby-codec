import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ISerialPortParameters, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../../constants/directions.js';
import * as parityTypes from '../../constants/parityTypes.js';


const COMMAND_ID = 0x06;
const COMMAND_SIZE = REQUEST_ID_SIZE + 3;

const examples: TCommandExampleList = [
    {
        name: 'response to GetSerialPort',
        parameters: {
            requestId: 7,
            baudRate: 5,
            dataBits: 8,
            parity: parityTypes.ODD
        },
        hex: {header: '08 04', body: '07 05 08 01'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetSerialPortResponse from 'jooby-codec/obis-observer/commands/uplink/GetSerialPortResponse.js';
 *
 * const commandBody = new Uint8Array([
 *     07 05 08 01
 * ]);
 * const command = GetSerialPortResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 7,
 *     baudRate: 5,
 *     dataBits: 8,
 *     parity: parityTypes.ODD
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetSerialPort.md#response)
 */
class GetSerialPortResponse extends Command {
    constructor ( public parameters: ISerialPortParameters & ICommandParameters ) {
        super();

        this.size = REQUEST_ID_SIZE + 4;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new GetSerialPortResponse({
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


export default GetSerialPortResponse;
