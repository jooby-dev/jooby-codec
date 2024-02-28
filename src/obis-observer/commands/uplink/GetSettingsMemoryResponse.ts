import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../../constants/directions.js';
import mergeUint8Arrays from '../../../utils/mergeUint8Arrays.js';
import getBytesFromHex from '../../../utils/getBytesFromHex.js';
//import {HEX} from '../../../constants/bytesConversionFormats.js';
//import {TBytesConversionFormatOptions, getStringFromBytes} from '../../../utils/bytesConversion.js';


/**
 * IGetSettingsMemoryResponseParameters command parameters
 */
interface IGetSettingsMemoryResponseParameters extends ICommandParameters {
    settingsMemorySize: number,
    offset: number,
    data: Uint8Array
}

const COMMAND_ID = 0x91;

// request id + settingsMemorySize + offset + data
const COMMAND_HEADER_SIZE = REQUEST_ID_SIZE + 4 + 4;


const examples: TCommandExampleList = [
    {
        name: 'get memory response',
        parameters: {
            requestId: 2,
            settingsMemorySize: 10,
            offset: 2,
            data: getBytesFromHex('00 0102 03')
        },
        hex: {header: '91 0d', body: '02 00 00 00 0a 00 00 00 02 00 01 02 03'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetSettingsMemoryResponse from 'jooby-codec/obis-observer/commands/uplink/GetSettingsMemoryResponse.js';
 *
 * const commandBody = new Uint8Array([
 *     0x02, 0x00, 0x00, 0x00, 0x0a, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0x02, 0x03
 * ]);
 * const command = GetSettingsMemoryResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 2,
 *     settingsMemorySize: 10,
 *     offset: 2,
 *     data: [0x00, 0x01, 0x02, 0x03]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetSettingsMemory.md#response)
 */
class GetSettingsMemoryResponse extends Command {
    constructor ( public parameters: IGetSettingsMemoryResponseParameters ) {
        super();

        this.size = COMMAND_HEADER_SIZE + parameters.data.length;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        const requestId = buffer.getUint8();
        const settingsMemorySize = buffer.getUint32();
        const offset = buffer.getUint32();
        const memoryData = data.slice(COMMAND_HEADER_SIZE);

        return new GetSettingsMemoryResponse({requestId, settingsMemorySize, offset, data: memoryData});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {requestId, settingsMemorySize, offset, data} = this.parameters;
        const buffer = new CommandBinaryBuffer(COMMAND_HEADER_SIZE);

        buffer.setUint8(requestId);
        buffer.setUint32(settingsMemorySize);
        buffer.setUint32(offset);

        return Command.toBytes(
            COMMAND_ID,
            // combine header and image data
            mergeUint8Arrays(buffer.toUint8Array(), data)
        );
    }
}


export default GetSettingsMemoryResponse;
