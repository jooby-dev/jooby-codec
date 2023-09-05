import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


/**
 * IGetMeterInfoResponseParameters command parameters
 */
interface IGetMeterInfoResponseParameters extends ICommandParameters {
    address: string,
    meterProfileId?: number
}


const COMMAND_ID = 0x79;

const examples: TCommandExampleList = [
    {
        name: 'get meter info response without meterProfileId and without address',
        parameters: {
            requestId: 3,
            address: ''
        },
        hex: {header: '79 01', body: '03'}
    },
    {
        name: 'get meter info response without meterProfileId',
        parameters: {
            requestId: 2,
            address: 'ma2375'
        },
        hex: {header: '79 08', body: '02 06 6d 61 32 33 37 35'}
    },
    {
        name: 'get meter info response with meterProfileId',
        parameters: {
            requestId: 2,
            address: 'ma2375',
            meterProfileId: 1
        },
        hex: {header: '79 09', body: '02 06 6d 61 32 33 37 35 01'}
    }
];

const commandSize = ( parameters: IGetMeterInfoResponseParameters ): number => {
    let size = REQUEST_ID_SIZE;

    if ( parameters.address.length !== 0 || parameters.meterProfileId ) {
        size += 1 + parameters.address.length;

        if ( parameters.meterProfileId ) {
            size += 1;
        }
    }

    return size;
};


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
        const address = buffer.isEmpty ? '' : buffer.getString();

        return buffer.isEmpty
            ? new GetMeterInfoResponse({requestId, address})
            : new GetMeterInfoResponse({requestId, address, meterProfileId: buffer.getUint8()});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(this.size as number);
        const {requestId, meterProfileId, address} = this.parameters;

        buffer.setUint8(requestId);

        if ( address.length !== 0 || meterProfileId ) {
            buffer.setString(address);
            if (meterProfileId) {
                buffer.setUint8(meterProfileId);
            }
        }

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetMeterInfoResponse;
