import Command, {TCommandExampleList, ICommandBinary} from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../../constants/directions.js';
import {TTime2000} from '../../../utils/time.js';


/**
 * Time2000 command parameters
 */
interface ITime2000Parameters {
    /** unique time manipulation operation number */
    sequenceNumber: number,
    time2000: TTime2000
}


const COMMAND_ID = 0x09;
const COMMAND_BODY_SIZE = 5;

const examples: TCommandExampleList = [
    {
        name: 'time is 2023.04.03 14:01:17 GMT',
        parameters: {sequenceNumber: 77, time2000: 733845677},
        hex: {header: '09 05', body: '4d 2b bd 98 ad'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import Time2000 from 'jooby-codec/analog/commands/uplink/Time2000.js';
 *
 * // failure
 * const commandBody = new Uint8Array([0x4d, 0x2b, 0xbd, 0x98, 0xad]);
 * const command = Time2000.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {sequenceNumber: 77, time2000: 733845677}
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetTime2000.md#response)
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
            throw new Error(`Wrong buffer size: ${data.byteLength}.`);
        }

        const buffer = new CommandBinaryBuffer(data);
        const parameters = {
            sequenceNumber: buffer.getUint8(),
            time2000: buffer.getTime()
        };

        if ( !buffer.isEmpty ) {
            throw new Error('BinaryBuffer is not empty.');
        }

        return new Time2000(parameters);
    }

    toBinary (): ICommandBinary {
        const {sequenceNumber, time2000} = this.parameters;
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);

        buffer.setUint8(sequenceNumber);
        buffer.setTime(time2000);

        return Command.toBinary(COMMAND_ID, buffer.toUint8Array());
    }
}


export default Time2000;
