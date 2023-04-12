/**
 * [[include:commands/downlink/GetArchiveDaysMul.md]]
 *
 * @packageDocumentation
 */

import Command from '../../Command.js';
import CommandBinaryBuffer, {Seconds} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directionTypes.js';
import {getSecondsFromDate, getDateFromSeconds} from '../../utils/time.js';


/**
 * GetArchiveDaysMul command parameters
 *
 * @example
 * // request for 1 days archive values from channel #1 from 2023-12-24T00:00:00.000Z or 756691200 seconds since 2000 year
 * {channels: [0], dayAmount: 1, time: 756691200}
 */
interface IDownlinkGetArchiveDaysMulParameters {
    /** amount of days to retrieve */
    dayAmount: number,

    time: Seconds,

    /** array of channels indexes */
    channels: Array<number>
}


const COMMAND_ID = 0x1b;
const COMMAND_TITLE = 'GET_ARCHIVE_DAYS_MUL';
const COMMAND_BODY_SIZE = 4;


/**
 * Downlink command
 *
 * @example
 * ```js
 * import GetArchiveDaysMul from 'jooby-codec/commands/downlink/GetArchiveDaysMul';
 *
 * const parameters = {channels: [0], dayAmount: 1, time: 756691200};
 * const command = new GetArchiveDaysMul(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 1b 04 2f 98 01 01
 * ```
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/GetArchiveDaysMul.md#request)
 */
class GetArchiveDaysMul extends Command {
    constructor ( public parameters: IDownlinkGetArchiveDaysMulParameters ) {
        super();

        this.parameters.channels = this.parameters.channels.sort((a, b) => a - b);
    }

    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly title = COMMAND_TITLE;

    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        if ( data.byteLength !== COMMAND_BODY_SIZE ) {
            throw new Error(`${this.getName()}. Wrong buffer size: ${data.byteLength}.`);
        }

        const buffer = new CommandBinaryBuffer(data);

        const date = buffer.getDate();
        const channels = buffer.getChannels(true);
        const dayAmount = buffer.getUint8();

        if ( !buffer.isEmpty ) {
            throw new Error(`${this.getName()}. BinaryBuffer is not empty.`);
        }

        return new GetArchiveDaysMul({channels, dayAmount, time: getSecondsFromDate(date)});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {channels, dayAmount, time} = this.parameters;
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);

        const date = getDateFromSeconds(time);

        buffer.setDate(date);
        buffer.setChannels(channels);
        buffer.setUint8(dayAmount);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default GetArchiveDaysMul;
