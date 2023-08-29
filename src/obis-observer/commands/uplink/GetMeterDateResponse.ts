import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters, DATE_TIME_SIZE} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {TTime2000} from '../../../utils/time.js';


/**
 * IGetMeterDateResponseParameters command parameters
 */
interface IGetMeterDateResponseParameters extends ICommandParameters {
    time2000?: TTime2000
}

const COMMAND_ID = 0x7b;

const examples: TCommandExampleList = [
    {
        name: 'response to GetMeterDate with data',
        parameters: {
            requestId: 7,
            time2000: 741280502
        },
        hex: {header: '7b 05', body: '07 2c 2f 0a f6'}
    },
    {
        name: 'response to GetMeterDate without data',
        parameters: {
            requestId: 8
        },
        hex: {header: '7b 01', body: '08'}
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
 *     0x07, 0x2c, 0x2f, 0x0a, 0xf6
 * ]);
 * const command = GetMeterDateResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 7,
 *     time2000: 741280502
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetMeterDate.md#response)
 */
class GetMeterDateResponse extends Command {
    constructor ( public parameters: IGetMeterDateResponseParameters ) {
        super();

        this.size = REQUEST_ID_SIZE + (parameters.time2000 ? DATE_TIME_SIZE : 0);
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
            ? new GetMeterDateResponse({requestId})
            : new GetMeterDateResponse({requestId, time2000: buffer.getUint32()});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(this.size as number);
        const {requestId, time2000} = this.parameters;

        buffer.setUint8(requestId);
        if ( time2000 ) {
            buffer.setUint32(time2000);
        }

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetMeterDateResponse;
