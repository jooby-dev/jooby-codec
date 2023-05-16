import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../constants/directions.js';
import {resultCodes} from '../../constants/index.js';


/**
 * IRemoveShortNameProfileResponseParameters command parameters
 */
interface IRemoveShortNameProfileResponseParameters extends ICommandParameters {
    resultCode: number
}


const COMMAND_ID = 0x08;
const COMMAND_SIZE = 1 + REQUEST_ID_SIZE;

const examples: TCommandExampleList = [
    {
        name: 'remove short name profile - not found',
        parameters: {
            requestId: 5,
            resultCode: resultCodes.PROFILE_NOT_FOUND
        },
        hex: {header: '08', body: '05 05'}
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import RemoveShortNameProfileResponse from 'jooby-codec/obis-observer/commands/uplink/RemoveShortNameProfileResponse.js';
 *
 * const commandBody = new Uint8Array([0x05, 0x04]);
 * const command = RemoveShortNameProfileResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     requestId: 5,
 *     resultCode: 4
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/RemoveShortNameProfileResponse.md#request)
 */
class RemoveShortNameProfileResponse extends Command {
    constructor ( public parameters: IRemoveShortNameProfileResponseParameters ) {
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

        return new RemoveShortNameProfileResponse({
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


export default RemoveShortNameProfileResponse;
