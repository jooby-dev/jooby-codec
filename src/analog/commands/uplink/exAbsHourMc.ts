/**
 * Command for retrieving absolute values of channels with hourly differences.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as exAbsHourMc from 'jooby-codec/analog/commands/uplink/exAbsHourMc.js';
 *
 * // 1 channel at 2023.03.10 12:00:00 GMT
 * const bytes = [0x2e, 0x6a, 0x2c, 0x01, 0x83, 0xb9, 0xf3, 0x14, 0x80, 0x01];
 *
 * // decoded payload
 * const parameters = exAbsHourMc.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     startTime2000: 731764800,
 *     hours: 2,
 *     channelList: [
 *         {
 *             pulseCoefficient: 100,
 *             index: 1,
 *             value: 342457,
 *             diff: [128]
 *         }
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/uplink/ExAbsHourMC.md)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import {TTime2000, getTime2000FromDate, getDateFromTime2000} from '../../utils/time.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import {
    IChannelHourAbsoluteValue,
    getHours,
    setHours,
    getDate,
    setDate,
    getChannelsAbsoluteValuesWithHourDiff,
    setChannelsAbsoluteValuesWithHourDiff
} from '../../utils/binary/buffer.js';
import {exAbsHourMc as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export interface IUplinkExAbsHourMcResponseParameters {
    channelList: Array<IChannelHourAbsoluteValue>;

    /**
     * Start date for requested data.
     */
    startTime2000: TTime2000;

    /**
     * Number of hours.
     */
    hours: types.TUint8;
}

export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 3;

// date 2 bytes, hour 1 byte (max hours: 7), channelList 1 byte (max channelList: 4)
// 4 + (4 channelList * 1 byte pulse coefficient) + (4 channelList * 5 bytes of hour values) + (4 * 5 bytes of diff * 7 max hours diff)
const COMMAND_BODY_MAX_SIZE = 168;

export const examples: command.TCommandExamples = {
    '1 channel at 2023.03.10 12:00:00 GMT': {
        id,
        name,
        headerSize,
        parameters: {
            startTime2000: 731764800,
            hours: 2,
            channelList: [
                {
                    diff: [128],
                    value: 342457,
                    pulseCoefficient: 100,
                    index: 1
                }
            ]
        },
        bytes: [
            0x1f, 0x0a, 0x0a,
            0x2e, 0x6a, 0x2c, 0x01, 0x83, 0xb9, 0xf3, 0x14, 0x80, 0x01
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IUplinkExAbsHourMcResponseParameters => {
    if ( bytes.length > COMMAND_BODY_MAX_SIZE ) {
        throw new Error(`Wrong buffer size: ${bytes.length}.`);
    }

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);
    const date = getDate(buffer);
    const {hour, hours} = getHours(buffer);
    const channelList = getChannelsAbsoluteValuesWithHourDiff(buffer, hours);

    date.setUTCHours(hour);

    return {startTime2000: getTime2000FromDate(date), hours, channelList};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IUplinkExAbsHourMcResponseParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(COMMAND_BODY_MAX_SIZE, false);
    const {startTime2000, hours, channelList} = parameters;

    const date = getDateFromTime2000(startTime2000);
    const hour = date.getUTCHours();

    setDate(buffer, startTime2000);
    setHours(buffer, hour, hours);
    setChannelsAbsoluteValuesWithHourDiff(buffer, channelList);

    return command.toBytes(id, buffer.getBytesToOffset());
};
