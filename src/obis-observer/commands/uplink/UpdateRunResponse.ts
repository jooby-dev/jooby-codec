import Command, {TCommandExampleList} from '../../Command.js';
import {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {resultCodes} from '../../constants/index.js';


/**
 * IUpdateRunResponseParameters command parameters
 */
interface IUpdateRunResponseParameters extends ICommandParameters {
    resultCode: number
}


const COMMAND_ID = 0x35;
const COMMAND_SIZE = REQUEST_ID_SIZE + 1;

const examples: TCommandExampleList = [
    {
        name: 'response to UpdateRun - success',
        parameters: {
            requestId: 33,
            resultCode: resultCodes.OK
        },
        hex: {header: '35 02', body: '21 00'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import UpdateRunResponse from 'jooby-codec/obis-observer/commands/uplink/UpdateRunResponse.js';
 *
 * const commandBody = new Uint8Array([0x21, 0x00]);
 * const command = UpdateRunResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 33,
 *     resultCode: 0
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/UpdateImageWrite.md#response)
 */
class UpdateRunResponse extends Command {
    constructor ( public parameters: IUpdateRunResponseParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( [requestId, resultCode]: Uint8Array ) {
        return new UpdateRunResponse({requestId, resultCode});
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


export default UpdateRunResponse;
