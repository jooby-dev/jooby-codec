/**
 * Command to request/receive the archive data of hourly consumption.
 * In the data field of the command, it is necessary to set the start date and hour for reading the archive.
 * In case there is no data in the archive, a base value of `0xffffffff` will be provided.
 * Since the length of the transmitted data from the sensor is limited, not all requested data will be transferred.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getArchiveHours from 'jooby-codec/analog/commands/uplink/getArchiveHours.js';
 *
 * // response to getArchiveHours downlink command
 * const bytes = [0x2f, 0x97, 0x8c, 0x00, 0x00, 0xa3, 0x80, 0x0a];
 *
 * // decoded payload
 * const parameters = getArchiveHours.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     startTime2000: 756648000,
 *     counter: {isMagneticInfluence: true, value: 163},
 *     diff: [
 *         {isMagneticInfluence: true, value: 10}
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetArchiveHours.md#response)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, ILegacyHourCounterWithDiff} from '../../utils/CommandBinaryBuffer.js';


export const id: types.TCommandId = 0x05;
export const name: types.TCommandName = 'getArchiveHours';
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    '1 hour archive from 2023.12.23 12:00:00 GMT': {
        id,
        name,
        headerSize,
        parameters: {
            startTime2000: 756648000,
            counter: {isMagneticInfluence: true, value: 163},
            diff: [
                {isMagneticInfluence: true, value: 10}
            ]
        },
        bytes: [
            0x05, 0x08,
            0x2f, 0x97, 0x8c, 0x00, 0x00, 0xa3, 0x80, 0x0a
        ]
    }
};

/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): ILegacyHourCounterWithDiff => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(data);

    return buffer.getLegacyHourCounterWithDiff(true);
};

/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns encoded bytes
 */
export const toBytes = ( parameters: ILegacyHourCounterWithDiff ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(CommandBinaryBuffer.getLegacyHourCounterSize(parameters));

    buffer.setLegacyHourCounterWithDiff(parameters, true);

    return command.toBytes(id, buffer.getBytesToOffset());
};
