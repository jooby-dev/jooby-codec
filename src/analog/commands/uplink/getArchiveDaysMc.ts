/**
 * Command for receiving response with archive days data from MC.
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
import CommandBinaryBuffer, {ICommandBinaryBuffer, IChannelDays} from '../../utils/CommandBinaryBuffer.js';


interface IGetArchiveDaysMCResponseParameters {
    channelList: Array<IChannelDays>;
    startTime2000: TTime2000;
    days: number;
}


export const id: types.TCommandId = 0x1b;
export const name: types.TCommandName = 'getArchiveDaysMc';
export const headerSize = 2;

// date 2 bytes, channelList 1 byte (max channelList: 4), days 1 byte (max days - 255)
// 4 + (4 channelList * 5 bytes of day values * 255 max days)
const COMMAND_BODY_MAX_SIZE = 5104;

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
            0x1b, 0x05,
            0x15, 0x49, 0x01, 0x01, 0x00
        ]
    }
};

/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): IGetArchiveDaysMCResponseParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(data);
    const date = buffer.getDate();
    const channels = buffer.getChannels();
    const days = buffer.getUint8();
    const channelList: Array<IChannelDays> = [];

    channels.forEach(channelIndex => {
        const dayList: Array<number> = [];

        channelList.push({dayList, index: channelIndex});

        for ( let day = 0; day < days; ++day ) {
            dayList.push(buffer.getExtendedValue());
        }
    });

    return {startTime2000: getTime2000FromDate(date), days, channelList};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns encoded bytes
 */
export const toBytes = ( parameters: IGetArchiveDaysMCResponseParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
    const {startTime2000, days, channelList} = parameters;

    buffer.setDate(startTime2000);
    buffer.setChannels(channelList);
    buffer.setUint8(days);

    channelList.forEach(({dayList}) => {
        dayList.forEach(value => {
            buffer.setExtendedValue(value);
        });
    });

    return command.toBytes(id, buffer.getBytesToOffset());
};
