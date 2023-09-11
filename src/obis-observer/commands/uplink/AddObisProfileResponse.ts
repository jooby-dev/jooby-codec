import Command, {TCommandExampleList} from '../../Command.js';
import {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {resultCodes} from '../../constants/index.js';


/**
 * IAddObisProfileResponseParameters command parameters
 */
interface IAddObisProfileResponseParameters extends ICommandParameters {
    resultCode: number
}


const COMMAND_ID = 0x47;
const COMMAND_SIZE = REQUEST_ID_SIZE + 1;

const examples: TCommandExampleList = [
    {
        name: 'add obis profile - succeed',
        parameters: {
            requestId: 7,
            resultCode: resultCodes.OK
        },
        hex: {header: '47 02', body: '07 00'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import AddObisProfileResponse from 'jooby-codec/obis-observer/commands/uplink/AddObisProfileResponse.js';
 *
 * const commandBody = new Uint8Array([0x07, 0x00]);
 * const command = AddObisProfileResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 7,
 *     resultCode: 0
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/AddObisProfile.md#response)
 */
class AddObisProfileResponse extends Command {
    constructor ( public parameters: IAddObisProfileResponseParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( [requestId, resultCode]: Uint8Array ) {
        return new AddObisProfileResponse({requestId, resultCode});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return Command.toBytes(COMMAND_ID, new Uint8Array([this.parameters.requestId, this.parameters.resultCode]));
    }
}


export default AddObisProfileResponse;
