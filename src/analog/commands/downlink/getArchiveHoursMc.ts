/**
 * Command to request hour pulse counter's values from device archive.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getArchiveHoursMC from 'jooby-codec/analog/commands/downlink/getArchiveHoursMC.js';
 *
 * // hour pulse counter and 1 hour diff for 1 channel from 2023.12.23 12:00:00 GMT
 * const parameters = {startTime2000: 756648000, hours: 2, channelList: [1]};
 * const bytes = getArchiveHoursMC.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [26, 4, 47, 151, 44, 1]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetArchiveHoursMC.md#request)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import {TTime2000, getDateFromTime2000, getTime2000FromDate} from '../../utils/time.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';


interface IGetArchiveHoursMcParameters {
    /**
     * Number of hours.
     */
    hours: types.TUint8;

    /**
     * Start date for requested day pulse counter's values.
     */
    startTime2000: TTime2000;

    channelList: Array<types.TInt32>;
}


export const id: types.TCommandId = 0x1a;
export const name: types.TCommandName = 'getArchiveHoursMc';
export const headerSize = 2;

const COMMAND_BODY_SIZE = 4;

export const examples: command.TCommandExamples = {
    'hour pulse counter and 1 hour diff for 1 channel from 2023.12.23 12:00:00 GMT': {
        id,
        name,
        headerSize,
        parameters: {startTime2000: 756648000, hours: 2, channelList: [1]},
        bytes: [
            0x1a, 0x04,
            0x2f, 0x97, 0x2c, 0x01
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): IGetArchiveHoursMcParameters => {
    if ( data.length !== COMMAND_BODY_SIZE ) {
        throw new Error(`Wrong buffer size: ${data.length}.`);
    }

    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(data);
    const date = buffer.getDate();
    const {hour, hours} = buffer.getHours();
    const channelList = buffer.getChannels();

    date.setUTCHours(hour);

    if ( !buffer.isEmpty ) {
        throw new Error('BinaryBuffer is not empty.');
    }

    return {startTime2000: getTime2000FromDate(date), hours, channelList};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns encoded bytes
 */
export const toBytes = ( parameters: IGetArchiveHoursMcParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);
    const {hours, startTime2000, channelList} = parameters;
    const date = getDateFromTime2000(startTime2000);
    const hour = date.getUTCHours();

    buffer.setDate(date);
    buffer.setHours(hour, hours);
    buffer.setChannels(channelList.map(index => ({index})));

    return command.toBytes(id, buffer.data);
};
