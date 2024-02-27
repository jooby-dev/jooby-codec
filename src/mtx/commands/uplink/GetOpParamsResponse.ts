import Command, {TCommandExampleList, COMMAND_HEADER_SIZE} from '../../Command.js';
import CommandBinaryBuffer, {IOperatorParameters, OPERATOR_PARAMETERS_SIZE} from '../../CommandBinaryBuffer.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {UPLINK} from '../../../constants/directions.js';


const COMMAND_ID = 0x1e;
const COMMAND_SIZE = OPERATOR_PARAMETERS_SIZE;

const examples: TCommandExampleList = [
    {
        name: 'get default operator parameters response',
        parameters: CommandBinaryBuffer.getDefaultOperatorParameters(),
        hex: {
            header: '1e 4a',
            body: `00 04 0b 28 00 02 61 60 00 01 d4 c0 00 00 7c 38 00 00 7c 38 00 00 7c 38 00
                   00 7c 38 00 1e 01 7f 07 80 00 31 84 00 00 03 03 00 00 00 f0 0f 05 05 00 01
                   00 05 05 37 2d 00 00 00 00 00 02 00 05 05 05 01 08 38 3f ff 05 05 00 18`
        }
    }
];


/**
 * Uplink command to get device operator parameters.
 *
 * The corresponding downlink command: `GetOpParams`.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetOpParamsResponse from 'jooby-codec/obis-observer/commands/uplink/GetOpParamsResponse.js';
 *
 * const commandBody = new Uint8Array([
 *     0x00, 0x04, 0x0b, 0x28, 0x00, 0x02, 0x61, 0x60, 0x00, 0x01, 0xd4, 0xc0, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c,
 *     0x38, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x00, 0x7c, 0x38, 0x00, 0x1e, 0x01, 0x7f, 0x07, 0x80, 0x00, 0x31, 0x84, 0x00,
 *     0x00, 0x03, 0x03, 0x00, 0x00, 0x00, 0xf0, 0x0f, 0x05, 0x05, 0x00, 0x01, 0x00, 0x05, 0x05, 0x37, 0x2d, 0x00, 0x00,
 *     0x00, 0x00, 0x00, 0x02, 0x00, 0x05, 0x05, 0x05, 0x01, 0x08, 0x38, 0x3f, 0xff, 0x05, 0x05, 0x00, 0x18
 * ]);
 * const command = GetOpParamsResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * // the same as CommandBinaryBuffer.getDefaultOperatorParameters()
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/uplink/GetOpParams.md#response)
 */
class GetOpParamsResponse extends Command {
    constructor ( public parameters: IOperatorParameters ) {
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
        if ( data.length < COMMAND_SIZE ) {
            throw new Error('Invalid SetOpParams data size.');
        }

        const buffer = new CommandBinaryBuffer(data);

        return new GetOpParamsResponse(buffer.getOperatorParameters());
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {size, parameters} = this;
        const buffer = new CommandBinaryBuffer(COMMAND_HEADER_SIZE + size);

        // header + size
        buffer.setUint8(COMMAND_ID);
        buffer.setUint8(size);

        // body
        buffer.setOperatorParameters(parameters);

        return buffer.toUint8Array();
    }
}


export default GetOpParamsResponse;
