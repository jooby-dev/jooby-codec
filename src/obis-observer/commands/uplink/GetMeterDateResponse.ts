import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters, DATE_TIME_SIZE} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {TTime2000} from '../../../utils/time.js';


/**
 * IGetMeterDateResponseParameters command parameters
 */
interface IGetMeterDateResponseParameters extends ICommandParameters {
    time2000: TTime2000,
    uptime: number
}

const COMMAND_ID = 0x23;

const examples: TCommandExampleList = [
    {
        name: 'current date and time info',
        parameters: {
            requestId: 7,
            time2000: 741280502,
            uptime: 4016
        },
        hex: {header: '23', body: '07 2c 2f 0a f6 00 00 0f b0'}
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
 *     0x07, 0x2c, 0x2f, 0x0a, 0xf6, 0x00, 0x00, 0x0f, 0xb0
 * ]);
 * const command = GetMeterDateResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 7,
 *     time2000: 741280502,
 *     uptime: 4016
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetMeterDate.md#response)
 */
class GetMeterDateResponse extends Command {
    constructor ( public parameters: IGetMeterDateResponseParameters ) {
        super();

        this.size = REQUEST_ID_SIZE + DATE_TIME_SIZE + 4;
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
            time2000: buffer.getUint32(),
            uptime: buffer.getUint32()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const buffer = new CommandBinaryBuffer(this.size);
        const {requestId, time2000, uptime} = this.parameters;

        buffer.setUint8(requestId);
        buffer.setUint32(time2000);
        buffer.setUint32(uptime);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetMeterDateResponse;
