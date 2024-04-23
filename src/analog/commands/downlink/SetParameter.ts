import Command, {TCommandExampleList, ICommandBinary} from '../../Command.js';
import CommandBinaryBuffer, {IParameter} from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../../constants/directions.js';
import * as deviceParameters from '../../constants/deviceParameters.js';
import * as rx2SpreadFactors from '../../constants/rx2SpreadFactors.js';


const COMMAND_ID = 0x03;

const examples: TCommandExampleList = [
    {
        name: 'set minimal reporting data interval to 1 hour',
        parameters: {
            id: deviceParameters.REPORTING_DATA_INTERVAL,
            data: {value: 3600}
        },
        hex: {header: '03 05', body: '01 00 00 00 06'}
    },
    {
        name: 'set day checkout hour to 12:00',
        parameters: {
            id: deviceParameters.DAY_CHECKOUT_HOUR,
            data: {value: 12}
        },
        hex: {header: '03 02', body: '04 0c'}
    },
    {
        name: 'set reporting data type to "day"',
        parameters: {
            id: deviceParameters.REPORTING_DATA_TYPE,
            data: {type: 1}
        },
        hex: {header: '03 02', body: '05 01'}
    },
    {
        name: 'set "with confirmation" for delivery of priority data',
        parameters: {
            id: deviceParameters.PRIORITY_DATA_DELIVERY_TYPE,
            data: {value: 0}
        },
        hex: {header: '03 02', body: '08 00'}
    },
    {
        name: 'set activation method to "ABP"',
        parameters: {
            id: deviceParameters.ACTIVATION_METHOD,
            data: {type: 1}
        },
        hex: {header: '03 02', body: '09 01'}
    },
    {
        name: 'set battery depassivation info',
        parameters: {
            id: deviceParameters.BATTERY_DEPASSIVATION_INFO,
            data: {loadTime: 100, internalResistance: 3222, lowVoltage: 233}
        },
        hex: {header: '03 07', body: '0a 00 64 0c 96 00 e9'}
    },
    {
        name: 'set battery minimal load time to "100"',
        parameters: {
            id: deviceParameters.BATTERY_MINIMAL_LOAD_TIME,
            data: {value: 100}
        },
        hex: {header: '03 05', body: '0b 00 00 00 64'}
    },
    {
        name: 'enable 1-4 channels, and disable serial channel for device',
        parameters: {
            id: deviceParameters.CHANNELS_CONFIG,
            data: {value: 0}
        },
        hex: {header: '03 02', body: '0d 00'}
    },
    {
        name: 'set spread factor and frequency for RX2 window',
        parameters: {
            id: deviceParameters.RX2_CONFIG,
            data: {spreadFactor: rx2SpreadFactors.SF7B125, frequency: 20000}
        },
        hex: {header: '03 05', body: '12 05 00 00 c8'}
    },
    {
        name: 'set absolute data (not multichannel device)',
        parameters: {
            id: deviceParameters.ABSOLUTE_DATA,
            data: {value: 2023, meterValue: 204, pulseCoefficient: 100}
        },
        hex: {header: '03 0a', body: '17 00 00 00 cc 83 00 00 07 e7'}
    },
    {
        name: 'enable absolute data (not multichannel device)',
        parameters: {id: deviceParameters.ABSOLUTE_DATA_ENABLE, data: {state: 1}},
        hex: {header: '03 02', body: '18 01'}
    },
    {
        name: 'set device serial number',
        parameters: {
            id: deviceParameters.SERIAL_NUMBER,
            data: {value: '1b 0a 3e dc 3e 22'}
        },
        hex: {header: '03 07', body: '19 1b 0a 3e dc 3e 22'}
    },
    {
        name: 'set device geolocation',
        parameters: {
            id: deviceParameters.GEOLOCATION,
            data: {latitude: 34.43, longitude: 43.43, altitude: 23}
        },
        hex: {header: '03 0b', body: '1a 52 b8 09 42 52 b8 2d 42 17 00'}
    },
    {
        name: 'set interval to send EXTRA FRAME',
        parameters: {
            id: deviceParameters.EXTRA_FRAME_INTERVAL,
            data: {value: 3600}
        },
        hex: {header: '03 03', body: '1c 10 0e'}
    },
    {
        name: 'set absolute data for multichannel device (1 channel)',
        parameters: {
            id: deviceParameters.ABSOLUTE_DATA_MULTI_CHANNEL,
            data: {value: 2032, meterValue: 402, pulseCoefficient: 1000, channel: 1}
        },
        hex: {header: '03 0b', body: '1d 00 00 00 01 92 84 00 00 07 f0'}
    },
    {
        name: 'enable absolute data for multichannel device (2 channel)',
        parameters: {
            id: deviceParameters.ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL,
            data: {state: 1, channel: 2}
        },
        hex: {header: '03 03', body: '1e 01 01'}
    },
    {
        name: 'set pulse channels config',
        parameters: {
            id: deviceParameters.PULSE_CHANNELS_SCAN_CONFIG,
            data: {channelList: [1, 4], pullUpTime: 18, scanTime: 23}
        },
        hex: {header: '03 04', body: '1f 09 12 17'}
    },
    {
        name: 'enable channels: 1, 2, disable channels: 3, 4, for pulse device',
        parameters: {
            id: deviceParameters.PULSE_CHANNELS_SET_CONFIG,
            data: {channel1: true, channel2: true, channel3: false, channel4: false}
        },
        hex: {header: '03 02', body: '20 03'}
    },
    {
        name: 'set depassivation config for device',
        parameters: {
            id: deviceParameters.BATTERY_DEPASSIVATION_CONFIG,
            data: {
                resistanceStartThreshold: 36000,
                resistanceStopThreshold: 26000
            }
        },
        hex: {header: '03 05', body: '21 8c a0 65 90'}
    },
    {
        name: 'set configuration for mqtt session',
        parameters: {
            id: deviceParameters.MQTT_SESSION_CONFIG,
            data: {
                clientId: 'clientId',
                username: 'username',
                password: 'password',
                cleanSession: 1
            }
        },
        hex: {header: '03 1d', body: '22 08 63 6c 69 65 6e 74 49 64 08 75 73 65 72 6e 61 6d 65 08 70 61 73 73 77 6f 72 64 01'}
    },
    {
        name: 'set mqtt broker address',
        parameters: {
            id: deviceParameters.MQTT_BROKER_ADDRESS,
            data: {
                hostName: 'chirpstack-example.com',
                port: 1800
            }
        },
        hex: {header: '03 1a', body: '23 16 63 68 69 72 70 73 74 61 63 6b 2d 65 78 61 6d 70 6c 65 2e 63 6f 6d 07 08'}
    },
    {
        name: 'enable ssl for mqtt',
        parameters: {
            id: deviceParameters.MQTT_SSL_ENABLE,
            data: {
                enable: 1
            }
        },
        hex: {header: '03 02', body: '24 01'}
    },
    {
        name: 'set mqtt topic prefix',
        parameters: {
            id: deviceParameters.MQTT_TOPIC_PREFIX,
            data: {
                topicPrefix: '/nbiot/N0000000000001/cmd'
            }
        },
        hex: {header: '03 1b', body: '25 19 2f 6e 62 69 6f 74 2f 4e 30 30 30 30 30 30 30 30 30 30 30 30 31 2f 63 6d 64'}
    },
    {
        name: 'set mqtt configuration for data receive',
        parameters: {
            id: deviceParameters.MQTT_DATA_RECEIVE_CONFIG,
            data: {
                qos: 1
            }
        },
        hex: {header: '03 02', body: '26 01'}
    },
    {
        name: 'set mqtt configuration for data send',
        parameters: {
            id: deviceParameters.MQTT_DATA_SEND_CONFIG,
            data: {
                qos: 1,
                retain: 1,
                newestSendFirst: 1,
                sendCountAttempts: 1,
                sendTimeoutBetweenAttempts: 1
            }
        },
        hex: {header: '03 06', body: '27 01 01 01 01 01'}
    },
    {
        name: 'set nbiot configuration for ssl',
        parameters: {
            id: deviceParameters.NBIOT_SSL_CONFIG,
            data: {
                securityLevel: 1,
                version: 1
            }
        },
        hex: {header: '03 03', body: '28 01 01'}
    },
    {
        name: 'write ssl cacert on nbiot module',
        parameters: {
            id: deviceParameters.NBIOT_SSL_CACERT_WRITE,
            data: {
                size: 10,
                position: 0,
                chunk: new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
            }
        },
        hex: {header: '03 0f', body: '29 00 0a 00 00 00 01 02 03 04 05 06 07 08 09'}
    },
    {
        name: 'set ssl cacert crc32 on nbiot module',
        parameters: {
            id: deviceParameters.NBIOT_SSL_CACERT_SET,
            data: {
                crc32: 0x123456
            }
        },
        hex: {header: '03 05', body: '2a 00 12 34 56'}
    },
    {
        name: 'write ssl client cert on nbiot module',
        parameters: {
            id: deviceParameters.NBIOT_SSL_CLIENT_CERT_WRITE,
            data: {
                size: 10,
                position: 0,
                chunk: new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
            }
        },
        hex: {header: '03 0f', body: '2b 00 0a 00 00 00 01 02 03 04 05 06 07 08 09'}
    },
    {
        name: 'set ssl client cert crc32 on nbiot module',
        parameters: {
            id: deviceParameters.NBIOT_SSL_CLIENT_CERT_SET,
            data: {
                crc32: 0x123456
            }
        },
        hex: {header: '03 05', body: '2c 00 12 34 56'}
    },
    {
        name: 'write ssl client key on nbiot module',
        parameters: {
            id: deviceParameters.NBIOT_SSL_CLIENT_KEY_WRITE,
            data: {
                size: 10,
                position: 0,
                chunk: new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
            }
        },
        hex: {header: '03 0f', body: '2d 00 0a 00 00 00 01 02 03 04 05 06 07 08 09'}
    },
    {
        name: 'set ssl client key crc32 on nbiot module',
        parameters: {
            id: deviceParameters.NBIOT_SSL_CLIENT_KEY_SET,
            data: {
                crc32: 0x123456
            }
        },
        hex: {header: '03 05', body: '2e 00 12 34 56'}
    },
    {
        name: 'update nbiot device software',
        parameters: {
            id: deviceParameters.NBIOT_DEVICE_SOFTWARE_UPDATE,
            data: {
                softwareImageUrl: 'http://infomir.com.ua/8.bin'
            }
        },
        hex: {header: '03 1d', body: '2f 1b 68 74 74 70 3a 2f 2f 69 6e 66 6f 6d 69 72 2e 63 6f 6d 2e 75 61 2f 38 2e 62 69 6e'}
    },
    {
        name: 'update nbiot module firmware',
        parameters: {
            id: deviceParameters.NBIOT_MODULE_FIRMWARE_UPDATE,
            data: {
                moduleFirmwareImageUrl: 'http://infomir.com.ua/8.bin'
            }
        },
        hex: {header: '03 1d', body: '30 1b 68 74 74 70 3a 2f 2f 69 6e 66 6f 6d 69 72 2e 63 6f 6d 2e 75 61 2f 38 2e 62 69 6e'}
    },
    {
        name: 'set configuration for reporting data',
        parameters: {
            id: deviceParameters.REPORTING_DATA_CONFIG,
            data: {
                dataType: 0,
                hour: 6,
                minutes: 10,
                countToSend: 20
            }
        },
        hex: {header: '03 05', body: '31 00 06 0a 14'}
    },
    {
        name: 'set configuration for events',
        parameters: {
            id: deviceParameters.EVENTS_CONFIG,
            data: {
                eventId: 2,
                enableEvent: 1,
                sendEvent: 1,
                saveEvent: 1
            }
        },
        hex: {header: '03 05', body: '32 02 01 01 01'}
    },
    {
        name: 'set nbiot bands',
        parameters: {
            id: deviceParameters.NBIOT_BANDS,
            data: {bands: [3, 8, 20]}
        },
        hex: {header: '03 05', body: '34 03 03 08 14'}
    }
];


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import SetParameter from 'jooby-codec/analog/commands/downlink/SetParameter.js';
 *
 * const parameters = {id: constants.deviceParameters.ABSOLUTE_DATA, data: {value: 2023, meterValue: 204, pulseCoefficient: 100}};
 * const command = new SetParameter(parameters);
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 03 0a 17 00 00 00 cc 83 00 00 07 e7
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/downlink/SetParameter.md)
 */
class SetParameter extends Command {
    constructor ( public parameters: IParameter ) {
        super();
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = DOWNLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new SetParameter(buffer.getParameter());
    }

    toBinary (): ICommandBinary {
        const buffer = new CommandBinaryBuffer(CommandBinaryBuffer.getParameterSize(this.parameters));

        buffer.setParameter(this.parameters);

        return Command.toBinary(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default SetParameter;
