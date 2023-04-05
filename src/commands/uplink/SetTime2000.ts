import Command from '../../Command.js';

import BinaryBuffer from '../../BinaryBuffer.js';


const COMMAND_ID = 0x02;
const COMMAND_TITLE = 'SET_TIME_2000';
const COMMAND_BODY_SIZE = 1;


/**
 * SetTime2000 command parameters
 *
 * @example
 * {status: 1}
 */
interface IUplinkSetTime2000Parameters {
    status: number
}


/**
 * Uplink command.
 *
 * @example
 * ```js
 * import SetTime2000 from 'jooby-codec/commands/uplink/SetTime2000';
 *
 * // success
 * const parameters = {status: 1};
 * const command = new SetTime2000(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 02 01 01
 * ```
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/SetTime2000.md#response)
 */
class SetTime2000 extends Command {
    constructor ( public parameters: IUplinkSetTime2000Parameters ) {
        super();
    }

    static readonly id = COMMAND_ID;

    static readonly isUplink = true;

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

        return new SetTime2000(parameters);
    }

    toBytes (): Uint8Array {
        const {status} = this.parameters;
        const buffer = new BinaryBuffer(COMMAND_BODY_SIZE, false);

        buffer.setUint8(status);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default SetTime2000;
