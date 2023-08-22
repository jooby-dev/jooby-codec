import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer, {REQUEST_ID_SIZE, ICommandParameters} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


const COMMAND_ID = 0x66;
const COMMAND_SIZE = REQUEST_ID_SIZE;

const examples: TCommandExampleList = [
    {
        name: 'simple request',
        parameters: {
            requestId: 3
        },
        hex: {header: '66', body: '03'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetMeterArchiveProfile from 'jooby-codec/obis-observer/commands/downlink/GetMeterArchiveProfile.js';
 *
 * const parameters = {
 *     requestId: 3
 * };
 * const command = new GetMeterArchiveProfile(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 66 01 03
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetMeterArchiveProfile.md#request)
 */
class GetMeterArchiveProfile extends Command {
    constructor ( public parameters: ICommandParameters ) {
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

        return new GetMeterArchiveProfile({requestId: buffer.getUint8()});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const buffer = new CommandBinaryBuffer(this.size);

        buffer.setUint8(this.parameters.requestId);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetMeterArchiveProfile;
