import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


const COMMAND_ID = 0x1a;
const COMMAND_SIZE = REQUEST_ID_SIZE;

const examples: TCommandExampleList = [
    {
        name: 'simple response',
        parameters: {
            requestId: 7
        },
        hex: {header: '1a', body: '07'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import RebootResponse from 'jooby-codec/obis-observer/commands/uplink/RebootResponse.js';
 *
 * const commandBody = new Uint8Array([0x07]);
 * const command = RebootResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 7
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/Reboot.md#response)
 */
class RebootResponse extends Command {
    constructor ( public parameters: ICommandParameters ) {
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

        return new RebootResponse({requestId: buffer.getUint8()});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_SIZE);

        buffer.setUint8(this.parameters.requestId);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default RebootResponse;
