import Command, {TCommandExampleList} from '../../Command.js';
import {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


const COMMAND_ID = 0x63;
const COMMAND_SIZE = REQUEST_ID_SIZE + 1;

const examples: TCommandExampleList = [
    {
        name: 'response to RemoveObisProfile - succeed',
        parameters: {
            requestId: 7
        },
        hex: {header: '63 01', body: '07'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import RemoveMeterProfileResponse from 'jooby-codec/obis-observer/commands/uplink/RemoveMeterProfileResponse.js';
 *
 * const commandBody = new Uint8Array([0x07]);
 * const command = RemoveMeterProfileResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 7,
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/RemoveMeterProfile.md#response)
 */
class RemoveMeterProfileResponse extends Command {
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
        return new RemoveMeterProfileResponse({requestId});
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


export default RemoveMeterProfileResponse;
