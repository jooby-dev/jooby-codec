import Command, {TCommandExampleList} from '../../Command.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directions.js';
import {getTime2000FromDate, getDateFromTime2000, TTime2000} from '../../../utils/time.js';


/**
 * GetArchiveHours command parameters
 */
interface IGetArchiveHoursParameters {
    /** the number of hours to retrieve */
    hours: number,
    startTime2000: TTime2000
}


const COMMAND_ID = 0x05;
const COMMAND_BODY_SIZE = 4;

const examples: TCommandExampleList = [
    {
        name: '2 hours counter from 2023.12.23 12:00:00 GMT',
        parameters: {hours: 2, startTime2000: 756648000},
        hex: {header: '05 04', body: '2f 97 0c 02'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import GetArchiveHours from 'jooby-codec/analog/commands/downlink/GetArchiveHours.js';
 *
 * const parameters = {hours: 2, startTime2000: 756648000};
 * const command = new GetArchiveHours(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 05 04 2f 97 0c 02
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetArchiveHours.md#request)
 */
class GetArchiveHours extends Command {
    constructor ( public parameters: IGetArchiveHoursParameters ) {
        super();
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        if ( data.byteLength !== COMMAND_BODY_SIZE ) {
            throw new Error(`Wrong buffer size: ${data.byteLength}.`);
        }

        const buffer = new CommandBinaryBuffer(data);
        const date = buffer.getDate();
        const {hour} = buffer.getHours();
        const hours = buffer.getUint8();

        date.setUTCHours(hour);

        if ( !buffer.isEmpty ) {
            throw new Error('BinaryBuffer is not empty.');
        }

        return new GetArchiveHours({hours, startTime2000: getTime2000FromDate(date)});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {hours, startTime2000} = this.parameters;
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);
        const date = getDateFromTime2000(startTime2000);
        const hour = date.getUTCHours();

        buffer.setDate(date);
        buffer.setHours(hour, 0);
        buffer.setUint8(hours);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetArchiveHours;
