import Command, {TCommandExampleList, COMMAND_HEADER_SIZE} from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../../constants/directions.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {TInt16} from '../../../types.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import SetCorrectDateTimeResponse from '../uplink/SetCorrectDateTimeResponse.js';


interface ISetCorrectDateTimeParameters {
    /**
     * Number of seconds to shift time.
     */
    seconds: TInt16
}


const COMMAND_ID = 0x5c;
const COMMAND_SIZE = 2;

const examples: TCommandExampleList = [
    {
        name: 'shift device time 5 seconds forward',
        parameters: {
            seconds: 5
        },
        hex: {header: '5c 02', body: '00 05'}
    },
    {
        name: 'shift device time 5 seconds backward',
        parameters: {
            seconds: -5
        },
        hex: {header: '5c 02', body: 'ff fb'}
    }
];


/**
 * Downlink command for incremental time correction.
 *
 * The corresponding uplink command: {@link SetCorrectDateTimeResponse}.
 *
 * @example
 * ```js
 * import SetCorrectDateTime from 'jooby-codec/mtx/commands/downlink/SetCorrectDateTime.js';
 *
 * const parameters = {
 *     seconds: 5
 * };
 * const command = new SetCorrectDateTime(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 5c 02 00 05
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/SetCorrectDateTime.md#request)
 */
class SetCorrectDateTime extends Command {
    constructor ( public parameters: ISetCorrectDateTimeParameters ) {
        super();

        this.size = COMMAND_SIZE;
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;

    static readonly accessLevel = READ_ONLY;

    static readonly maxSize = COMMAND_SIZE;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new SetCorrectDateTime({
            seconds: buffer.getInt16()
        });
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {size, parameters} = this;
        const buffer = new CommandBinaryBuffer(COMMAND_HEADER_SIZE + size);

        // header + size
        buffer.setUint8(COMMAND_ID);
        buffer.setUint8(size);

        // body
        buffer.setInt16(parameters.seconds);

        return buffer.toUint8Array();
    }
}


export default SetCorrectDateTime;
