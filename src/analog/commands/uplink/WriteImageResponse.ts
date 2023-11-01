import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../../constants/directions.js';


/**
 * WriteImageResponse command parameters
 */
interface IWriteImageParameters {
    offset: number,
    status: number
}


const COMMAND_ID = 0x2a1f;
const COMMAND_SIZE = 5;

const examples: TCommandExampleList = [
    {
        name: 'write image',
        parameters: {
            offset: 4,
            status: 1
        },
        hex: {header: '1f 2A 05', body: '00 00 00 04 01'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import WriteImageResponse from 'jooby-codec/analog/commands/uplink/WriteImageResponse.js';
 *
 * const commandBody = new Uint8Array([
 *     0x1f, 0x2a, 0x05, 0x00, 0x00, 0x00, 0x04, 0x01
 * ]);
 * const command = WriteImageResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     offset: 4,
 *     status: 1
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/WriteImage.md#response)
 */
class WriteImageResponse extends Command {
    constructor ( public parameters: IWriteImageParameters ) {
        super();
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new WriteImageResponse({
            offset: buffer.getUint32(false),
            status: buffer.getUint8()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_SIZE);
        const {offset, status} = this.parameters;


        buffer.setUint32(offset, false);
        buffer.setUint8(status);

        return Command.toBytes(
            COMMAND_ID,
            buffer.toUint8Array()
        );
    }
}


export default WriteImageResponse;
