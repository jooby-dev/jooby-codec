import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {resultCodes} from '../../constants/index.js';


/**
 * ISetShortNameResponseParameters command parameters
 */
interface ISetShortNameResponseParameters extends ICommandParameters {
    resultCode: number
}


const COMMAND_ID = 0x04;
const COMMAND_SIZE = 1 + REQUEST_ID_SIZE;

const examples: TCommandExampleList = [
    {
        name: 'set short name - succeed',
        parameters: {
            requestId: 2,
            resultCode: resultCodes.OK
        },
        hex: {header: '04', body: '02 00'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import SetShortNameResponse from 'jooby-codec/obis-observer/commands/uplink/SetShortNameResponse.js';
 *
 * const commandBody = new Uint8Array([0x02, 0x00]);
 * const command = SetShortNameResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 2,
 *     resultCode: 0
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/SetShortName.md#response)
 */
class SetShortNameResponse extends Command {
    constructor ( public parameters: ISetShortNameResponseParameters ) {
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

        return new SetShortNameResponse({requestId: buffer.getUint8(), resultCode: buffer.getUint8()});
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


export default SetShortNameResponse;
