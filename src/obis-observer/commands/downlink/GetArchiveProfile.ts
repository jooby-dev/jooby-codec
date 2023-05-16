import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


const COMMAND_ID = 0x0d;
const COMMAND_SIZE = REQUEST_ID_SIZE;

const examples: TCommandExampleList = [
    {
        name: 'simple request',
        parameters: {
            requestId: 3
        },
        hex: {header: '0d', body: '03'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetArchiveProfile from 'jooby-codec/obis-observer/commands/downlink/GetArchiveProfile.js';
 *
 * const command = new GetArchiveProfile({requestId: 3});
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 0d 03
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetArchiveProfile.md#request)
 */
class GetArchiveProfile extends Command {
    constructor ( public parameters: ICommandParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new GetArchiveProfile({requestId: buffer.getUint8()});
    }

    // eslint-disable-next-line class-methods-use-this
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_SIZE);

        buffer.setUint8(this.parameters.requestId);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetArchiveProfile;
