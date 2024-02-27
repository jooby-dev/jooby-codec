import Command, {TCommandExampleList} from '../../Command.js';
import {DOWNLINK} from '../../../constants/directions.js';
import {READ_WRITE} from '../../constants/accessLevels.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import TurnRelayOnResponse from '../uplink/TurnRelayOnResponse.js';


const COMMAND_ID = 0x18;
const COMMAND_SIZE = 0;

const examples: TCommandExampleList = [
    {
        name: 'simple request',
        hex: {header: '18 00', body: ''}
    }
];


/**
 * Downlink command to turn the device relay on.
 *
 * The corresponding uplink command: {@link TurnRelayOnResponse}.
 *
 * @example
 * ```js
 * import TurnRelayOn from 'jooby-codec/mtx/commands/downlink/TurnRelayOn.js';
 *
 * const command = new TurnRelayOn();
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 18 00
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/TurnRelayOn.md#request)
 */
class TurnRelayOn extends Command {
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
        return new TurnRelayOn();
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return new Uint8Array([COMMAND_ID, this.size]);
    }
}


export default TurnRelayOn;
