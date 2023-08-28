import Command, {TCommandExampleList} from '../../Command.js';
import {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {resultCodes} from '../../constants/index.js';


/**
 * IAddMeterProfileResponseParameters command parameters
 */
interface IRebootResponseParameters extends ICommandParameters {
    resultCode: number
}


const COMMAND_ID = 0x1a;
const COMMAND_SIZE = REQUEST_ID_SIZE;

const examples: TCommandExampleList = [
    {
        name: 'reboot response',
        parameters: {
            requestId: 7,
            resultCode: resultCodes.OK
        },
        hex: {header: '1a', body: '07 00'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import RebootResponse from 'jooby-codec/obis-observer/commands/uplink/RebootResponse.js';
 *
 * const commandBody = new Uint8Array([0x07]);
 * const command = RebootResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 7
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/Reboot.md#response)
 */
class RebootResponse extends Command {
    constructor ( public parameters: IRebootResponseParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( [requestId, resultCode]: Uint8Array ) {
        return new RebootResponse({requestId, resultCode});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return Command.toBytes(COMMAND_ID, new Uint8Array([this.parameters.requestId, this.parameters.resultCode]));
    }
}


export default RebootResponse;
