/**
 * Uplink command to get the maximum A+ power for the day.
 *
 * The corresponding downlink command: `getDayMaxDemand`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getDayMaxDemand from 'jooby-codec/mtx/commands/uplink/getDayMaxDemand.js';
 *
 * // response to getDayMaxDemand downlink command
 * const bytes = [
 *     0x17, 0x03, 0x0c,
 *     0x01, 0x00, 0x00, 0x00, 0x01, 0xc8,
 *     0x03, 0x0c, 0x00, 0x00, 0x25, 0x02,
 *     0x07, 0x1e, 0x00, 0x01, 0x32, 0xed,
 *     0x0c, 0x3b, 0x00, 0x06, 0x09, 0x77
 * ];
 *
 * // decoded payload
 * const parameters = getDayMaxDemand.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     date: {
 *         year: 23,
 *         month: 3,
 *         date: 12
 *     },
 *     power: [
 *         {
 *             hours: 1,
 *             minutes: 0,
 *             power: 456
 *         },
 *         {
 *             hours: 3,
 *             minutes: 12,
 *             power: 9474
 *         },
 *         {
 *             hours: 7,
 *             minutes: 30,
 *             power: 78573
 *         },
 *         {
 *             hours: 12,
 *             minutes: 59,
 *             power: 395639
 *         }
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/uplink/GetDayMaxDemand.md#response)
 */

import * as types from '../../types.js';
import * as command from '../../utils/command.js';
import * as accessLevels from '../../constants/accessLevels.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, TARIFF_NUMBER} from '../../utils/CommandBinaryBuffer.js';


interface IGetDayMaxDemandResponseParameters {
    date: types.IDate,
    power: Array<{
        hours: types.TUint8,
        minutes: types.TUint8,
        power: types.TUint32
    }>
}


export const id: types.TCommandId = 0x31;
export const name: types.TCommandName = 'getDayMaxDemand';
export const headerSize = 2;
export const accessLevel: types.TAccessLevel = accessLevels.READ_ONLY;
export const maxSize = 27;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'response for 2023.03.12': {
        id,
        name,
        headerSize,
        accessLevel,
        maxSize,
        parameters: {
            date: {
                year: 23,
                month: 3,
                date: 12
            },
            power: [
                {
                    hours: 1,
                    minutes: 0,
                    power: 456
                },
                {
                    hours: 3,
                    minutes: 12,
                    power: 9474
                },
                {
                    hours: 7,
                    minutes: 30,
                    power: 78573
                },
                {
                    hours: 12,
                    minutes: 59,
                    power: 395639
                }
            ]
        },
        bytes: [
            0x31, 0x1b,
            0x17, 0x03, 0x0c,
            0x01, 0x00, 0x00, 0x00, 0x01, 0xc8,
            0x03, 0x0c, 0x00, 0x00, 0x25, 0x02,
            0x07, 0x1e, 0x00, 0x01, 0x32, 0xed,
            0x0c, 0x3b, 0x00, 0x06, 0x09, 0x77
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( bytes: types.TBytes ): IGetDayMaxDemandResponseParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);
    const date = buffer.getDate();

    // 4 tariffs
    const power = Array.from({length: TARIFF_NUMBER}, () => ({
        hours: buffer.getUint8(),
        minutes: buffer.getUint8(),
        power: buffer.getUint32()
    }));

    return {date, power};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetDayMaxDemandResponseParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    buffer.setDate(parameters.date);

    parameters.power.forEach(value => {
        buffer.setUint8(value.hours);
        buffer.setUint8(value.minutes);
        buffer.setUint32(value.power);
    });

    return command.toBytes(id, buffer.getBytesToOffset());
};
