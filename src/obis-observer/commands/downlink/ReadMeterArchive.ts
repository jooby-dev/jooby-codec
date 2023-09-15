import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters, DATE_TIME_SIZE} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';
import {TTime2000} from '../../../utils/time.js';


/**
 * IReadArchiveParameters command parameters
 */
interface IReadArchiveParameters extends ICommandParameters {
    archiveType: number,
    startIndex: number,
    meterId?: number,
    time2000?: TTime2000
}


const COMMAND_ID = 0x11;
const COMMAND_SIZE = REQUEST_ID_SIZE + 2;

const examples: TCommandExampleList = [
    {
        name: 'request to read all archive 1',
        parameters: {
            requestId: 3,
            archiveType: 1,
            startIndex: 0
        },
        hex: {header: '11 03', body: '03 01 00'}
    },
    {
        name: 'request to read all archive 1 for the meter 2 starts with index 4',
        parameters: {
            requestId: 3,
            archiveType: 1,
            startIndex: 4,
            meterId: 2
        },
        hex: {header: '11 04', body: '03 01 04 02'}
    },
    {
        name: 'request to read archive 1 from 2023.12.23 00:00:00 GMT for meter 5',
        parameters: {
            requestId: 33,
            archiveType: 1,
            startIndex: 0,
            meterId: 5,
            time2000: 756604800
        },
        hex: {header: '11 08', body: '21 01 00 05 2d 18 df 80'}
    },
    {
        name: 'request archive 2 from 2023-12-23 04:00:00 GMT for meter 6',
        parameters: {
            requestId: 34,
            archiveType: 2,
            startIndex: 0,
            meterId: 6,
            time2000: 756619200
        },
        hex: {header: '11 08', body: '22 02 00 06 2d 19 17 c0'}
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
 *     meterId: 5,
 *     archiveType: 2,
 *     time2000: 756619200
 * };
 * const command = new ReadMeterArchive(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 7f 07 05 22 02 2d 19 17 c0
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/ReadMeterArchive.md#request)
 */
class ReadMeterArchive extends Command {
    constructor ( public parameters: IReadArchiveParameters ) {
        super();

        this.size = COMMAND_SIZE
            + (parameters.meterId ? 1 : 0)
            + (parameters.time2000 ? DATE_TIME_SIZE : 0);
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        const requestId = buffer.getUint8();
        const archiveType = buffer.getUint8();
        const startIndex = buffer.getUint8();

        if ( buffer.isEmpty ) {
            return new ReadMeterArchive({requestId, archiveType, startIndex});
        }

        const meterId = buffer.getUint8();
        return buffer.isEmpty
            ? new ReadMeterArchive({requestId, archiveType, startIndex, meterId})
            : new ReadMeterArchive({requestId, archiveType, startIndex, meterId, time2000: buffer.getUint32()});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {requestId, archiveType, startIndex, meterId, time2000} = this.parameters;
        const buffer = new CommandBinaryBuffer(this.size as number);

        buffer.setUint8(requestId);
        buffer.setUint8(archiveType);
        buffer.setUint8(startIndex);

        if ( meterId ) {
            buffer.setUint8(meterId);

            if (time2000) {
                buffer.setUint32(time2000);
            }
        }

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default ReadMeterArchive;
