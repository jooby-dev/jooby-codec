import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * IGetArchiveStateParameters command parameters
 */
interface IGetArchiveStateParameters extends ICommandParameters {
    profile: number
}


const COMMAND_ID = 0x28;
const COMMAND_SIZE = REQUEST_ID_SIZE + 1;

const examples: TCommandExampleList = [
    {
        name: 'get archive state',
        parameters: {
            requestId: 5,
            profile: 1
        },
        hex: {header: '28', body: '05 01'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetArchiveState from 'jooby-codec/obis-observer/commands/downlink/GetArchiveState.js';
 *
 * const parameters = {
 *     requestId: 5,
 *     profile: 1
 * };
 * const command = new GetArchiveState(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 28 05 01
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetArchiveState.md#request)
 */
class GetArchiveState extends Command {
    constructor ( public parameters: IGetArchiveStateParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new GetArchiveState({
            requestId: buffer.getUint8(),
            profile: buffer.getUint8()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_SIZE);
        const {requestId, profile} = this.parameters;

        buffer.setUint8(requestId);
        buffer.setUint8(profile);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetArchiveState;
