/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as message from '../../src/mtx/message.js';
import Command from '../../src/mtx/Command.js';
import CommandBinaryBuffer from '../../src/mtx/CommandBinaryBuffer.js';
import * as downlinkCommands from '../../src/mtx/commands/downlink/index.js';
import * as uplinkCommands from '../../src/mtx/commands/uplink/index.js';
import getHexFromBytes from '../../src/utils/getHexFromBytes.js';
import getBytesFromHex from '../../src/utils/getBytesFromHex.js';
import * as accessLevels from '../../src/mtx/constants/accessLevels.js';
import * as frameTypes from '../../src/mtx/constants/frameTypes.js';
import * as directions from '../../src/mtx/constants/directions.js';
import {ACCESS_DENIED} from '../../src/mtx/constants/resultCodes.js';


interface IMessage {
    name: string,
    hex: string,
    frameHex: string,
    messageId: number,
    accessLevel: number,
    direction: number,
    commands: Array<Command>,
    lrc: number,
    frameType: number,
    source: Uint8Array,
    destination: Uint8Array,
    crc: Uint8Array
}

type TMessageList = Array<IMessage>;

const aesKey = new Uint8Array([...Array(16).keys()]);

const downlinkMessages: TMessageList = [
    {
        name: 'ActivateRatePlan',
        hex: '10 12 16 e1 99 37 2f 46 a3 7f 7a 42 5b 37 96 67 ef 3e 7e 41 45 02 2d 06 5c 9f 97 6c 36 ee 69 11 9b ae',
        frameHex: '7e 50 a8 a9 f5 f6 10 12 16 e1 99 37 2f 46 a3 7f 7a 42 5b 37 96 67 ef 3e 7d 5e 41 45 02 2d 06 5c 9f 97 6c 36 ee 69 7d 31 9b ae 25 f1 7e',
        messageId: 16,
        accessLevel: downlinkCommands.ActivateRatePlan.accessLevel,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.ActivateRatePlan({
                tariffTable: 8,
                tariffPlan: {
                    id: 1,
                    tariffSet: 2,
                    activateYear: 3,
                    activateMonth: 4,
                    activateDay: 5,
                    specialProfilesArraySize: 6,
                    seasonProfilesArraySize: 7,
                    dayProfilesArraySize: 8
                }
            })
        ],
        lrc: 0x58,
        crc: new Uint8Array([0x25, 0xf1]),
        frameType: frameTypes.DATA_REQUEST,
        source: new Uint8Array([0xf5, 0xf6]),
        destination: new Uint8Array([0xa8, 0xa9])
    },
    {
        name: 'GetDateTime',
        hex: '0a 13 47 04 a6 e5 e6 37 01 ad 37 a5 d5 71 92 14 3c 52',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 47 04 a6 e5 e6 37 01 ad 37 a5 d5 71 92 14 3c 52 b8 6e 7e',
        messageId: 10,
        accessLevel: downlinkCommands.GetDateTime.accessLevel,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.GetDateTime()
        ],
        lrc: 0x41,
        crc: new Uint8Array([0xb8, 0x6e]),
        frameType: frameTypes.DATA_REQUEST,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'GetDeviceId',
        hex: '0a 13 55 9e 05 01 4e 5c 2a 6c 0d 8a da 30 a7 4c 0f 86',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 55 9e 05 01 4e 5c 2a 6c 0d 8a da 30 a7 4c 0f 86 9c 30 7e',
        messageId: 10,
        accessLevel: downlinkCommands.GetDeviceId.accessLevel,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.GetDeviceId()
        ],
        lrc: 0x43,
        crc: new Uint8Array([0x9c, 0x30]),
        frameType: frameTypes.DATA_REQUEST,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'GetDisplayParam',
        hex: '0a 13 5a 01 aa 20 6e b7 a9 d6 17 b5 61 3f 3b 63 af 05',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 5a 01 aa 20 6e b7 a9 d6 17 b5 61 3f 3b 63 af 05 8a d6 7e',
        messageId: 10,
        accessLevel: downlinkCommands.GetDisplayParam.accessLevel,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.GetDisplayParam({
                displayMode: 5
            })
        ],
        lrc: 0x1c,
        crc: new Uint8Array([0x8a, 0xd6]),
        frameType: frameTypes.DATA_REQUEST,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'GetOpParams',
        hex: '0a 13 d4 ec 1c a5 2c a6 46 26 f1 6f 4a 48 aa a1 83 22',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 d4 ec 1c a5 2c a6 46 26 f1 6f 4a 48 aa a1 83 22 a0 c6 7e',
        messageId: 10,
        accessLevel: downlinkCommands.GetOpParams.accessLevel,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.GetOpParams()
        ],
        lrc: 0x58,
        crc: new Uint8Array([0xa0, 0xc6]),
        frameType: frameTypes.DATA_REQUEST,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'GetRatePlanInfo',
        hex: '0a 13 f1 f3 f2 80 ae 7a 4d 0b 50 a7 fa 3e 0d 6c 44 33',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 f1 f3 f2 80 ae 7a 4d 0b 50 a7 fa 3e 0d 6c 44 33 5f 81 7e',
        messageId: 10,
        accessLevel: downlinkCommands.GetRatePlanInfo.accessLevel,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.GetRatePlanInfo({
                tariffTable: 5
            })
        ],
        lrc: 0x6e,
        crc: new Uint8Array([0x5f, 0x81]),
        frameType: frameTypes.DATA_REQUEST,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'PrepareRatePlan',
        hex: '0a 12 de 91 0a aa 47 cd 42 c6 e1 05 ff 7e ca 61 55 97',
        frameHex: '7e 50 aa aa ff ff 0a 12 de 91 0a aa 47 cd 42 c6 e1 05 ff 7d 5e ca 61 55 97 55 96 7e',
        messageId: 10,
        accessLevel: downlinkCommands.PrepareRatePlan.accessLevel,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.PrepareRatePlan({
                tariffTable: 0,
                id: 987654321
            })
        ],
        lrc: 0x6b,
        crc: new Uint8Array([0x55, 0x96]),
        frameType: frameTypes.DATA_REQUEST,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'RunTariffPlan',
        hex: '0a 12 b4 52 a3 9e 75 02 fd 91 7f ec 66 c1 c1 8b ec 53',
        frameHex: '7e 50 aa aa ff ff 0a 12 b4 52 a3 9e 75 02 fd 91 7f ec 66 c1 c1 8b ec 53 d0 84 7e',
        messageId: 10,
        accessLevel: downlinkCommands.RunTariffPlan.accessLevel,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.RunTariffPlan({
                tariffTable: 5
            })
        ],
        lrc: 0x45,
        crc: new Uint8Array([0xd0, 0x84]),
        frameType: frameTypes.DATA_REQUEST,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'SetDayProfile (4 periods)',
        hex: '0a 12 4f e8 4c 59 76 3d b5 fb dd dd 6d f3 8d 0b 69 b8',
        frameHex: '7e 50 aa aa ff ff 0a 12 4f e8 4c 59 76 3d b5 fb dd dd 6d f3 8d 0b 69 b8 92 76 7e',
        messageId: 10,
        accessLevel: downlinkCommands.SetDayProfile.accessLevel,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.SetDayProfile({
                tariffTable: 0,
                index: 5,
                periods: [
                    {tariff: 0, isFirstHalfHour: true, hour: 2},
                    {tariff: 1, isFirstHalfHour: false, hour: 3},
                    {tariff: 2, isFirstHalfHour: true, hour: 4},
                    {tariff: 3, isFirstHalfHour: false, hour: 5}
                ]
            })
        ],
        lrc: 0xaa,
        crc: new Uint8Array([0x92, 0x76]),
        frameType: frameTypes.DATA_REQUEST,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'SetDayProfile (max periods)',
        hex: '0a 12 6d 4b 7a 82 06 2a de a1 79 ff 49 9b a9 c4 cc b4',
        frameHex: '7e 50 aa aa ff ff 0a 12 6d 4b 7a 82 06 2a de a1 79 ff 49 9b a9 c4 cc b4 49 70 7e',
        messageId: 10,
        accessLevel: downlinkCommands.SetDayProfile.accessLevel,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.SetDayProfile({
                tariffTable: 0,
                index: 3,
                periods: [
                    {tariff: 0, isFirstHalfHour: true, hour: 2},
                    {tariff: 1, isFirstHalfHour: false, hour: 3},
                    {tariff: 2, isFirstHalfHour: true, hour: 4},
                    {tariff: 3, isFirstHalfHour: false, hour: 5},
                    {tariff: 0, isFirstHalfHour: true, hour: 6},
                    {tariff: 1, isFirstHalfHour: false, hour: 7},
                    {tariff: 2, isFirstHalfHour: false, hour: 8},
                    {tariff: 3, isFirstHalfHour: true, hour: 9}
                ]
            })
        ],
        lrc: 0x5e,
        crc: new Uint8Array([0x49, 0x70]),
        frameType: frameTypes.DATA_REQUEST,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'SetDisplayParam',
        hex: '0a 12 dc d4 6d 81 98 a0 02 26 30 74 c9 64 ba f8 55 1c',
        frameHex: '7e 50 aa aa ff ff 0a 12 dc d4 6d 81 98 a0 02 26 30 74 c9 64 ba f8 55 1c 40 a9 7e',
        messageId: 10,
        accessLevel: downlinkCommands.SetDisplayParam.accessLevel,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.SetDisplayParam({
                displayMode: 8,
                order: [4, 5, 6, 7]
            })
        ],
        lrc: 0x17,
        crc: new Uint8Array([0x40, 0xa9]),
        frameType: frameTypes.DATA_REQUEST,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'SetOpParams',
        hex: '0a 12 f7 fe 51 bb e6 91 41 38 dd 6d 37 e4 87 cc 4c b4 22 0c 2e 12 c7 73 f8 23 b3 51 c2 f7 7d a9 56 76 e3 b3 49 b4 57 6c fc 89 a4 30 2e cf d8 6c ff c1 84 7b 8e a0 a9 65 a6 10 9f e9 31 2c 33 80 ad 22 08 af 02 26 40 ae e6 68 3e 6f f8 ee 4d 04 b0 75',
        frameHex: '7e 50 aa aa ff ff 0a 12 f7 fe 51 bb e6 91 41 38 dd 6d 37 e4 87 cc 4c b4 22 0c 2e 12 c7 73 f8 23 b3 51 c2 f7 7d 5d a9 56 76 e3 b3 49 b4 57 6c fc 89 a4 30 2e cf d8 6c ff c1 84 7b 8e a0 a9 65 a6 10 9f e9 31 2c 33 80 ad 22 08 af 02 26 40 ae e6 68 3e 6f f8 ee 4d 04 b0 75 36 b9 7e',
        messageId: 10,
        accessLevel: downlinkCommands.SetOpParams.accessLevel,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.SetOpParams(CommandBinaryBuffer.getDefaultOperatorParameters())
        ],
        lrc: 0x7b,
        crc: new Uint8Array([0x36, 0xb9]),
        frameType: frameTypes.DATA_REQUEST,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'SetSeasonProfile (default)',
        hex: '0a 12 93 31 26 0c b6 37 9b d4 7a 77 9c 82 9c 73 71 eb',
        frameHex: '7e 50 aa aa ff ff 0a 12 93 31 26 0c b6 37 9b d4 7a 77 9c 82 9c 73 71 eb fd eb 7e',
        messageId: 10,
        accessLevel: downlinkCommands.SetSeasonProfile.accessLevel,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.SetSeasonProfile({
                tariffTable: 1,
                index: 8,
                month: 1,
                date: 1,
                dayIndexes: [0, 0, 0, 0, 0, 0, 0]
            })
        ],
        lrc: 0x54,
        crc: new Uint8Array([0xfd, 0xeb]),
        frameType: frameTypes.DATA_REQUEST,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'SetSeasonProfile',
        hex: '0a 12 20 20 65 6d 84 7d 8d 08 fa d6 da c7 ed 73 6a 79',
        frameHex: '7e 50 aa aa ff ff 0a 12 20 20 65 6d 84 7d 5d 8d 08 fa d6 da c7 ed 73 6a 79 fa cb 7e',
        messageId: 10,
        accessLevel: downlinkCommands.SetSeasonProfile.accessLevel,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.SetSeasonProfile({
                tariffTable: 0,
                index: 2,
                month: 5,
                date: 9,
                dayIndexes: [0, 1, 2, 3, 4, 5, 6]
            })
        ],
        lrc: 0x54,
        crc: new Uint8Array([0xfa, 0xcb]),
        frameType: frameTypes.DATA_REQUEST,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'SetSpecialDay',
        hex: '0a 12 4c 2a 8a fc f5 5e b0 15 08 94 35 d1 2a 03 54 32',
        frameHex: '7e 50 aa aa ff ff 0a 12 4c 2a 8a fc f5 5e b0 15 08 94 35 d1 2a 03 54 32 55 f4 7e',
        messageId: 10,
        accessLevel: downlinkCommands.SetSpecialDay.accessLevel,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.SetSpecialDay({
                tariffTable: 1,
                index: 5,
                month: 1,
                date: 9,
                dayIndex: 3,
                isPeriodic: true
            })
        ],
        lrc: 0x5c,
        crc: new Uint8Array([0x55, 0xf4]),
        frameType: frameTypes.DATA_REQUEST,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'TurnRelayOff',
        hex: '0a 12 9d 81 66 34 ec 71 c4 62 af 9f 69 f6 c9 eb e8 08',
        frameHex: '7e 50 aa aa ff ff 0a 12 9d 81 66 34 ec 71 c4 62 af 9f 69 f6 c9 eb e8 08 cb 7f 7e',
        messageId: 10,
        accessLevel: downlinkCommands.TurnRelayOff.accessLevel,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.TurnRelayOff()
        ],
        lrc: 0x5e,
        crc: new Uint8Array([0xcb, 0x7f]),
        frameType: frameTypes.DATA_REQUEST,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'TurnRelayOn',
        hex: '0a 12 0d 8d 21 54 75 8a 37 a0 21 fa cd a3 c3 f2 00 4b',
        frameHex: '7e 50 aa aa ff ff 0a 12 0d 8d 21 54 75 8a 37 a0 21 fa cd a3 c3 f2 00 4b d2 62 7e',
        messageId: 10,
        accessLevel: downlinkCommands.TurnRelayOn.accessLevel,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.TurnRelayOn()
        ],
        lrc: 0x5f,
        crc: new Uint8Array([0xd2, 0x62]),
        frameType: frameTypes.DATA_REQUEST,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'two read-only encrypted commands',
        hex: '0a 13 66 82 dd f1 e5 58 9b 25 8f c4 dc 28 fc 87 ed 14',
        frameHex: '7e 50 a1 a1 f1 f1 0a 7d 33 66 82 dd f1 e5 58 9b 25 8f c4 dc 28 fc 87 ed 14 62 d8 7e',
        messageId: 10,
        accessLevel: accessLevels.READ_ONLY,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.TurnRelayOn(),
            new downlinkCommands.TurnRelayOff()
        ],
        lrc: 0x47,
        crc: new Uint8Array([0x62, 0xd8]),
        frameType: frameTypes.DATA_REQUEST,
        source: new Uint8Array([0xf1, 0xf1]),
        destination: new Uint8Array([0xa1, 0xa1])
    },
    {
        name: 'many read-only encrypted commands',
        hex: '0a 13 40 3c 61 2c e6 56 3e d5 b8 f1 26 62 2a a7 e1 66 be 89 ba 1c 74 fa 1d 50 af eb 39 5f fe 24 27 bd',
        frameHex: '7e 50 a1 a1 f1 f1 0a 7d 33 40 3c 61 2c e6 56 3e d5 b8 f1 26 62 2a a7 e1 66 be 89 ba 1c 74 fa 1d 50 af eb 39 5f fe 24 27 bd fc 35 7e',
        messageId: 10,
        accessLevel: accessLevels.READ_ONLY,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.TurnRelayOn(),
            new downlinkCommands.TurnRelayOn(),
            new downlinkCommands.TurnRelayOn(),
            new downlinkCommands.TurnRelayOn(),
            new downlinkCommands.TurnRelayOn(),
            new downlinkCommands.TurnRelayOn(),
            new downlinkCommands.TurnRelayOn()
        ],
        lrc: 0x5e,
        crc: new Uint8Array([0xfc, 0x35]),
        frameType: frameTypes.DATA_REQUEST,
        source: new Uint8Array([0xf1, 0xf1]),
        destination: new Uint8Array([0xa1, 0xa1])
    },
    {
        name: 'one unencrypted command',
        hex: '0b 10 10 18 00 00 5d',
        frameHex: '7e 50 a2 a3 f2 f3 0b 10 10 18 00 00 5d 3c d4 7e',
        messageId: 11,
        accessLevel: accessLevels.UNENCRYPTED,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.TurnRelayOn()
        ],
        lrc: 0x5d,
        crc: new Uint8Array([0x3c, 0xd4]),
        frameType: frameTypes.DATA_REQUEST,
        source: new Uint8Array([0xf2, 0xf3]),
        destination: new Uint8Array([0xa2, 0xa3])
    },
    {
        name: 'two unencrypted commands',
        hex: '0b 10 10 18 00 19 00 00 44',
        frameHex: '7e 50 a3 a4 f3 f4 0b 10 10 18 00 19 00 00 44 c3 d4 7e',
        messageId: 11,
        accessLevel: accessLevels.UNENCRYPTED,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.TurnRelayOn(),
            new downlinkCommands.TurnRelayOff()
        ],
        lrc: 0x44,
        crc: new Uint8Array([0xc3, 0xd4]),
        frameType: frameTypes.DATA_REQUEST,
        source: new Uint8Array([0xf3, 0xf4]),
        destination: new Uint8Array([0xa3, 0xa4])
    }
];

const uplinkMessages: TMessageList = [
    {
        name: 'ActivateRatePlanResponse',
        hex: '0a 12 83 4d 1e ca 77 1e 00 b9 75 de b3 41 63 bd 47 68',
        frameHex: '7e 51 aa aa ff ff 0a 12 83 4d 1e ca 77 1e 00 b9 75 de b3 41 63 bd 47 68 33 9c 7e',
        messageId: 10,
        accessLevel: uplinkCommands.ActivateRatePlanResponse.accessLevel,
        direction: directions.UPLINK,
        commands: [
            new uplinkCommands.ActivateRatePlanResponse()
        ],
        lrc: 0x54,
        crc: new Uint8Array([0x33, 0x9c]),
        frameType: frameTypes.DATA_RESPONSE,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'ErrorResponse',
        hex: '0a 13 b5 c2 74 9b cb c7 60 a7 7a 65 1e 74 b5 5a b9 9e',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 b5 c2 74 9b cb c7 60 a7 7a 65 1e 74 b5 5a b9 9e a8 1f 7e',
        messageId: 10,
        accessLevel: uplinkCommands.ErrorResponse.accessLevel,
        direction: directions.UPLINK,
        commands: [
            new uplinkCommands.ErrorResponse({
                commandId: downlinkCommands.TurnRelayOn.id,
                errorCode: ACCESS_DENIED
            })
        ],
        lrc: 0x31,
        crc: new Uint8Array([0xa8, 0x1f]),
        frameType: frameTypes.DATA_RESPONSE,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'GetDateTimeResponse',
        hex: '0a 13 f0 3d 29 b1 49 51 a1 76 81 a0 ec 9e 1b 45 a7 40',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 f0 3d 29 b1 49 51 a1 76 81 a0 ec 9e 1b 45 a7 40 03 5d 7e',
        messageId: 10,
        accessLevel: uplinkCommands.GetDateTimeResponse.accessLevel,
        direction: directions.UPLINK,
        commands: [
            new uplinkCommands.GetDateTimeResponse({
                seconds: 25,
                minutes: 30,
                hours: 18,
                day: 2,
                date: 13,
                month: 9,
                year: 23,
                isSummerTime: false
            })
        ],
        lrc: 0x4d,
        crc: new Uint8Array([0x03, 0x5d]),
        frameType: frameTypes.DATA_RESPONSE,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'GetDeviceIdResponse',
        hex: '0a 13 cf 5f a5 a8 36 72 4f c9 7a 07 35 f8 17 d4 96 51',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 cf 5f a5 a8 36 72 4f c9 7a 07 35 f8 17 d4 96 51 fe 54 7e',
        messageId: 10,
        accessLevel: uplinkCommands.GetDeviceIdResponse.accessLevel,
        direction: directions.UPLINK,
        commands: [
            new uplinkCommands.GetDeviceIdResponse({
                manufacturer: '001a79',
                type: 23,
                year: 2020,
                serial: '1b1d6a'
            })
        ],
        lrc: 0x47,
        crc: new Uint8Array([0xfe, 0x54]),
        frameType: frameTypes.DATA_RESPONSE,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'GetDisplayParamResponse',
        hex: '0a 13 29 3d 20 95 fd 5a 96 e0 7d d3 86 ce 79 b4 58 a6',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 29 3d 20 95 fd 5a 96 e0 7d 5d d3 86 ce 79 b4 58 a6 d8 41 7e',
        messageId: 10,
        accessLevel: uplinkCommands.GetDisplayParamResponse.accessLevel,
        direction: directions.UPLINK,
        commands: [
            new uplinkCommands.GetDisplayParamResponse({
                displayMode: 8,
                order: [4, 5, 6, 7]
            })
        ],
        lrc: 0x15,
        crc: new Uint8Array([0xd8, 0x41]),
        frameType: frameTypes.DATA_RESPONSE,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'GetOpParamsResponse',
        hex: '0a 13 a0 05 6f ba 5c 1c 6b 62 b9 37 db 7d 87 e4 c5 8e 22 0c 2e 12 c7 73 f8 23 b3 51 c2 f7 7d a9 56 76 e3 b3 49 b4 57 6c fc 89 a4 30 2e cf d8 6c ff c1 84 7b 8e a0 a9 65 a6 10 9f e9 31 2c 33 80 ad 22 08 af 02 26 40 ae e6 68 3e 6f f8 ee 4d 04 b0 75',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 a0 05 6f ba 5c 1c 6b 62 b9 37 db 7d 5d 87 e4 c5 8e 22 0c 2e 12 c7 73 f8 23 b3 51 c2 f7 7d 5d a9 56 76 e3 b3 49 b4 57 6c fc 89 a4 30 2e cf d8 6c ff c1 84 7b 8e a0 a9 65 a6 10 9f e9 31 2c 33 80 ad 22 08 af 02 26 40 ae e6 68 3e 6f f8 ee 4d 04 b0 75 9f 27 7e',
        messageId: 10,
        accessLevel: uplinkCommands.GetOpParamsResponse.accessLevel,
        direction: directions.UPLINK,
        commands: [
            new uplinkCommands.GetOpParamsResponse(CommandBinaryBuffer.getDefaultOperatorParameters())
        ],
        lrc: 0x7b,
        crc: new Uint8Array([0x9f, 0x27]),
        frameType: frameTypes.DATA_RESPONSE,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'GetRatePlanInfoResponse',
        hex: '0a 13 2e 2c be 49 63 cc c6 cb e3 ab c5 42 bb 0f da a1 e5 f5 67 48 ac 4e 54 9d a4 1e 75 e8 0a 8c 93 7c',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 2e 2c be 49 63 cc c6 cb e3 ab c5 42 bb 0f da a1 e5 f5 67 48 ac 4e 54 9d a4 1e 75 e8 0a 8c 93 7c 85 8b 7e',
        messageId: 10,
        accessLevel: uplinkCommands.GetRatePlanInfoResponse.accessLevel,
        direction: directions.UPLINK,
        commands: [
            new uplinkCommands.GetRatePlanInfoResponse({
                tariffTable: 8,
                activePlan: {
                    id: 1,
                    tariffSet: 2,
                    activateYear: 3,
                    activateMonth: 4,
                    activateDay: 5,
                    specialProfilesArraySize: 6,
                    seasonProfilesArraySize: 7,
                    dayProfilesArraySize: 8
                },
                passivePlan: {
                    id: 10,
                    tariffSet: 20,
                    activateYear: 30,
                    activateMonth: 40,
                    activateDay: 50,
                    specialProfilesArraySize: 60,
                    seasonProfilesArraySize: 70,
                    dayProfilesArraySize: 80
                }
            })
        ],
        lrc: 0x4d,
        crc: new Uint8Array([0x85, 0x8b]),
        frameType: frameTypes.DATA_RESPONSE,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'PrepareRatePlanResponse',
        hex: '0c 12 0b 27 68 f1 39 fe 5c 32 9f 44 45 c3 03 60 a8 b6',
        frameHex: '7e 51 aa aa ff ff 0c 12 0b 27 68 f1 39 fe 5c 32 9f 44 45 c3 03 60 a8 b6 08 c3 7e',
        messageId: 12,
        accessLevel: uplinkCommands.PrepareRatePlanResponse.accessLevel,
        direction: directions.UPLINK,
        commands: [
            new uplinkCommands.PrepareRatePlanResponse()
        ],
        lrc: 0x53,
        crc: new Uint8Array([0x08, 0xc3]),
        frameType: frameTypes.DATA_RESPONSE,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'RunTariffPlanResponse',
        hex: '0c 12 9f f9 75 af c6 27 a8 3b 9b 79 51 23 6b 74 59 ba',
        frameHex: '7e 51 aa aa ff ff 0c 12 9f f9 75 af c6 27 a8 3b 9b 79 51 23 6b 74 59 ba e3 19 7e',
        messageId: 12,
        accessLevel: uplinkCommands.RunTariffPlanResponse.accessLevel,
        direction: directions.UPLINK,
        commands: [
            new uplinkCommands.RunTariffPlanResponse()
        ],
        lrc: 0x41,
        crc: new Uint8Array([0xe3, 0x19]),
        frameType: frameTypes.DATA_RESPONSE,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'SetDayProfileResponse',
        hex: '0c 12 cb 50 1d 66 88 69 6d 1b 4d 2b fb d6 6a a4 8d 31',
        frameHex: '7e 51 aa aa ff ff 0c 12 cb 50 1d 66 88 69 6d 1b 4d 2b fb d6 6a a4 8d 31 48 83 7e',
        messageId: 12,
        accessLevel: uplinkCommands.SetDayProfileResponse.accessLevel,
        direction: directions.UPLINK,
        commands: [
            new uplinkCommands.SetDayProfileResponse()
        ],
        lrc: 0x57,
        crc: new Uint8Array([0x48, 0x83]),
        frameType: frameTypes.DATA_RESPONSE,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'SetDisplayParamResponse',
        hex: '0a 12 ae 17 9c ae bc 0b aa 81 9c f9 39 39 eb da af 99',
        frameHex: '7e 51 aa aa ff ff 0a 12 ae 17 9c ae bc 0b aa 81 9c f9 39 39 eb da af 99 7d 5e d7 7e',
        messageId: 10,
        accessLevel: uplinkCommands.SetDisplayParamResponse.accessLevel,
        direction: directions.UPLINK,
        commands: [
            new uplinkCommands.SetDisplayParamResponse()
        ],
        lrc: 0x1a,
        crc: new Uint8Array([0x7e, 0xd7]),
        frameType: frameTypes.DATA_RESPONSE,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'SetOpParamsResponse',
        hex: '0a 12 b7 7e 91 e5 84 c7 9e 69 9c 5a 6a 38 b1 d8 c1 02',
        frameHex: '7e 51 aa aa ff ff 0a 12 b7 7d 5e 91 e5 84 c7 9e 69 9c 5a 6a 38 b1 d8 c1 02 01 cb 7e',
        messageId: 10,
        accessLevel: uplinkCommands.SetOpParamsResponse.accessLevel,
        direction: directions.UPLINK,
        commands: [
            new uplinkCommands.SetOpParamsResponse()
        ],
        lrc: 0x58,
        crc: new Uint8Array([0x01, 0xcb]),
        frameType: frameTypes.DATA_RESPONSE,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'SetSeasonProfileResponse',
        hex: '0a 12 0d 18 99 92 bd c9 f6 f1 06 b5 c1 9b 15 66 a1 6a',
        frameHex: '7e 51 aa aa ff ff 0a 12 0d 18 99 92 bd c9 f6 f1 06 b5 c1 9b 15 66 a1 6a d4 6b 7e',
        messageId: 10,
        accessLevel: uplinkCommands.SetSeasonProfileResponse.accessLevel,
        direction: directions.UPLINK,
        commands: [
            new uplinkCommands.SetSeasonProfileResponse()
        ],
        lrc: 0x56,
        crc: new Uint8Array([0xd4, 0x6b]),
        frameType: frameTypes.DATA_RESPONSE,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'SetSpecialDayResponse',
        hex: '0a 12 58 96 e9 31 df b7 cb e9 79 0d 30 4e 02 f0 3f 5e',
        frameHex: '7e 51 aa aa ff ff 0a 12 58 96 e9 31 df b7 cb e9 79 0d 30 4e 02 f0 3f 5e 32 96 7e',
        messageId: 10,
        accessLevel: uplinkCommands.SetSpecialDayResponse.accessLevel,
        direction: directions.UPLINK,
        commands: [
            new uplinkCommands.SetSpecialDayResponse()
        ],
        lrc: 0x55,
        crc: new Uint8Array([0x32, 0x96]),
        frameType: frameTypes.DATA_RESPONSE,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'TurnRelayOffResponse',
        hex: '0a 12 9d 81 66 34 ec 71 c4 62 af 9f 69 f6 c9 eb e8 08',
        frameHex: '7e 51 aa aa ff ff 0a 12 9d 81 66 34 ec 71 c4 62 af 9f 69 f6 c9 eb e8 08 02 f6 7e',
        messageId: 10,
        accessLevel: uplinkCommands.TurnRelayOffResponse.accessLevel,
        direction: directions.UPLINK,
        commands: [
            new uplinkCommands.TurnRelayOffResponse()
        ],
        lrc: 0x5e,
        crc: new Uint8Array([0x02, 0xf6]),
        frameType: frameTypes.DATA_RESPONSE,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'TurnRelayOnResponse',
        hex: '0a 12 0d 8d 21 54 75 8a 37 a0 21 fa cd a3 c3 f2 00 4b',
        frameHex: '7e 51 aa aa ff ff 0a 12 0d 8d 21 54 75 8a 37 a0 21 fa cd a3 c3 f2 00 4b 1b eb 7e',
        messageId: 10,
        accessLevel: uplinkCommands.TurnRelayOnResponse.accessLevel,
        direction: directions.UPLINK,
        commands: [
            new uplinkCommands.TurnRelayOnResponse()
        ],
        lrc: 0x5f,
        crc: new Uint8Array([0x1b, 0xeb]),
        frameType: frameTypes.DATA_RESPONSE,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'two unencrypted commands',
        hex: '0b 10 10 18 00 18 00 00 45',
        frameHex: '7e 51 a3 a4 f3 f4 0b 10 10 18 00 18 00 00 45 1b a7 7e',
        messageId: 11,
        accessLevel: accessLevels.UNENCRYPTED,
        direction: directions.UPLINK,
        commands: [
            new uplinkCommands.TurnRelayOnResponse(),
            new uplinkCommands.TurnRelayOnResponse()
        ],
        lrc: 0x45,
        crc: new Uint8Array([0x1b, 0xa7]),
        frameType: frameTypes.DATA_RESPONSE,
        source: new Uint8Array([0xf3, 0xf4]),
        destination: new Uint8Array([0xa3, 0xa4])
    },
    {
        name: 'many unencrypted commands',
        hex: '0c 10 10 18 00 18 00 18 00 18 00 18 00 18 00 18 00 18 00 00 45',
        frameHex: '7e 51 a3 a4 f3 f4 0c 10 10 18 00 18 00 18 00 18 00 18 00 18 00 18 00 18 00 00 45 38 67 7e',
        messageId: 12,
        accessLevel: accessLevels.UNENCRYPTED,
        direction: directions.UPLINK,
        commands: [
            new uplinkCommands.TurnRelayOnResponse(),
            new uplinkCommands.TurnRelayOnResponse(),
            new uplinkCommands.TurnRelayOnResponse(),
            new uplinkCommands.TurnRelayOnResponse(),
            new uplinkCommands.TurnRelayOnResponse(),
            new uplinkCommands.TurnRelayOnResponse(),
            new uplinkCommands.TurnRelayOnResponse(),
            new uplinkCommands.TurnRelayOnResponse()
        ],
        lrc: 0x45,
        crc: new Uint8Array([0x38, 0x67]),
        frameType: frameTypes.DATA_RESPONSE,
        source: new Uint8Array([0xf3, 0xf4]),
        destination: new Uint8Array([0xa3, 0xa4])
    }
];


const checkMessage = ( messageParams: IMessage ) => {
    const {hex, messageId, accessLevel, direction, commands, lrc} = messageParams;
    const {frameHex, frameType, source, destination, crc} = messageParams;
    const messageBytes = message.toBytes(commands, {messageId, aesKey, accessLevel});
    const messageData = message.fromHex(hex, {aesKey, direction});
    const frame = message.toFrame(messageBytes, {frameType, source, destination});
    const frameMessageData = message.fromFrame(getBytesFromHex(frameHex), {aesKey});

    expect(getHexFromBytes(messageBytes)).toEqual(hex);
    expect(messageData.lrc).toEqual(lrc);
    expect(messageData.messageId).toEqual(messageId);
    expect(messageData.accessLevel).toEqual(accessLevel);
    expect(getHexFromBytes(frame)).toEqual(frameHex);
    expect(messageData.commands.map(item => item.command)).toStrictEqual(commands);
    expect(frameMessageData.crc).toStrictEqual(crc);
    expect(frameMessageData.source).toStrictEqual(source);
    expect(frameMessageData.destination).toStrictEqual(destination);
    expect(frameMessageData.frameType).toStrictEqual(frameType);
    expect(messageData.commands).toStrictEqual(frameMessageData.commands);
};


describe('downlink messages', () => {
    downlinkMessages.forEach(messageData => {
        test(messageData.name, () => {
            checkMessage(messageData);
        });
    });
});

describe('uplink messages', () => {
    uplinkMessages.forEach(messageData => {
        test(messageData.name, () => {
            checkMessage(messageData);
        });
    });
});
