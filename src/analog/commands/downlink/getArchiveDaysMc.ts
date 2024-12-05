/**
 * Command to request day pulse counter's values from device archive.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getArchiveDaysMc from 'jooby-codec/analog/commands/downlink/getArchiveDaysMc.js';
 *
 * // 1 day pulse counter for 1 channel from 2023.03.10 00:00:00 GMT
 * const parameters = {startTime2000: 731721600, days: 1, channelList: [1]};
 * const bytes = getArchiveDaysMc.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [27, 4, 46, 106, 1, 1]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetArchiveDaysMC.md#request)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import {TTime2000, getDateFromTime2000, getTime2000FromDate} from '../../utils/time.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';
import {getArchiveDaysMc as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


interface IGetArchiveDaysMcParameters {
    /**
     * Start date for requested day pulse counter's values.
     */
    startTime2000: TTime2000;

    /** The number of days to get data from archive. */
    days: types.TUint8;

    /**
     * List of channel numbers to retrieve.
     * Max channels: `32`.
     */
    channelList: Array<types.TUint8>;
}

export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

const COMMAND_BODY_SIZE = 4;

export const examples: command.TCommandExamples = {
    '1 day pulse counter for 1 channel from 2023.03.10 00:00:00 GMT': {
        id,
        name,
        headerSize,
        parameters: {startTime2000: 731721600, days: 1, channelList: [1]},
        bytes: [
            0x1b, 0x04,
            0x2e, 0x6a, 0x01, 0x01
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): IGetArchiveDaysMcParameters => {
    if ( data.length !== COMMAND_BODY_SIZE ) {
        throw new Error(`Wrong buffer size: ${data.length}.`);
    }

    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(data);
    const date = buffer.getDate();
    const channelList = buffer.getChannels();
    const days = buffer.getUint8();

    if ( !buffer.isEmpty ) {
        throw new Error('BinaryBuffer is not empty.');
    }

    return {startTime2000: getTime2000FromDate(date), days, channelList};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns encoded bytes
 */
export const toBytes = ( parameters: IGetArchiveDaysMcParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);
    const {startTime2000, days, channelList} = parameters;
    const date = getDateFromTime2000(startTime2000);

    buffer.setDate(date);
    buffer.setChannels(channelList.map(index => ({index})));
    buffer.setUint8(days);

    return command.toBytes(id, buffer.data);
};
