import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {ICommandParameters, REQUEST_ID_SIZE} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../../constants/directions.js';


/**
 * IGetContentByObisResponseParameters command parameters
 */
interface IGetContentByObisResponseParameters extends ICommandParameters {
    content: string
}


const COMMAND_ID = 0x4f;

const examples: TCommandExampleList = [
    {
        name: 'response to GetObisContent',
        parameters: {
            requestId: 2,
            content: '57906635'
        },
        hex: {header: '4f 0a', body: '02 08 35 37 39 30 36 36 33 35'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetContentByObisResponse from 'jooby-codec/obis-observer/commands/uplink/GetContentByObisResponse.js';
 *
 * const commandBody = new Uint8Array([0x02, 0x08, 0x35, 0x37, 0x39, 0x30, 0x36, 0x36, 0x33, 0x35]);
 * const command = GetContentByObisResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 2,
 *     content: '57906635'
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/uplink/GetContentByObis.md)
 */
class GetContentByObisResponse extends Command {
    constructor ( public parameters: IGetContentByObisResponseParameters ) {
        super();

        // request id size + 1 content size byte + content size
        this.size = REQUEST_ID_SIZE + 1 + this.parameters.content.length;
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

        return new GetContentByObisResponse({requestId, content});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(this.size);
        const {requestId, content} = this.parameters;

        buffer.setUint8(requestId);
        buffer.setString(content);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetContentByObisResponse;
