/**
 * The command for requesting the archive of daily data from the pulse counter sensor.
 * If there is no data available in the archive, 0xffffffff will be returned.
 * Due to the limited length of transmitted data from the sensor, not all requested data will be transferred.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getArchiveDays from 'jooby-codec/analog/commands/downlink/getArchiveDays.js';
 *
 * // 1 day counter from 2023.03.10 00:00:00 GMT
 * const parameters = {startTime2000: 731721600, days: 1};
 * const bytes = getArchiveDays.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [6, 3, 46, 106, 1]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetArchiveDays.md#request)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import {TTime2000, getDateFromTime2000, getTime2000FromDate} from '../../utils/time.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';

interface IGetArchiveDaysParameters {
    /** the number of days to retrieve */
    days: number,
    startTime2000: TTime2000
}

export const id: types.TCommandId = 0x06;
export const name: types.TCommandName = 'getArchiveDays';
export const headerSize = 2;

const COMMAND_BODY_SIZE = 3;

export const examples: command.TCommandExamples = {
    '1 day counter from 2023.03.10 00:00:00 GMT': {
        id,
        name,
        headerSize,
        parameters: {startTime2000: 731721600, days: 1},
        bytes: [
            0x06, 0x03,
            0x2e, 0x6a, 0x01
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): IGetArchiveDaysParameters => {
    if ( data.length !== COMMAND_BODY_SIZE ) {
        throw new Error(`Wrong buffer size: ${data.length}.`);
    }

    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(data);
    const date = buffer.getDate();
    const days = buffer.getUint8();

    if ( !buffer.isEmpty ) {
        throw new Error('BinaryBuffer is not empty.');
    }

    return {startTime2000: getTime2000FromDate(date), days};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns encoded bytes
 */
export const toBytes = ( parameters: IGetArchiveDaysParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);
    const {startTime2000, days} = parameters;
    const date = getDateFromTime2000(startTime2000);

    buffer.setDate(date);
    buffer.setUint8(days);

    return command.toBytes(id, buffer.data);
};
