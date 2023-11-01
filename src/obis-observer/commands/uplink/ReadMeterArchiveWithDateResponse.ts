import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters, IObisValueFloat} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../../constants/directions.js';


/**
 * IReadMeterArchiveWithDateResponseParameters command parameters
 */
interface IReadMeterArchiveWithDateResponseParameters extends ICommandParameters {
    isCompleted: boolean,
    obisValueList: Array<IObisValueFloat>
}

const COMMAND_ID = 0x14;

// request id byte isCompleted byte
const COMMAND_HEADER_SIZE = REQUEST_ID_SIZE + 1;

const examples: TCommandExampleList = [
    {
        name: 'response to ReadMeterArchiveWithDate from 2023-12-23 04:00:00 GMT for meter 4',
        parameters: {
            requestId: 12,
            isCompleted: true,
            obisValueList: [{
                code: 8,
                content: 3.60
            }]
        },
        hex: {header: '14 07', body: '0c 01 08 40 66 66 66'}
    },
    {
        name: 'response to ReadMeterArchiveWithDate without data',
        parameters: {
            requestId: 34,
            isCompleted: true,
            obisValueList: []
        },
        hex: {header: '14 02', body: '22 01'}
    }
];

const commandSize = ( parameters: IReadMeterArchiveWithDateResponseParameters ): number => {
    let size = COMMAND_HEADER_SIZE;

    // + obis values list list of code 1 byte with float content 4 bytes
    parameters.obisValueList.forEach(obisId => {
        size += CommandBinaryBuffer.getObisContentSize(obisId);
    });

    return size;
};


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import ReadMeterArchiveWithDateResponse from 'jooby-codec/obis-observer/commands/uplink/ReadMeterArchiveWithDateResponse.js';
 *
 * const commandBody = new Uint8Array([
 *     0x11, 0x01, 0x08, 0x40, 0x66, 0x66, 0x66
 * ]);
 * const command = ReadMeterArchiveWithDateResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 12,
 *     isCompleted: true,
 *     obisValueList: [{code: 8, content: 3.60}]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/ReadMeterArchiveWithDate.md#response)
 */
class ReadMeterArchiveWithDateResponse extends Command {
    constructor ( public parameters: IReadMeterArchiveWithDateResponseParameters) {
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
        const obisValueList:Array<IObisValueFloat> = [];

        if ( buffer.isEmpty ) {
            return new ReadMeterArchiveWithDateResponse({requestId, isCompleted, obisValueList});
        }

        while ( !buffer.isEmpty ) {
            obisValueList.push(buffer.getObisValueFloat());
        }

        return new ReadMeterArchiveWithDateResponse({requestId, isCompleted, obisValueList});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {requestId, isCompleted, obisValueList} = this.parameters;
        const buffer = new CommandBinaryBuffer(this.size as number);

        buffer.setUint8(requestId);
        buffer.setUint8(isCompleted ? 1 : 0);
        obisValueList.forEach(obisValue => buffer.setObisValueFloat(obisValue));

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default ReadMeterArchiveWithDateResponse;
