import Command, {TCommandExampleList, COMMAND_HEADER_SIZE} from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {IDateTime} from '../../utils/dateTime.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {UPLINK} from '../../../constants/directions.js';


const COMMAND_ID = 0x07;
const COMMAND_SIZE = 8;

const examples: TCommandExampleList = [
    {
        name: 'time: 2024.02.19 18:31:55',
        parameters: {
            isSummerTime: false,
            seconds: 55,
            minutes: 31,
            hours: 18,
            day: 2,
            date: 19,
            month: 2,
            year: 24
        },
        hex: {header: '07 08', body: '00 37 1f 12 02 13 02 18'}
    }
];


/**
 * Uplink command to get full date from device.
 *
 * The corresponding downlink command: `GetDateTime`.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetDateTimeResponse from 'jooby-codec/obis-observer/commands/uplink/GetDateTimeResponse.js';
 *
 * const commandBody = new Uint8Array([0x00, 0x37, 0x1f, 0x12, 0x02, 0x13, 0x02, 0x18]);
 * const command = GetDateTimeResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     isSummerTime: false,
 *     seconds: 55,
 *     minutes: 31,
 *     hours: 18,
 *     day: 2,
 *     date: 19,
 *     month: 2,
 *     year: 24
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
