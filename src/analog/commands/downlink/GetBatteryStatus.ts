import Command, {TCommandExampleList} from '../../Command.js';
import {DOWNLINK} from '../../../constants/directions.js';


const COMMAND_ID = 0x051f;

const examples: TCommandExampleList = [
    {
        name: 'simple request',
        hex: {header: '1f 05 00', body: ''}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetBatteryStatus from 'jooby-codec/analog/commands/downlink/GetBatteryStatus.js';
 *
 * const command = new GetBatteryStatus();
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 1f 05 00
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetBatteryStatus.md#request)
 */
class GetBatteryStatus extends Command {
    constructor () {
        super();
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = false;


    // data - only body (without header)
    static fromBytes () {
        return new GetBatteryStatus();
    }

    // returns full message - header with body
    // eslint-disable-next-line class-methods-use-this
    toBytes (): Uint8Array {
        return Command.toBytes(COMMAND_ID);
    }
}


export default GetBatteryStatus;
