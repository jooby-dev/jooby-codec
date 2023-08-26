import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';


/**
 * IGetObserverUptimeResponseParameters command parameters
 */
interface IGetObserverUptimeResponseParameters extends ICommandParameters {
    uptime: number
}

const COMMAND_ID = 0x06;

const examples: TCommandExampleList = [
    {
        name: 'current date and time info',
        parameters: {
            requestId: 7,
            uptime: 4016
        },
        hex: {header: '06', body: '07 00 00 0f b0'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetObserverUptimeResponse from 'jooby-codec/obis-observer/commands/uplink/GetObserverUptimeResponse.js';
 *
 * const commandBody = new Uint8Array([
 *     0x07, 0x00, 0x00, 0x0f, 0xb0
 * ]);
 * const command = GetObserverUptimeResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 7,
  *     uptime: 4016
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetObserverUptime.md#response)
 */
class GetObserverUptimeResponse extends Command {
    constructor ( public parameters: IGetObserverUptimeResponseParameters ) {
        super();

        this.size = REQUEST_ID_SIZE + 4;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new GetObserverUptimeResponse({
            requestId: buffer.getUint8(),
            uptime: buffer.getUint32()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const buffer = new CommandBinaryBuffer(this.size);
        const {requestId, uptime} = this.parameters;

        buffer.setUint8(requestId);
        buffer.setUint32(uptime);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetObserverUptimeResponse;
