import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {ICommandParameters, REQUEST_ID_SIZE} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


/**
 * IGetContentByObisResponseParameters command parameters
 */
interface IGetContentByObisResponseParameters extends ICommandParameters {
    content: string
}


const COMMAND_ID = 0x16;

const examples: TCommandExampleList = [
    {
        name: 'content response',
        parameters: {
            requestId: 2,
            content: '57906635'
        },
        hex: {header: '16', body: '0a 02 08 35 37 39 30 36 36 33 35'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetContentByObisResponse from 'jooby-codec/obis-observer/commands/uplink/GetContentByObisResponse.js';
 *
 * const commandBody = new Uint8Array([
 *     0x3a, 0x2d, 0x18, 0xdf, 0x80, 0x32, 0x1a, 0x72, 0x65, 0x61, 0x63, 0x74, 0x69,
 *     0x76, 0x65, 0x20, 0x70, 0x6f, 0x77, 0x65, 0x72, 0x20, 0x51, 0x49, 0x2c, 0x20,
 *     0x61, 0x76, 0x65, 0x72, 0x61, 0x67, 0x65, 0x38, 0x18, 0x72, 0x65, 0x61, 0x63,
 *     0x74, 0x69, 0x76, 0x65, 0x20, 0x70, 0x6f, 0x77, 0x65, 0x72, 0x20, 0x51, 0x49,
 *     0x2c, 0x20, 0x74, 0x6f, 0x74, 0x61, 0x6c
 * ]);
 * const command = GetContentByObisResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     time: 756604800,
 *     shortNameList: [
 *         {code: 50, content: 'reactive power QI, average'},
 *         {code: 56, content: 'reactive power QI, total'}
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/uplink/GetContentByObis.md)
 */
class GetContentByObisResponse extends Command {
    constructor ( public parameters: IGetContentByObisResponseParameters ) {
        super();

        // request id size + 1 command size byte + 1 content size byte + content size
        this.size = REQUEST_ID_SIZE + 1 + 1 + this.parameters.content.length;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        // need to skip 1 byte as size is not used
        buffer.getUint8();

        const requestId = buffer.getUint8();
        const content = buffer.getString();

        return new GetContentByObisResponse({requestId, content});
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


export default GetContentByObisResponse;
