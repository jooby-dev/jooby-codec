import Command, {TCommandExampleList} from '../../Command.js';
import {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../../constants/directions.js';


/**
 * IGetMeterIdResponseParameters command parameters
 */
interface IGetMeterIdResponseParameters extends ICommandParameters {
    meterId: number
}

const COMMAND_ID = 0x77;
const COMMAND_SIZE = REQUEST_ID_SIZE + 1;


const examples: TCommandExampleList = [
    {
        name: 'get meter id response',
        parameters: {
            requestId: 2,
            meterId: 1
        },
        hex: {header: '77 02', body: '02 01'}
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
 *     0x02, 0x01
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
    static fromBytes ( [requestId, meterId]: Uint8Array ) {
        return new GetMeterIdResponse({requestId, meterId});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {parameters} = this;

        return Command.toBytes(
            COMMAND_ID,
            new Uint8Array([parameters.requestId, parameters.meterId])
        );
    }
}


export default GetMeterIdResponse;
