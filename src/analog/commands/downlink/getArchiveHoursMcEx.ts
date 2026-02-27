/**
 * Command to request hour pulse counter's values from device archive.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getArchiveHoursMcEx from 'jooby-codec/analog/commands/downlink/getArchiveHoursMcEx.js';
 *
 * const parameters = {startTime2000: 756648000, hour: 12, hours: 2, channelList: [1]};
 * const bytes = getArchiveHoursMcEx.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [31, 48, 5, 47, 151, 12, 2, 1]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetArchiveHoursMCEx.md#request)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import {TTime2000, getTime2000FromDate, getDateFromTime2000} from '../../utils/time.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import {
    IChannel,
    getChannels,
    setChannels,
    getDate,
    setDate
} from '../../utils/binary/buffer.js';
import {getArchiveHoursMcEx as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


interface IGetExAbsArchiveHoursMcExParameters {
    hour: types.TUint8,

    /**
     * The number of hours to retrieve.
     */
    hours: types.TUint8,

    /**
     * Start date for requested day pulse counter's values.
     */
    startTime2000: TTime2000,

    /**
     * List of channel numbers to retrieve.
     * Max channels: `32`.
     */
    channelList: Array<types.TUint8>;
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 3;

const COMMAND_BODY_SIZE = 5;

export const examples: command.TCommandExamples = {
    '1 hour absolute values for 1 channel from 2023.12.23 12:00:00 GMT': {
        id,
        name,
        headerSize,
        parameters: {startTime2000: 756648000, hour: 12, hours: 2, channelList: [1]},
        bytes: [
            0x1f, 0x30, 0x05,
            0x2f, 0x97, 0x0c, 0x02, 0x01
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetExAbsArchiveHoursMcExParameters => {
    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);
    const date = getDate(buffer);
    const hour = buffer.getUint8();
    const hours = buffer.getUint8();
    const channelList = getChannels(buffer);

    date.setUTCHours(hour);

    if ( !buffer.isEmpty ) {
        throw new Error('BinaryBuffer is not empty.');
    }

    return {startTime2000: getTime2000FromDate(date), hour, hours, channelList};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetExAbsArchiveHoursMcExParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(COMMAND_BODY_SIZE, false);
    const {channelList, hour, hours, startTime2000} = parameters;
    const date = getDateFromTime2000(startTime2000);

    setDate(buffer, date);
    buffer.setUint8(hour);
    buffer.setUint8(hours);
    setChannels(buffer, channelList.map(index => ({index} as IChannel)));

    return command.toBytes(id, buffer.data);
};
