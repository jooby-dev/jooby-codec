import Command, {TCommandExampleList} from '../../Command.js';
import {DOWNLINK} from '../../../constants/directions.js';
import {READ_ONLY} from '../../constants/accessLevels.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import GetDeviceTypeResponse from '../uplink/GetDeviceTypeResponse.js';


const COMMAND_ID = 0x04;
const COMMAND_SIZE = 0;

const examples: TCommandExampleList = [
    {
        name: 'simple request',
        hex: {header: '04 00', body: ''}
    }
];


/**
 * Downlink command to get device type.
 *
 * The corresponding uplink command: {@link GetDeviceTypeResponse}.
 *
 * @example
 * ```js
 * import GetDeviceType from 'jooby-codec/mtx/commands/downlink/GetDeviceType.js';
 *
 * const command = new GetDeviceType();
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 04 00
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetDeviceType.md#request)
 */
class GetDeviceType extends Command {
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
        return new GetDeviceType();
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        return new Uint8Array([COMMAND_ID, this.size]);
    }
}


export default GetDeviceType;
