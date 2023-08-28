import Command, {TCommandExampleList} from '../../Command.js';
import {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {resultCodes} from '../../constants/index.js';


/**
 * IRemoveMeterResponseParameters command parameters
 */
interface IRemoveMeterResponseParameters extends ICommandParameters {
    resultCode: number
}


const COMMAND_ID = 0x73;
const COMMAND_SIZE = 1 + REQUEST_ID_SIZE;

const examples: TCommandExampleList = [
    {
        name: 'remove obis profile - succeed',
        parameters: {
            requestId: 7,
            resultCode: resultCodes.OK
        },
        hex: {header: '73 02', body: '07 00'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import RemoveMeterResponse from 'jooby-codec/obis-observer/commands/uplink/RemoveMeterResponse.js';
 *
 * const commandBody = new Uint8Array([0x07, 0x00]);
 * const command = RemoveMeterResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 7,
 *     resultCode: 0
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/RemoveMeter.md#response)
 */
class RemoveMeterResponse extends Command {
    constructor ( public parameters: IRemoveMeterResponseParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( [requestId, resultCode]: Uint8Array ) {
        return new RemoveMeterResponse({requestId, resultCode});
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


export default RemoveMeterResponse;
