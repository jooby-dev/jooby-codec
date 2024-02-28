import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {ICommandParameters, REQUEST_ID_SIZE} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../../constants/directions.js';


/**
 * IGetSettingsMemoryParameters command parameters
 */
interface IGetSettingsMemoryParameters extends ICommandParameters {
    offset: number,
    size?: number
}


const COMMAND_ID = 0x90;

const examples: TCommandExampleList = [
    {
        name: 'get settings memory block',
        parameters: {
            requestId: 5,
            offset: 16,
            size: 4
        },
        hex: {header: '90 09', body: '05 00 00 00 10 00 00 00 04'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetSettingsMemory from 'jooby-codec/obis-observer/commands/downlink/GetSettingsMemory.js';
 *
 * const parameters = {
 *     requestId: 8,
 *     offset: 16,
 *     size: 4
 * };
 * const command = new GetSettingsMemory(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 90 09 05 00 00 00 10 00 00 00 04
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetSettingsMemory.md#request)
 */
class GetSettingsMemory extends Command {
    constructor ( public parameters: IGetSettingsMemoryParameters ) {
        super();

        this.size = REQUEST_ID_SIZE + 4 + ((parameters.size && parameters.size !== 0) ? 4 : 0);
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new GetSettingsMemory({
            requestId: buffer.getUint8(),
            offset: buffer.getUint32(),
            size: buffer.getUint32()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {requestId, offset, size} = this.parameters;
        const buffer = new CommandBinaryBuffer(this.size);

        buffer.setUint8(requestId);
        buffer.setUint32(offset);
        if ( size && size !== 0 ) {
            buffer.setUint32(size);
        }

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetSettingsMemory;
