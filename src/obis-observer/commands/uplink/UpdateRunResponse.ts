import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {resultCodes} from '../../constants/index.js';


/**
 * IUpdateRunResponseParameters command parameters
 */
interface IUpdateRunResponseParameters extends ICommandParameters {
    resultCode: number
}


const COMMAND_ID = 0x2f;
const COMMAND_SIZE = 1 + REQUEST_ID_SIZE;

const examples: TCommandExampleList = [
    {
        name: 'success',
        parameters: {
            requestId: 33,
            resultCode: resultCodes.OK
        },
        hex: {header: '2f', body: '21 00'}
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
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new UpdateRunResponse({
            requestId: buffer.getUint8(),
            resultCode: buffer.getUint8()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_SIZE);
        const {requestId, resultCode} = this.parameters;

        buffer.setUint8(requestId);
        buffer.setUint8(resultCode);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default UpdateRunResponse;
