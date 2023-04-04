import Command from '../../Command.js';

import BinaryBuffer from '../../BinaryBuffer.js';


const COMMAND_ID = 0x09;
const COMMAND_TITLE = 'TIME_2000';
const COMMAND_BODY_SIZE = 5;


/**
 * Time2000 command parameters
 *
 * @example
 * // time: 2023-04-03T14:01:17.000Z
 * {sequenceNumber: 77, time: 733845677}
 */
interface ITime2000Parameters {
    /** sequence Number */
    sequenceNumber: number,
    /** seconds since year 2000 */
    time: number
}


/**
 * Uplink command.
 *
 * @example
 * ```js
 * import Time2000 from 'jooby-codec/commands/uplink/Time2000';
 *
 * // time: 2023-04-03T14:01:17.000Z
 * const parameters = {sequenceNumber: 77, time: 733845677};
 * const command = new Time2000(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 09 05 4d 2b bd 98 ad
 * ```
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/uplink/Time2000.md)
 */
class Time2000 extends Command {
    constructor ( public parameters: ITime2000Parameters ) {
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
            sequenceNumber: buffer.getUint8(),
            time: buffer.getUint32(false)
        };

        if ( !buffer.isEmpty ) {
            throw new Error(`${this.getName()}. BinaryBuffer is not empty.`);
        }

        return new Time2000(parameters);
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {sequenceNumber, time} = this.parameters;
        const buffer = new BinaryBuffer(COMMAND_BODY_SIZE, false);

        buffer.setUint8(sequenceNumber);
        buffer.setUint32(time, false);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default Time2000;
