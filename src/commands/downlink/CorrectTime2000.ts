/**
 * [[include:commands/downlink/CorrectTime2000.md]]
 *
 * @packageDocumentation
 */

import Command from '../../Command.js';
import BinaryBuffer from '../../BinaryBuffer.js';


const COMMAND_ID = 0x0c;
const COMMAND_TITLE = 'CORRECT_TIME_2000';
const COMMAND_BODY_SIZE = 2;


/**
 * CorrectTime2000 command parameters
 *
 * @example
 * // 120 seconds to the past
 * {sequenceNumber: 45, time: -120}
 */
interface IDownlinkCorrectTime2000Parameters {
    /** sequence Number */
    sequenceNumber: number,
    /**
     * seconds
     * range: [-127..+127]
     */
    time: number
}


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import CorrectTime2000 from 'jooby-codec/commands/downlink/CorrectTime2000';
 *
 * // 120 seconds to the past
 * const parameters = {sequenceNumber: 45, time: -120};
 * const command = new CorrectTime2000(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 0c 02 2d 88
 * ```
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/CorrectTime2000.md#request)
 */
class CorrectTime2000 extends Command {
    constructor ( public parameters: IDownlinkCorrectTime2000Parameters ) {
        super();
    }

    static readonly id = COMMAND_ID;

    static readonly isUplink = false;

    static readonly title = COMMAND_TITLE;

    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        if ( data.byteLength !== COMMAND_BODY_SIZE ) {
            throw new Error(`${this.getName()}. Wrong buffer size: ${data.byteLength}.`);
        }

        const buffer = new BinaryBuffer(data, false);
        const parameters = {
            sequenceNumber: buffer.getUint8(),
            time: buffer.getInt8()
        };

        if ( !buffer.isEmpty ) {
            throw new Error(`${this.getName()}. BinaryBuffer is not empty.`);
        }

        return new CorrectTime2000(parameters);
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {sequenceNumber, time} = this.parameters;
        const buffer = new BinaryBuffer(COMMAND_BODY_SIZE, false);

        buffer.setUint8(sequenceNumber);
        buffer.setInt8(time);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default CorrectTime2000;
