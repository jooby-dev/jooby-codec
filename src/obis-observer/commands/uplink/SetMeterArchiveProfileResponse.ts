import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
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
        name: 'successful request',
        parameters: {
            requestId: 156,
            resultCode: resultCodes.OK
        },
        hex: {header: '69', body: '9c 00'}
    },
    {
        name: 'failed request',
        parameters: {
            requestId: 49,
            resultCode: resultCodes.PROFILE_NOT_FOUND
        },
        hex: {header: '69', body: '31 05'}
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
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new SetMeterArchiveProfileResponse({
            requestId: buffer.getUint8(),
            resultCode: buffer.getUint8()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_SIZE);
        const {requestId, resultCode} = this.parameters;

        buffer.setUint8(requestId);
        buffer.setUint8(resultCode);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default SetMeterArchiveProfileResponse;
