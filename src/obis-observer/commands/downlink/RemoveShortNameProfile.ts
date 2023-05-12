import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';


/**
 * IRemoveShortNameProfileParameters command parameters
 */
interface IRemoveShortNameProfileParameters {
    shortName: number
}


const COMMAND_ID = 0x04;
const COMMAND_SIZE = 1;

const examples: TCommandExampleList = [
    {
        name: 'remove profile for short name 28',
        parameters: {
            shortName: 28
        },
        hex: {header: '04', body: '1c'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import RemoveShortNameProfile from 'jooby-codec/obis-observer/commands/downlink/RemoveShortNameProfile.js';
 *
 * const parameters = {
 *     shortName: 28
 * };
 * const command = new RemoveShortNameProfile(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 04 1c
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/RemoveShortNameProfile.md#request)
 */
class RemoveShortNameProfile extends Command {
    constructor ( public parameters: IRemoveShortNameProfileParameters ) {
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

        return new RemoveShortNameProfile({shortName: buffer.getUint8()});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const buffer = new CommandBinaryBuffer(COMMAND_SIZE);
        const {shortName} = this.parameters;

        buffer.setUint8(shortName);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default RemoveShortNameProfile;
