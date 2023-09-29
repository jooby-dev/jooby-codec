import Command, {TCommandExampleList, COMMAND_HEADER_SIZE} from '../../Command.js';
import CommandBinaryBuffer, {IOperatorParameters, OPERATOR_PARAMETERS_SIZE} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';
import {READ_WRITE} from '../../constants/accessLevels.js';


const COMMAND_ID = 0x1f;
const COMMAND_SIZE = OPERATOR_PARAMETERS_SIZE;

const examples: TCommandExampleList = [
    {
        name: 'set default operator parameters request',
        parameters: CommandBinaryBuffer.getDefaultOperatorParameters(),
        hex: {
            header: '1f 4a',
            body: `00 04 0b 28 00 02 61 60 00 01 d4 c0 00 00 7c 38 00 00 7c 38 00 00 7c 38 00
                   00 7c 38 00 1e 01 7f 07 80 00 31 84 00 00 03 03 00 00 00 f0 0f 05 05 00 01
                   00 05 05 37 2d 00 00 00 00 00 02 00 05 05 05 01 08 38 3f ff 05 05 00 18`
        }
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import SetOpParams from 'jooby-codec/mtx/commands/downlink/SetOpParams.js';
 * import CommandBinaryBuffer from 'jooby-codec/mtx/CommandBinaryBuffer.js';
 *
 * const parameters = CommandBinaryBuffer.getDefaultOperatorParameters();
 * const command = new SetOpParams(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 1f 4a 00 04 0b 28 00 02 61 60 00 01 d4 c0 00 00 7c 38 00 00 7c 38 00 00 7c 38
 * // 00 00 7c 38 00 1e 01 7f 07 80 00 31 84 00 00 03 03 00 00 00 f0 0f 05 05 00 01
 * // 00 05 05 37 2d 00 00 00 00 00 02 00 05 05 05 01 08 38 3f ff 05 05 00 18
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/SetOpParams.md#request)
 */
class SetOpParams extends Command {
    constructor ( public parameters: IOperatorParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;

    static readonly accessLevel = READ_WRITE;

    static readonly maxSize = COMMAND_SIZE;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        if ( data.length !== COMMAND_SIZE ) {
            throw new Error('Invalid SetOpParams data size.');
        }

        const buffer = new CommandBinaryBuffer(data);

        return new SetOpParams(buffer.getOperatorParameters());
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


export default SetOpParams;
