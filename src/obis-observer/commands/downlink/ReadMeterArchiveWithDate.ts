import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, METER_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../../constants/directions.js';
import {TTime2000} from '../../../utils/time.js';


/**
 * IReadMeterArchiveWithDateParameters command parameters
 */
interface IReadMeterArchiveWithDateParameters extends ICommandParameters {
    archiveType: number,
    index: number,
    meterId: number,
    time2000: TTime2000
}


const COMMAND_ID = 0x13;
const COMMAND_SIZE = REQUEST_ID_SIZE + METER_ID_SIZE + 9;

const examples: TCommandExampleList = [

    {
        name: 'request to read all archive 2 for the meter 1 starts with index 0 for the date 15-09-23 14:24:22',
        parameters: {
            requestId: 3,
            archiveType: 2,
            index: 0,
            meterId: 1,
            time2000: 496333462
        },
        hex: {header: '13 0e', body: '03 02 00 00 00 00 00 00 00 01 1d 95 72 96'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import ReadMeterArchiveWithDate from 'jooby-codec/obis-observer/commands/downlink/ReadMeterArchiveWithDate.js';
 *
 * const parameters = {
 *     requestId: 3,
 *     archiveType: 2,
 *     index: 0,
 *     meterId: 1,
 *     time2000: 496333462
 * };
 * const command = new ReadMeterArchiveWithDate(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 13 0e 03 02 00 00 00 00 00 00 00 01 1d 95 72 96
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/ReadMeterArchiveWithDate.md#request)
 */
class ReadMeterArchiveWithDate extends Command {
    constructor ( public parameters: IReadMeterArchiveWithDateParameters ) {
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

        return new ReadMeterArchiveWithDate({
            requestId: buffer.getUint8(),
            archiveType: buffer.getUint8(),
            index: buffer.getUint32(),
            meterId: buffer.getUint32(),
            time2000: buffer.getUint32()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {requestId, archiveType, index, meterId, time2000} = this.parameters;
        const buffer = new CommandBinaryBuffer(this.size as number);

        buffer.setUint8(requestId);
        buffer.setUint8(archiveType);
        buffer.setUint32(index);
        buffer.setUint32(meterId);
        buffer.setUint32(time2000);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default ReadMeterArchiveWithDate;
