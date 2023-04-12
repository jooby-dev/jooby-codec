/**
 * [[include:commands/downlink/ExAbsArchiveDaysMul.md]]
 *
 * @packageDocumentation
 */

import Command from '../../Command.js';
import CommandBinaryBuffer, {Seconds} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directionTypes.js';
import {getSecondsFromDate, getDateFromSeconds} from '../../utils/time.js';


/**
 * ExAbsArchiveDaysMul command parameters
 *
 * @example
 * // request for 1 days archive values from channel #1 from 2023-12-24T00:00:00.000Z or 756691200 seconds since 2000 year
 * {channels: [0], dayAmount: 1, time: 756691200}
 */
interface IDownlinkExAbsArchiveDaysMulParameters {
    /** amount of days to retrieve */
    dayAmount: number,

    time: Seconds,

    /** array of channels indexes */
    channels: Array<number>
}


// TODO: rework extended headers detection
const COMMAND_ID = 0x0d1f;
const COMMAND_TITLE = 'EX_ABS_ARCHIVE_DAYS_MUL';
const COMMAND_BODY_SIZE = 4;


/**
 * Downlink command
 *
 * @example
 * ```js
 * import ExAbsArchiveDaysMul from 'jooby-codec/commands/downlink/ExAbsArchiveDaysMul';
 *
 * const parameters = {channels: [0], dayAmount: 1, time: 756691200};
 * const command = new ExAbsArchiveDaysMul(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 1f 0c 04 2f 98 01 01
 * ```
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/ExAbsArchiveDaysMul.md#request)
 */
class ExAbsArchiveDaysMul extends Command {
    constructor ( public parameters: IDownlinkExAbsArchiveDaysMulParameters ) {
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

        return new ExAbsArchiveDaysMul({channels, dayAmount, time: getSecondsFromDate(date)});
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


export default ExAbsArchiveDaysMul;
