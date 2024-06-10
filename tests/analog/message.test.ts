/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import * as message from '../../src/analog/message/index.js';
import {IMessage, IInvalidMessage, TMessageExamples} from '../../src/analog/message/types.js';
import {ICommandConfig} from '../../src/analog/utils/command.js';
import * as downlinkCommands from '../../src/analog/commands/downlink/index.js';
import * as uplinkCommands from '../../src/analog/commands/uplink/index.js';
import getBytesFromHex from '../../src/utils/getBytesFromHex.js';
import getHexFromBytes from '../../src/utils/getHexFromBytes.js';
import * as hardwareTypes from '../../src/analog/constants/hardwareTypes.js';
import {TBytes} from '../../src/types.js';


const downlinkMessages: TMessageExamples = {
    'valid correctTime2000': {
        bytes: getBytesFromHex('0c 02 2d 88  fe'),
        commands: [
            {
                id: downlinkCommands.correctTime2000.id,
                name: 'correctTime2000',
                headerSize: 2,
                parameters: {sequenceNumber: 45, seconds: -120},
                bytes: getBytesFromHex('0c 02 2d 88')
            }
        ],
        lrc: {
            expected: 0xfe,
            actual: 0xfe
        }
    },
    'invalid correctTime2000': {
        message: {
            bytes: getBytesFromHex('0c 02 2d 88  00'),
            commands: [
                {
                    id: downlinkCommands.correctTime2000.id,
                    name: 'correctTime2000',
                    headerSize: 2,
                    parameters: {sequenceNumber: 45, seconds: -120},
                    bytes: getBytesFromHex('0c 02 2d 88')
                }
            ],
            lrc: {
                expected: 0,
                actual: 0xfe
            }
        },
        error: 'Mismatch LRC.'
    }
};

const validUplinkMessages: TMessageExamples = {
    'valid correctTime2000 response': {
        bytes: getBytesFromHex('0c 01 00  58'),
        commands: [
            {
                id: uplinkCommands.correctTime2000.id,
                name: 'correctTime2000',
                headerSize: 2,
                config: {
                    hardwareType: hardwareTypes.GASIC
                },
                parameters: {status: 0},
                bytes: getBytesFromHex('0c 01 00')
            }
        ],
        lrc: {
            expected: 0x58,
            actual: 0x58
        }
    },
    'valid setTime2000 + currentMc + dayMc': {
        bytes: getBytesFromHex('02 01 01  18 06 0f 83 01 08 0a 0c  16 08 2f 97 55 0c 83 01 08 0a  b5'),
        commands: [
            {
                id: uplinkCommands.setTime2000.id,
                name: 'setTime2000',
                headerSize: 2,
                config: {
                    hardwareType: hardwareTypes.GASIC
                },
                parameters: {status: 1},
                bytes: getBytesFromHex('02 01 01')
            },
            {
                id: uplinkCommands.currentMc.id,
                name: 'currentMc',
                headerSize: 2,
                config: {
                    hardwareType: hardwareTypes.GASIC
                },
                parameters: {
                    channelList: [
                        {index: 1, value: 131},
                        {index: 2, value: 8},
                        {index: 3, value: 10},
                        {index: 4, value: 12}
                    ]
                },
                bytes: getBytesFromHex('18 06 0f 83 01 08 0a 0c')
            },
            {
                id: uplinkCommands.dayMc.id,
                name: 'dayMc',
                headerSize: 2,
                config: {
                    hardwareType: hardwareTypes.GASIC
                },
                parameters: {
                    startTime2000: 756604800,
                    channelList: [
                        {index: 1, value: 12},
                        {index: 3, value: 131},
                        {index: 5, value: 8},
                        {index: 7, value: 10}
                    ]
                },
                bytes: getBytesFromHex('16 08 2f 97 55 0c 83 01 08 0a')
            }
        ],
        lrc: {
            expected: 0xb5,
            actual: 0xb5
        }
    },
    'valid old status + currentMc': {
        bytes: getBytesFromHex('14 0c 02 84 0c 01 e3 5c 0c 69 10 17 fe 62  18 03 01 b9 17  33'),
        commands: [
            {
                id: uplinkCommands.status.id,
                name: 'status',
                headerSize: 2,
                config: {
                    hardwareType: hardwareTypes.GASIC
                },
                parameters: {
                    software: {
                        type: 2,
                        version: 132
                    },
                    hardware: {
                        type: hardwareTypes.GASIC,
                        version: 1
                    },
                    data: {
                        batteryVoltage: {
                            underLowLoad: 3637,
                            underHighLoad: 3084
                        },
                        batteryInternalResistance: 26896,
                        temperature: 23,
                        remainingBatteryCapacity: 100,
                        lastEventSequenceNumber: 98
                    }
                },
                bytes: getBytesFromHex('14 0c 02 84 0c 01 e3 5c 0c 69 10 17 fe 62')
            },
            {
                id: uplinkCommands.currentMc.id,
                name: 'currentMc',
                headerSize: 2,
                config: {
                    hardwareType: hardwareTypes.GASIC
                },
                parameters: {
                    channelList: [
                        {index: 1, value: 3001}
                    ]
                },
                bytes: getBytesFromHex('18 03 01 b9 17')
            }
        ],
        lrc: {
            expected: 0x33,
            actual: 0x33
        }
    },
    'valid new status + currentMc': {
        bytes: getBytesFromHex('14 0d 02 84 0c 01 e3 5c 0c 69 10 17 fd 62 64  18 03 01 b9 17  55'),
        commands: [
            {
                id: uplinkCommands.status.id,
                name: 'status',
                headerSize: 2,
                config: {
                    hardwareType: hardwareTypes.GASIC
                },
                parameters: {
                    software: {
                        type: 2,
                        version: 132
                    },
                    hardware: {
                        type: hardwareTypes.GASIC,
                        version: 1
                    },
                    data: {
                        batteryVoltage: {
                            underLowLoad: 3637,
                            underHighLoad: 3084
                        },
                        batteryInternalResistance: 26896,
                        temperature: 23,
                        remainingBatteryCapacity: 99.6,
                        lastEventSequenceNumber: 98,
                        downlinkQuality: 100
                    }
                },
                bytes: getBytesFromHex('14 0d 02 84 0c 01 e3 5c 0c 69 10 17 fd 62 64')
            },
            {
                id: uplinkCommands.currentMc.id,
                name: 'currentMc',
                headerSize: 2,
                config: {
                    hardwareType: hardwareTypes.GASIC
                },
                parameters: {
                    channelList: [
                        {index: 1, value: 3001}
                    ]
                },
                bytes: getBytesFromHex('18 03 01 b9 17')
            }
        ],
        lrc: {
            expected: 0x55,
            actual: 0x55
        }
    },
    'valid currentMc+lastEvent response': {
        bytes: getBytesFromHex('18 03 01 8a 12 62 ed 00 58'),
        commands: [
            {
                id: uplinkCommands.currentMc.id,
                name: 'currentMc',
                headerSize: 2,
                config: {
                    hardwareType: hardwareTypes.GASIC
                },
                parameters: {
                    channelList: [
                        {
                            value: 2314,
                            index: 1
                        }
                    ]
                },
                bytes: getBytesFromHex('18 03 01 8a 12')
            },
            {
                id: uplinkCommands.lastEvent.id,
                name: 'lastEvent',
                headerSize: 1,
                config: {
                    hardwareType: hardwareTypes.GASIC
                },
                parameters: {
                    sequenceNumber: 237,
                    status: {
                        isBatteryLow: false,
                        isMagneticInfluence: false,
                        isButtonReleased: false,
                        isConnectionLost: false
                    }
                },
                bytes: getBytesFromHex('62 ed 00')
            }
        ],
        lrc: {
            expected: 0x58,
            actual: 0x58
        }
    },
    'valid hourMc+lastEvent response': {
        bytes: getBytesFromHex('17 06 00 6f 0c 01 99 35 62 bc 00 54'),
        commands: [
            {
                id: uplinkCommands.hourMc.id,
                name: 'hourMc',
                headerSize: 2,
                config: {
                    hardwareType: hardwareTypes.GASIC
                },
                parameters: {
                    startTime2000: 6436800,
                    hours: 1,
                    channelList: [
                        {
                            value: 6809,
                            diff: [],
                            index: 1
                        }
                    ]
                },
                bytes: getBytesFromHex('17 06 00 6f 0c 01 99 35')
            },
            {
                id: uplinkCommands.lastEvent.id,
                name: 'lastEvent',
                headerSize: 1,
                config: {
                    hardwareType: hardwareTypes.GASIC
                },
                parameters: {
                    sequenceNumber: 188,
                    status: {
                        isBatteryLow: false,
                        isMagneticInfluence: false,
                        isButtonReleased: false,
                        isConnectionLost: false
                    }
                },
                bytes: getBytesFromHex('62 bc 00')
            }
        ],
        lrc: {
            expected: 0x54,
            actual: 0x54
        }
    },
    'valid time2000+status response': {
        bytes: getBytesFromHex('09 05 00 00 62 2c 58 14 0d 02 76 0c 01 e3 6c 83 4f 93 19 fd bc 51 f6'),
        commands: [
            {
                id: uplinkCommands.time2000.id,
                name: 'time2000',
                headerSize: 2,
                config: {
                    hardwareType: hardwareTypes.GASIC
                },
                parameters: {
                    sequenceNumber: 0,
                    time2000: 6433880
                },
                bytes: getBytesFromHex('09 05 00 00 62 2c 58')
            },
            {
                id: uplinkCommands.status.id,
                name: 'status',
                headerSize: 2,
                config: {
                    hardwareType: hardwareTypes.GASIC
                },
                parameters: {
                    software: {
                        type: 2,
                        version: 118
                    },
                    hardware: {
                        type: 12,
                        version: 1
                    },
                    data: {
                        batteryVoltage: {
                            underLowLoad: 3638,
                            underHighLoad: 3203
                        },
                        batteryInternalResistance: 20371,
                        temperature: 25,
                        remainingBatteryCapacity: 99.6,
                        lastEventSequenceNumber: 188,
                        downlinkQuality: 81
                    }
                },
                bytes: getBytesFromHex('14 0d 02 76 0c 01 e3 6c 83 4f 93 19 fd bc 51')
            }
        ],
        lrc: {
            expected: 0xf6,
            actual: 0xf6
        }
    },
    'valid exAbsHourMc+lastEvent response': {
        bytes: getBytesFromHex('1f 0a 0e 30 c7 e5 01 82 f4 52 00 00 00 00 00 00 00 62 62 00 79'),
        commands: [
            {
                id: uplinkCommands.exAbsHourMc.id,
                name: 'exAbsHourMc',
                headerSize: 3,
                config: {
                    hardwareType: hardwareTypes.GASIC
                },
                parameters: {
                    startTime2000: 771051600,
                    hours: 8,
                    channelList: [
                        {
                            diff: [
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ],
                            value: 10612,
                            pulseCoefficient: 10,
                            index: 1
                        }
                    ]
                },
                bytes: getBytesFromHex('1f 0a 0e 30 c7 e5 01 82 f4 52 00 00 00 00 00 00 00')
            },
            {
                id: uplinkCommands.lastEvent.id,
                name: 'lastEvent',
                headerSize: 1,
                config: {
                    hardwareType: hardwareTypes.GASIC
                },
                parameters: {
                    sequenceNumber: 98,
                    status: {
                        isBatteryLow: false,
                        isMagneticInfluence: false,
                        isButtonReleased: false,
                        isConnectionLost: false
                    }
                },
                bytes: getBytesFromHex('62 62 00')
            }
        ],
        lrc: {
            expected: 0x79,
            actual: 0x79
        }
    }
};

const invalidUplinkMessages: TMessageExamples = {
    'invalid correctTime2000 response': {
        message: {
            bytes: getBytesFromHex('0c 01 00  00'),
            commands: [
                {
                    id: uplinkCommands.correctTime2000.id,
                    name: 'correctTime2000',
                    headerSize: 2,
                    parameters: {status: 0},
                    bytes: getBytesFromHex('0c 01 00')
                }
            ],
            lrc: {
                expected: 0,
                actual: 0x58
            }
        },
        error: 'Mismatch LRC.'
    }
};

const mtxUplinkMessages: TMessageExamples = {
    'mtx uplink segment #1': {
        bytes: getBytesFromHex('1e28c4314d1010796430280fff011d00000008001a00000008001d00000008011d00000008001a00000033'),
        commands: [
            {
                id: uplinkCommands.dataSegment.id,
                name: 'dataSegment',
                headerSize: 2,
                config: {
                    hardwareType: hardwareTypes.MTXLORA
                },
                parameters: {
                    segmentationSessionId: 196,
                    segmentIndex: 1,
                    segmentsNumber: 3,
                    isLast: false,
                    data: getBytesFromHex('4d1010796430280fff011d00000008001a00000008001d00000008011d00000008001a000000')
                },
                bytes: getBytesFromHex('1e28c4314d1010796430280fff011d00000008001a00000008001d00000008011d00000008001a000000')
            }
        ],
        lrc: {
            expected: 0x33,
            actual: 0x33
        }
    },
    'mtx uplink segment #2': {
        bytes: getBytesFromHex('1e21c4b31d00000008013a00000008013a00000008013a00000008013a00000008000063d0b90507'),
        commands: [
            {
                id: uplinkCommands.dataSegment.id,
                name: 'dataSegment',
                headerSize: 2,
                config: {
                    hardwareType: hardwareTypes.MTXLORA
                },
                parameters: {
                    segmentationSessionId: 196,
                    segmentIndex: 3,
                    segmentsNumber: 3,
                    isLast: true,
                    data: getBytesFromHex('1d00000008013a00000008013a00000008013a00000008013a000000080000')
                },
                bytes: getBytesFromHex('1e21c4b31d00000008013a00000008013a00000008013a00000008013a000000080000')
            },
            {
                id: uplinkCommands.lastEvent.id,
                name: 'lastEvent',
                headerSize: 1,
                config: {
                    hardwareType: hardwareTypes.MTXLORA
                },
                parameters: {
                    sequenceNumber: 208,
                    status: {
                        isLockedOut: true,
                        isMagneticInfluence: false,
                        isMeterCaseOpen: true,
                        isMeterFailure: true,
                        isMeterProgramRestarted: true,
                        isMeterTerminalBoxOpen: false,
                        isModuleCompartmentOpen: true,
                        isNewTariffPlanReceived: false,
                        isParametersSetLocally: true,
                        isParametersSetRemotely: false,
                        isTariffPlanChanged: false,
                        isTimeCorrected: true,
                        isTimeSet: false
                    }
                },
                bytes: getBytesFromHex('63d0b905')
            }
        ],
        lrc: {
            expected: 0x07,
            actual: 0x07
        }
    }
};


const checkDownlinkMessage = ( implementation, exampleMessage: IMessage | IInvalidMessage, config?: ICommandConfig ) => {
    let messageFromBytes: IMessage | IInvalidMessage;
    let bytesFromMessage: TBytes;

    if ( 'bytes' in exampleMessage ) {
        // valid message
        messageFromBytes = implementation.fromBytes(exampleMessage.bytes, config);
        bytesFromMessage = implementation.toBytes(exampleMessage.commands);

        expect(getHexFromBytes(bytesFromMessage)).toBe(getHexFromBytes(exampleMessage.bytes));
    } else if ( 'message' in exampleMessage ) {
        // invalid message
        messageFromBytes = implementation.fromBytes(exampleMessage.message.bytes, config);
    } else {
        // everything else
        throw new Error('wrong message format');
    }

    expect(messageFromBytes).toStrictEqual(exampleMessage);
};

const checkMessages = ( description: string, implementation, messagesExamples: TMessageExamples, config?: ICommandConfig ) => (
    describe(description, () => {
        for ( const [exampleName, exampleMessage] of Object.entries(messagesExamples) ) {
            test(exampleName, () => {
                checkDownlinkMessage(implementation, exampleMessage, config);
            });
        }
    })
);


checkMessages('downlink messages', message.downlink, downlinkMessages);
checkMessages('uplink messages', message.uplink, validUplinkMessages, {hardwareType: hardwareTypes.GASIC});
checkMessages('uplink messages', message.uplink, invalidUplinkMessages);
checkMessages('mtx uplink messages', message.uplink, mtxUplinkMessages, {hardwareType: hardwareTypes.MTXLORA});

describe('message validation', () => {
    test('test valid input', () => {
        const bytes = getBytesFromHex('02 05 4e 2b bd 98 ad 03 07 0a 00 64 0c 96 00 e9 a6');
        const messageFromBytes = message.downlink.fromBytes(bytes);

        if ( 'error' in messageFromBytes ) {
            throw new Error('wrong message');
        }
    });

    test('test invalid input', () => {
        const bytes = getBytesFromHex('02 05 4e 2b bd 98 ab 03 07 0a 00 64 0c 96 00 e9 a6');
        const messageFromBytes = message.downlink.fromBytes(bytes);

        if ( !('error' in messageFromBytes) ) {
            throw new Error('wrong message');
        }
    });
});
