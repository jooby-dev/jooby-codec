import Command, {TCommandExampleList} from '../../Command.js';
import {DOWNLINK} from '../../../constants/directions.js';
import {READ_ONLY} from '../../constants/accessLevels.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import GetEnergyDayPreviousResponse from '../uplink/GetEnergyDayPreviousResponse.js';


const COMMAND_ID = 0x03;
const COMMAND_SIZE = 0;

const examples: TCommandExampleList = [
    {
        name: 'simple request',
        hex: {header: '03 00', body: ''}
    }
];


/**
 * Downlink command to get active energy for a previous day by 4 tariffs (T1-T4).
 *
 * The corresponding uplink command: {@link GetEnergyDayPreviousResponse}.
 *
 * @example
 * ```js
 * import GetEnergyDayPrevious from 'jooby-codec/mtx/commands/downlink/GetEnergyDayPrevious.js';
 *
 * const command = new GetEnergyDayPrevious();
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 03 00
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetEnergyDayPrevious.md#request)
 */
class GetEnergyDayPrevious extends Command {
    constructor () {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = false;

    static readonly accessLevel = READ_ONLY;

    static readonly maxSize = COMMAND_SIZE;


    // data - only body (without header)
    static fromBytes () {
        return new GetEnergyDayPrevious();
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return new Uint8Array([COMMAND_ID, this.size]);
    }
}


export default GetEnergyDayPrevious;
