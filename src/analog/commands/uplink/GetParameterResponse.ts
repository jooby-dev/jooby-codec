import Command, {TCommandExampleList, ICommandBinary} from '../../Command.js';
import CommandBinaryBuffer, {IParameter} from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../../constants/directions.js';
import * as deviceParameters from '../../constants/deviceParameters.js';


const COMMAND_ID = 0x04;

const examples: TCommandExampleList = [
    {
        name: 'absolute data (not multichannel device)',
        parameters: {
            id: deviceParameters.ABSOLUTE_DATA,
            data: {value: 2023, meterValue: 204, pulseCoefficient: 100}
        },
        hex: {header: '04 0a', body: '17 00 00 00 cc 83 00 00 07 e7'}
    },
    {
        name: 'absolute data enabled',
        parameters: {
            id: deviceParameters.ABSOLUTE_DATA_ENABLE,
            data: {state: 1}
        },
        hex: {header: '04 02', body: '18 01'}
    },
    {
        name: 'absolute data for multichannel device (1 channel)',
        parameters: {
            id: deviceParameters.ABSOLUTE_DATA_MULTI_CHANNEL,
            data: {value: 2032, meterValue: 402, pulseCoefficient: 1000, channel: 1}
        },
        hex: {header: '04 0b', body: '1d 00 00 00 01 92 84 00 00 07 f0'}
    },
    {
        name: 'absolute data enabled for multichannel device (1 channel)',
        parameters: {
            id: deviceParameters.ABSOLUTE_DATA_ENABLE_MULTI_CHANNEL,
            data: {state: 1, channel: 2}
        },
        hex: {header: '04 03', body: '1e 01 01'}
    },
    {
        name: 'mqtt session config',
        parameters: {
            id: deviceParameters.MQTT_SESSION_CONFIG,
            data: null
        },
        hex: {header: '04 01', body: '22'}
    },
    {
        name: 'nbiot ssl cacert write',
        parameters: {
            id: deviceParameters.NBIOT_SSL_CACERT_WRITE,
            data: null
        },
        hex: {header: '04 01', body: '29'}
    },
    {
        name: 'nbiot ssl client cert write',
        parameters: {
            id: deviceParameters.NBIOT_SSL_CLIENT_CERT_WRITE,
            data: null
        },
        hex: {header: '04 01', body: '2b'}
    },
    {
        name: 'nbiot ssl client key write',
        parameters: {
            id: deviceParameters.NBIOT_SSL_CLIENT_KEY_WRITE,
            data: null
        },
        hex: {header: '04 01', body: '2d'}
    },
    {
        name: 'nbiot ssl cacert set',
        parameters: {
            id: deviceParameters.NBIOT_SSL_CACERT_SET,
            data: null
        },
        hex: {header: '04 01', body: '2a'}
    },
    {
        name: 'nbiot ssl client cert set',
        parameters: {
            id: deviceParameters.NBIOT_SSL_CLIENT_CERT_SET,
            data: null
        },
        hex: {header: '04 01', body: '2c'}
    },
    {
        name: 'nbiot ssl client key set',
        parameters: {
            id: deviceParameters.NBIOT_SSL_CLIENT_KEY_SET,
            data: null
        },
        hex: {header: '04 01', body: '2e'}
    },
    {
        name: 'nbiot device software update',
        parameters: {
            id: deviceParameters.NBIOT_DEVICE_SOFTWARE_UPDATE,
            data: null
        },
        hex: {header: '04 01', body: '2f'}
    },
    {
        name: 'empty nbiot module firmware update',
        parameters: {
            id: deviceParameters.NBIOT_MODULE_FIRMWARE_UPDATE,
            data: null
        },
        hex: {header: '04 01', body: '30'}
    },
    {
        name: 'mqtt broker address',
        parameters: {
            id: deviceParameters.MQTT_BROKER_ADDRESS,
            data: {
                hostName: 'mqtt-broker-address.dev',
                port: 80
            }
        },
        hex: {
            header: '04 1b',
            body: '23 17 6d 71 74 74 2d 62 72 6f 6b 65 72 2d 61 64 64 72 65 73 73 2e 64 65 76 00 50'
        }
    },
    {
        name: 'enabled mqtt ssl',
        parameters: {
            id: deviceParameters.MQTT_SSL_ENABLE,
            data: {enable: 1}
        },
        hex: {header: '04 02', body: '24 01'}
    },
    {
        name: 'mqtt topic prefix',
        parameters: {
            id: deviceParameters.MQTT_TOPIC_PREFIX,
            data: {topicPrefix: 'test'}
        },
        hex: {header: '04 06', body: '25 04 74 65 73 74'}
    },
    {
        name: 'mqtt data receive config',
        parameters: {
            id: deviceParameters.MQTT_DATA_RECEIVE_CONFIG,
            data: {qos: 22}
        },
        hex: {
            header: '04 02',
            body: '26 16'
        }
    },
    {
        name: 'mqtt data send config',
        parameters: {
            id: deviceParameters.MQTT_DATA_SEND_CONFIG,
            data: {
                qos: 22,
                retain: 1,
                newestSendFirst: 1,
                sendCountAttempts: 7,
                sendTimeoutBetweenAttempts: 20
            }
        },
        hex: {
            header: '04 06',
            body: '27 16 01 01 07 14'
        }
    },
    {
        name: 'nbiot ssl config',
        parameters: {
            id: deviceParameters.NBIOT_SSL_CONFIG,
            data: {
                securityLevel: 1,
                version: 56
            }
        },
        hex: {
            header: '04 03',
            body: '28 01 38'
        }
    },
    {
        name: 'reporting data config',
        parameters: {
            id: deviceParameters.REPORTING_DATA_CONFIG,
            data: {
                dataType: 1,
                hour: 9,
                minutes: 22,
                countToSend: 3
            }
        },
        hex: {
            header: '04 05',
            body: '31 01 09 16 03'
        }
    },
    {
        name: 'events config',
        parameters: {
            id: deviceParameters.EVENTS_CONFIG,
            data: {
                eventId: 72,
                enableEvent: 1,
                sendEvent: 3,
                saveEvent: 4
            }
        },
        hex: {
            header: '04 05',
            body: '32 48 01 03 04'
        }
    },
    {
        name: 'nbiot module info',
        parameters: {
            id: deviceParameters.NBIOT_MODULE_INFO,
            data: {
                moduleInfo: 'BC660KGLAAR01A05'
            }
        },
        hex: {
            header: '04 12',
            body: '33 10 42 43 36 36 30 4b 47 4c 41 41 52 30 31 41 30 35'
        }
    },
    {
        name: 'nbiot bands',
        parameters: {
            id: deviceParameters.NBIOT_BANDS,
            data: {
                count: 2,
                bands: [
                    3,
                    20
                ]
            }
        },
        hex: {
            header: '04 04',
            body: '34 02 03 14'
        }
    }
];


/**
 * Uplink command.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import GetParameterResponse from 'jooby-codec/analog/commands/uplink/GetParameterResponse.js';
 *
 * const commandBody = new Uint8Array([
 *     0x1d, 0x01, 0x00, 0x00, 0x01, 0x92, 0x80, 0x00, 0x00, 0x07, 0xf0
 * ]);
 * const command = GetParameterResponse.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     id: 29,
 *     data: { channel: 2, meterValue: 402, pulseCoefficient: 1, value: 2032 }
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetParameter.md#response)
 */
class GetParameterResponse extends Command {
    constructor ( public parameters: IParameter ) {
        super();
    }


    static readonly id = COMMAND_ID;

    static readonly directionType = UPLINK;

    static readonly examples = examples;

    static readonly hasParameters = true;


    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new GetParameterResponse(buffer.getResponseParameter());
    }

    toBinary (): ICommandBinary {
        const buffer = new CommandBinaryBuffer(CommandBinaryBuffer.getResponseParameterSize(this.parameters));

        buffer.setResponseParameter(this.parameters);

        return Command.toBinary(COMMAND_ID, buffer.getBytesToOffset());
    }
}


export default GetParameterResponse;
