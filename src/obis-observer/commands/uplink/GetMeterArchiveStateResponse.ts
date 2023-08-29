import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters, DATE_TIME_SIZE} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {TTime2000} from '../../../utils/time.js';


/**
 * IGetMeterArchiveStateResponseParameters command parameters
 */
interface IGetMeterArchiveStateResponseParameters extends ICommandParameters {
    archiveRecordsNumber: number,
    eldestTime2000: TTime2000,
    newestTime2000: TTime2000
}

const COMMAND_ID = 0x7d;

// request id byte + records count + DateTime 4 bytes * 2
const COMMAND_SIZE = REQUEST_ID_SIZE + 4 + DATE_TIME_SIZE * 2;

const examples: TCommandExampleList = [
    {
        name: 'response to GetMeterArchiveState. no archive records',
        parameters: {
            requestId: 2,
            archiveRecordsNumber: 0,
            eldestTime2000: 0,
            newestTime2000: 0
        },
        hex: {header: '7d 0d', body: '02 00 00 00 00 00 00 00 00 00 00 00 00'}
    },
    {
        name: 'response to GetMeterArchiveState. 81 records from 2023.06.27 18:45:02 GMT to 2023.06.28 15:15:02 GMT',
        parameters: {
            requestId: 2,
            archiveRecordsNumber: 81,
            eldestTime2000: 741206702,
            newestTime2000: 741280502
        },
        hex: {header: '7d 0d', body: '02 00 00 00 51 2c 2d ea ae 2c 2f 0a f6'}
    },
    {
        name: 'response to GetMeterArchiveState without data',
        parameters: {
            requestId: 2
        },
        hex: {header: '7d 01', body: '02'}
    }
];

const isValidParameterSet = ( parameters: IGetMeterArchiveStateResponseParameters | ICommandParameters ): boolean => {
    const {requestId, archiveRecordsNumber, eldestTime2000, newestTime2000} = parameters as IGetMeterArchiveStateResponseParameters;

    return requestId !== undefined
        && archiveRecordsNumber !== undefined
        && eldestTime2000 !== undefined
        && newestTime2000 !== undefined;
};


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetMeterArchiveStateResponse from 'jooby-codec/obis-observer/commands/uplink/GetMeterArchiveStateResponse.js';
 *
 * const commandBody = new Uint8Array([
 *     0x02, 0x00, 0x00, 0x00, 0x51, 0x2c, 0x2d, 0xea, 0xae, 0x2c, 0x2f, 0x0a, 0xf6
 * ]);
 * const command = GetMeterArchiveStateResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 2,
 *     archiveRecordsNumber: 81,
 *     eldestTime2000: 741206702,
 *     newestTime2000: 741280502
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetMeterArchiveState.md#response)
 */
class GetMeterArchiveStateResponse extends Command {
    constructor ( public parameters: IGetMeterArchiveStateResponseParameters | ICommandParameters ) {
        super();

        this.size = isValidParameterSet(parameters) ? COMMAND_SIZE : REQUEST_ID_SIZE;
    }

    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);
        const requestId = buffer.getUint8();

        return buffer.isEmpty
            ? new GetMeterArchiveStateResponse({requestId} as ICommandParameters)
            : new GetMeterArchiveStateResponse({
                requestId,
                archiveRecordsNumber: buffer.getUint32(),
                eldestTime2000: buffer.getUint32(),
                newestTime2000: buffer.getUint32()
            });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( !isValidParameterSet(this.parameters) ) {
            return Command.toBytes(COMMAND_ID, new Uint8Array([this.parameters.requestId]));
        }

        const buffer = new CommandBinaryBuffer(COMMAND_SIZE);
        const {requestId, archiveRecordsNumber, eldestTime2000, newestTime2000} = this.parameters as IGetMeterArchiveStateResponseParameters;

        buffer.setUint8(requestId);
        buffer.setUint32(archiveRecordsNumber);
        buffer.setUint32(eldestTime2000);
        buffer.setUint32(newestTime2000);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetMeterArchiveStateResponse;
