/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as message from '../../src/analog/message/index.js';
import {IMessage, IInvalidMessage, TMessageExamples} from '../../src/analog/message/types.js';
import {ICommandConfig} from '../../src/analog/utils/command.js';
//import * as downlinkCommands from '../../src/analog/commands/downlink/index.js';
//import * as uplinkCommands from '../../src/analog/commands/uplink/index.js';
import getBytesFromHex from '../../src/utils/getBytesFromHex.js';
import getHexFromBytes from '../../src/utils/getHexFromBytes.js';
//import {DOWNLINK, UPLINK} from '../../src/constants/directions.js';
//import {MTXLORA} from '../../src/analog/constants/hardwareTypes.js';
import {TBytes} from '../../src/types.js';


// interface ISampleMessage {
//     name: string,
//     bytes: string,
//     commands: Array<ICommand>,
//     //isValid: boolean
// }

//type TMessageList = Array<IMessage | IInvalidMessage>;


// const downlinkMessages: TMessageList = [
//     /* {
//         // SetTime2000 + SetTime2000 + LRC
//         hex: '02 05 4e 00 01 e2 40  02 05 4e 00 01 e2 40  55',
//         commands: [
//             {
//                 parameters: {sequenceNumber: 78, seconds: 123456},
//                 command: downlinkCommands.SetTime2000
//             },
//             {
//                 parameters: {sequenceNumber: 78, seconds: 123456},
//                 command: downlinkCommands.SetTime2000
//             }
//         ],
//         isValid: true
//     },
//     {
//         // SetTime2000 + SetTime2000 (no LRC)
//         hex: '02 05 4e 00 01 e2 40  02 05 4e 00 01 e2 40',
//         commands: [
//             {
//                 parameters: {sequenceNumber: 78, seconds: 123456},
//                 command: downlinkCommands.SetTime2000
//             },
//             {
//                 parameters: {sequenceNumber: 78, seconds: 123456},
//                 command: downlinkCommands.SetTime2000
//             }
//         ],
//         isValid: false
//     } */
// ];

const downlinkMessages: TMessageExamples = {
    'valid correctTime2000': {
        bytes: getBytesFromHex('0c 02 2d 88  fe'),
        commands: [
            {
                id: 12,
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
                    id: 12,
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
                id: 12,
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
                    id: 12,
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
    }
};

// const uplinkMessages0: TMessageList = [
//     {
//         name: 'valid correctTime2000',
//         bytes: getBytesFromHex('0c 02 2d 88  fe'),
//         commands: [
//             {
//                 id: uplinkCommands.correctTime2000.commandId,
//                 parameters: {sequenceNumber: 45, seconds: -120},
//                 bytes: getBytesFromHex('0c 02 2d 88')
//             }
//         ],
//         //isValid: true
//     }
//     /* {
//         // SetTime2000Response + CurrentMC + DayMC + LRC
//         hex: '02 01 01  18 06 0f 83 01 08 0a 0c  16 08 2f 97 55 0c 83 01 08 0a  b5',
//         commands: [
//             {
//                 parameters: {status: 1},
//                 command: uplinkCommands.SetTime2000Response
//             },
//             {
//                 parameters: {
//                     channelList: [
//                         {index: 1, value: 131},
//                         {index: 2, value: 8},
//                         {index: 3, value: 10},
//                         {index: 4, value: 12}
//                     ]
//                 },
//                 command: uplinkCommands.CurrentMC
//             },
//             {
//                 parameters: {
//                     startTime2000: 756604800,
//                     channelList: [
//                         {index: 1, value: 12},
//                         {index: 3, value: 131},
//                         {index: 5, value: 8},
//                         {index: 7, value: 10}
//                     ]
//                 },
//                 command: uplinkCommands.DayMC
//             }
//         ],
//         isValid: true
//     } */
// ];

// const mtxUplinkMessages: TMessageList = [
//     /* {
//         hex: '1e28c4314d1010796430280fff011d00000008001a00000008001d00000008011d00000008001a00000033',
//         commands: [
//             {
//                 parameters: {
//                     segmentationSessionId: 196,
//                     segmentIndex: 1,
//                     segmentsNumber: 3,
//                     isLast: false,
//                     data: getBytesFromHex('4d1010796430280fff011d00000008001a00000008001d00000008011d00000008001a000000')
//                 },
//                 command: uplinkCommands.DataSegment
//             }
//         ],
//         isValid: true
//     },
//     {
//         hex: '1e21c4b31d00000008013a00000008013a00000008013a00000008013a00000008000063d0b9e5e7',
//         commands: [
//             {
//                 parameters: {
//                     segmentationSessionId: 196,
//                     segmentIndex: 3,
//                     segmentsNumber: 3,
//                     isLast: true,
//                     data: getBytesFromHex('1d00000008013a00000008013a00000008013a00000008013a000000080000')
//                 },
//                 command: uplinkCommands.DataSegment
//             },
//             {
//                 parameters: {
//                     sequenceNumber: 208,
//                     status: {
//                         isLockedOut: true,
//                         isMagneticInfluence: false,
//                         isMeterCaseOpen: true,
//                         isMeterFailure: true,
//                         isMeterProgramRestarted: true,
//                         isMeterTerminalBoxOpen: false,
//                         isModuleCompartmentOpen: true,
//                         isNewTariffPlanReceived: false,
//                         isParametersSetLocally: true,
//                         isParametersSetRemotely: false,
//                         isTariffPlanChanged: false,
//                         isTimeCorrected: true,
//                         isTimeSet: false
//                     }
//                 },
//                 config: {hardwareType: MTXLORA},
//                 command: uplinkCommands.LastEvent
//             }
//         ],
//         isValid: true
//     } */
// ];

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

        // sampleMessages.forEach(sampleMessage => {
        //     test(sampleMessage.name, () => {
        //         checkUplinkMessage(sampleMessage, config);
        //     });
        // });
    })
);


//checkMessages('downlink messages', downlinkMessages);
//checkMessages('downlink messages with config', downlinkMessages/* , {direction: DOWNLINK} */);

//checkUplinkMessages('uplink messages', uplinkMessageExamples);
checkMessages('downlink messages', message.downlink, downlinkMessages);
checkMessages('uplink messages', message.uplink, uplinkMessages);

//checkMessages('uplink messages with config', uplinkMessages/* , {direction: UPLINK} */);

//checkMessages('mtx uplink messages', mtxUplinkMessages, {/* direction: UPLINK,  */hardwareType: MTXLORA});

/* describe('message validation', () => {
    test('test valid input', () => {
        const hex = '02 05 4e 2b bd 98 ad 03 07 0a 00 64 0c 96 00 e9 a6';
        const message = Message.fromHex(hex);

        expect(message.isValid).toBe(true);
    });

    test('test invalid input', () => {
        const hex = '02 05 4e 2b bd 98 ab 03 07 0a 00 64 0c 96 00 e9 a6';
        const message = Message.fromHex(hex);

        expect(message.isValid).toBe(false);
    });
}); */

// describe('getCommands', () => {
//     test('test valid input', () => {
//         const hex = '02 05 4e 2b bd 98 ad 03 07 0a 00 64 0c 96 00 e9 a6';
//         const message = Message.fromHex(hex);
//         const strictResult = Message.getCommands(message, true);

//         expect(strictResult.length).toBe(2);
//         expect(strictResult[0]).toBeInstanceOf(downlinkCommands.SetTime2000);
//         expect(strictResult[1]).toBeInstanceOf(downlinkCommands.SetParameter);

//         const nonStrictResult = Message.getCommands(message, false);

//         expect(nonStrictResult.length).toBe(2);
//         expect(nonStrictResult[0]).toBeInstanceOf(downlinkCommands.SetTime2000);
//         expect(nonStrictResult[1]).toBeInstanceOf(downlinkCommands.SetParameter);

//         expect(strictResult).toStrictEqual(strictResult);
//     });

//     test('test invalid input', () => {
//         const hex = '02 05 4e 2b bd 98 ab 03 07 0a 00 64 0c 96 00 e9 a6';
//         const message = Message.fromHex(hex);
//         const strictResult = Message.getCommands(message, true);

//         expect(message.isValid).toBe(false);
//         expect(strictResult.length).toBe(0);

//         const nonStrictResult = Message.getCommands(message, false);

//         expect(message.isValid).toBe(false);
//         expect(nonStrictResult.length).toBe(2);
//         expect(nonStrictResult[0]).toBeInstanceOf(downlinkCommands.SetTime2000);
//         expect(nonStrictResult[1]).toBeInstanceOf(downlinkCommands.SetParameter);
//     });
// });
