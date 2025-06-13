/**
 * Command to request hourly consumption (absolute values) of device channels from the archive.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getExAbsArchiveHoursMc from 'jooby-codec/analog/commands/downlink/getExAbsArchiveHoursMc.js';
 *
 * const parameters = {startTime2000: 756648000, hours: 1, channelList: [1]};
 * const bytes = getExAbsArchiveHoursMc.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [31, 12, 4, 47, 151, 12, 1]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetExAbsArchiveHoursMC.md#request)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import {TTime2000, getTime2000FromDate, getDateFromTime2000} from '../../utils/time.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, IChannel} from '../../utils/CommandBinaryBuffer.js';
import {getExAbsArchiveHoursMc as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


interface IGetExAbsArchiveHoursMcParameters {
    /**
     * Number of hours.
     */
    hours: types.TUint8;

    /**
     * Start date for requested day pulse counter's values.
     */
    startTime2000: TTime2000;

    /**
     * List of channel numbers to retrieve.
     * Max channels: `32`.
     */
    channelList: Array<types.TUint8>;
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 3;

const COMMAND_BODY_SIZE = 4;

export const examples: command.TCommandExamples = {
    '1 hour absolute values for 1 channel from 2023.12.23 12:00:00 GMT': {
        id,
        name,
        headerSize,
        parameters: {channelList: [1], hours: 1, startTime2000: 756648000},
        bytes: [
            0x1f, 0x0c, 0x04,
            0x2f, 0x97, 0x0c, 0x01
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetExAbsArchiveHoursMcParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);
    const date = buffer.getDate();
    const {hour, hours} = buffer.getHours();
    const channelList = buffer.getChannels();

    date.setUTCHours(hour);

    if ( !buffer.isEmpty ) {
        throw new Error('BinaryBuffer is not empty.');
    }

    return {channelList, hours, startTime2000: getTime2000FromDate(date)};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetExAbsArchiveHoursMcParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);
    const {startTime2000, hours, channelList} = parameters;
    const date = getDateFromTime2000(startTime2000);
    const hour = date.getUTCHours();

    buffer.setDate(date);
    buffer.setHours(hour, hours);
    buffer.setChannels(channelList.map(index => ({index} as IChannel)));

    return command.toBytes(id, buffer.data);
};
