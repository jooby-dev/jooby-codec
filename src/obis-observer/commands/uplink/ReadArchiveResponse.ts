import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters, IObisValueFloat, DATE_TIME_SIZE} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {TTime2000} from '../../../utils/time.js';


/**
 * IReadArchiveResponseParameters command parameters
 */
interface IReadArchiveResponseParameters extends ICommandParameters {
    isCompleted: boolean,
    meterId?: number,
    time2000?: TTime2000,
    obisValueList: Array<IObisValueFloat>
}

const COMMAND_ID = 0x10;

// request id byte isCompleted byte
const COMMAND_HEADER_SIZE = REQUEST_ID_SIZE + 1;

const examples: TCommandExampleList = [
    {
        name: 'response to ReadArchive from 2023-12-23 04:00:00 GMT for meter 4',
        parameters: {
            requestId: 34,
            isCompleted: true,
            meterId: 4,
            time2000: 756619200,
            obisValueList: [
                {code: 50, content: 22.27},
                {code: 56, content: 89.33}
            ]
        },
        hex: {header: '10 11', body: '22 01 04 2d 19 17 c0 32 41 b2 28 f6 38 42 b2 a8 f6'}
    },
    {
        name: 'response to ReadArchive for meter 3',
        parameters: {
            requestId: 34,
            isCompleted: true,
            meterId: 3,
            obisValueList: []
        },
        hex: {header: '10 03', body: '22 01 03'}
    },
    {
        name: 'response to ReadArchive without data',
        parameters: {
            requestId: 34,
            isCompleted: true,
            obisValueList: []
        },
        hex: {header: '10 02', body: '22 01'}
    }
];

const commandSize = ( parameters: IReadArchiveResponseParameters ): number => {
    let size = COMMAND_HEADER_SIZE;

    if ( parameters.meterId ) {
        size += 1;

        if ( parameters.time2000 ) {
            size += DATE_TIME_SIZE;

            // + obis values list list of code 1 byte with float content 4 bytes
            parameters.obisValueList.forEach(obisId => {
                size += CommandBinaryBuffer.getObisContentSize(obisId);
            });
        }
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
 *     0x22, 01, 03, 0x02, 0x2d, 0x19, 0x17, 0xc0, 0x32, 0x41, 0xb2, 0x28, 0xf6, 0x38, 0x42, 0xb2, 0xa8, 0xf6
 * ]);
 * const command = ReadArchiveResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 34,
 *     isCompleted: true,
 *     meterId: 03,
 *     time2000: 756619200,
 *     obisValueList: [
 *         {code: 50, content: 22.27},
 *         {code: 56, content: 89.33}
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
        const isCompleted = buffer.getUint8() !== 0;
        const obisValueList:Array<IObisValueFloat> = [];

        if ( buffer.isEmpty) {
            return new ReadArchiveResponse({requestId, isCompleted, obisValueList});
        }

        const meterId = buffer.getUint8();

        if ( buffer.isEmpty) {
            return new ReadArchiveResponse({requestId, isCompleted, meterId, obisValueList});
        }

        const time2000 = buffer.getUint32();

        while ( !buffer.isEmpty ) {
            const obisValue = buffer.getObisValueFloat();

            obisValueList.push(obisValue);
        }

        return new ReadArchiveResponse({requestId, isCompleted, meterId, time2000, obisValueList});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {requestId, isCompleted, meterId, time2000, obisValueList} = this.parameters;
        const buffer = new CommandBinaryBuffer(this.size as number);

        buffer.setUint8(requestId);
        buffer.setUint8(isCompleted ? 1 : 0);

        if ( meterId ) {
            buffer.setUint8(meterId);
            if ( time2000 ) {
                buffer.setUint32(time2000);
                obisValueList.forEach(obisValue => buffer.setObisValueFloat(obisValue));
            }
        }

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default ReadArchiveResponse;
