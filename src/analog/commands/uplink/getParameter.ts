/**
 * The command to read the parameter set in the sensor.
 *
 * In the body of the command, you must specify the type of the parameter.
 * In response, the sensor will transmit the current value of the requested parameter.
 *
 * @packageDocumentation
 *
 * @example
 * ```typescript
 * import * as getParameter from 'jooby-codec/analog/commands/uplink/getParameter.js';
 *
 * // response to getParameter downlink command
 * const bytes = [0x01, 0x00, 0x00, 0x00, 0x04];
 *
 * // decoded payload
 * const parameters = getParameter.fromBytes(commandBody);
 *
 * console.log(parameters);
 * // output:
 * {
 *     id: 1,
 *     data: {value: 2400}
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetParameter.md#response)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import {
    IResponseParameter,
    getResponseParameterSize,
    getResponseParameter,
    setResponseParameter
} from '../../utils/binary/buffer.js';
import {getParameter as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'reporting data interval': {
        id,
        name,
        headerSize,
        parameters: {
            id: 1,
            name: 'REPORTING_DATA_INTERVAL',
            data: {
                specialSchedulePeriod: 0,
                firstDaysSpecialSchedule: 0,
                lastDaysSpecialSchedule: 0,
                period: 2400
            }
        },
        bytes: [
            0x04, 0x05,
            0x01, 0x00, 0x00, 0x00, 0x04
        ]
    },
    'get spread factor and frequency for RX2 window': {
        id,
        name,
        headerSize,
        parameters: {
            id: 18,
            name: 'RX2_CONFIG',
            data: {
                spreadFactor: 5,
                spreadFactorName: 'SF7B125',
                frequency: 20000
            }
        },
        bytes: [
            0x04, 0x05,
            0x12, 0x05, 0x00, 0x00, 0xc8
        ]
    },
    'absolute data (not multichannel device)': {
        id,
        name,
        headerSize,
        parameters: {
            id: 23,
            name: 'ABSOLUTE_DATA',
            data: {meterValue: 204, pulseCoefficient: 100, value: 2023}
        },
        bytes: [
            0x04, 0x0a,
            0x17, 0x00, 0x00, 0x00, 0xcc, 0x83, 0x00, 0x00, 0x07, 0xe7
        ]
    },
    'state of absolute data (not multichannel device)': {
        id,
        name,
        headerSize,
        parameters: {
            id: 24,
            name: 'ABSOLUTE_DATA_ENABLE',
            data: {state: 1}
        },
        bytes: [
            0x04, 0x02,
            0x18, 0x01
        ]
    },
    'absolute data for multichannel device (1 channel)': {
        id,
        name,
        headerSize,
        parameters: {
            id: 29,
            name: 'ABSOLUTE_DATA_MULTI_CHANNEL',
            data: {channel: 1, meterValue: 402, pulseCoefficient: 1000, value: 2032}
        },
        bytes: [
            0x04, 0x0b,
            0x1d, 0x00, 0x00, 0x00, 0x01, 0x92, 0x84, 0x00, 0x00, 0x07, 0xf0
        ]
    },
    'state of absolute data for multichannel device (1 channel)': {
        id,
        name,
        headerSize,
        parameters: {
            id: 30,
            name: 'ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL',
            data: {channel: 2, state: 1}
        },
        bytes: [
            0x04, 0x03,
            0x1e, 0x01, 0x01
        ]
    },
    'nbiot module info': {
        id,
        name,
        headerSize,
        parameters: {
            id: 51,
            name: 'NBIOT_MODULE_INFO',
            data: {
                moduleInfo: 'BC660KGLAAR01A05'
            }
        },
        bytes: [
            0x04, 0x12,
            0x33, 0x10, 0x42, 0x43, 0x36, 0x36, 0x30, 0x4B, 0x47, 0x4C, 0x41, 0x41, 0x52, 0x30, 0x31, 0x41, 0x30, 0x35
        ]
    },
    'nbiot bands': {
        id,
        name,
        headerSize,
        parameters: {
            id: 52,
            name: 'NBIOT_BANDS',
            data: {bands: [3, 20]}
        },
        bytes: [
            0x04, 0x04,
            0x34, 0x02, 0x03, 0x14
        ]
    },
    'time synchronization period in seconds via MAC commands': {
        id,
        name,
        headerSize,
        parameters: {
            id: 58,
            name: 'TIME_SYNCHRONIZATION_PERIOD_VIA_MAC',
            data: {
                period: 1440
            }
        },
        bytes: [
            0x04, 0x05,
            0x3a, 0x00, 0x00, 0x05, 0xa0
        ]
    },
    'keep lora connection even after being removed': {
        id,
        name,
        headerSize,
        parameters: {
            id: 59,
            name: 'KEEP_LORA_CONNECTION_ON_REMOVAL',
            data: {
                value: true
            }
        },
        bytes: [
            0x04, 0x02,
            0x3b, 0x01
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IResponseParameter => {
    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return getResponseParameter(buffer);
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IResponseParameter ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(getResponseParameterSize(parameters), false);

    setResponseParameter(buffer, parameters);

    return command.toBytes(id, buffer.data);
};
