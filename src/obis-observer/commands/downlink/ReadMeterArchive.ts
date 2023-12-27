import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, METER_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../../constants/directions.js';


/**
 * IReadMeterArchiveParameters command parameters
 */
interface IReadMeterArchiveParameters extends ICommandParameters {
    archiveType: number,
    index: number,
    meterId: number
}


const COMMAND_ID = 0x11;
const COMMAND_SIZE = REQUEST_ID_SIZE + METER_ID_SIZE + 5;

const examples: TCommandExampleList = [

    {
        name: 'request to read all archive 1 for the meter 2 starts with index 4',
        parameters: {
            requestId: 3,
            archiveType: 1,
            index: 4,
            meterId: 2
        },
        hex: {header: '11 0a', body: '03 01 00 00 00 04 00 00 00 02'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import ReadMeterArchive from 'jooby-codec/obis-observer/commands/downlink/ReadMeterArchive.js';
 *
 * const parameters = {
 *     requestId: 3,
 *     archiveType: 1,
 *     index: 4,
 *     meterId: 2
 * };
 * const command = new ReadMeterArchive(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 11 0a 03 01 00 00 00 04 00 00 00 02
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/ReadMeterArchive.md#request)
 */
class ReadMeterArchive extends Command {
    constructor ( public parameters: IReadMeterArchiveParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new ReadMeterArchive({
            requestId: buffer.getUint8(),
            archiveType: buffer.getUint8(),
            index: buffer.getUint32(),
            meterId: buffer.getUint32()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {requestId, archiveType, index, meterId} = this.parameters;
        const buffer = new CommandBinaryBuffer(this.size as number);

        buffer.setUint8(requestId);
        buffer.setUint8(archiveType);
        buffer.setUint32(index);
        buffer.setUint32(meterId);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default ReadMeterArchive;
