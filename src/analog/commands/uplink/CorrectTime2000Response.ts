import Command, {TCommandExampleList} from '../../Command.js';
import BinaryBuffer from '../../../utils/BinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


/**
 * CorrectTime2000Response command parameters
 *
 * @example
 * {status: 1}
 */
interface ICorrectTime2000ResponseParameters {
    status: number
}


const COMMAND_ID = 0x0c;
const COMMAND_BODY_SIZE = 1;

const examples: TCommandExampleList = [
    {
        name: 'failure',
        parameters: {status: 0},
        hex: {header: '0c 01', body: '00'}
    }
];

/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import CorrectTime2000Response from 'jooby-codec/analog/commands/uplink/CorrectTime2000Response';
 *
 * // failure
 * const commandBody = new Uint8Array([0x00]);
 * const command = CorrectTime2000Response.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {status: 0}
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/CorrectTime2000.md#response)
 */
class CorrectTime2000Response extends Command {
    constructor ( public parameters: ICorrectTime2000ResponseParameters ) {
        super();
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        if ( data.byteLength !== COMMAND_BODY_SIZE ) {
            throw new Error(`${this.getName()}. Wrong buffer size: ${data.byteLength}.`);
        }

        const buffer = new BinaryBuffer(data, false);
        const parameters = {
            status: buffer.getUint8()
        };

        if ( !buffer.isEmpty ) {
            throw new Error(`${this.getName()}. BinaryBuffer is not empty.`);
        }

        return new CorrectTime2000Response(parameters);
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {status} = this.parameters;
        const buffer = new BinaryBuffer(COMMAND_BODY_SIZE, false);

        buffer.setUint8(status);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default CorrectTime2000Response;
