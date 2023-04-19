import Command from '../../Command.js';
import BinaryBuffer from '../../BinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


/**
 * CorrectTime2000 command parameters
 *
 * @example
 * {status: 1}
 */
interface IUplinkCorrectTime2000Parameters {
    status: number
}


const COMMAND_ID = 0x0c;
const COMMAND_TITLE = 'CORRECT_TIME_2000';
const COMMAND_BODY_SIZE = 1;


/**
 * Uplink command.
 *
 * @example
 * ```js
 * import CorrectTime2000 from 'jooby-codec/commands/uplink/CorrectTime2000';
 *
 * // failure
 * const parameters = {status: 0};
 * const command = new CorrectTime2000(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 0c 01 00
 * ```
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/CorrectTime2000.md#response)
 */
class CorrectTime2000 extends Command {
    constructor ( public parameters: IUplinkCorrectTime2000Parameters ) {
        super();
    }

    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly title = COMMAND_TITLE;

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

        return new CorrectTime2000(parameters);
    }

    toBytes (): Uint8Array {
        const {status} = this.parameters;
        const buffer = new BinaryBuffer(COMMAND_BODY_SIZE, false);

        buffer.setUint8(status);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default CorrectTime2000;
