import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {resultCodes} from '../../constants/index.js';


/**
 * IAddShortNameProfileResponseParameters command parameters
 */
interface IAddShortNameProfileResponseParameters extends ICommandParameters {
    resultCode: number
}


const COMMAND_ID = 0x06;
const COMMAND_SIZE = 1 + REQUEST_ID_SIZE;

const examples: TCommandExampleList = [
    {
        name: 'add short name profile - succeed',
        parameters: {
            requestId: 7,
            resultCode: resultCodes.OK
        },
        hex: {header: '06', body: '07 00'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import AddShortNameProfileResponse from 'jooby-codec/obis-observer/commands/uplink/AddShortNameProfileResponse.js';
 *
 * const commandBody = new Uint8Array([0x07, 0x00]);
 * const command = AddShortNameProfileResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 7,
 *     resultCode: 0
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/AddShortNameProfile.md#response)
 */
class AddShortNameProfileResponse extends Command {
    constructor ( public parameters: IAddShortNameProfileResponseParameters ) {
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

        return new AddShortNameProfileResponse({
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


export default AddShortNameProfileResponse;
