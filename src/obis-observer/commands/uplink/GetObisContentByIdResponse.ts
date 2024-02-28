import roundNumber from '../../../utils/roundNumber.js';
import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../../constants/directions.js';


/**
 * IGetObisContentByIdResponseParameters command parameters
 */
interface IGetObisContentByIdResponseParameters extends ICommandParameters {
    /** obis code content from the metering device */
    content?: number
}

const COMMAND_ID = 0x51;

const examples: TCommandExampleList = [
    {
        name: 'response to GetObisContentById',
        parameters: {
            requestId: 121,
            content: 344.23
        },
        hex: {header: '51 05', body: '79 43 ac 1d 71'}
    },
    {
        name: 'response to GetObisContentById without content',
        parameters: {
            requestId: 122
        },
        hex: {header: '51 01', body: '7a'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetObisContentByIdResponse from 'jooby-codec/obis-observer/commands/uplink/GetObisContentByIdResponse.js';
 *
 * const commandBody = new Uint8Array([0x79, 0x43, 0xac, 0x1d, 0x71]);
 * const command = GetObisContentByIdResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 121,
 *     content: 344.23
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetObisContentById.md#response-with-float-content)
 */
class GetObisContentByIdResponse extends Command {
    constructor ( public parameters: IGetObisContentByIdResponseParameters ) {
        super();

        // request id byte + obis float32 content 4 bytes
        this.size = REQUEST_ID_SIZE + (parameters.content ? 4 : 0);
    }

    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);
        const requestId = buffer.getUint8();

        return buffer.isEmpty
            ? new GetObisContentByIdResponse({requestId})
            : new GetObisContentByIdResponse({requestId, content: roundNumber(buffer.getFloat32())});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(this.size);
        const {requestId, content} = this.parameters;

        buffer.setUint8(requestId);

        if ( content ) {
            buffer.setFloat32(roundNumber(content));
        }

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetObisContentByIdResponse;
