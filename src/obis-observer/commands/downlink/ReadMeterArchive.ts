import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters, DATE_TIME_SIZE} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';
import {TTime2000} from '../../../utils/time.js';


/**
 * IReadMeterArchiveParameters command parameters
 */
interface IReadMeterArchiveParameters extends ICommandParameters {
    meterId: number,
    archiveType: number,
    time2000: TTime2000
}


const COMMAND_ID = 0x7f;
const COMMAND_SIZE = REQUEST_ID_SIZE + 2 + DATE_TIME_SIZE;

const examples: TCommandExampleList = [
    {
        name: 'request archive 1 from 2023.12.23 00:00:00 GMT',
        parameters: {
            requestId: 33,
            meterId: 5,
            archiveType: 1,
            time2000: 756604800
        },
        hex: {header: '7f 07', body: '21 05 01 2d 18 df 80'}
    },
    {
        name: 'request archive 2 from 2023-12-23 04:00:00 GMT',
        parameters: {
            requestId: 34,
            meterId: 5,
            archiveType: 2,
            time2000: 756619200
        },
        hex: {header: '7f 07', body: '22 05 02 2d 19 17 c0'}
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
            meterId: buffer.getUint8(),
            archiveType: buffer.getUint8(),
            time2000: buffer.getUint32()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const {requestId, meterId, archiveType, time2000} = this.parameters;
        const buffer = new CommandBinaryBuffer(this.size);

        buffer.setUint8(requestId);
        buffer.setUint8(meterId);
        buffer.setUint8(archiveType);
        buffer.setUint32(time2000);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default ReadMeterArchive;
