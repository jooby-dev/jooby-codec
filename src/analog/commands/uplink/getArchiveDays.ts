/**
 * Uplink command for requesting the archive of daily data from the pulse counter sensor.
 * If there is no data available in the archive, `0xffffffff` will be returned.
 * Due to the limited length of transmitted data from the sensor, not all requested data will be transferred.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getArchiveDays from 'jooby-codec/analog/commands/uplink/getArchiveDays.js';
 *
 * // get day values from 2001.03.10
 * const bytes = [0xa9, 0x6d, 0x80, 0x00, 0x00, 0xea];
 *
 * // decoded payload
 * const parameters = getArchiveDays.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     startTime2000: 2678227200,
 *     dayList: [
 *         {isMagneticInfluence: true, value: 234}
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetArchiveDays.md#response)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import {TTime2000, getTime2000FromDate} from '../../utils/time.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {
    ILegacyCounter,
    getLegacyCounter,
    setLegacyCounter,
    getDate,
    setDate
} from '../../utils/CommandBinaryBuffer.js';
import {getArchiveDays as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


interface IGetArchiveDaysResponseParameters {
    /**
     * Start date for requested data.
     */
    startTime2000: TTime2000,

    dayList: Array<ILegacyCounter>
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

// date 2 bytes
const COMMAND_BODY_MIN_SIZE = 2;
const DAY_COUNTER_SIZE = 4;

export const examples: command.TCommandExamples = {
    'get day values from 2001.03.10': {
        id,
        name,
        headerSize,
        parameters: {
            startTime2000: 2678227200,
            dayList: [
                {isMagneticInfluence: true, value: 234}
            ]
        },
        bytes: [
            0x06, 0x06,
            0xa9, 0x6d, 0x80, 0x00, 0x00, 0xea
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetArchiveDaysResponseParameters => {
    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);
    const date = getDate(buffer);
    const dayList = [];

    while ( buffer.offset < buffer.data.length ) {
        dayList.push(getLegacyCounter(buffer, undefined, true));
    }

    return {startTime2000: getTime2000FromDate(date), dayList};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetArchiveDaysResponseParameters ): types.TBytes => {
    const {startTime2000, dayList} = parameters;
    const buffer: IBinaryBuffer = new BinaryBuffer(COMMAND_BODY_MIN_SIZE + (dayList.length * DAY_COUNTER_SIZE), false);

    setDate(buffer, startTime2000);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    dayList.forEach(dayCounter => setLegacyCounter(buffer, dayCounter, undefined, true));

    return command.toBytes(id, buffer.getBytesToOffset());
};
