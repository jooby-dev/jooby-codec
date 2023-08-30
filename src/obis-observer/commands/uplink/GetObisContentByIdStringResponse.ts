import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


/**
 * IGetObisContentByIdStringResponseParameters command parameters
 */
interface IGetObisContentByIdStringResponseParameters extends ICommandParameters {
    /** obis code content from the metering device */
    content: string
}

const COMMAND_ID = 0x4f;

const examples: TCommandExampleList = [
    {
        name: 'response to GetObisContentById with string result',
        parameters: {
            requestId: 121,
            content: 'Total energy'
        },
        hex: {header: '4f 0e', body: '79 0c 54 6f 74 61 6c 20 65 6e 65 72 67 79'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetObisContentByIdStringResponse from 'jooby-codec/obis-observer/commands/uplink/GetObisContentByIdStringResponse.js';
 *
 * const commandBody = new Uint8Array([0x79, 0x0c, 0x54, 0x6f, 0x74, 0x61, 0x6c, 0x20, 0x65, 0x6e, 0x65, 0x72, 0x67, 0x79]);
 * const command = GetObisContentByIdStringResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 121,
 *     content: 'Total energy'
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetObisContentByIdString.md#response-with-string-content)
 */
class GetObisContentByIdStringResponse extends Command {
    constructor ( public parameters: IGetObisContentByIdStringResponseParameters ) {
        super();

        // request id byte + obis string content 2-n bytes
        this.size = REQUEST_ID_SIZE + this.parameters.content.length + 1;
    }

    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);
        const requestId = buffer.getUint8();
        const content = buffer.getString();

        return new GetObisContentByIdStringResponse({requestId, content});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(this.size as number);
        const {requestId, content} = this.parameters;

        buffer.setUint8(requestId);
        buffer.setString(content);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetObisContentByIdStringResponse;
