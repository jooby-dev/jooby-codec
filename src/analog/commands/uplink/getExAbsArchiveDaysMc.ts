/**
 * Command for retrieving daily consumption (absolute values) of device channels from the archive.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getExAbsArchiveDaysMc from 'jooby-codec/analog/commands/uplink/getExAbsArchiveDaysMc.js';
 *
 * const bytes = [0x2e, 0x6a, 0x08, 0x02, 0x83, 0x94, 0x2b, 0xaa, 0x2c];
 *
 * // decoded payload
 * const parameters = getExAbsArchiveDaysMc.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     startTime2000: 731721600,
 *     days: 2,
 *     channelList: [
 *         {
 *             pulseCoefficient: 100,
 *             index: 4,
 *             dayList: [5524, 5674]
 *         }
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetExAbsArchiveDaysMC.md#response)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import {TTime2000, getTime2000FromDate} from '../../utils/time.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, IChannelArchiveDaysAbsolute} from '../../utils/CommandBinaryBuffer.js';


interface IGetExAbsArchiveDaysMcParameters {
    channelList: Array<IChannelArchiveDaysAbsolute>;
    startTime2000: TTime2000;
    days: number;
}


export const id: types.TCommandId = 0x0d1f;
export const name: types.TCommandName = 'getExAbsArchiveDaysMc';
export const headerSize = 3;

// date 2 bytes, channelList 1 byte (max channelList: 4), days 1 byte (max days - 255)
// 4 + (4 channelList * (1 byte pulse coefficient + 5 bytes of day values) * 255 max days)
const COMMAND_BODY_MAX_SIZE = 6124;

export const examples: command.TCommandExamples = {
    'archive days values at 4 channel from 2023.03.10 00:00:00 GMT': {
        id,
        name,
        headerSize,
        parameters: {
            channelList: [
                {
                    pulseCoefficient: 100,
                    dayList: [5524, 5674],
                    index: 4
                }
            ],
            days: 2,
            startTime2000: 731721600
        },
        bytes: [
            0x1f, 0x0d, 0x09,
            0x2e, 0x6a, 0x08, 0x02, 0x83, 0x94, 0x2b, 0xaa, 0x2c
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): IGetExAbsArchiveDaysMcParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(data);
    const date = buffer.getDate();
    const channels = buffer.getChannels();
    const days = buffer.getUint8();
    const channelList: Array<IChannelArchiveDaysAbsolute> = [];

    channels.forEach(channelIndex => {
        const dayList: Array<number> = [];
        const pulseCoefficient = buffer.getPulseCoefficient();

        channelList.push({
            pulseCoefficient,
            dayList,
            index: channelIndex
        });

        for ( let day = 0; day < days; ++day ) {
            dayList.push(buffer.getExtendedValue());
        }
    });

    return {channelList, days, startTime2000: getTime2000FromDate(date)};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns encoded bytes
 */
export const toBytes = ( parameters: IGetExAbsArchiveDaysMcParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(COMMAND_BODY_MAX_SIZE);
    const {channelList, startTime2000, days} = parameters;

    buffer.setDate(startTime2000);
    buffer.setChannels(channelList);
    buffer.setUint8(days);

    channelList.forEach(({pulseCoefficient, dayList}) => {
        buffer.setPulseCoefficient(pulseCoefficient);
        dayList.forEach(value => {
            buffer.setExtendedValue(value);
        });
    });

    return command.toBytes(id, buffer.getBytesToOffset());
};
