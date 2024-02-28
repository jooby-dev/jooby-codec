import Command, {TCommandExampleList, COMMAND_HEADER_SIZE} from '../../Command.js';
import CommandBinaryBuffer, {IDeviceId} from '../../CommandBinaryBuffer.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {UPLINK} from '../../../constants/directions.js';


const COMMAND_ID = 0x05;
const COMMAND_SIZE = 8;

const examples: TCommandExampleList = [
    {
        name: 'mode with order',
        parameters: {
            manufacturer: '001a79',
            type: 23,
            year: 20,
            serial: '1b1d6a'
        },
        hex: {header: '05 08', body: '00 1a 79 17 14 1b 1d 6a'}
    }
];


/**
 * Uplink command to get device identifier.
 *
 * The corresponding downlink command: `GetDeviceId`.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetDeviceIdResponse from 'jooby-codec/obis-observer/commands/uplink/GetDeviceIdResponse.js';
 *
 * const commandBody = new Uint8Array([0x00, 0x1a, 0x79, 0x17, 0x14, 0x1b, 0x1d, 0x6a]);
 * const command = GetDeviceIdResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     manufacturer: '001a79',
 *     type: 23,
 *     year: 20,
 *     serial: '1b1d6a'
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/uplink/GetDeviceId.md#response)
 */
class GetDeviceIdResponse extends Command {
    constructor ( public parameters: IDeviceId ) {
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

        return new GetDeviceIdResponse(buffer.getDeviceId());
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_HEADER_SIZE + this.size);

        // header + size
        buffer.setUint8(COMMAND_ID);
        buffer.setUint8(this.size);

        // body
        buffer.setDeviceId(this.parameters);

        return buffer.toUint8Array();
    }
}


export default GetDeviceIdResponse;
