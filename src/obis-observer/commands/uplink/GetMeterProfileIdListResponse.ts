import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


/**
 * IGetMeterProfileIdListResponseParameters command parameters
 */
interface IGetMeterProfileIdListResponseParameters extends ICommandParameters {
    meterProfileIdList: Array<number>
}

const COMMAND_ID = 0x65;

const examples: TCommandExampleList = [
    {
        name: 'two meterProfileId',
        parameters: {
            requestId: 3,
            meterProfileIdList: [1, 2]
        },
        hex: {header: '65', body: '03 01 02'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetMeterProfileIdListResponse from 'jooby-codec/obis-observer/commands/uplink/GetMeterProfileIdList.js';
 *
 * const commandBody = new Uint8Array([0x03, 0xc5, 0xc6]);
 * const command = GetMeterProfileIdListResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 3,
 *     meterProfileIdList: [1, 2]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetMeterProfileIdList.md#response)
 */
class GetMeterProfileIdListResponse extends Command {
    constructor ( public parameters: IGetMeterProfileIdListResponseParameters ) {
        super();

        // body size = request id byte + meterProfileIdList 0-n bytes
        this.size = REQUEST_ID_SIZE + parameters.meterProfileIdList.length;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        const requestId = buffer.getUint8();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const meterProfileIdList = [...new Array(data.length - REQUEST_ID_SIZE)].map(() => buffer.getUint8());

        return new GetMeterProfileIdListResponse({requestId, meterProfileIdList});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const buffer = new CommandBinaryBuffer(this.size);
        const {requestId, meterProfileIdList} = this.parameters;

        buffer.setUint8(requestId);
        meterProfileIdList.forEach(meterProfileId => buffer.setUint8(meterProfileId));

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetMeterProfileIdListResponse;
