import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * IGetShortNameProfileParameters command parameters
 */
interface IGetShortNameProfileParameters {
    shortName: number
}


const COMMAND_ID = 0x09;
const COMMAND_SIZE = 1;

const examples: TCommandExampleList = [
    {
        name: 'get profile for short name 128',
        parameters: {
            shortName: 128
        },
        hex: {header: '09', body: '80'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetShortNameProfile from 'jooby-codec/obis-observer/commands/downlink/GetShortNameProfile.js';
 *
 * const parameters = {
 *     shortName: 128
 * };
 * const command = new GetShortNameProfile(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 09 80
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetShortNameProfile.md#request)
 */
class GetShortNameProfile extends Command {
    constructor ( public parameters: IGetShortNameProfileParameters ) {
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

        return new GetShortNameProfile({shortName: buffer.getUint8()});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        if ( typeof this.size !== 'number' ) {
            throw new Error('unknown or invalid size');
        }

        const buffer = new CommandBinaryBuffer(this.size);
        const {shortName} = this.parameters;

        buffer.setUint8(shortName);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetShortNameProfile;
