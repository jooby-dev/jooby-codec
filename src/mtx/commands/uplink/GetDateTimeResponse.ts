import Command, {TCommandExampleList, COMMAND_HEADER_SIZE} from '../../Command.js';
import CommandBinaryBuffer, {IDateTime} from '../../CommandBinaryBuffer.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {UPLINK} from '../../../constants/directions.js';


const COMMAND_ID = 0x07;
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
        hex: {header: '07 08', body: '00 19 1e 12 02 0d 09 17'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetDateTimeResponse from 'jooby-codec/obis-observer/commands/uplink/GetDateTimeResponse.js';
 *
 * const commandBody = new Uint8Array([0x00, 0x19, 0x1e, 0x12, 0x02, 0x0d, 0x09, 0x17]);
 * const command = GetDateTimeResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     seconds: 25,
 *     minutes: 30,
 *     hours: 18,
 *     day: 2,
 *     date: 13,
 *     month: 9,
 *     year: 23,
 *     isSummerTime: false
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/uplink/GetDateTime.md#response)
 */
class GetDateTimeResponse extends Command {
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

        return new GetDateTimeResponse(buffer.getDateTime());
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


export default GetDateTimeResponse;
