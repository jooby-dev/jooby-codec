import Command, {TCommandExampleList} from '../../Command.js';
import {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {resultCodes} from '../../constants/index.js';


/**
 * ISetMeterArchiveProfileResponseParameters command parameters
 */
interface ISetMeterArchiveProfileResponseParameters extends ICommandParameters {
    resultCode: number
}


const COMMAND_ID = 0x69;
const COMMAND_SIZE = REQUEST_ID_SIZE + 1;

const examples: TCommandExampleList = [
    {
        name: 'response to SetMeterArchiveProfile - successful',
        parameters: {
            requestId: 156,
            resultCode: resultCodes.OK
        },
        hex: {header: '69 02', body: '9c 00'}
    },
    {
        name: 'response to SetMeterArchiveProfile - failed',
        parameters: {
            requestId: 49,
            resultCode: resultCodes.METER_PROFILE_NOT_FOUND
        },
        hex: {header: '69 02', body: '31 0a'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import SetMeterArchiveProfileResponse from 'jooby-codec/obis-observer/commands/uplink/SetMeterArchiveProfileResponse.js';
 *
 * const commandBody = new Uint8Array([0x9c, 0x00]);
 * const command = SetMeterArchiveProfileResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 156,
 *     resultCode: 0
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commads/SetMeterArchiveProfile.md#response)
 */
class SetMeterArchiveProfileResponse extends Command {
    constructor ( public parameters: ISetMeterArchiveProfileResponseParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( [requestId, resultCode]: Uint8Array ) {
        return new SetMeterArchiveProfileResponse({requestId, resultCode});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return Command.toBytes(
            COMMAND_ID,
            new Uint8Array(
                [this.parameters.requestId, this.parameters.resultCode]
            )
        );
    }
}


export default SetMeterArchiveProfileResponse;
