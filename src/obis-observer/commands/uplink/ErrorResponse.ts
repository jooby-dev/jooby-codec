import Command, {TCommandExampleList} from '../../Command.js';
import {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {resultCodes} from '../../constants/index.js';


/**
 * IErrorResponseParameters command parameters
 */
interface IErrorResponseParameters extends ICommandParameters {
    resultCode: number
}


const COMMAND_ID = 0xfe;
const COMMAND_SIZE = REQUEST_ID_SIZE + 1;

const examples: TCommandExampleList = [
    {
        name: 'error code - format error',
        parameters: {
            requestId: 32,
            resultCode: resultCodes.FORMAT_ERROR
        },
        hex: {header: 'fe 02', body: '20 03'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import ErrorResponse from 'jooby-codec/obis-observer/commands/uplink/ErrorResponse.js';
 *
 * const commandBody = new Uint8Array([0x20, 0x03]);
 * const command = ErrorResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 32,
 *     resultCode: 3
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/ErrorResponse.md#response)
 */
class ErrorResponse extends Command {
    constructor ( public parameters: IErrorResponseParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( [requestId, resultCode]: Uint8Array ) {
        return new ErrorResponse({requestId, resultCode});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {parameters} = this;

        return Command.toBytes(
            COMMAND_ID,
            new Uint8Array([parameters.requestId, parameters.resultCode])
        );
    }
}


export default ErrorResponse;
