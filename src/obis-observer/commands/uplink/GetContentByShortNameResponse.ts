import roundNumber from '../../../utils/roundNumber.js';
import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


/**
 * IGetContentByShortNameResponseParameters command parameters
 */
interface IGetContentByShortNameResponseParameters extends ICommandParameters {
    /** obis code content from the metering device */
    content: number
}

const COMMAND_ID = 0x18;

const examples: TCommandExampleList = [
    {
        name: 'simple response',
        parameters: {
            requestId: 121,
            content: 344.23
        },
        hex: {header: '18', body: '79 43 ac 1d 71'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetContentByShortNameResponse from 'jooby-codec/obis-observer/commands/uplink/GetContentByShortNameResponse.js';
 *
 * const commandBody = new Uint8Array([0x79, 0x43, 0xac, 0x1d, 0x71]);
 * const command = GetContentByShortNameResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 121,
 *     content: 344.23
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetContentByShortName.md#response-with-float-content)
 */
class GetContentByShortNameResponse extends Command {
    constructor ( public parameters: IGetContentByShortNameResponseParameters ) {
        super();

        // request id byte + obis float32 content 4 bytes
        this.size = REQUEST_ID_SIZE + 4;
    }

    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        const requestId = buffer.getUint8();
        const content = roundNumber(buffer.getFloat32());

        return new GetContentByShortNameResponse({requestId, content});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const buffer = new CommandBinaryBuffer(this.size);
        const {requestId, content} = this.parameters;

        buffer.setUint8(requestId);
        buffer.setFloat32(roundNumber(content));

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetContentByShortNameResponse;
