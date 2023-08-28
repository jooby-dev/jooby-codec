import Command, {TCommandExampleList} from '../../Command.js';
import {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {resultCodes} from '../../constants/index.js';


/**
 * ISetSerialPortResponseParameters command parameters
 */
interface ISetSerialPortResponseParameters extends ICommandParameters {
    resultCode: number
}


const COMMAND_ID = 0x1a;
const COMMAND_SIZE = REQUEST_ID_SIZE + 1;

const examples: TCommandExampleList = [
    {
        name: 'set serial port settings - succeed',
        parameters: {
            requestId: 32,
            resultCode: resultCodes.OK
        },
        hex: {header: '1a 02', body: '20 00'}
    },
    {
        name: 'set serial port settings - failed',
        parameters: {
            requestId: 32,
            resultCode: resultCodes.FAILURE
        },
        hex: {header: '1a 02', body: '20 01'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import SetSerialPortResponse from 'jooby-codec/obis-observer/commands/uplink/SetSerialPortResponse.js';
 *
 * const commandBody = new Uint8Array([0x20, 0x00]);
 * const command = SetSerialPortResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 32,
 *     resultCode: 0
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/SetSerialPort.md#response)
 */
class SetSerialPortResponse extends Command {
    constructor ( public parameters: ISetSerialPortResponseParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( [requestId, resultCode]: Uint8Array ) {
        return new SetSerialPortResponse({requestId, resultCode});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return Command.toBytes(
            COMMAND_ID,
            new Uint8Array(
                [this.parameters.requestId, this.parameters.resultCode]
            )
        );
    }
}


export default SetSerialPortResponse;
