import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


/**
 * IGetMeterInfoResponseParameters command parameters
 */
interface IGetMeterInfoResponseParameters extends ICommandParameters {
    meterProfileId?: number,
    address: string
}


const COMMAND_ID = 0x79;
const INVALID_METER_PROFILE_ID = 0xff;

const examples: TCommandExampleList = [
    {
        name: 'get meter info response with meterProfileId',
        parameters: {
            requestId: 2,
            meterProfileId: 1,
            address: 'ma2375'
        },
        hex: {header: '79 09', body: '02 01 06 6d 61 32 33 37 35'}
    },
    {
        name: 'get meter info response without meterProfileId',
        parameters: {
            requestId: 2,
            address: 'ma2375'
        },
        hex: {header: '79 09', body: '02 ff 06 6d 61 32 33 37 35'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetMeterInfoResponse from 'jooby-codec/obis-observer/commands/uplink/GetMeterInfoResponse.js';
 *
 * const commandBody = new Uint8Array([
 *     0x79, 0x09, 0x02, 0x01, 0x06, 0x6d, 0x61, 0x32, 0x33, 0x37, 0x35
 * ]);
 * const command = GetMeterInfoResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 2,
 *     meterProfileId: 1,
 *     address: 'ma2375'
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetMeterInfo.md#response)
 */
class GetMeterInfoResponse extends Command {
    constructor ( public parameters: IGetMeterInfoResponseParameters ) {
        super();

        // real size - request id byte + software version 2 bytes + hardware version 2 bytes + device name string size byte + string bytes
        this.size = REQUEST_ID_SIZE + 1 + 1 + parameters.address.length;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        const requestId = buffer.getUint8();
        const meterProfileId = buffer.getUint8();
        const address = buffer.getString();

        return meterProfileId === INVALID_METER_PROFILE_ID
            ? new GetMeterInfoResponse({requestId, address})
            : new GetMeterInfoResponse({requestId, meterProfileId, address});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(this.size as number);
        const {requestId, meterProfileId, address} = this.parameters;

        buffer.setUint8(requestId);
        buffer.setUint8(meterProfileId || INVALID_METER_PROFILE_ID);
        buffer.setString(address);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetMeterInfoResponse;
