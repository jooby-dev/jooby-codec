/**
 * Downlink command to get half hours for the selected channel by date.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getHalfHourDemandChannel from 'jooby-codec/mtx3/commands/downlink/getHalfHourDemandChannel.js';
 *
 * const parameters = {
 *     channel: 1,
 *     loadProfile: 16,
 *     date: {
 *         year: 24,
 *         month: 3,
 *         date: 22
 *     }
 * };
 *
 * const bytes = getHalfHourDemandChannel.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [90, 5, 1, 16, 24, 3, 22]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx3/commands/GetHalfHourDemandChannel.md#request)
 */

import * as command from '../../../mtx1/utils/command.js';
import {READ_ONLY} from '../../../mtx1/constants/accessLevels.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {THalfHourLoadProfile, TChannel} from '../../utils/CommandBinaryBuffer.js';
import {getDate, setDate} from '../../../mtx1/utils/CommandBinaryBuffer.js';
import * as types from '../../types.js';
import {getHalfHourDemandChannel as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


interface IGetHalfHourDemandChannelRequestParameters {
    channel: TChannel,
    loadProfile: THalfHourLoadProfile,
    date: types.IDate
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 5;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'request A-R- energy for phase A on 2024.03.22': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            channel: 1,
            loadProfile: 16,
            date: {
                year: 24,
                month: 3,
                date: 22
            }
        },
        bytes: [
            0x5a, 0x05,
            0x01, // channel
            0x10, // load profile
            0x18, 0x03, 0x16 // date
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetHalfHourDemandChannelRequestParameters => {
    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return {
        channel: buffer.getUint8(),
        loadProfile: buffer.getUint8(),
        date: getDate(buffer)
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetHalfHourDemandChannelRequestParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    // body
    buffer.setUint8(parameters.channel);
    buffer.setUint8(parameters.loadProfile);
    setDate(buffer, parameters.date);

    return command.toBytes(id, buffer.data);
};
