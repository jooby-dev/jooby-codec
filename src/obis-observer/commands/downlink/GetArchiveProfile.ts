import Command, {TCommandExampleList} from '../../Command.js';
import {DOWNLINK} from '../../constants/directions.js';


const COMMAND_ID = 0x07;
const COMMAND_SIZE = 0;

const examples: TCommandExampleList = [
    {
        name: 'simple request',
        hex: {header: '07', body: ''}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetArchiveProfile from 'jooby-codec/obis-observer/commands/downlink/GetArchiveProfile.js';
 *
 * const command = new GetArchiveProfile();
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 07
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetArchiveProfile.md#request)
 */
class GetArchiveProfile extends Command {
    constructor () {
        super();

        this.size = COMMAND_SIZE;
    }

    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = false;

    // data - only body (without header)
    static fromBytes () {
        return new GetArchiveProfile();
    }

    // returns full message - header with body
    // eslint-disable-next-line class-methods-use-this
    toBytes (): Uint8Array {
        return Command.toBytes(COMMAND_ID);
    }
}


export default GetArchiveProfile;
