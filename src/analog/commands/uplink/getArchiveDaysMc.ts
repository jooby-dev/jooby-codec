/**
 * Command to receive day pulse counter's values from device archive.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getArchiveDaysMc from 'jooby-codec/analog/commands/uplink/getArchiveDaysMc.js';
 *
 * // get day values from 2001.03.10 12:00:00 GMT for channel 1
 * const bytes = [0xa9, 0x6d, 0x01, 0x02, 0xea, 0x01, 0xcc, 0x02];
 *
 * // decoded payload
 * const parameters = getArchiveDaysMc.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     startTime2000: 2678227200,
 *     days: 2,
 *     channelList: [{index: 1, dayList: [234, 332]}]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetArchiveDaysMC.md#response)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import {TTime2000, getTime2000FromDate} from '../../utils/time.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {
    IChannelDays,
    getExtendedValue,
    setExtendedValue,
    getChannels,
    setChannels,
    getDate,
    setDate
} from '../../utils/CommandBinaryBuffer.js';
import * as archive from '../../constants/archive.js';
import {getArchiveDaysMc as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


interface IGetArchiveDaysMcResponseParameters {
    channelList: Array<IChannelDays>;

    /**
     * Start date for requested data.
     */
    startTime2000: TTime2000;

    /**
     * The number of days from archive.
     *
     * It's pulse counter's values by days for each channel.
     */
    days: types.TUint8;
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

const COMMAND_BODY_MAX_SIZE = 255;

export const examples: command.TCommandExamples = {
    'get day values from 2001.03.10 12:00:00 GMT for channel 1': {
        id,
        name,
        headerSize,
        parameters: {
            startTime2000: 2678227200,
            days: 2,
            channelList: [{dayList: [234, 332], index: 1}]
        },
        bytes: [
            0x1b, 0x08,
            0xa9, 0x6d, 0x01, 0x02, 0xea, 0x01, 0xcc, 0x02
        ]
    },
    'empty result from 2010.10.09 00:00:00 GMT for channel 1': {
        id,
        name,
        headerSize,
        parameters: {
            startTime2000: 339897600,
            days: 1,
            channelList: [{dayList: [0], index: 1}]
        },
        bytes: [
            0x1b, 0x09,
            0x15, 0x49, 0x01, 0x01, 0xff, 0xff, 0xff, 0xff, 0x0f
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetArchiveDaysMcResponseParameters => {
    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);
    const date = getDate(buffer);
    const channels = getChannels(buffer);
    const days = buffer.getUint8();
    const channelList: Array<IChannelDays> = [];

    channels.forEach(channelIndex => {
        const dayList: Array<number> = [];

        channelList.push({dayList, index: channelIndex});

        for ( let day = 0; day < days; ++day ) {
            const value = getExtendedValue(buffer);

            dayList.push(value === archive.EMPTY_VALUE ? 0 : value);
        }
    });

    return {startTime2000: getTime2000FromDate(date), days, channelList};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetArchiveDaysMcResponseParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(COMMAND_BODY_MAX_SIZE, false);
    const {startTime2000, days, channelList} = parameters;

    setDate(buffer, startTime2000);
    setChannels(buffer, channelList);
    buffer.setUint8(days);

    channelList.forEach(({dayList}) => {
        dayList.forEach(value => {
            setExtendedValue(buffer, value === 0 ? archive.EMPTY_VALUE : value);
        });
    });

    return command.toBytes(id, buffer.getBytesToOffset());
};
