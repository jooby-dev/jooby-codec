import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


/**
 * IGetMeterIdListResponseParameters command parameters
 */
interface IGetMeterIdListResponseParameters extends ICommandParameters {
    meterIdList: Array<number>
}

const COMMAND_ID = 0x75;

const examples: TCommandExampleList = [
    {
        name: 'response to GetMeterIdList with two meterId',
        parameters: {
            requestId: 3,
            meterIdList: [1, 2]
        },
        hex: {header: '75 03', body: '03 01 02'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetMeterIdListResponse from 'jooby-codec/obis-observer/commands/uplink/GetMeterIdList.js';
 *
 * const commandBody = new Uint8Array([0x03, 0xc5, 0xc6]);
 * const command = GetMeterIdListResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 3,
 *     meterIdList: [1, 2]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetMeterIdList.md#response)
 */
class GetMeterIdListResponse extends Command {
    constructor ( public parameters: IGetMeterIdListResponseParameters ) {
        super();

        // body size = request id byte + meterIdList 0-n bytes
        this.size = REQUEST_ID_SIZE + parameters.meterIdList.length;
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
        const meterIdList = [...new Array(data.length - REQUEST_ID_SIZE)].map(() => buffer.getUint8());

        return new GetMeterIdListResponse({requestId, meterIdList});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const buffer = new CommandBinaryBuffer(this.size);
        const {requestId, meterIdList} = this.parameters;

        buffer.setUint8(requestId);
        meterIdList.forEach(meterId => buffer.setUint8(meterId));

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetMeterIdListResponse;
