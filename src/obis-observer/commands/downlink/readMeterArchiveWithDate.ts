/**
 * Downlink command to get the meter archive data for the specific date.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as readMeterArchiveWithDate from 'jooby-codec/obis-observer/commands/downlink/readMeterArchiveWithDate.js';
 *
 * const parameters = {
 *     requestId: 3,
 *     archiveType: 2,
 *     index: 0,
 *     meterId: 1,
 *     time2000: 496333462
 * };
 *
 * const bytes = readMeterArchiveWithDate.toBytes(parameters);
 *
 * // output command binary in hex representation
 * console.log(bytes);
 * // output
 * [19, 14, 3, 2, 0, 0, 0, 0, 0, 0, 0, 1, 29, 149, 114, 150]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/ReadMeterArchiveWithDate.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../../types.js';
import CommandBinaryBuffer, {
    ICommandBinaryBuffer, ICommandParameters, REQUEST_ID_SIZE, METER_ID_SIZE
} from '../../utils/CommandBinaryBuffer.js';
import {TTime2000} from '../../../analog/utils/time.js';
import {readMeterArchiveWithDate as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


export interface IReadMeterArchiveWithDateParameters extends ICommandParameters {
    archiveType: types.TUint8,
    index: types.TUint32,
    meterId: types.TUint32,
    time2000: TTime2000
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

const COMMAND_BODY_SIZE = REQUEST_ID_SIZE + METER_ID_SIZE + 9;

export const examples: command.TCommandExamples = {
    'request to read all archive 2 for the meter 1 starts with index 0 for the date 15-09-23 14:24:22': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 3,
            archiveType: 2,
            index: 0,
            meterId: 1,
            time2000: 496333462
        },
        bytes: [
            0x13, 0x0e,
            0x03, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x1d, 0x95, 0x72, 0x96
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IReadMeterArchiveWithDateParameters => {
    if ( bytes.length !== COMMAND_BODY_SIZE ) {
        throw new Error(`Wrong buffer size: ${bytes.length}.`);
    }

    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);
    const requestId = buffer.getUint8();
    const archiveType = buffer.getUint8();
    const index = buffer.getUint32();
    const meterId = buffer.getUint32();
    const time2000 = buffer.getUint32() as TTime2000;

    return {
        requestId,
        archiveType,
        index,
        meterId,
        time2000
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IReadMeterArchiveWithDateParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);

    buffer.setUint8(parameters.requestId);
    buffer.setUint8(parameters.archiveType);
    buffer.setUint32(parameters.index);
    buffer.setUint32(parameters.meterId);
    buffer.setUint32(parameters.time2000);

    return command.toBytes(id, buffer.data);
};
