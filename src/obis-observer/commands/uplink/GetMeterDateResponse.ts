import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters, DATE_TIME_SIZE} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {TTime2000} from '../../../utils/time.js';


/**
 * IGetMeterDateResponseParameters command parameters
 */
interface IGetMeterDateResponseParameters extends ICommandParameters {
    meterId: number,
    time2000: TTime2000
}

const COMMAND_ID = 0x7b;

const examples: TCommandExampleList = [
    {
        name: 'response to GetMeterDate',
        parameters: {
            requestId: 7,
            meterId: 4,
            time2000: 741280502
        },
        hex: {header: '7b 06', body: '07 04 2c 2f 0a f6'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetMeterDateResponse from 'jooby-codec/obis-observer/commands/uplink/GetMeterDateResponse.js';
 *
 * const commandBody = new Uint8Array([
 *     0x07, 0x04, 0x2c, 0x2f, 0x0a, 0xf6
 * ]);
 * const command = GetMeterDateResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 7,
 *     meterId: 4
 *     time2000: 741280502
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetMeterDate.md#response)
 */
class GetMeterDateResponse extends Command {
    constructor ( public parameters: IGetMeterDateResponseParameters ) {
        super();

        this.size = REQUEST_ID_SIZE + 1 + DATE_TIME_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new GetMeterDateResponse({
            requestId: buffer.getUint8(),
            meterId: buffer.getUint8(),
            time2000: buffer.getUint32()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const buffer = new CommandBinaryBuffer(this.size);
        const {requestId, meterId, time2000} = this.parameters;

        buffer.setUint8(requestId);
        buffer.setUint8(meterId);
        buffer.setUint32(time2000);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetMeterDateResponse;
