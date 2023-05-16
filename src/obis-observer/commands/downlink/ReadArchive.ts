import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';
import {archiveTypes} from '../../constants/index.js';


/**
 * IReadArchiveParameters command parameters
 */
interface IReadArchiveParameters extends ICommandParameters {
    archiveType: number,
    time: number
}


const COMMAND_ID = 0x11;
const COMMAND_SIZE = REQUEST_ID_SIZE + 5;

const examples: TCommandExampleList = [
    {
        name: 'request detailed archive from 2023-12-22 23:40:00 GMT',
        parameters: {
            requestId: 33,
            archiveType: archiveTypes.DETAILED,
            time: 756604800
        },
        hex: {header: '11', body: '21 01 2d 18 df 80'}
    },
    {
        name: 'request summary archive from 2023-12-22 23:40:00 GMT',
        parameters: {
            requestId: 34,
            archiveType: archiveTypes.SUMMARY,
            time: 756619200
        },
        hex: {header: '11', body: '22 02 2d 19 17 c0'}
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
 *     requestId: 34,
 *     archiveType: 2,
 *     time: 756619200
 * };
 * const command = new ReadArchive(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 11 22 02 2d 19 17 c0
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
            time: buffer.getUint32()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const {requestId, archiveType, time} = this.parameters;

        const buffer = new CommandBinaryBuffer(this.size);

        buffer.setUint8(requestId);
        buffer.setUint8(archiveType);
        buffer.setUint32(time);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default ReadArchive;
