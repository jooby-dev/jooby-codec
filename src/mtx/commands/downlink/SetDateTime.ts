import Command, {TCommandExampleList, COMMAND_HEADER_SIZE} from '../../Command.js';
import CommandBinaryBuffer, {IDateTime} from '../../CommandBinaryBuffer.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {UPLINK} from '../../../constants/directions.js';


const COMMAND_ID = 0x08;
const COMMAND_SIZE = 8;

const examples: TCommandExampleList = [
    {
        name: 'time response: 2023-09-13T15:30:25.000Z',
        parameters: {
            isSummerTime: false,
            seconds: 25,
            minutes: 30,
            hours: 18,
            day: 2,
            date: 13,
            month: 9,
            year: 23
        },
        hex: {header: '08 08', body: '00 19 1e 12 02 0d 09 17'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import SetDateTime from 'jooby-codec/mtx/commands/downlink/SetDateTime.js';
 *
 * const parameters = {
 *     isSummerTime: false,
 *     seconds: 25,
 *     minutes: 30,
 *     hours: 18,
 *     day: 2,
 *     date: 13,
 *     month: 9,
 *     year: 23
 * };
 * const command = new SetDateTime(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 08 08 00 19 1e 12 02 0d 09 17
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/SetDateTime.md#request)
 */
class SetDateTime extends Command {
    constructor ( public parameters: IDateTime ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;

    static readonly accessLevel = READ_ONLY;

    static readonly maxSize = COMMAND_SIZE;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new SetDateTime(buffer.getDateTime());
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_HEADER_SIZE + this.size);

        // header + size
        buffer.setUint8(COMMAND_ID);
        buffer.setUint8(this.size);

        // body
        buffer.setDateTime(this.parameters);

        return buffer.toUint8Array();
    }
}


export default SetDateTime;
