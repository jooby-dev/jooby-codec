/**
 * [[include:commands/downlink/ExAbsArchiveHoursMul.md]]
 *
 * @packageDocumentation
 */

import Command from '../../Command.js';
import CommandBinaryBuffer, {Seconds} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directionTypes.js';
import {getSecondsFromDate, getDateFromSeconds} from '../../utils/time.js';


/**
 * ExAbsArchiveHoursMul command parameters
 *
 * @example
 * // request for 2 hours archive values from channel #1 from 2023-12-23T12:00:00.000Z or 756648000 seconds since 2000 year
 * {channels: [0], hourAmount: 2, time: 756648000}
 */
interface IDownlinkExAbsArchiveHoursMulParameters {
    /** amount of hours to retrieve */
    hourAmount: number,

    time: Seconds,

    /** array of channels indexes */
    channels: Array<number>
}


// TODO: rework extended headers detection
const COMMAND_ID = 0x0c1f;
const COMMAND_TITLE = 'EX_ABS_ARCHIVE_HOUR_MUL';
const COMMAND_BODY_SIZE = 4;


/**
 * Downlink command
 *
 * @example
 * ```js
 * import ExAbsArchiveHoursMul from 'jooby-codec/commands/downlink/ExAbsArchiveHoursMul';
 *
 * const parameters = {channels: [0], hourAmount: 0, time: 756648000};
 * const command = new ExAbsArchiveHoursMul(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 1f 0c 04 2f 97 0c 01
 * ```
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/ExAbsArchiveHoursMul.md#request)
 */
class ExAbsArchiveHoursMul extends Command {
    constructor ( public parameters: IDownlinkExAbsArchiveHoursMulParameters ) {
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
        const {hour, hours: hourAmount} = buffer.getHours();
        const channels = buffer.getChannels(true);

        date.setUTCHours(hour);

        if ( !buffer.isEmpty ) {
            throw new Error(`${this.getName()}. BinaryBuffer is not empty.`);
        }

        return new ExAbsArchiveHoursMul({channels, hourAmount, time: getSecondsFromDate(date)});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {channels, hourAmount, time} = this.parameters;
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);

        const date = getDateFromSeconds(time);
        const hour = date.getUTCHours();

        buffer.setDate(date);
        buffer.setHours(hour, hourAmount);
        buffer.setChannels(channels);

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default ExAbsArchiveHoursMul;
