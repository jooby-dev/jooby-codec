import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {ICommandParameters, REQUEST_ID_SIZE} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * IGetObisContentByIdParameters command parameters
 */
interface IGetObisContentByIdParameters extends ICommandParameters {
    requestId: number,
    obisId: number
}


const COMMAND_ID = 0x4e;

const examples: TCommandExampleList = [
    {
        name: 'get content for obisId 50',
        parameters: {
            requestId: 121,
            obisId: 50
        },
        hex: {header: '4e', body: '79 32'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetObisContentById from 'jooby-codec/obis-observer/commands/downlink/GetObisContentById.js';
 *
 * const parameters = {
 *     requestId: 121,
 *     obisId: 50
 * };
 * const command = new GetObisContentById(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 4e 02 79 32
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetObisContentById.md#request)
 */
class GetObisContentById extends Command {
    constructor ( public parameters: IGetObisContentByIdParameters ) {
        super();

        // request id size + obisId 1 byte
        this.size = REQUEST_ID_SIZE + 1;
    }

    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;

    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new GetObisContentById({
            requestId: buffer.getUint8(),
            obisId: buffer.getUint8()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const buffer = new CommandBinaryBuffer(this.size);
        const {requestId, obisId} = this.parameters;

        buffer.setUint8(requestId);
        buffer.setUint8(obisId);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetObisContentById;
