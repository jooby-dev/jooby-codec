/**
 * Battery status event.
 *
 * It is only available for ultrasonic water meters, i.e. `US_WATER` hardware type.
 * Event is sent every 24 hours.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as usWaterMeterBatteryStatus from 'jooby-codec/analog/commands/uplink/usWaterMeterBatteryStatus.js';
 *
 * const bytes = [0xe1, 0x0e, 0x10, 0x0a, 0x04, 0x64, 0x00];
 *
 * // decoded payload
 * const parameters = usWaterMeterBatteryStatus.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     voltage: {
 *         underLowLoad: 3600,
 *         underHighLoad: 3600
 *     },
 *     internalResistance: 1034,
 *     lastDepassivationTime: 100
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/uplink/USWaterMeterBatteryStatus.md)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, IBatteryVoltage} from '../../utils/CommandBinaryBuffer.js';


export interface IUSWaterMeterBatteryStatusParameters {
    voltage: IBatteryVoltage,

    /**
     * Internal resistance of the battery in `mΩ`.
     * If the value of the internal resistance is `65535` `mOhm`, then the resistance is unknown.
     * Max value is about `60000` `mOhm`. Typical range is about `5000..28000` `mOhm`.
     */
    internalResistance: types.TUint16,

    /**
     * Duration of the last depassivation (in seconds)
     */
    lastDepassivationTime: types.TUint16
}


export const id: types.TCommandId = 0x141f;
export const name: types.TCommandName = 'usWaterMeterBatteryStatus';
export const headerSize = 3;

const COMMAND_BODY_SIZE: number = 7;

export const examples: command.TCommandExamples = {
    event: {
        id,
        name,
        headerSize,
        parameters: {
            voltage: {
                underLowLoad: 3600,
                underHighLoad: 3600
            },
            internalResistance: 1034,
            lastDepassivationTime: 100
        },
        bytes: [
            0x1f, 0x14, 0x07,
            0xe1, 0x0e, 0x10, 0x04, 0x0a, 0x00, 0x64
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param data - command body bytes
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): IUSWaterMeterBatteryStatusParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(data);

    return {
        voltage: buffer.getBatteryVoltage(),
        internalResistance: buffer.getUint16(),
        lastDepassivationTime: buffer.getUint16()
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IUSWaterMeterBatteryStatusParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);

    buffer.setBatteryVoltage(parameters.voltage);
    buffer.setUint16(parameters.internalResistance);
    buffer.setUint16(parameters.lastDepassivationTime);

    return command.toBytes(id, buffer.data);
};
