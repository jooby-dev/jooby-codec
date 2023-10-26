import Command, {TCommandExampleList, COMMAND_HEADER_SIZE} from '../../Command.js';
import CommandBinaryBuffer, {ISpecialDay} from '../../CommandBinaryBuffer.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {UPLINK} from '../../constants/directions.js';


const COMMAND_ID = 0x3d;
const COMMAND_SIZE = 4;

const examples: TCommandExampleList = [
    {
        name: 'special day response',
        parameters: {
            month: 1,
            date: 9,
            dayIndex: 3,
            isPeriodic: true
        },
        hex: {header: '3d 04', body: '01 09 03 00'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetSpecialDayResponse from 'jooby-codec/obis-observer/commands/uplink/GetSpecialDayResponse.js';
 *
 * const commandBody = new Uint8Array([0x01, 0x09, 0x03, 0x00]);
 * const command = GetSpecialDayResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     month: 1,
 *     date: 9,
 *     dayIndex: 3,
 *     isPeriodic: true
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/uplink/GetSpecialDayResponse.md)
 */
class GetSpecialDayResponse extends Command {
    constructor ( public parameters: ISpecialDay ) {
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

        return new GetSpecialDayResponse(buffer.getSpecialDay());
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {size, parameters} = this;
        const buffer = new CommandBinaryBuffer(COMMAND_HEADER_SIZE + size);

        // header + size
        buffer.setUint8(COMMAND_ID);
        buffer.setUint8(size);

        // body
        buffer.setSpecialDay(parameters);

        return buffer.toUint8Array();
    }
}


export default GetSpecialDayResponse;
