/**
 * Command to request daily consumption (absolute values) of device channels from the archive.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getExAbsArchiveDaysMc from 'jooby-codec/analog/commands/downlink/getExAbsArchiveDaysMc.js';
 *
 * const parameters = {startTime2000: 756691200, days: 1, channelList: [1]};
 * const bytes = getExAbsArchiveDaysMc.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [31, 13, 4, 47, 152, 1, 1]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetExAbsArchiveDaysMC.md#request)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import {TTime2000, getTime2000FromDate} from '../../utils/time.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, IChannel} from '../../utils/CommandBinaryBuffer.js';


interface IGetExAbsArchiveDaysMCParameters {
    days: number;
    startTime2000: TTime2000;
    channelList: Array<number>;
}


export const id: types.TCommandId = 0x0d1f;
export const name: types.TCommandName = 'getExAbsArchiveDaysMc';
export const headerSize = 3;

const COMMAND_BODY_SIZE = 4;

export const examples: command.TCommandExamples = {
    '1 day absolute value for 1 channel from 2023.12.24 00:00:00 GMT': {
        id,
        name,
        headerSize,
        parameters: {startTime2000: 756691200, days: 1, channelList: [1]},
        bytes: [
            0x1f, 0x0d, 0x04,
            0x2f, 0x98, 0x01, 0x01
        ]
    }
};

/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): IGetExAbsArchiveDaysMCParameters => {
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
export const toBytes = ( parameters: IGetExAbsArchiveDaysMCParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);
    const {startTime2000, days, channelList} = parameters;
    buffer.setDate(startTime2000);
    buffer.setChannels(channelList.map(index => ({index} as IChannel)));
    buffer.setUint8(days);

    return command.toBytes(id, buffer.data);
};
