import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * IReadArchiveParameters command parameters
 */
interface IReadArchiveParameters extends ICommandParameters {
    archiveType: number,
    index: number
}


const COMMAND_ID = 0x15;
const COMMAND_SIZE = REQUEST_ID_SIZE + 5;

const examples: TCommandExampleList = [

    {
        name: 'request to read all archive 1 starts with index 4',
        parameters: {
            requestId: 3,
            archiveType: 1,
            index: 4
        },
        hex: {header: '15 06', body: '03 01 00 00 00 04'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import ReadArchive from 'jooby-codec/obis-observer/commands/downlink/ReadArchive.js';
 *
 * const parameters = {
 *     requestId: 3,
 *     archiveType: 1,
 *     index: 4,
 * };
 * const command = new ReadArchive(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 15 06 03 01 00 00 00 04
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/ReadArchive.md#request)
 */
class ReadArchive extends Command {
    constructor ( public parameters: IReadArchiveParameters ) {
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

        return new ReadArchive({
            requestId: buffer.getUint8(),
            archiveType: buffer.getUint8(),
            index: buffer.getUint32()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {requestId, archiveType, index} = this.parameters;
        const buffer = new CommandBinaryBuffer(this.size as number);

        buffer.setUint8(requestId);
        buffer.setUint8(archiveType);
        buffer.setUint32(index);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default ReadArchive;
