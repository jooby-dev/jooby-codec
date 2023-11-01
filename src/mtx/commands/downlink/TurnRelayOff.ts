import Command, {TCommandExampleList} from '../../Command.js';
import {DOWNLINK} from '../../../constants/directions.js';
import {READ_WRITE} from '../../constants/accessLevels.js';


const COMMAND_ID = 0x19;
const COMMAND_SIZE = 0;

const examples: TCommandExampleList = [
    {
        name: 'simple request',
        hex: {header: '19 00', body: ''}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import TurnRelayOff from 'jooby-codec/mtx/commands/downlink/TurnRelayOff.js';
 *
 * const command = new TurnRelayOff();
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 19 00
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/TurnRelayOff.md#request)
 */
class TurnRelayOff extends Command {
    constructor () {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = false;

    static readonly accessLevel = READ_WRITE;

    static readonly maxSize = COMMAND_SIZE;


    // data - only body (without header)
    static fromBytes () {
        return new TurnRelayOff();
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return new Uint8Array([COMMAND_ID, this.size]);
    }
}


export default TurnRelayOff;
