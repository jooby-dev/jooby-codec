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
import * as deviceParameters from '../../constants/deviceParameters.js';
import deviceParameterNames from '../../constants/deviceParameterNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    '01_LoRa: set minimal reporting data interval to 1 hour': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.REPORTING_DATA_INTERVAL,
            name: deviceParameterNames[deviceParameters.REPORTING_DATA_INTERVAL],
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
    '04_LoRa: set day checkout hour to 12:00': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.DAY_CHECKOUT_HOUR,
            name: deviceParameterNames[deviceParameters.DAY_CHECKOUT_HOUR],
            data: {value: 12}
        },
        bytes: [
            0x03, 0x02,
            0x04, 0x0c
        ]
    },
    '05_LoRa: set reporting data type to "day"': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.REPORTING_DATA_TYPE,
            name: deviceParameterNames[deviceParameters.REPORTING_DATA_TYPE],
            data: {type: 1}
        },
        bytes: [
            0x03, 0x02,
            0x05, 0x01
        ]
    },
    '08_LoRa: set "with confirmation" for delivery of priority data': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.PRIORITY_DATA_DELIVERY_TYPE,
            name: deviceParameterNames[deviceParameters.PRIORITY_DATA_DELIVERY_TYPE],
            data: {value: 0}
        },
        bytes: [
            0x03, 0x02,
            0x08, 0x00
        ]
    },
    '09_LoRa: set activation method to "ABP"': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.ACTIVATION_METHOD,
            name: deviceParameterNames[deviceParameters.ACTIVATION_METHOD],
            data: {type: 1}
        },
        bytes: [
            0x03, 0x02,
            0x09, 0x01
        ]
    },
    '10_LoRa: set battery depassivation info': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.BATTERY_DEPASSIVATION_INFO,
            name: deviceParameterNames[deviceParameters.BATTERY_DEPASSIVATION_INFO],
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
    '11_LoRa: set battery minimal load time to "100"': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.BATTERY_MINIMAL_LOAD_TIME,
            name: deviceParameterNames[deviceParameters.BATTERY_MINIMAL_LOAD_TIME],
            data: {value: 100}
        },
        bytes: [
            0x03, 0x05,
            0x0b, 0x00, 0x00, 0x00, 0x64
        ]
    },
    '13_LoRa: enable 1-4 channels, and disable serial channel for device': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.CHANNELS_CONFIG,
            name: deviceParameterNames[deviceParameters.CHANNELS_CONFIG],
            data: {value: 0}
        },
        bytes: [
            0x03, 0x02,
            0x0d, 0x00
        ]
    },
    '18_LoRa: set spread factor and frequency for RX2 window': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.RX2_CONFIG,
            name: deviceParameterNames[deviceParameters.RX2_CONFIG],
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
    '23_Common_Gas: set absolute data (not multichannel device': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.ABSOLUTE_DATA,
            name: deviceParameterNames[deviceParameters.ABSOLUTE_DATA],
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
    '24_Common_Gas: enable absolute data (not multichannel device': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.ABSOLUTE_DATA_ENABLE,
            name: deviceParameterNames[deviceParameters.ABSOLUTE_DATA_ENABLE],
            data: {state: 1}
        },
        bytes: [
            0x03, 0x02,
            0x18, 0x01
        ]
    },
    '25_LoRa: set device serial number': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.SERIAL_NUMBER,
            name: deviceParameterNames[deviceParameters.SERIAL_NUMBER],
            data: {value: '1b 0a 3e dc 3e 22'}
        },
        bytes: [
            0x03, 0x07,
            0x19, 0x1b, 0x0a, 0x3e, 0xdc, 0x3e, 0x22
        ]
    },
    '26_LoRa: set device geolocation': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.GEOLOCATION,
            name: deviceParameterNames[deviceParameters.GEOLOCATION],
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
    '28_LoRa: set interval to send EXTRA FRAME': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.EXTRA_FRAME_INTERVAL,
            name: deviceParameterNames[deviceParameters.EXTRA_FRAME_INTERVAL],
            data: {value: 3600}
        },
        bytes: [
            0x03, 0x03,
            0x1c, 0x0e, 0x10
        ]
    },
    '29_Common_4PU: set absolute data for multichannel device (1 channel': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.ABSOLUTE_DATA_MULTI_CHANNEL,
            name: deviceParameterNames[deviceParameters.ABSOLUTE_DATA_MULTI_CHANNEL],
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
    '30_Common_4PU: enable absolute data for multichannel device (2 channel': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL,
            name: deviceParameterNames[deviceParameters.ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL],
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
    '31_LoRa_4PU: set pulse channels config': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.PULSE_CHANNELS_SCAN_CONFIG,
            name: deviceParameterNames[deviceParameters.PULSE_CHANNELS_SCAN_CONFIG],
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
    '32_LoRa_4PU: enable channels: 1, 2, disable channels: 3, 4, for pulse device': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.PULSE_CHANNELS_SET_CONFIG,
            name: deviceParameterNames[deviceParameters.PULSE_CHANNELS_SET_CONFIG],
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
    '33_LoRa: set depassivation config for device': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.BATTERY_DEPASSIVATION_CONFIG,
            name: deviceParameterNames[deviceParameters.BATTERY_DEPASSIVATION_CONFIG],
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
    '34_NB-IoT: set configuration for session': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.MQTT_SESSION_CONFIG,
            name: deviceParameterNames[deviceParameters.MQTT_SESSION_CONFIG],
            data: {
                clientId: 'id',
                username: 'login',
                password: 'pass',
                cleanSession: 1
            }
        },
        bytes: [
            0x03, 0x10,
            0x22, 0x02, 0x69, 0x64, 0x05, 0x6c, 0x6f, 0x67, 0x69, 0x6e, 0x04, 0x70, 0x61, 0x73, 0x73, 0x01
        ]
    },
    '35_NB-IoT: set broker address': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.MQTT_BROKER_ADDRESS,
            name: deviceParameterNames[deviceParameters.MQTT_BROKER_ADDRESS],
            data: {
                hostName: '127.0.0.1',
                port: 1883
            }
        },
        bytes: [
            0x03, 0x0d,
            0x23, 0x09, 0x31, 0x32, 0x37, 0x2e, 0x30, 0x2e, 0x30, 0x2e, 0x31, 0x07, 0x5b
        ]
    },
    '36_NB-IoT: disable ssl': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.MQTT_SSL_ENABLE,
            name: deviceParameterNames[deviceParameters.MQTT_SSL_ENABLE],
            data: {
                enable: 0
            }
        },
        bytes: [
            0x03, 0x02,
            0x24, 0x00
        ]
    },
    '37_NB-IoT: set topic prefix': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.MQTT_TOPIC_PREFIX,
            name: deviceParameterNames[deviceParameters.MQTT_TOPIC_PREFIX],
            data: {
                topicPrefix: 'mqtt'
            }
        },
        bytes: [
            0x03, 0x06,
            0x25, 0x04, 0x6d, 0x71, 0x74, 0x74
        ]
    },
    '38_NB-IoT: set configuration for data receive': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.MQTT_DATA_RECEIVE_CONFIG,
            name: deviceParameterNames[deviceParameters.MQTT_DATA_RECEIVE_CONFIG],
            data: {
                qos: 1,
                count: 255,
                timeout: 20
            }
        },
        bytes: [
            0x03, 0x04,
            0x26, 0x01, 0xff, 0x14
        ]
    },
    '39_NB-IoT: set configuration for data send': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.MQTT_DATA_SEND_CONFIG,
            name: deviceParameterNames[deviceParameters.MQTT_DATA_SEND_CONFIG],
            data: {
                qos: 1,
                retain: 0,
                newestSendFirst: 1
            }
        },
        bytes: [
            0x03, 0x04,
            0x27, 0x01, 0x00, 0x01
        ]
    },
    '40_NB-IoT: set configuration for ssl': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.NBIOT_SSL_CONFIG,
            name: deviceParameterNames[deviceParameters.NBIOT_SSL_CONFIG],
            data: {
                securityLevel: 0,
                version: 3
            }
        },
        bytes: [
            0x03, 0x03,
            0x28, 0x00, 0x03
        ]
    },
    '47_NB-IoT: update software': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.NBIOT_DEVICE_SOFTWARE_UPDATE,
            name: deviceParameterNames[deviceParameters.NBIOT_DEVICE_SOFTWARE_UPDATE],
            data: {
                softwareImageUrl: 'http://url.com/image.bin'
            }
        },
        bytes: [
            0x03, 0x1a,
            0x2f, 0x18, 0x68, 0x74, 0x74, 0x70, 0x3a, 0x2f, 0x2f, 0x75, 0x72, 0x6c, 0x2e, 0x63, 0x6f, 0x6d, 0x2f, 0x69, 0x6d, 0x61, 0x67, 0x65, 0x2e, 0x62, 0x69, 0x6e
        ]
    },
    '48_NB-IoT: update NB-IoT module firmware': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.NBIOT_MODULE_FIRMWARE_UPDATE,
            name: deviceParameterNames[deviceParameters.NBIOT_MODULE_FIRMWARE_UPDATE],
            data: {
                moduleFirmwareImageUrl: 'http://url.com/nbiot.bin'
            }
        },
        bytes: [
            0x03, 0x1a,
            0x30, 0x18, 0x68, 0x74, 0x74, 0x70, 0x3a, 0x2f, 0x2f, 0x75, 0x72, 0x6c, 0x2e, 0x63, 0x6f, 0x6d, 0x2f, 0x6e, 0x62, 0x69, 0x6f, 0x74, 0x2e, 0x62, 0x69, 0x6e
        ]
    },
    '49_NB-IoT: set configuration for reporting data': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.REPORTING_DATA_CONFIG,
            name: deviceParameterNames[deviceParameters.REPORTING_DATA_CONFIG],
            data: {
                dataType: 0,
                hour: 4,
                minutes: 0,
                countToSend: 24
            }
        },
        bytes: [
            0x03, 0x05,
            0x31, 0x00, 0x04, 0x00, 0x18
        ]
    },
    '50_NB-IoT: set configuration for events': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.EVENTS_CONFIG,
            name: deviceParameterNames[deviceParameters.EVENTS_CONFIG],
            data: {
                eventId: 3,
                sendEvent: 1,
                saveEvent: 1
            }
        },
        bytes: [
            0x03, 0x04,
            0x32, 0x03, 0x01, 0x01
        ]
    },
    '52_NB-IoT: set nbiot bands': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.NBIOT_BANDS,
            name: deviceParameterNames[deviceParameters.NBIOT_BANDS],
            data: {bands: [3, 8, 20]}
        },
        bytes: [
            0x03, 0x05,
            0x34, 0x03, 0x03, 0x08, 0x14
        ]
    },
    '53_NB-IoT: set nbiot apn': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.NBIOT_APN,
            name: deviceParameterNames[deviceParameters.NBIOT_APN],
            data: {apn: 'nbiot'}
        },
        bytes: [
            0x03, 0x07,
            0x35, 0x05, 0x6e, 0x62, 0x69, 0x6f, 0x74
        ]
    },
    '54_NB-IoT: set nbiot led indication': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.NBIOT_LED_INDICATION,
            name: deviceParameterNames[deviceParameters.NBIOT_LED_INDICATION],
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
    '55_NB-IoT: set nbiot sim pin code': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.NBIOT_SIM,
            name: deviceParameterNames[deviceParameters.NBIOT_SIM],
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
    '56_4PU: set channel type. Channel index: 1, type: power channel': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.CHANNEL_TYPE,
            name: deviceParameterNames[deviceParameters.CHANNEL_TYPE],
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
    '56_4PU: set channel type. Channel index: 2, type: binary sensor': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.CHANNEL_TYPE,
            name: deviceParameterNames[deviceParameters.CHANNEL_TYPE],
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
    '56_4PU: set channel type. Channel index: 3, type: temperature sensor': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.CHANNEL_TYPE,
            name: deviceParameterNames[deviceParameters.CHANNEL_TYPE],
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
    '56_4PU: set channel type. Channel index: 4, type: idle': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.CHANNEL_TYPE,
            name: deviceParameterNames[deviceParameters.CHANNEL_TYPE],
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
    '57_NB-IoT: enable extra payload with signal quality on every uplink command': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.EXTRA_PAYLOAD_ENABLE,
            name: deviceParameterNames[deviceParameters.EXTRA_PAYLOAD_ENABLE],
            data: {enable: 1}
        },
        bytes: [
            0x03, 0x02,
            0x39, 0x01
        ]
    },
    '58_Common: time synchronization period in seconds via MAC commands': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.TIME_SYNCHRONIZATION_PERIOD_VIA_MAC,
            name: deviceParameterNames[deviceParameters.TIME_SYNCHRONIZATION_PERIOD_VIA_MAC],
            data: {
                period: 1440
            }
        },
        bytes: [
            0x03, 0x05,
            0x3a, 0x00, 0x00, 0x05, 0xa0
        ]
    },
    '59_LoRa: keep its lora connection even after being removed': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.KEEP_LORA_CONNECTION_ON_REMOVAL,
            name: deviceParameterNames[deviceParameters.KEEP_LORA_CONNECTION_ON_REMOVAL],
            data: {
                value: true
            }
        },
        bytes: [
            0x03, 0x02,
            0x3b, 0x01
        ]
    },
    '60_NB-IoT: set nbiot ntp server': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.NBIOT_NTP_SERVER,
            name: deviceParameterNames[deviceParameters.NBIOT_NTP_SERVER],
            data: {
                server: '162.159.200.1',
                port: 123
            }
        },
        bytes: [
            0x03, 0x11,
            0x3c, 0x0d, 0x31, 0x36, 0x32, 0x2e, 0x31, 0x35, 0x39, 0x2e, 0x32, 0x30, 0x30, 0x2e, 0x31, 0x00, 0x7b
        ]
    },
    '61_LoRa_4PU: activate module': {
        id,
        name,
        headerSize,
        parameters: {
            id: deviceParameters.ACTIVATE_MODULE,
            name: deviceParameterNames[deviceParameters.ACTIVATE_MODULE],
            data: {enable: 1}
        },
        bytes: [
            0x03, 0x02,
            0x3d, 0x01
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
