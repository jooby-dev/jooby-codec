import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters, IShortNameFloat, DATE_TIME_SIZE} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {TTime2000} from '../../../utils/time.js';


/**
 * IReadArchiveResponseParameters command parameters
 */
interface IReadArchiveResponseParameters extends ICommandParameters {
    time2000: TTime2000,
    shortNameList: Array<IShortNameFloat>
}

const COMMAND_ID = 0x12;
// request id byte + DateTime 4 bytes
const COMMAND_HEADER_SIZE = REQUEST_ID_SIZE + DATE_TIME_SIZE;

const examples: TCommandExampleList = [
    {
        name: 'archive from 2023-12-23 04:00:00 GMT',
        parameters: {
            requestId: 34,
            time2000: 756619200,
            shortNameList: [
                {code: 50, content: 22.27},
                {code: 56, content: 89.33}
            ]
        },
        hex: {header: '12', body: '0f 22 2d 19 17 c0 32 41 b2 28 f6 38 42 b2 a8 f6'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import ReadArchiveResponse from 'jooby-codec/obis-observer/commands/uplink/ReadArchiveResponse.js';
 *
 * const commandBody = new Uint8Array([
 *     0x10, 0x22, 0x02, 0x2d, 0x19, 0x17, 0xc0, 0x32, 0x41, 0xb2, 0x28, 0xf6, 0x38, 0x42, 0xb2, 0xa8, 0xf6
 * ]);
 * const command = ReadArchiveResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 34,
 *     time2000: 756619200,
 *     shortNameList: [
 *         {code: 50, content: 22.27},
 *         {code: 56, content: 89.33}
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/ReadArchive.md#response)
 */
class ReadArchiveResponse extends Command {
    constructor ( public parameters: IReadArchiveResponseParameters ) {
        super();

        // size byte + header
        let size = 1 + COMMAND_HEADER_SIZE;

        // + short name list of code 1 byte with float content 4 bytes
        this.parameters.shortNameList.forEach(shortName => {
            size += CommandBinaryBuffer.getShortNameContentSize(shortName);
        });

        this.size = size;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        let size = buffer.getUint8() - COMMAND_HEADER_SIZE;
        const requestId = buffer.getUint8();
        const time2000 = buffer.getUint32();
        const shortNameList = [];

        while ( size ) {
            const shortName = buffer.getShortNameFloat();

            size -= CommandBinaryBuffer.getShortNameContentSize(shortName);
            shortNameList.push(shortName);
        }

        return new ReadArchiveResponse({requestId, time2000, shortNameList});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const buffer = new CommandBinaryBuffer(this.size);
        const {requestId, time2000, shortNameList} = this.parameters;

        // subtract size byte
        buffer.setUint8(this.size - 1);
        buffer.setUint8(requestId);
        buffer.setUint32(time2000);
        shortNameList.forEach(shortName => buffer.setShortNameFloat(shortName));

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default ReadArchiveResponse;
