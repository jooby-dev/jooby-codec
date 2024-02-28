import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, METER_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../../constants/directions.js';


/**
 * IGetMeterIdListResponseParameters command parameters
 */
interface IGetMeterIdListResponseParameters extends ICommandParameters {
    isCompleted: boolean,
    meterIdList: Array<number>
}

const COMMAND_ID = 0x75;

const examples: TCommandExampleList = [
    {
        name: 'response to GetMeterIdList with two meterId',
        parameters: {
            requestId: 4,
            isCompleted: true,
            meterIdList: [1, 2]
        },
        hex: {header: '75 0a', body: '04 01 00 00 00 01 00 00 00 02'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetMeterIdListResponse from 'jooby-codec/obis-observer/commands/uplink/GetMeterIdList.js';
 *
 * const commandBody = new Uint8Array([0x04, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x02]);
 * const command = GetMeterIdListResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 4,
 *     isCompleted: true,
 *     meterIdList: [1, 2]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetMeterIdList.md#response)
 */
class GetMeterIdListResponse extends Command {
    constructor ( public parameters: IGetMeterIdListResponseParameters ) {
        super();

        // body size = request id byte + isCompleted byte + meterIdList 0-n bytes
        this.size = REQUEST_ID_SIZE + 1 + parameters.meterIdList.length * METER_ID_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        const requestId = buffer.getUint8();
        const isCompleted = buffer.isEmpty ? 1 : buffer.getUint8();
        const meterIdList = buffer.isEmpty
            ? []
            : [...new Array<number>(buffer.bytesLeft / METER_ID_SIZE)].map(() => buffer.getUint32());

        return new GetMeterIdListResponse({requestId, isCompleted: isCompleted !== 0, meterIdList});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(this.size);
        const {requestId, isCompleted, meterIdList} = this.parameters;

        buffer.setUint8(requestId);
        buffer.setUint8(isCompleted ? 1 : 0);
        meterIdList.forEach(meterId => buffer.setUint32(meterId));

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetMeterIdListResponse;
