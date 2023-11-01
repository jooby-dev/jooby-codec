import Command, {TCommandExampleList, COMMAND_HEADER_SIZE} from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {UPLINK} from '../../../constants/directions.js';


interface IGetDeviceTypeResponseParameters {
    type: string,
    flags: number
}


const COMMAND_ID = 0x04;
const COMMAND_SIZE = 9;

const examples: TCommandExampleList = [
    {
        name: 'type 1',
        parameters: {
            type: 'MTX 1A10.DG.2L5-LD4',
            flags: 255
        },
        hex: {header: '04 09', body: '00 11 21 49 21 b6 81 c0  ff'}
    },
    {
        name: 'type 1',
        parameters: {
            type: 'MTX 1G05.DH.2L2-DOB4',
            flags: 0
        },
        hex: {header: '04 09', body: '00 12 16 47 21 b3 17 2c  00'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetDeviceTypeResponse from 'jooby-codec/obis-observer/commands/uplink/GetDeviceTypeResponse.js
 *
 * const commandBody = new Uint8Array([0x04, 0x09, 0x00, 0x11, 0x21, 0x49, 0x21, 0xB6, 0x81, 0xC0, 0xff]);
 * const command = GetDeviceTypeResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     type: 'MTX 1A10.DG.2L5-LD4',
 *     flags: 255
 * };
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/uplink/GetDeviceTypeResponse.md)
 */
class GetDeviceTypeResponse extends Command {
    constructor ( public parameters: IGetDeviceTypeResponseParameters ) {
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

        return new GetDeviceTypeResponse({
            type: buffer.getDeviceTypeString(),
            flags: buffer.getUint8()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {size, parameters} = this;
        const buffer = new CommandBinaryBuffer(COMMAND_HEADER_SIZE + size);

        // header + size
        buffer.setUint8(COMMAND_ID);
        buffer.setUint8(this.size);

        // body
        buffer.setBytes(CommandBinaryBuffer.getDeviceTypeBytes(parameters.type));
        buffer.setUint8(parameters.flags);

        return buffer.toUint8Array();
    }
}


export default GetDeviceTypeResponse;
