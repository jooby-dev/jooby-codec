import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, METER_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../../constants/directions.js';


/**
 * IGetMeterIdResponseParameters command parameters
 */
interface IGetMeterIdResponseParameters extends ICommandParameters {
    meterId: number
}

const COMMAND_ID = 0x77;
const COMMAND_SIZE = REQUEST_ID_SIZE + METER_ID_SIZE;


const examples: TCommandExampleList = [
    {
        name: 'get meter id response',
        parameters: {
            requestId: 2,
            meterId: 1
        },
        hex: {header: '77 05', body: '02 00 00 00 01'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetMeterIdResponse from 'jooby-codec/obis-observer/commands/uplink/GetMeterIdResponse.js';
 *
 * const commandBody = new Uint8Array([
 *     0x02, 0x00, 0x00, 0x00, 0x01
 * ]);
 * const command = GetMeterIdResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 2,
 *     meterId: 1
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetMeterId.md#response)
 */
class GetMeterIdResponse extends Command {
    constructor ( public parameters: IGetMeterIdResponseParameters ) {
        super();

        this.size = parameters.meterId ? COMMAND_SIZE : REQUEST_ID_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new GetMeterIdResponse({
            requestId: buffer.getUint8(),
            meterId: buffer.getUint32()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {requestId, meterId} = this.parameters;
        const buffer = new CommandBinaryBuffer(this.size as number);

        buffer.setUint8(requestId);
        buffer.setUint32(meterId);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetMeterIdResponse;
