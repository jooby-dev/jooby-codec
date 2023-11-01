import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../../constants/directions.js';


/**
 * IGetMeterProfileIdListResponseParameters command parameters
 */
interface IGetMeterProfileIdListResponseParameters extends ICommandParameters {
    isCompleted: boolean,
    meterProfileIdList: Array<number>
}

const COMMAND_ID = 0x65;

const examples: TCommandExampleList = [
    {
        name: 'response to GetMeterProfileIdList with two meterProfileId',
        parameters: {
            requestId: 5,
            isCompleted: true,
            meterProfileIdList: [1, 2]
        },
        hex: {header: '65 04', body: '05 01 01 02'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetMeterProfileIdListResponse from 'jooby-codec/obis-observer/commands/uplink/GetMeterProfileIdList.js';
 *
 * const commandBody = new Uint8Array([0x05, 0x01, 0x01, 0x02]);
 * const command = GetMeterProfileIdListResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 5,
 *     isCompleted: true,
 *     meterProfileIdList: [1, 2]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetMeterProfileIdList.md#response)
 */
class GetMeterProfileIdListResponse extends Command {
    constructor ( public parameters: IGetMeterProfileIdListResponseParameters ) {
        super();

        // body size = request id byte + isCompleted byte + meterProfileIdList 0-n bytes
        this.size = REQUEST_ID_SIZE + 1 + parameters.meterProfileIdList.length;
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
        const meterProfileIdList = buffer.isEmpty
            ? []
            : [...new Array<number>(buffer.bytesLeft)].map(() => buffer.getUint8());

        return new GetMeterProfileIdListResponse({requestId, isCompleted: isCompleted !== 0, meterProfileIdList});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(this.size as number);
        const {requestId, isCompleted, meterProfileIdList} = this.parameters;

        buffer.setUint8(requestId);
        buffer.setUint8(isCompleted ? 1 : 0);
        meterProfileIdList.forEach(meterProfileId => buffer.setUint8(meterProfileId));

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetMeterProfileIdListResponse;
