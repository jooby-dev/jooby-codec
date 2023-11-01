import Command, {TCommandExampleList} from '../../Command.js';
import BinaryBuffer from '../../../utils/BinaryBuffer.js';
import {DOWNLINK} from '../../../constants/directions.js';


/**
 * CorrectTime2000 command parameters
 *
 * @example
 * // 120 seconds to the past
 * {sequenceNumber: 45, seconds: -120}
 */
interface ICorrectTime2000Parameters {
    /** unique time manipulation operation number */
    sequenceNumber: number,
    /**
     * seconds
     * range: [-127..+127]
     */
    seconds: number
}


const COMMAND_ID = 0x0c;
const COMMAND_BODY_SIZE = 2;

const examples: TCommandExampleList = [
    {
        name: 'correct time to 120 seconds to the past',
        parameters: {sequenceNumber: 45, seconds: -120},
        hex: {header: '0c 02', body: '2d 88'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import CorrectTime2000 from 'jooby-codec/analog/commands/downlink/CorrectTime2000.js';
 *
 * // 120 seconds to the past
 * const parameters = {sequenceNumber: 45, seconds: -120};
 * const command = new CorrectTime2000(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 0c 02 2d 88
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/CorrectTime2000.md#request)
 */
class CorrectTime2000 extends Command {
    constructor ( public parameters: ICorrectTime2000Parameters ) {
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
            seconds: buffer.getInt8()
        };

        if ( !buffer.isEmpty ) {
            throw new Error('BinaryBuffer is not empty.');
        }

        return new CorrectTime2000(parameters);
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {sequenceNumber, seconds} = this.parameters;
        const buffer = new BinaryBuffer(COMMAND_BODY_SIZE, false);

        buffer.setUint8(sequenceNumber);
        buffer.setInt8(seconds);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default CorrectTime2000;
