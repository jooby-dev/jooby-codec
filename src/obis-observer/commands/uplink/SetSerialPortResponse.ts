import Command, {TCommandExampleList} from '../../Command.js';
import {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


const COMMAND_ID = 0x0a;
const COMMAND_SIZE = REQUEST_ID_SIZE + 1;

const examples: TCommandExampleList = [
    {
        name: 'response to SetSerialPortSettings - succeed',
        parameters: {
            requestId: 32
        },
        hex: {header: '0a 01', body: '20'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import SetSerialPortResponse from 'jooby-codec/obis-observer/commands/uplink/SetSerialPortResponse.js';
 *
 * const commandBody = new Uint8Array([0x20]);
 * const command = SetSerialPortResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 32
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/SetSerialPort.md#response)
 */
class SetSerialPortResponse extends Command {
    constructor ( public parameters: ICommandParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( [requestId]: Uint8Array ) {
        return new SetSerialPortResponse({requestId});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return Command.toBytes(
            COMMAND_ID,
            new Uint8Array(
                [this.parameters.requestId]
            )
        );
    }
}


export default SetSerialPortResponse;
