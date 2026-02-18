/**
 * Uplink command for receiving status information from the sensor battery.
 *
 * By default, the battery status is measured once per 24 hours. The state of the battery physically cannot change dramatically.
 * Response to the request contains the latest measurement results. This is enough to monitor the battery condition.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getBatteryStatus from 'jooby-codec/analog/commands/uplink/getBatteryStatus.js';
 *
 * const bytes = 0x10, 0x0e, 0x10, 0x0e, 0x0a, 0x04, 0x0f, 0x29, 0x00, 0x22, 0x00;
 *
 * // decoded payload
 * const parameters = getBatteryStatus.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     voltageUnderLowLoad: 3600,
 *     voltageUnderHighLoad: 3600,
 *     internalResistance: 1034,
 *     temperature: 15,
 *     remainingCapacity: 41,
 *     isLastDayOverconsumption: false,
 *     averageDailyOverconsumptionCounter: 34
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetBatteryStatus.md#response)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {getBatteryStatus as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


/**
 * GetBatteryStatusResponse command parameters
 */
export interface IGetBatteryStatusResponseParameters {
    /**
     * Voltage under minimum load (sleep mode), value in `mV`.
     * Typical value is about `3600` `mV`.
     * If the voltage value is `4095` `mV`, then the value is unknown.
     */
    voltageUnderLowLoad: types.TUint16;

    /**
     * Voltage under load simulating transmission mode, value in `mV`.
     * Typical value is about `3600` `mV`.
     * If the voltage value is `4095` `mV`, then the value is unknown.
     */
    voltageUnderHighLoad: types.TUint16;

    /**
     * Internal resistance of the battery in `mΩ`.
     * If the value of the internal resistance is `65535` `mOhm`, then the resistance is unknown.
     * Max value is about `60000` `mOhm`. Typical range is about `5000..28000` `mOhm`.
     */
    internalResistance: types.TUint16;

    /**
     * It's a signed number in degrees Celsius.
     */
    temperature: types.TInt8;

    /**
     * It's the remaining battery capacity, where `254` is `100%`.
     * A value of `255` means that the remaining battery capacity is unknown.
     */
    remainingCapacity: types.TUint8;

    /**
     * Flag is set when consumption over the last 24 hours was higher than estimated.
     */
    isLastDayOverconsumption: boolean;

    /**
     * Counter for exceeding average daily consumption.
     */
    averageDailyOverconsumptionCounter: types.TUint16;
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 3;

const COMMAND_BODY_SIZE: number = 11;

export const examples: command.TCommandExamples = {
    'simple response': {
        id,
        name,
        headerSize,
        parameters: {
            voltageUnderLowLoad: 3600,
            voltageUnderHighLoad: 3600,
            internalResistance: 1034,
            temperature: 15,
            remainingCapacity: 41,
            isLastDayOverconsumption: false,
            averageDailyOverconsumptionCounter: 34
        },
        bytes: [
            0x1f, 0x05, 0x0b,
            0x0e, 0x10, 0x0e, 0x10, 0x04, 0x0a, 0x0f, 0x29, 0x00, 0x00, 0x22
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetBatteryStatusResponseParameters => {
    validateCommandPayload(name, bytes, COMMAND_BODY_SIZE);

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return {
        voltageUnderLowLoad: buffer.getUint16(),
        voltageUnderHighLoad: buffer.getUint16(),
        internalResistance: buffer.getUint16(),
        temperature: buffer.getInt8(),
        remainingCapacity: buffer.getUint8(),
        isLastDayOverconsumption: buffer.getUint8() === 1,
        averageDailyOverconsumptionCounter: buffer.getUint16()
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetBatteryStatusResponseParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(COMMAND_BODY_SIZE, false);

    buffer.setUint16(parameters.voltageUnderLowLoad);
    buffer.setUint16(parameters.voltageUnderHighLoad);
    buffer.setUint16(parameters.internalResistance);
    buffer.setInt8(parameters.temperature);
    buffer.setUint8(parameters.remainingCapacity);
    buffer.setUint8(parameters.isLastDayOverconsumption ? 1 : 0);
    buffer.setUint16(parameters.averageDailyOverconsumptionCounter);

    return command.toBytes(id, buffer.data);
};
