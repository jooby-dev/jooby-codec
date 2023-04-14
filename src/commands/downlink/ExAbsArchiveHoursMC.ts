/**
 * [[include:commands/downlink/ExAbsArchiveHoursMC.md]]
 *
 * @packageDocumentation
 */

import Command from '../../Command.js';
import CommandBinaryBuffer, {IChannel} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../constants/directionTypes.js';
import {getSecondsFromDate, getDateFromSeconds} from '../../utils/time.js';


/**
 * ExAbsArchiveHoursMC command parameters
 *
 * @example
 * // request for 2 hours archive values from channel #1 from 2023-12-23T12:00:00.000Z or 756648000 seconds since 2000 year
 * {channelList: [0], hours: 2, seconds: 756648000}
 */
interface IDownlinkExAbsArchiveHoursMCParameters {
    /** amount of hours to retrieve */
    hours: number,

    /** time */
    seconds: number,

    /** array of channelList indexes */
    channelList: Array<number>
}


// TODO: rework extended headers detection
const COMMAND_ID = 0x0c1f;
const COMMAND_TITLE = 'EX_ABS_ARCHIVE_HOUR_MC';
const COMMAND_BODY_SIZE = 4;


/**
 * Downlink command
 *
 * @example
 * ```js
 * import ExAbsArchiveHoursMC from 'jooby-codec/commands/downlink/ExAbsArchiveHoursMC';
 *
 * const parameters = {channelList: [0], hours: 0, seconds: 756648000};
 * const command = new ExAbsArchiveHoursMC(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 1f 0c 04 2f 97 0c 01
 * ```
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/commands/ExAbsArchiveHoursMC.md#request)
 */
class ExAbsArchiveHoursMC extends Command {
    constructor ( public parameters: IDownlinkExAbsArchiveHoursMCParameters ) {
        super();

        this.parameters.channelList = this.parameters.channelList.sort((a, b) => a - b);
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
        const {hour, hours} = buffer.getHours();
        const channelList = buffer.getChannels();

        date.setUTCHours(hour);

        if ( !buffer.isEmpty ) {
            throw new Error(`${this.getName()}. BinaryBuffer is not empty.`);
        }

        return new ExAbsArchiveHoursMC({channelList, hours, seconds: getSecondsFromDate(date)});
    }

    // returns full message - header with body
    toBytes (): Uint8Array {
        const {channelList, hours, seconds} = this.parameters;
        const buffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);

        const date = getDateFromSeconds(seconds);
        const hour = date.getUTCHours();

        buffer.setDate(date);
        buffer.setHours(hour, hours);
        buffer.setChannels(channelList.map(index => ({index} as IChannel)));

        return Command.toBytes(COMMAND_ID, buffer.toUint8Array());
    }
}


export default ExAbsArchiveHoursMC;
