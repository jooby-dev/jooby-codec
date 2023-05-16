import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {ICommandParameters, REQUEST_ID_SIZE} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * IGetContentByShortNameParameters command parameters
 */
interface IGetContentByShortNameParameters extends ICommandParameters {
    requestId: number,
    shortName: number
}


const COMMAND_ID = 0x17;

const examples: TCommandExampleList = [
    {
        name: 'get content for short name 50',
        parameters: {
            requestId: 121,
            shortName: 50
        },
        hex: {header: '17', body: '79 32'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetContentByShortName from 'jooby-codec/obis-observer/commands/downlink/GetContentByShortName.js';
 *
 * const parameters = {
 *     requestId: 121,
 *     shortName: 50
 * };
 * const command = new GetContentByShortName(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 17 79 32
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetContentByShortName.md#request)
 */
class GetContentByShortName extends Command {
    constructor ( public parameters: IGetContentByShortNameParameters ) {
        super();

        // request id size + short name 1 byte
        this.size = REQUEST_ID_SIZE + 1;
    }

    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;

    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new GetContentByShortName({requestId: buffer.getUint8(), shortName: buffer.getUint8()});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const buffer = new CommandBinaryBuffer(this.size);
        const {requestId, shortName} = this.parameters;

        buffer.setUint8(requestId);
        buffer.setUint8(shortName);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetContentByShortName;
