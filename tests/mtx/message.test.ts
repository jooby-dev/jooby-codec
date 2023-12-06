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
import * as meterTypes from '../../src/mtx/constants/meterTypes.js';
import * as directions from '../../src/constants/directions.js';
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
        name: 'GetBuildVersion',
        hex: '0a 13 2e a2 48 fd 55 cd 7b a3 d0 b0 c5 3d 2b 18 05 29',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 2e a2 48 fd 55 cd 7b a3 d0 b0 c5 3d 2b 18 05 29 30 fc 7e',
        messageId: 10,
        accessLevel: downlinkCommands.GetBuildVersion.accessLevel,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.GetBuildVersion()
        ],
        lrc: 0x36,
        crc: new Uint8Array([0x30, 0xfc]),
        frameType: frameTypes.DATA_REQUEST,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'GetCorrectTime',
        hex: '0a 13 8d 17 1d ad d8 2f 50 e5 0f ca a3 20 8d 83 e8 4d',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 8d 17 1d ad d8 2f 50 e5 0f ca a3 20 8d 83 e8 4d 82 87 7e',
        messageId: 10,
        accessLevel: downlinkCommands.GetCorrectTime.accessLevel,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.GetCorrectTime()
        ],
        lrc: 0x78,
        crc: new Uint8Array([0x82, 0x87]),
        frameType: frameTypes.DATA_REQUEST,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
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
        name: 'GetDayProfile',
        hex: '0a 13 00 3f e4 e6 f8 7e 34 9d ba ee 69 dd 8a b9 32 78',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 00 3f e4 e6 f8 7d 5e 34 9d ba ee 69 dd 8a b9 32 78 e2 26 7e',
        messageId: 10,
        accessLevel: downlinkCommands.GetDayProfile.accessLevel,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.GetDayProfile({
                tariffTable: 0,
                index: 3,
                isActive: true
            })
        ],
        lrc: 0x7d,
        crc: new Uint8Array([0xe2, 0x26]),
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
        name: 'GetDeviceType',
        hex: '0a 13 e2 47 89 5f 0c d5 5f 65 5b 08 bc a0 42 cc b0 1f',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 e2 47 89 5f 0c d5 5f 65 5b 08 bc a0 42 cc b0 1f cf 3a 7e',
        messageId: 10,
        accessLevel: downlinkCommands.GetDeviceType.accessLevel,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.GetDeviceType()
        ],
        lrc: 0x42,
        crc: new Uint8Array([0xcf, 0x3a]),
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
        name: 'GetSaldo',
        hex: '0a 13 c4 63 dc 84 55 42 73 2d f9 a4 59 86 a8 46 9c 66',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 c4 63 dc 84 55 42 73 2d f9 a4 59 86 a8 46 9c 66 39 12 7e',
        messageId: 10,
        accessLevel: downlinkCommands.GetSaldo.accessLevel,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.GetSaldo()
        ],
        lrc: 0x6f,
        crc: new Uint8Array([0x39, 0x12]),
        frameType: frameTypes.DATA_REQUEST,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'GetSaldoParameters',
        hex: '0a 13 2f a5 23 de 3c bf bb 0d 6b f1 1f db 52 05 b4 ba',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 2f a5 23 de 3c bf bb 0d 6b f1 1f db 52 05 b4 ba 04 57 7e',
        messageId: 10,
        accessLevel: downlinkCommands.GetSaldoParameters.accessLevel,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.GetSaldoParameters()
        ],
        lrc: 0x68,
        crc: new Uint8Array([0x04, 0x57]),
        frameType: frameTypes.DATA_REQUEST,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'GetSeasonProfile',
        hex: '0a 13 00 d0 7e e7 8d eb 4c 39 05 4d 75 aa cf fd 4f 77',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 00 d0 7d 5e e7 8d eb 4c 39 05 4d 75 aa cf fd 4f 77 aa 4b 7e',
        messageId: 10,
        accessLevel: downlinkCommands.GetSeasonProfile.accessLevel,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.GetSeasonProfile({
                tariffTable: 0,
                index: 5,
                isActive: false
            })
        ],
        lrc: 0x7d,
        crc: new Uint8Array([0xaa, 0x4b]),
        frameType: frameTypes.DATA_REQUEST,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'GetSpecialDay',
        hex: '0a 13 51 32 8d fe 15 42 ae 8b 62 d3 c6 72 12 b4 90 09',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 51 32 8d fe 15 42 ae 8b 62 d3 c6 72 12 b4 90 09 57 8a 7e',
        messageId: 10,
        accessLevel: downlinkCommands.GetSpecialDay.accessLevel,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.GetSpecialDay({
                tariffTable: 0,
                index: 5,
                isActive: false
            })
        ],
        lrc: 0x7c,
        crc: new Uint8Array([0x57, 0x8a]),
        frameType: frameTypes.DATA_REQUEST,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'GetVersion',
        hex: '0a 13 a8 5e b1 b5 57 0a b9 f2 27 3e 27 47 88 bc d3 83',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 a8 5e b1 b5 57 0a b9 f2 27 3e 27 47 88 bc d3 83 ee 5b 7e',
        messageId: 10,
        accessLevel: downlinkCommands.GetVersion.accessLevel,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.GetVersion()
        ],
        lrc: 0x6e,
        crc: new Uint8Array([0xee, 0x5b]),
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
        name: 'SetAccessKey',
        hex: '0a 12 f1 b6 e0 a9 84 51 a5 08 c7 b0 3b 82 6c 0b b1 a4 f3 45 64 f3 06 94 d4 a9 93 e3 ea 2c 8a 9b bc 8a',
        frameHex: '7e 50 aa aa ff ff 0a 12 f1 b6 e0 a9 84 51 a5 08 c7 b0 3b 82 6c 0b b1 a4 f3 45 64 f3 06 94 d4 a9 93 e3 ea 2c 8a 9b bc 8a d2 28 7e',
        messageId: 10,
        accessLevel: downlinkCommands.SetAccessKey.accessLevel,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.SetAccessKey({
                accessLevel: accessLevels.READ_ONLY,
                key: new Uint8Array([
                    0, 1, 2, 3, 4, 5, 6, 7,
                    7, 6, 5, 4, 3, 2, 1, 0
                ])
            })
        ],
        lrc: 0x5c,
        crc: new Uint8Array([0xd2, 0x28]),
        frameType: frameTypes.DATA_REQUEST,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'SetCorrectDateTime',
        hex: '0a 12 44 f7 b3 43 5a 72 9e 18 f3 22 8c 7c 30 7e 01 0a',
        frameHex: '7e 50 aa aa ff ff 0a 12 44 f7 b3 43 5a 72 9e 18 f3 22 8c 7c 30 7d 5e 01 0a 56 ad 7e',
        messageId: 10,
        accessLevel: downlinkCommands.SetCorrectDateTime.accessLevel,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.SetCorrectDateTime({
                seconds: -5
            })
        ],
        lrc: 0x1d,
        crc: new Uint8Array([0x56, 0xad]),
        frameType: frameTypes.DATA_REQUEST,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'SetCorrectTime',
        hex: '0a 12 9a 60 72 38 6a b3 c9 49 2f 6b 3d 32 4f 7f 7c 75',
        frameHex: '7e 50 aa aa ff ff 0a 12 9a 60 72 38 6a b3 c9 49 2f 6b 3d 32 4f 7f 7c 75 85 db 7e',
        messageId: 10,
        accessLevel: downlinkCommands.SetCorrectTime.accessLevel,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.SetCorrectTime({
                monthTransitionSummer: 3,
                dateTransitionSummer: 0,
                hoursTransitionSummer: 3,
                hoursCorrectSummer: 1,
                monthTransitionWinter: 10,
                dateTransitionWinter: 0,
                hoursTransitionWinter: 4,
                hoursCorrectWinter: 1,
                needCorrection: true
            })
        ],
        lrc: 0x5d,
        crc: new Uint8Array([0x85, 0xdb]),
        frameType: frameTypes.DATA_REQUEST,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'SetDateTime',
        hex: '0a 13 8c 84 46 31 26 33 6b 32 4e 05 d5 9f 95 31 e2 b9',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 8c 84 46 31 26 33 6b 32 4e 05 d5 9f 95 31 e2 b9 7a 1c 7e',
        messageId: 10,
        accessLevel: downlinkCommands.SetDateTime.accessLevel,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.SetDateTime({
                isSummerTime: false,
                seconds: 25,
                minutes: 30,
                hours: 18,
                day: 2,
                date: 13,
                month: 9,
                year: 23
            })
        ],
        lrc: 0x42,
        crc: new Uint8Array([0x7a, 0x1c]),
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
        name: 'SetSaldo',
        hex: '0a 12 84 7a 49 26 56 ad 85 d8 fb ce 99 fb e8 09 62 92 14 37 ef 69 d6 c4 3e e6 00 9a b5 21 fc 27 2b c2',
        frameHex: '7e 50 aa aa ff ff 0a 12 84 7a 49 26 56 ad 85 d8 fb ce 99 fb e8 09 62 92 14 37 ef 69 d6 c4 3e e6 00 9a b5 21 fc 27 2b c2 ab 08 7e',
        messageId: 10,
        accessLevel: downlinkCommands.SetSaldo.accessLevel,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.SetSaldo({
                date: {
                    month: 9,
                    date: 23,
                    hours: 6,
                    minutes: 35
                },
                saldoNew: 2,
                saldoOld: 5
            })
        ],
        lrc: 0x5d,
        crc: new Uint8Array([0xab, 0x08]),
        frameType: frameTypes.DATA_REQUEST,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'SetSaldoParameters',
        hex: '0a 12 0d fe 89 57 38 c7 9b 7b 77 14 bd 8b 9e f3 eb 44 1b 2e f6 c5 32 4d 34 24 14 15 55 c8 0f 13 cf bc 67 15 9e 5a 97 29 dc 1a 47 86 95 29 61 8d 58 ca',
        frameHex: '7e 50 aa aa ff ff 0a 12 0d fe 89 57 38 c7 9b 7b 77 14 bd 8b 9e f3 eb 44 1b 2e f6 c5 32 4d 34 24 14 15 55 c8 0f 7d 33 cf bc 67 15 9e 5a 97 29 dc 1a 47 86 95 29 61 8d 58 ca a8 9f 7e',
        messageId: 10,
        accessLevel: downlinkCommands.SetSaldoParameters.accessLevel,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.SetSaldoParameters({
                coefficients: [2, 3, 4, 5],
                decimalPointTariff: 6,
                indicationThreshold: 7,
                relayThreshold: 8,
                mode: 9,
                saldoOffTimeBegin: 10,
                saldoOffTimeEnd: 11,
                decimalPointIndication: 12,
                powerThreshold: 13,
                creditThreshold: 14
            })
        ],
        lrc: 0x43,
        crc: new Uint8Array([0xa8, 0x9f]),
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
        name: 'GetBuildVersionResponse',
        hex: '0a 13 9b 4b f7 2a d1 e5 49 a5 09 50 9a 59 7e c2 b5 88',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 9b 4b f7 2a d1 e5 49 a5 09 50 9a 59 7d 5e c2 b5 88 21 54 7e',
        messageId: 10,
        accessLevel: uplinkCommands.GetBuildVersionResponse.accessLevel,
        direction: directions.UPLINK,
        commands: [
            new uplinkCommands.GetBuildVersionResponse({
                date: 16,
                month: 9,
                year: 21,
                version: '0.0.9'
            })
        ],
        lrc: 0x35,
        crc: new Uint8Array([0x21, 0x54]),
        frameType: frameTypes.DATA_RESPONSE,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'GetCorrectTimeResponse',
        hex: '0a 13 d4 93 ea 6a b2 92 f9 a6 23 76 16 fc 12 38 9f b6',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 d4 93 ea 6a b2 92 f9 a6 23 76 16 fc 12 38 9f b6 cc 0b 7e',
        messageId: 10,
        accessLevel: uplinkCommands.GetCorrectTimeResponse.accessLevel,
        direction: directions.UPLINK,
        commands: [
            new uplinkCommands.GetCorrectTimeResponse({
                monthTransitionSummer: 3,
                dateTransitionSummer: 0,
                hoursTransitionSummer: 3,
                hoursCorrectSummer: 1,
                monthTransitionWinter: 10,
                dateTransitionWinter: 0,
                hoursTransitionWinter: 4,
                hoursCorrectWinter: 1,
                needCorrection: true
            })
        ],
        lrc: 0x7e,
        crc: new Uint8Array([0xcc, 0x0b]),
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
        name: 'GetDayProfileResponse',
        hex: '0a 13 69 11 3f 2e d8 4d d1 ba 20 c4 a1 ec ff 6b 38 74',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 69 7d 31 3f 2e d8 4d d1 ba 20 c4 a1 ec ff 6b 38 74 14 98 7e',
        messageId: 10,
        accessLevel: uplinkCommands.GetDayProfileResponse.accessLevel,
        direction: directions.UPLINK,
        commands: [
            new uplinkCommands.GetDayProfileResponse({
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
        lrc: 0x75,
        crc: new Uint8Array([0x14, 0x98]),
        frameType: frameTypes.DATA_RESPONSE,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'GetDayProfileResponse (4 periods)',
        hex: '0a 13 d6 40 91 21 77 5b ba 57 f9 92 50 42 4a 16 ae 82',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 d6 40 91 21 77 5b ba 57 f9 92 50 42 4a 16 ae 82 16 10 7e',
        messageId: 10,
        accessLevel: uplinkCommands.GetDayProfileResponse.accessLevel,
        direction: directions.UPLINK,
        commands: [
            new uplinkCommands.GetDayProfileResponse({
                periods: [
                    {tariff: 0, isFirstHalfHour: true, hour: 2},
                    {tariff: 1, isFirstHalfHour: false, hour: 3},
                    {tariff: 2, isFirstHalfHour: true, hour: 4},
                    {tariff: 3, isFirstHalfHour: false, hour: 5}
                ]
            })
        ],
        lrc: 0x87,
        crc: new Uint8Array([0x16, 0x10]),
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
        name: 'GetDeviceTypeResponse',
        hex: '0a 13 cf 02 a9 57 43 0a 46 e0 7a 34 22 b7 71 0c 19 29',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 cf 02 a9 57 43 0a 46 e0 7a 34 22 b7 71 0c 19 29 93 54 7e',
        messageId: 10,
        accessLevel: uplinkCommands.GetDeviceTypeResponse.accessLevel,
        direction: directions.UPLINK,
        commands: [
            new uplinkCommands.GetDeviceTypeResponse({
                type: 'MTX 1G05.DH.2L2-DOB4',
                revision: 0x0b,
                meterType: meterTypes.G_FULL
            })
        ],
        lrc: 0xb0,
        crc: new Uint8Array([0x93, 0x54]),
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
        name: 'GetSaldoParametersResponse',
        hex: '0c 13 0d b0 25 08 91 ca 54 e3 a4 cc be a2 73 ae 54 bf a0 43 77 0d 98 4c 73 a6 4b 06 d7 22 9c 38 bb b8 50 4e ed 7a 9d 84 6f 85 b4 ee 57 2c fd 1f 7c 18',
        frameHex: '7e 51 aa aa ff ff 0c 7d 33 0d b0 25 08 91 ca 54 e3 a4 cc be a2 73 ae 54 bf a0 43 77 0d 98 4c 73 a6 4b 06 d7 22 9c 38 bb b8 50 4e ed 7a 9d 84 6f 85 b4 ee 57 2c fd 1f 7c 18 65 40 7e',
        messageId: 12,
        accessLevel: uplinkCommands.GetSaldoParametersResponse.accessLevel,
        direction: directions.UPLINK,
        commands: [
            new uplinkCommands.GetSaldoParametersResponse({
                coefficients: [2, 3, 4, 5],
                decimalPointTariff: 6,
                indicationThreshold: 7,
                relayThreshold: 8,
                mode: 90,
                saldoOffTimeBegin: 10,
                saldoOffTimeEnd: 11,
                decimalPointIndication: 12,
                powerThreshold: 13,
                creditThreshold: 14
            })
        ],
        lrc: 0x10,
        crc: new Uint8Array([0x65, 0x40]),
        frameType: frameTypes.DATA_RESPONSE,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'GetSaldoResponse',
        hex: '0c 13 b3 92 d2 17 c6 97 00 75 1a eb 35 dd 62 76 c4 3a d9 e5 b4 c7 af f2 3c 79 79 a6 08 37 2e dd 9e 07 8a 3f bc 8a bf d1 89 57 ad b5 42 7b 33 fc 35 f8',
        frameHex: '7e 51 aa aa ff ff 0c 7d 33 b3 92 d2 17 c6 97 00 75 1a eb 35 dd 62 76 c4 3a d9 e5 b4 c7 af f2 3c 79 79 a6 08 37 2e dd 9e 07 8a 3f bc 8a bf d1 89 57 ad b5 42 7b 33 fc 35 f8 79 44 7e',
        messageId: 12,
        accessLevel: uplinkCommands.GetSaldoResponse.accessLevel,
        direction: directions.UPLINK,
        commands: [
            new uplinkCommands.GetSaldoResponse({
                currentSaldo: 1,
                count: 0,
                energy: [2, 3, 4, 5],
                beginSaldoOfPeriod: 7,
                date: {
                    month: 9,
                    date: 23,
                    hours: 6,
                    minutes: 35
                }
            })
        ],
        lrc: 0x4f,
        crc: new Uint8Array([0x79, 0x44]),
        frameType: frameTypes.DATA_RESPONSE,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'GetSeasonProfileResponse',
        hex: '0c 13 b6 6b 87 aa a9 25 92 39 df 19 ee f7 2c 1e 41 90',
        frameHex: '7e 51 aa aa ff ff 0c 7d 33 b6 6b 87 aa a9 25 92 39 df 19 ee f7 2c 1e 41 90 ca 5a 7e',
        messageId: 12,
        accessLevel: uplinkCommands.GetSeasonProfileResponse.accessLevel,
        direction: directions.UPLINK,
        commands: [
            new uplinkCommands.GetSeasonProfileResponse({
                month: 1,
                date: 2,
                dayIndexes: [0, 1, 0, 1, 0, 1, 0]
            })
        ],
        lrc: 0x71,
        crc: new Uint8Array([0xca, 0x5a]),
        frameType: frameTypes.DATA_RESPONSE,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'GetVersionResponse',
        hex: '0c 13 8f d7 f5 0b b9 60 dc fc 45 73 a5 5b e8 4a 64 ae',
        frameHex: '7e 51 aa aa ff ff 0c 7d 33 8f d7 f5 0b b9 60 dc fc 45 73 a5 5b e8 4a 64 ae 07 4a 7e',
        messageId: 12,
        accessLevel: uplinkCommands.GetVersionResponse.accessLevel,
        direction: directions.UPLINK,
        commands: [
            new uplinkCommands.GetVersionResponse({
                version: '104.25.003'
            })
        ],
        lrc: 0x65,
        crc: new Uint8Array([0x07, 0x4a]),
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
        name: 'SetAccessKeyResponse',
        hex: '0c 12 e5 f3 8e 60 03 20 e1 2d df 5b b5 dc e1 5e 78 52',
        frameHex: '7e 51 aa aa ff ff 0c 12 e5 f3 8e 60 03 20 e1 2d df 5b b5 dc e1 5e 78 52 a2 ac 7e',
        messageId: 12,
        accessLevel: uplinkCommands.SetAccessKeyResponse.accessLevel,
        direction: directions.UPLINK,
        commands: [
            new uplinkCommands.SetAccessKeyResponse()
        ],
        lrc: 0x4e,
        crc: new Uint8Array([0xa2, 0xac]),
        frameType: frameTypes.DATA_RESPONSE,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'SetCorrectDateTimeResponse',
        hex: '0c 12 14 dd 5a e1 9d b0 2f 3d d1 e0 53 b1 7e a3 4c 52',
        frameHex: '7e 51 aa aa ff ff 0c 12 14 dd 5a e1 9d b0 2f 3d d1 e0 53 b1 7d 5e a3 4c 52 76 8a 7e',
        messageId: 12,
        accessLevel: uplinkCommands.SetCorrectDateTimeResponse.accessLevel,
        direction: directions.UPLINK,
        commands: [
            new uplinkCommands.SetCorrectDateTimeResponse()
        ],
        lrc: 0x1b,
        crc: new Uint8Array([0x76, 0x8a]),
        frameType: frameTypes.DATA_RESPONSE,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'SetCorrectTimeResponse',
        hex: '0c 12 26 85 8e bd de 25 89 90 68 46 6d b8 60 1c fc 83',
        frameHex: '7e 51 aa aa ff ff 0c 12 26 85 8e bd de 25 89 90 68 46 6d b8 60 1c fc 83 f1 d6 7e',
        messageId: 12,
        accessLevel: uplinkCommands.SetCorrectTimeResponse.accessLevel,
        direction: directions.UPLINK,
        commands: [
            new uplinkCommands.SetCorrectTimeResponse()
        ],
        lrc: 0x5b,
        crc: new Uint8Array([0xf1, 0xd6]),
        frameType: frameTypes.DATA_RESPONSE,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'SetDateTimeResponse',
        hex: '0c 12 7d 7c c3 a1 f1 1d 18 e0 19 bf be af 01 63 da 9b',
        frameHex: '7e 51 aa aa ff ff 0c 12 7d 5d 7c c3 a1 f1 1d 18 e0 19 bf be af 01 63 da 9b 65 b1 7e',
        messageId: 12,
        accessLevel: uplinkCommands.SetDateTimeResponse.accessLevel,
        direction: directions.UPLINK,
        commands: [
            new uplinkCommands.SetDateTimeResponse()
        ],
        lrc: 0x4f,
        crc: new Uint8Array([0x65, 0xb1]),
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
        crc: new Uint8Array([0x7e, 0xd7]), // special case
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
        name: 'SetSaldoParametersResponse',
        hex: '0a 12 7b 8e 5b 7b 50 32 a8 b2 5b 46 69 04 a4 49 40 ff',
        frameHex: '7e 51 aa aa ff ff 0a 12 7b 8e 5b 7b 50 32 a8 b2 5b 46 69 04 a4 49 40 ff 84 a3 7e',
        messageId: 10,
        accessLevel: uplinkCommands.SetSaldoParametersResponse.accessLevel,
        direction: directions.UPLINK,
        commands: [
            new uplinkCommands.SetSaldoParametersResponse()
        ],
        lrc: 0x68,
        crc: new Uint8Array([0x84, 0xa3]),
        frameType: frameTypes.DATA_RESPONSE,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'SetSaldoResponse',
        hex: '0a 12 a0 c5 af e7 f5 1a b0 89 a8 71 8f a2 e8 60 d8 f5',
        frameHex: '7e 51 aa aa ff ff 0a 12 a0 c5 af e7 f5 1a b0 89 a8 71 8f a2 e8 60 d8 f5 2b 3e 7e',
        messageId: 10,
        accessLevel: uplinkCommands.SetSaldoResponse.accessLevel,
        direction: directions.UPLINK,
        commands: [
            new uplinkCommands.SetSaldoResponse()
        ],
        lrc: 0x6d,
        crc: new Uint8Array([0x2b, 0x3e]),
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
        name: 'GetSpecialDayResponse',
        hex: '0a 13 8e b0 81 8d 53 40 b4 1d 24 56 8e 0e 86 8c 89 8f',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 8e b0 81 8d 53 40 b4 1d 24 56 8e 0e 86 8c 89 8f 01 74 7e',
        messageId: 10,
        accessLevel: uplinkCommands.GetSpecialDayResponse.accessLevel,
        direction: directions.UPLINK,
        commands: [
            new uplinkCommands.GetSpecialDayResponse({
                month: 1,
                date: 9,
                dayIndex: 3,
                isPeriodic: true
            })
        ],
        lrc: 0x74,
        crc: new Uint8Array([0x01, 0x74]),
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
