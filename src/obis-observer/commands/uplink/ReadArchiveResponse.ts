import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters, IObisValueFloat, DATE_TIME_SIZE} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {TTime2000} from '../../../utils/time.js';
import roundNumber from '../../../utils/roundNumber.js';


interface IArchiveRecord {
    meterId: number,
    time2000: TTime2000,
    obisValueList: Array<IObisValueFloat>
}

/**
 * IReadArchiveResponseParameters command parameters
 */
interface IReadArchiveResponseParameters extends ICommandParameters {
    isCompleted: boolean,
    content: Array<IArchiveRecord>
}

const COMMAND_ID = 0x16;

// request id byte isCompleted byte
const COMMAND_HEADER_SIZE = REQUEST_ID_SIZE + 1;

const examples: TCommandExampleList = [
    {
        name: 'response to ReadArchive from 2023-12-23 04:00:00 GMT for meter 4',
        parameters: {
            requestId: 12,
            isCompleted: true,
            content: [
                {
                    meterId: 1,
                    time2000: 464784480,
                    obisValueList: [{code: 8, content: 0.40}]
                },
                {
                    meterId: 2,
                    time2000: 464784416,
                    obisValueList: [{code: 8, content: 0.20}]
                }
            ]
        },
        hex: {header: '16 17', body: '0c 01 01 1b b4 0c 60 08 3e cc cc cd 00 02 1b b4 0c 20 08 3e 4c cc cd'}
    },
    {
        name: 'response to ReadArchive without data',
        parameters: {
            requestId: 34,
            isCompleted: true,
            content: []
        },
        hex: {header: '16 02', body: '22 01'}
    }
];

const commandSize = ( parameters: IReadArchiveResponseParameters ): number => {
    let size = COMMAND_HEADER_SIZE;
    let datesInContent = 0;

    for ( let it = 0; it < parameters.content.length; ++it ) {
        const obisValues = parameters.content[it].obisValueList;

        if ( obisValues.length !== 0 ) {
            // meterId + date
            size += 1 + DATE_TIME_SIZE;
            // 1 byte obis id + 4 byte float value for each obis value
            size += (1 + 4) * obisValues.length;

            datesInContent++;
        }
    }

    if ( datesInContent !== 0 ) {
        // 1 byte for each date except the last - date end flag
        size += datesInContent - 1;
    }

    return size;
};


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import ReadArchiveResponse from 'jooby-codec/obis-observer/commands/uplink/ReadArchiveResponse.js';
 *
 * const commandBody = new Uint8Array([
 *     0x0c, 0x01, 0x01, 0x1b, 0xb4, 0x0c, 0x60, 0x08, 0x3e, 0xcc, 0xcc, 0xcd, 0x00, 0x02, 0x1b, 0xb4, 0x0c, 0x20, 0x08, 0x3e, 0x4c, 0xcc, 0xcd
 * ]);
 * const command = ReadArchiveResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 12,
 *     isCompleted: true,
 *     content: [
 *         {
 *             meterId: 1,
 *             time2000: 464784480,
 *             obisValueList: [{code: 8, content: 0.40}]
 *         },
 *         {
 *             meterId: 2,
 *             time2000: 464784416,
 *             obisValueList: [{code: 8, content: 0.20}]
 *         }
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/ReadArchive.md#response)
 */
class ReadArchiveResponse extends Command {
    constructor ( public parameters: IReadArchiveResponseParameters) {
        super();

        this.size = commandSize(parameters);
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);
        const requestId = buffer.getUint8();
        const isCompleted = buffer.isEmpty ? true : buffer.getUint8() !== 0;
        const content:Array<IArchiveRecord> = [];

        if ( buffer.isEmpty ) {
            return new ReadArchiveResponse({requestId, isCompleted, content});
        }

        while ( !buffer.isEmpty ) {
            const record: IArchiveRecord = {
                meterId: buffer.getUint8(),
                time2000: buffer.getUint32(),
                obisValueList: []
            };

            while ( !buffer.isEmpty ) {
                const code = buffer.getUint8();
                if ( code === 0) {
                    break;
                }

                record.obisValueList.push({code, content: roundNumber(buffer.getFloat32())});
            }

            content.push(record);
        }

        return new ReadArchiveResponse({requestId, isCompleted, content});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {requestId, isCompleted, content} = this.parameters;
        const buffer = new CommandBinaryBuffer(this.size as number);

        buffer.setUint8(requestId);
        buffer.setUint8(isCompleted ? 1 : 0);

        for ( let it = 0; it < content.length; ++it ) {
            if ( it !== 0) {
                // end of date flag
                buffer.setUint8(0);
            }

            const {meterId, time2000, obisValueList} = content[it];

            buffer.setUint8(meterId);
            buffer.setUint32(time2000);
            obisValueList.forEach(obisValue => buffer.setObisValueFloat(obisValue));
        }


        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default ReadArchiveResponse;
