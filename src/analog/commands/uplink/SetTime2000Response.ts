import Command, {TCommandExampleList, ICommandBinary} from '../../Command.js';
import BinaryBuffer from '../../../utils/BinaryBuffer.js';
import {UPLINK} from '../../../constants/directions.js';


/**
 * SetTime2000Response command parameters
 *
 * @example
 * {status: 1}
 */
interface ISetTime2000ResponseParameters {
    status: number
}


const COMMAND_ID = 0x02;
const COMMAND_BODY_SIZE = 1;

const examples: TCommandExampleList = [
    {
        name: 'success',
        parameters: {status: 1},
        hex: {header: '02 01', body: '01'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import SetTime2000Response from 'jooby-codec/analog/commands/uplink/SetTime2000Response.js';
 *
 * const commandBody = new Uint8Array([0x01]);
 * const command = SetTime2000Response.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {status: 1}
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/SetTime2000.md#response)
 */
class SetTime2000Response extends Command {
    constructor ( public parameters: ISetTime2000ResponseParameters ) {
        super();
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        if ( data.byteLength !== COMMAND_BODY_SIZE ) {
            throw new Error(`Wrong buffer size: ${data.byteLength}.`);
        }

        const buffer = new BinaryBuffer(data, false);
        const parameters = {
            status: buffer.getUint8()
        };

        if ( !buffer.isEmpty ) {
            throw new Error('BinaryBuffer is not empty.');
        }

        return new SetTime2000Response(parameters);
    }

    toBinary (): ICommandBinary {
        const {status} = this.parameters;
        const buffer = new BinaryBuffer(COMMAND_BODY_SIZE, false);

        buffer.setUint8(status);

        return Command.toBinary(COMMAND_ID, buffer.toUint8Array());
    }
}


export default SetTime2000Response;
