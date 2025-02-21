/**
 * Device parameters setup command.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * sa setParameter from 'jooby-codec/analog/commands/downlink/SetParameter.js';
 * import deviceParameters from 'jooby-codec/analog/constants/deviceParameters.js';
 *
 *
 * const parameters = {
 *     id: constants.deviceParameters.ABSOLUTE_DATA,
 *     data: { value: 2023, meterValue: 204, pulseCoefficient: 100 }
 * };
 * const bytes = setParameter.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [3, 10, 23, 0, 0, 0, 204, 131, 0, 0, 7, 231]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/SetParameter.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../../types.js';
import * as channelTypes from '../../constants/channelTypes.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, IParameter, getParameterSize} from '../../utils/CommandBinaryBuffer.js';
import {setParameter as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'set minimal reporting data interval to 1 hour': {
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
                period: 3600
            }
        },
        bytes: [
            0x03, 0x05,
            0x01, 0x00, 0x00, 0x00, 0x06
        ]
    },
    'set day checkout hour to 12:00': {
        id,
        name,
        headerSize,
        parameters: {
            id: 4,
            name: 'DAY_CHECKOUT_HOUR',
            data: {value: 12}
        },
        bytes: [
            0x03, 0x02,
            0x04, 0x0c
        ]
    },
    'set reporting data type to "day"': {
        id,
        name,
        headerSize,
        parameters: {
            id: 5,
            name: 'REPORTING_DATA_TYPE',
            data: {type: 1}
        },
        bytes: [
            0x03, 0x02,
            0x05, 0x01
        ]
    },
    'set "with confirmation" for delivery of priority data': {
        id,
        name,
        headerSize,
        parameters: {
            id: 8,
            name: 'PRIORITY_DATA_DELIVERY_TYPE',
            data: {value: 0}
        },
        bytes: [
            0x03, 0x02,
            0x08, 0x00
        ]
    },
    'set activation method to "ABP"': {
        id,
        name,
        headerSize,
        parameters: {
            id: 9,
            name: 'ACTIVATION_METHOD',
            data: {type: 1}
        },
        bytes: [
            0x03, 0x02,
            0x09, 0x01
        ]
    },
    'set battery depassivation info': {
        id,
        name,
        headerSize,
        parameters: {
            id: 10,
            name: 'BATTERY_DEPASSIVATION_INFO',
            data: {
                loadTime: 100,
                internalResistance: 3222,
                lowVoltage: 233
            }
        },
        bytes: [
            0x03, 0x07,
            0x0a, 0x00, 0x64, 0x0c, 0x96, 0x00, 0xe9
        ]
    },
    'set battery minimal load time to "100"': {
        id,
        name,
        headerSize,
        parameters: {
            id: 11,
            name: 'BATTERY_MINIMAL_LOAD_TIME',
            data: {value: 100}
        },
        bytes: [
            0x03, 0x05,
            0x0b, 0x00, 0x00, 0x00, 0x64
        ]
    },
    'enable 1-4 channels, and disable serial channel for device': {
        id,
        name,
        headerSize,
        parameters: {
            id: 13,
            name: 'CHANNELS_CONFIG',
            data: {value: 0}
        },
        bytes: [
            0x03, 0x02,
            0x0d, 0x00
        ]
    },
    'set spread factor and frequency for RX2 window': {
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
            0x03, 0x05,
            0x12, 0x05, 0x00, 0x00, 0xc8
        ]
    },
    'set absolute data (not multichannel device)': {
        id,
        name,
        headerSize,
        parameters: {
            id: 23,
            name: 'ABSOLUTE_DATA',
            data: {
                meterValue: 204,
                pulseCoefficient: 100,
                value: 2023
            }
        },
        bytes: [
            0x03, 0x0a,
            0x17, 0x00, 0x00, 0x00, 0xcc, 0x83, 0x00, 0x00, 0x07, 0xe7
        ]
    },
    'enable absolute data (not multichannel device)': {
        id,
        name,
        headerSize,
        parameters: {
            id: 24,
            name: 'ABSOLUTE_DATA_ENABLE',
            data: {state: 1}
        },
        bytes: [
            0x03, 0x02,
            0x18, 0x01
        ]
    },
    'set device serial number': {
        id,
        name,
        headerSize,
        parameters: {
            id: 25,
            name: 'SERIAL_NUMBER',
            data: {value: '1b 0a 3e dc 3e 22'}
        },
        bytes: [
            0x03, 0x07,
            0x19, 0x1b, 0x0a, 0x3e, 0xdc, 0x3e, 0x22
        ]
    },
    'set device geolocation': {
        id,
        name,
        headerSize,
        parameters: {
            id: 26,
            name: 'GEOLOCATION',
            data: {
                latitude: 34.43,
                longitude: 43.43,
                altitude: 23
            }
        },
        bytes: [
            0x03, 0x0b,
            0x1a, 0x42, 0x09, 0xb8, 0x52, 0x42, 0x2d, 0xb8, 0x52, 0x00, 0x17
        ]
    },
    'set interval to send EXTRA FRAME': {
        id,
        name,
        headerSize,
        parameters: {
            id: 28,
            name: 'EXTRA_FRAME_INTERVAL',
            data: {value: 3600}
        },
        bytes: [
            0x03, 0x03,
            0x1c, 0x0e, 0x10
        ]
    },
    'set absolute data for multichannel device (1 channel)': {
        id,
        name,
        headerSize,
        parameters: {
            id: 29,
            name: 'ABSOLUTE_DATA_MULTI_CHANNEL',
            data: {
                channel: 1,
                meterValue: 402,
                pulseCoefficient: 1000,
                value: 2032
            }
        },
        bytes: [
            0x03, 0x0b,
            0x1d, 0x00, 0x00, 0x00, 0x01, 0x92, 0x84, 0x00, 0x00, 0x07, 0xf0
        ]
    },
    'enable absolute data for multichannel device (2 channel)': {
        id,
        name,
        headerSize,
        parameters: {
            id: 30,
            name: 'ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL',
            data: {
                channel: 2,
                state: 1
            }
        },
        bytes: [
            0x03, 0x03,
            0x1e, 0x01, 0x01
        ]
    },
    'set pulse channels config': {
        id,
        name,
        headerSize,
        parameters: {
            id: 31,
            name: 'PULSE_CHANNELS_SCAN_CONFIG',
            data: {
                channelList: [1, 4],
                pullUpTime: 18,
                scanTime: 23
            }
        },
        bytes: [
            0x03, 0x04,
            0x1f, 0x09, 0x12, 0x17
        ]
    },
    'enable channels: 1, 2, disable channels: 3, 4, for pulse device': {
        id,
        name,
        headerSize,
        parameters: {
            id: 32,
            name: 'PULSE_CHANNELS_SET_CONFIG',
            data: {
                channel1: true,
                channel2: true,
                channel3: false,
                channel4: false
            }
        },
        bytes: [
            0x03, 0x02,
            0x20, 0x03
        ]
    },
    'set depassivation config for device': {
        id,
        name,
        headerSize,
        parameters: {
            id: 33,
            name: 'BATTERY_DEPASSIVATION_CONFIG',
            data: {
                resistanceStartThreshold: 36000,
                resistanceStopThreshold: 26000
            }
        },
        bytes: [
            0x03, 0x05,
            0x21, 0x8c, 0xa0, 0x65, 0x90
        ]
    },
    'set nbiot bands': {
        id,
        name,
        headerSize,
        parameters: {
            id: 52,
            name: 'NBIOT_BANDS',
            data: {bands: [3, 8, 20]}
        },
        bytes: [
            0x03, 0x05,
            0x34, 0x03, 0x03, 0x08, 0x14
        ]
    },
    'set nbiot apn': {
        id,
        name,
        headerSize,
        parameters: {
            id: 53,
            name: 'NBIOT_APN',
            data: {apn: 'nbiot'}
        },
        bytes: [
            0x03, 0x07,
            0x35, 0x05, 0x6e, 0x62, 0x69, 0x6f, 0x74
        ]
    },
    'set nbiot led indication': {
        id,
        name,
        headerSize,
        parameters: {
            id: 54,
            name: 'NBIOT_LED_INDICATION',
            data: {
                enableLed: 1,
                enableNbiotNetworkLed: 1
            }
        },
        bytes: [
            0x03, 0x03,
            0x36, 0x01, 0x01
        ]
    },
    'set nbiot sim pin code': {
        id,
        name,
        headerSize,
        parameters: {
            id: 55,
            name: 'NBIOT_SIM',
            data: {
                enable: 1,
                pin: 9999
            }
        },
        bytes: [
            0x03, 0x04,
            0x37, 0x01, 0x27, 0x0f
        ]
    },
    'set channel type. Channel index: 1, type: power channel': {
        id,
        name,
        headerSize,
        parameters: {
            id: 56,
            name: 'CHANNEL_TYPE',
            data: {
                channel: 1,
                type: channelTypes.POWER_CHANNEL,
                parameters: {}
            }
        },
        bytes: [
            0x03, 0x03,
            0x38, 0x00, 0x02
        ]
    },
    'set channel type. Channel index: 2, type: binary sensor': {
        id,
        name,
        headerSize,
        parameters: {
            id: 56,
            name: 'CHANNEL_TYPE',
            data: {
                channel: 2,
                type: channelTypes.BINARY_SENSOR,
                parameters: {
                    activeStateTimeMs: 5000
                }
            }
        },
        bytes: [
            0x03, 0x05,
            0x38, 0x01, 0x03, 0x13, 0x88
        ]
    },
    'set channel type. Channel index: 3, type: temperature sensor': {
        id,
        name,
        headerSize,
        parameters: {
            id: 56,
            name: 'CHANNEL_TYPE',
            data: {
                channel: 3,
                type: channelTypes.TEMPERATURE_SENSOR,
                parameters: {
                    measurementPeriod: 3600,
                    hysteresisSec: 2,
                    highTemperatureThreshold: 40,
                    lowTemperatureThreshold: 5
                }
            }
        },
        bytes: [
            0x03, 0x08,
            0x38, 0x02, 0x04, 0x0e, 0x10, 0x02, 0x28, 0x05
        ]
    },
    'set channel type. Channel index: 4, type: idle': {
        id,
        name,
        headerSize,
        parameters: {
            id: 56,
            name: 'CHANNEL_TYPE',
            data: {
                channel: 4,
                type: channelTypes.IDLE,
                parameters: {}
            }
        },
        bytes: [
            0x03, 0x03,
            0x38, 0x03, 0x00
        ]
    },
    'enable extra payload with signal quality on every uplink command': {
        id,
        name,
        headerSize,
        parameters: {
            id: 57,
            name: 'EXTRA_PAYLOAD_ENABLE',
            data: {enable: 1}
        },
        bytes: [
            0x03, 0x02,
            0x39, 0x01
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
            0x03, 0x05,
            0x3a, 0x00, 0x00, 0x05, 0xa0
        ]
    },
    'keep its lora connection even after being removed': {
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
            0x03, 0x02,
            0x3b, 0x01
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param data - binary data containing command parameters
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): IParameter => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(data);

    return buffer.getParameter();
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IParameter ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(getParameterSize(parameters));

    buffer.setParameter(parameters);

    return command.toBytes(id, buffer.data);
};
