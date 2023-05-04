import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {TTime2000} from '../../utils/time.js';


/**
 * Time2000 command parameters
 *
 * @example
 * // time: 2023-04-03T14:01:17.000Z
 * {sequenceNumber: 77, time: 733845677}
 */
interface ITime2000Parameters {
    /** unique time manipulation operation number */
    sequenceNumber: number,
    time: TTime2000
}


const COMMAND_ID = 0x09;
const COMMAND_BODY_SIZE = 5;

const examples: TCommandExampleList = [
    {
        name: 'time is 2023.04.03 14:01:17 GMT',
        parameters: {sequenceNumber: 77, time: 733845677},
        hex: {header: '09 05', body: '4d 2b bd 98 ad'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import CorrectTime2000Response from 'jooby-codec/commands/uplink/CorrectTime2000Response';
 *
 * // failure
 * const commandBody = new Uint8Array([0x4d, 0x2b, 0xbd, 0x98, 0xad]);
 * const command = CorrectTime2000Response.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {sequenceNumber: 77, time: 733845677}
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/uplink/Time2000.md)
 */
class Time2000 extends Command {
    constructor ( public parameters: ITime2000Parameters ) {
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

        const buffer = new CommandBinaryBuffer(data);
        const parameters = {
            sequenceNumber: buffer.getUint8(),
            time: buffer.getTime()
        };

        if ( !buffer.isEmpty ) {
            throw new Error(`${this.getName()}. BinaryBuffer is not empty.`);
        }

        return new Time2000(parameters);
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {sequenceNumber, time} = this.parameters;
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);

        buffer.setUint8(sequenceNumber);
        buffer.setTime(time);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default Time2000;
