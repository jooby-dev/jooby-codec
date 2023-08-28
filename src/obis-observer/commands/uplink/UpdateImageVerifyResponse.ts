import Command, {TCommandExampleList} from '../../Command.js';
import {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {resultCodes} from '../../constants/index.js';


/**
 * IUpdateImageVerifyResponseParameters command parameters
 */
interface IUpdateImageVerifyResponseParameters extends ICommandParameters {
    resultCode: number
}


const COMMAND_ID = 0x31;
const COMMAND_SIZE = REQUEST_ID_SIZE + 1;

const examples: TCommandExampleList = [
    {
        name: 'success',
        parameters: {
            requestId: 32,
            resultCode: resultCodes.OK
        },
        hex: {header: '31 02', body: '20 00'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import UpdateImageVerifyResponse from 'jooby-codec/obis-observer/commands/uplink/UpdateImageVerifyResponse.js';
 *
 * const commandBody = new Uint8Array([0x20, 0x00]);
 * const command = UpdateImageVerifyResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 32,
 *     resultCode: 0
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/UpdateImageVerify.md#response)
 */
class UpdateImageVerifyResponse extends Command {
    constructor ( public parameters: IUpdateImageVerifyResponseParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( [requestId, resultCode]: Uint8Array ) {
        return new UpdateImageVerifyResponse({requestId, resultCode});
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


export default UpdateImageVerifyResponse;
