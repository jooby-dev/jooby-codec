/**
 * Command to request/receive the archive data of hourly consumption.
 * In the data field of the command, it is necessary to set the start date and hour for reading the archive.
 * In case there is no data in the archive, a base value of `0xffffffff` will be provided.
 * Since the length of the transmitted data from the sensor is limited, not all requested data will be transferred.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getArchiveHours from 'jooby-codec/analog/commands/downlink/getArchiveHours.js';
 *
 * // 2 hours counter from 2023.12.23 12:00:00 GMT
 * const parameters = {startTime2000: 756648000, hours: 2};
 * const bytes = getArchiveHours.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [5, 4, 47, 151, 12, 2]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetArchiveHours.md#request)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import {TTime2000, getDateFromTime2000, getTime2000FromDate} from '../../utils/time.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';
import {getArchiveHours as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


interface IGetArchiveHoursParameters {
    /**
     * The number of hours to retrieve.
     */
    hours: types.TUint8,

    /**
     * Start date for requested data.
     */
    startTime2000: TTime2000
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

const COMMAND_BODY_SIZE = 4;

export const examples: command.TCommandExamples = {
    '2 hours counter from 2023.12.23 12:00:00 GMT': {
        id,
        name,
        headerSize,
        parameters: {startTime2000: 756648000, hours: 2},
        bytes: [
            0x05, 0x04,
            0x2f, 0x97, 0x0c, 0x02
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): IGetArchiveHoursParameters => {
    if ( data.length !== COMMAND_BODY_SIZE ) {
        throw new Error(`Wrong buffer size: ${data.length}.`);
    }

    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(data);
    const date = buffer.getDate();
    const {hour} = buffer.getHours();
    const hours = buffer.getUint8();

    date.setUTCHours(hour);

    if ( !buffer.isEmpty ) {
        throw new Error('BinaryBuffer is not empty.');
    }

    return {startTime2000: getTime2000FromDate(date), hours};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns encoded bytes
 */
export const toBytes = ( parameters: IGetArchiveHoursParameters ): types.TBytes => {
    const {startTime2000, hours} = parameters;
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);
    const date = getDateFromTime2000(startTime2000);
    const hour = date.getUTCHours();

    buffer.setDate(date);
    // force hours to 0
    buffer.setHours(hour, 1);
    buffer.setUint8(hours);

    return command.toBytes(id, buffer.data);
};
