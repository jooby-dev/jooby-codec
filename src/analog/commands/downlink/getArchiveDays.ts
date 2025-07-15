/**
 * Downlink command for requesting the archive of daily data from the pulse counter sensor.
 * If there is no data available in the archive, `0xffffffff` will be returned.
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
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {
    getDate,
    setDate
} from '../../utils/CommandBinaryBuffer.js';
import {getArchiveDays as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


interface IGetArchiveDaysParameters {
    /** the number of days to retrieve from archive */
    days: types.TUint8,

    /**
     * Start date for requested day pulse counter's values.
     */
    startTime2000: TTime2000
}

export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
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
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetArchiveDaysParameters => {
    if ( bytes.length !== COMMAND_BODY_SIZE ) {
        throw new Error(`Wrong buffer size: ${bytes.length}.`);
    }

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);
    const date = getDate(buffer);
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
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetArchiveDaysParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(COMMAND_BODY_SIZE, false);
    const {startTime2000, days} = parameters;
    const date = getDateFromTime2000(startTime2000);

    setDate(buffer, date);
    buffer.setUint8(days);

    return command.toBytes(id, buffer.data);
};
