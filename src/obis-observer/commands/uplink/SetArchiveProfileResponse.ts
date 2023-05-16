import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {resultCodes} from '../../constants/index.js';


/**
 * ISetArchiveProfileResponseParameters command parameters
 */
interface ISetArchiveProfileResponseParameters extends ICommandParameters {
    resultCode: number
}


const COMMAND_ID = 0x10;
const COMMAND_SIZE = REQUEST_ID_SIZE + 1;

const examples: TCommandExampleList = [
    {
        name: 'successful request',
        parameters: {
            requestId: 156,
            resultCode: resultCodes.OK
        },
        hex: {header: '10', body: '9c 00'}
    },
    {
        name: 'failed request',
        parameters: {
            requestId: 49,
            resultCode: resultCodes.PROFILE_NOT_FOUND
        },
        hex: {header: '10', body: '31 05'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import SetArchiveProfileResponse from 'jooby-codec/obis-observer/commands/uplink/SetArchiveProfileResponse.js';
 *
 * const commandBody = new Uint8Array([0x9c, 0x00]);
 * const command = SetArchiveProfileResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 156,
 *     resultCode: 0
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/SetArchiveProfile.md#response)
 */
class SetArchiveProfileResponse extends Command {
    constructor ( public parameters: ISetArchiveProfileResponseParameters ) {
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

        return new SetArchiveProfileResponse({
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


export default SetArchiveProfileResponse;
