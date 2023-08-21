import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


/**
 * IGetContentByShortNameStringResponseParameters command parameters
 */
interface IGetContentByShortNameStringResponseParameters extends ICommandParameters {
    /** obis code content from the metering device */
    content: string
}

const COMMAND_ID = 0x19;

const examples: TCommandExampleList = [
    {
        name: 'simple response',
        parameters: {
            requestId: 121,
            content: 'Total energy'
        },
        hex: {header: '19', body: '0e 79 0c 54 6f 74 61 6c 20 65 6e 65 72 67 79'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetContentByShortNameStringResponse from 'jooby-codec/obis-observer/commands/uplink/GetContentByShortNameStringResponse.js';
 *
 * const commandBody = new Uint8Array([0x79, 0x0c, 0x54, 0x6f, 0x74, 0x61, 0x6c, 0x20, 0x65, 0x6e, 0x65, 0x72, 0x67, 0x79]);
 * const command = GetContentByShortNameStringResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 121,
 *     content: 'Total energy'
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetContentByShortNameString.md#response-with-string-content)
 */
class GetContentByShortNameStringResponse extends Command {
    constructor ( public parameters: IGetContentByShortNameStringResponseParameters ) {
        super();

        // request id byte + command size byte + obis string content 2-n bytes
        this.size = REQUEST_ID_SIZE + 1 + this.parameters.content.length + 1;
    }

    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        // skip size byte
        buffer.seek(buffer.offset + 1);

        const requestId = buffer.getUint8();
        const content = buffer.getString();

        return new GetContentByShortNameStringResponse({requestId, content});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const buffer = new CommandBinaryBuffer(this.size);
        const {requestId, content} = this.parameters;

        // subtract size byte
        buffer.setUint8(this.size - 1);
        buffer.setUint8(requestId);
        buffer.setString(content);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetContentByShortNameStringResponse;
