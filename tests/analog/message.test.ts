/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import * as message from '../../src/analog/message/index.js';
import {IMessage, IInvalidMessage, TMessageExamples} from '../../src/analog/message/types.js';
import {ICommandConfig} from '../../src/analog/utils/command.js';
import * as downlinkCommands from '../../src/analog/commands/downlink/index.js';
import * as uplinkCommands from '../../src/analog/commands/uplink/index.js';
import getBytesFromHex from '../../src/utils/getBytesFromHex.js';
import getHexFromBytes from '../../src/utils/getHexFromBytes.js';
import {MTXLORA} from '../../src/analog/constants/hardwareTypes.js';
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
        error: 'mismatch LRC'
    }
};

const uplinkMessages: TMessageExamples = {
    'valid correctTime2000 response': {
        bytes: getBytesFromHex('0c 01 00  58'),
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
            expected: 0x58,
            actual: 0x58
        }
    },
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
        error: 'mismatch LRC'
    },
    'valid setTime2000 + currentMc + dayMc': {
        bytes: getBytesFromHex('02 01 01  18 06 0f 83 01 08 0a 0c  16 08 2f 97 55 0c 83 01 08 0a  b5'),
        commands: [
            {
                id: uplinkCommands.setTime2000.id,
                name: 'setTime2000',
                headerSize: 2,
                parameters: {status: 1},
                bytes: getBytesFromHex('02 01 01')
            },
            {
                id: uplinkCommands.currentMc.id,
                name: 'currentMc',
                headerSize: 2,
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
                    hardwareType: MTXLORA
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
                    hardwareType: MTXLORA
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
                    hardwareType: MTXLORA
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
checkMessages('uplink messages', message.uplink, uplinkMessages);
checkMessages('mtx uplink messages', message.uplink, mtxUplinkMessages, {hardwareType: MTXLORA});

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
