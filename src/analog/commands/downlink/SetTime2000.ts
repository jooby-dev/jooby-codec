import Command, {TCommandExampleList} from '../../Command.js';
import BinaryBuffer from '../../../utils/BinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * SetTime2000 command parameters
 *
 * @example
 * // time: 2023-04-03T14:01:17.000Z
 * {sequenceNumber: 77, seconds: 733845677}
 */
interface ISetTime2000Parameters {
    /** unique time manipulation operation number */
    sequenceNumber: number,
    /** seconds */
    seconds: number
}


const COMMAND_ID = 0x02;
const COMMAND_BODY_SIZE = 5;

const examples: TCommandExampleList = [
    {
        name: 'set time to 2023.04.03 14:01:17 GMT',
        parameters: {sequenceNumber: 78, seconds: 733845677},
        hex: {header: '02 05', body: '4e 2b bd 98 ad'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import SetTime2000 from 'jooby-codec/analog/commands/downlink/SetTime2000.js';
 *
 * const parameters = {sequenceNumber: 78, seconds: 123456};
 * const command = new SetTime2000(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 02 05 4e 00 01 e2 40
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/SetTime2000.md#request)
 */
class SetTime2000 extends Command {
    constructor ( public parameters: ISetTime2000Parameters ) {
        super();
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        if ( data.byteLength !== COMMAND_BODY_SIZE ) {
            throw new Error(`Wrong buffer size: ${data.byteLength}.`);
        }

        const buffer = new BinaryBuffer(data, false);
        const parameters = {
            sequenceNumber: buffer.getUint8(),
            seconds: buffer.getInt32()
        };

        if ( !buffer.isEmpty ) {
            throw new Error('BinaryBuffer is not empty.');
        }

        return new SetTime2000(parameters);
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {sequenceNumber, seconds} = this.parameters;
        const buffer = new BinaryBuffer(COMMAND_BODY_SIZE, false);

        buffer.setUint8(sequenceNumber);
        buffer.setInt32(seconds);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default SetTime2000;
