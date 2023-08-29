import Command, {TCommandExampleList} from '../../Command.js';
import {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {resultCodes} from '../../constants/index.js';


/**
 * ISetObisResponseParameters command parameters
 */
interface ISetObisIdResponseParameters extends ICommandParameters {
    resultCode: number
}


const COMMAND_ID = 0x43;
const COMMAND_SIZE = REQUEST_ID_SIZE + 1;

const examples: TCommandExampleList = [
    {
        name: 'response to SetObisId - succeed',
        parameters: {
            requestId: 2,
            resultCode: resultCodes.OK
        },
        hex: {header: '43 02', body: '02 00'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import SetObisIdResponse from 'jooby-codec/obis-observer/commands/uplink/SetObisIdResponse.js';
 *
 * const commandBody = new Uint8Array([0x02, 0x00]);
 * const command = SetObisIdResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 2,
 *     resultCode: 0
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/SetObisId.md#response)
 */
class SetObisIdResponse extends Command {
    constructor ( public parameters: ISetObisIdResponseParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( [requestId, resultCode]: Uint8Array ) {
        return new SetObisIdResponse({requestId, resultCode});
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


export default SetObisIdResponse;
