import Command, {TCommandExampleList} from '../../Command.js';
import {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


const COMMAND_ID = 0x61;
const COMMAND_SIZE = REQUEST_ID_SIZE + 1;

const examples: TCommandExampleList = [
    {
        name: 'add meter profile - succeed',
        parameters: {
            requestId: 7
        },
        hex: {header: '61 01', body: '07'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import AddMeterProfileResponse from 'jooby-codec/obis-observer/commands/uplink/AddMeterProfileResponse.js';
 *
 * const commandBody = new Uint8Array([0x07]);
 * const command = AddMeterProfileResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 7,
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/AddMeterProfile.md#response)
 */
class AddMeterProfileResponse extends Command {
    constructor ( public parameters: ICommandParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( [requestId]: Uint8Array ) {
        return new AddMeterProfileResponse({requestId});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return Command.toBytes(
            COMMAND_ID,
            new Uint8Array(
                [this.parameters.requestId]
            )
        );
    }
}


export default AddMeterProfileResponse;
