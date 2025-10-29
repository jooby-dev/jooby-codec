/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import * as message from '../../src/mtx1/message/index.js';
import * as downlinkCommands from '../../src/mtx1/commands/downlink/index.js';
import * as uplinkCommands from '../../src/mtx1/commands/uplink/index.js';
import getHexFromBytes from '../../src/utils/getHexFromBytes.js';
import getBytesFromHex from '../../src/utils/getBytesFromHex.js';
import * as frame from '../../src/mtx1/utils/frame.js';
import * as accessLevels from '../../src/mtx1/constants/accessLevels.js';
import * as frameTypes from '../../src/mtx1/constants/frameTypes.js';
import {TBytes} from '../../src/types.js';


export interface IMessage {
    name: string,
    hex: string,
    frameHex: string,
    messageId: number,
    accessLevel: number,
    commands: any,
    lrc: number,
    frameType: number,
    source: number,
    destination: number,
    crc: number
}

export type TMessageList = Array<IMessage>;

export const aesKey = [...Array(16).keys()];

const downlinkMessages: TMessageList = [
    {
        name: 'activateRatePlan',
        hex: '10 12 3e 80 82 b2 b5 66 0c 08 4a 49 c2 50 0c 1e f8 19 92 f8 d0 25 88 de 70 d1 60 24 7c 53 4a 6b 64 d0',
        frameHex: '7e 50 a8 a9 f5 f6 10 12 3e 80 82 b2 b5 66 0c 08 4a 49 c2 50 0c 1e f8 19 92 f8 d0 25 88 de 70 d1 60 24 7c 53 4a 6b 64 d0 87 75 7e',
        messageId: 16,
        accessLevel: downlinkCommands.activateRatePlan.accessLevel,
        commands: [
            downlinkCommands.activateRatePlan.examples['set rate plan request']
        ],
        lrc: 0x50,
        crc: 0x7587,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xf5f6,
        destination: 0xa8a9
    },
    {
        name: 'getBv',
        hex: '0a 13 2e a2 48 fd 55 cd 7b a3 d0 b0 c5 3d 2b 18 05 29',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 2e a2 48 fd 55 cd 7b a3 d0 b0 c5 3d 2b 18 05 29 30 fc 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getBv.accessLevel,
        commands: [
            downlinkCommands.getBv.examples['simple request']
        ],
        lrc: 0x36,
        crc: 0xfc30,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getCorrectTime',
        hex: '0a 13 8d 17 1d ad d8 2f 50 e5 0f ca a3 20 8d 83 e8 4d',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 8d 17 1d ad d8 2f 50 e5 0f ca a3 20 8d 83 e8 4d 82 87 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getCorrectTime.accessLevel,
        commands: [
            downlinkCommands.getCorrectTime.examples['simple request']
        ],
        lrc: 0x78,
        crc: 0x8782,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getCurrentStatusMeter',
        hex: '0a 13 92 b4 f6 2d 89 83 5d 97 fa 3b ae fd 07 54 7e 39',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 92 b4 f6 2d 89 83 5d 97 fa 3b ae fd 07 54 7d 5e 39 8d 91 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getCurrentStatusMeter.accessLevel,
        commands: [
            downlinkCommands.getCurrentStatusMeter.examples['simple request']
        ],
        lrc: 0x7f,
        crc: 0x918d,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getCriticalEvent',
        hex: '0a 13 18 96 23 b6 1a 81 8a 3b a5 e5 64 91 90 72 56 06',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 18 96 23 b6 1a 81 8a 3b a5 e5 64 91 90 72 56 06 ba 41 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getCriticalEvent.accessLevel,
        commands: [
            downlinkCommands.getCriticalEvent.examples['simple request']
        ],
        lrc: 0x06,
        crc: 0x41ba,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getCurrentValues',
        hex: '0a 13 69 f4 c3 58 30 92 05 e8 22 ed 74 8c cb bc 53 b4',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 69 f4 c3 58 30 92 05 e8 22 ed 74 8c cb bc 53 b4 fe f9 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getCurrentValues.accessLevel,
        commands: [
            downlinkCommands.getCurrentValues.examples['simple request']
        ],
        lrc: 0x4b,
        crc: 0xf9fe,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getDateTime',
        hex: '0a 13 47 04 a6 e5 e6 37 01 ad 37 a5 d5 71 92 14 3c 52',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 47 04 a6 e5 e6 37 01 ad 37 a5 d5 71 92 14 3c 52 b8 6e 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getDateTime.accessLevel,
        commands: [
            downlinkCommands.getDateTime.examples['simple request']
        ],
        lrc: 0x41,
        crc: 0x6eb8,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getDayDemand',
        hex: '0a 13 68 a5 76 4f 3b ee b4 d7 2e 2a 7c f6 ee 41 92 06',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 68 a5 76 4f 3b ee b4 d7 2e 2a 7c f6 ee 41 92 06 a6 71 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getDayDemand.accessLevel,
        commands: [
            downlinkCommands.getDayDemand.examples['request day values for 2024.03.22 00:00:00 GMT'],
            downlinkCommands.getDayDemand.examples['request day values with energy type for 2024.03.22 00:00:00 GMT']
        ],
        lrc: 0x40,
        crc: 0x71a6,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        // does not exist in empro
        name: 'getDayDemandExport',
        hex: '0a 13 c7 fd 48 30 45 4e c9 52 a5 4f b7 7e 3e 3e 43 9e',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 c7 fd 48 30 45 4e c9 52 a5 4f b7 7d 5e 3e 3e 43 9e ca 69 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getDayDemandExport.accessLevel,
        commands: [
            downlinkCommands.getDayDemandExport.examples['request day values for 2024.03.22 00:00:00 GMT'],
            downlinkCommands.getDayDemandExport.examples['request day values with energy type for 2024.03.22 00:00:00 GMT']
        ],
        lrc: 0x40,
        crc: 0x69ca,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getDayMaxDemand',
        hex: '0a 13 6f bb 91 12 b6 71 1d b6 3f ce 9e 6d c4 a6 d9 2a',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 6f bb 91 12 b6 71 1d b6 3f ce 9e 6d c4 a6 d9 2a 7c a8 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getDayMaxDemand.accessLevel,
        commands: [
            downlinkCommands.getDayMaxDemand.examples['request for 2024.03.22']
        ],
        lrc: 0x79,
        crc: 0xa87c,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getDayMaxDemandExport',
        hex: '0a 13 70 80 47 e2 54 69 cc b3 99 64 ea 9d 29 ff 7f 21',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 70 80 47 e2 54 69 cc b3 99 64 ea 9d 29 ff 7f 21 0b fb 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getDayMaxDemandExport.accessLevel,
        commands: [
            downlinkCommands.getDayMaxDemandExport.examples['request for 2024.03.22']
        ],
        lrc: 0x10,
        crc: 0xfb0b,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getDayMaxDemandPrevious',
        hex: '0a 13 60 60 a6 9b f6 36 09 72 e9 94 74 60 4e ff af 58',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 60 60 a6 9b f6 36 09 72 e9 94 74 60 4e ff af 58 d7 d3 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getDayMaxDemandPrevious.accessLevel,
        commands: [
            downlinkCommands.getDayMaxDemandPrevious.examples['simple request']
        ],
        lrc: 0x0c,
        crc: 0xd3d7,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getDayProfile',
        hex: '0a 13 00 3f e4 e6 f8 7e 34 9d ba ee 69 dd 8a b9 32 78',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 00 3f e4 e6 f8 7d 5e 34 9d ba ee 69 dd 8a b9 32 78 e2 26 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getDayProfile.accessLevel,
        commands: [
            downlinkCommands.getDayProfile.examples['request for active tariff table A+']
        ],
        lrc: 0x7d,
        crc: 0x26e2,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getDemand',
        hex: '0a 13 cf 06 01 7f e7 3e fb 27 b8 51 15 87 89 f8 03 12',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 cf 06 01 7f e7 3e fb 27 b8 51 15 87 89 f8 03 12 fd 6a 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getDemand.accessLevel,
        commands: [
            downlinkCommands.getDemand.examples['request for A+']
        ],
        lrc: 0xd2,
        crc: 0x6afd,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getDemandParameters',
        hex: '0a 13 7f 75 5e 03 80 f0 ef 5b d8 ed f5 5e b1 87 e3 7c',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 7f 75 5e 03 80 f0 ef 5b d8 ed f5 5e b1 87 e3 7c cd 8f 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getDemandParameters.accessLevel,
        commands: [
            downlinkCommands.getDemandParameters.examples['simple request']
        ],
        lrc: 0x33,
        crc: 0x8fcd,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getDeviceId',
        hex: '0a 13 55 9e 05 01 4e 5c 2a 6c 0d 8a da 30 a7 4c 0f 86',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 55 9e 05 01 4e 5c 2a 6c 0d 8a da 30 a7 4c 0f 86 9c 30 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getDeviceId.accessLevel,
        commands: [
            downlinkCommands.getDeviceId.examples['simple request']
        ],
        lrc: 0x43,
        crc: 0x309c,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getDeviceType',
        hex: '0a 13 e2 47 89 5f 0c d5 5f 65 5b 08 bc a0 42 cc b0 1f',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 e2 47 89 5f 0c d5 5f 65 5b 08 bc a0 42 cc b0 1f cf 3a 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getDeviceType.accessLevel,
        commands: [
            downlinkCommands.getDeviceType.examples['simple request']
        ],
        lrc: 0x42,
        crc: 0x3acf,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getDisplayParam',
        hex: '0a 13 c2 58 80 dd 86 de 35 e8 a3 fc 04 c4 a5 b8 ce 4a',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 c2 58 80 dd 86 de 35 e8 a3 fc 04 c4 a5 b8 ce 4a ab 59 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getDisplayParam.accessLevel,
        commands: [
            downlinkCommands.getDisplayParam.examples['get additional display parameters']
        ],
        lrc: 0x18,
        crc: 0x59ab,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getEnergy',
        hex: '0a 13 bc 75 40 f0 ec 47 4e 8a 02 d2 23 6b 95 4d 78 40',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 bc 75 40 f0 ec 47 4e 8a 02 d2 23 6b 95 4d 78 40 68 85 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getEnergy.accessLevel,
        commands: [
            downlinkCommands.getEnergy.examples['get default A+ energy'],
            downlinkCommands.getEnergy.examples['get A- energy']
        ],
        lrc: 0x45,
        crc: 0x8568,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getEnergyDayPrevious',
        hex: '0a 13 cc 4b 4e f3 a2 5d e3 e4 05 cc ad 32 60 01 4a ad',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 cc 4b 4e f3 a2 5d e3 e4 05 cc ad 32 60 01 4a ad da a9 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getEnergyDayPrevious.accessLevel,
        commands: [
            downlinkCommands.getEnergyDayPrevious.examples['simple request']
        ],
        lrc: 0x45,
        crc: 0xa9da,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getEnergyExportDayPrevious',
        hex: '0a 13 94 f0 94 e7 49 bd a3 f3 39 3f 6f 65 b5 c9 ad 89',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 94 f0 94 e7 49 bd a3 f3 39 3f 6f 65 b5 c9 ad 89 60 45 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getEnergyExportDayPrevious.accessLevel,
        commands: [
            downlinkCommands.getEnergyExportDayPrevious.examples['simple request']
        ],
        lrc: 0x16,
        crc: 0x4560,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getEvents',
        hex: '0a 13 65 ac 46 61 64 80 2f 50 86 fb 27 52 67 6a f7 c2',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 65 ac 46 61 64 80 2f 50 86 fb 27 52 67 6a f7 c2 25 70 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getEvents.accessLevel,
        commands: [
            downlinkCommands.getEvents.examples['simple request']
        ],
        lrc: 0x70,
        crc: 0x7025,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getEventsCounters',
        hex: '0a 13 17 2c 12 33 90 5c f7 3d 1e c1 86 03 9c c8 a3 23',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 17 2c 12 33 90 5c f7 3d 1e c1 86 03 9c c8 a3 23 e1 1e 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getEventsCounters.accessLevel,
        commands: [
            downlinkCommands.getEventsCounters.examples['simple request']
        ],
        lrc: 0x72,
        crc: 0x1ee1,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getEventStatus',
        hex: '0a 13 85 db fe 1a eb 10 1c 70 06 08 c4 81 c3 45 da 8e',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 85 db fe 1a eb 10 1c 70 06 08 c4 81 c3 45 da 8e 0b 9a 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getEventStatus.accessLevel,
        commands: [
            downlinkCommands.getEventStatus.examples['simple request']
        ],
        lrc: 0x47,
        crc: 0x9a0b,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getExtendedCurrentValues',
        hex: '0a 13 c9 81 8b ba b3 62 84 1e eb 65 90 be c6 ef 64 8d',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 c9 81 8b ba b3 62 84 1e eb 65 90 be c6 ef 64 8d 3c 6a 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getExtendedCurrentValues.accessLevel,
        commands: [
            downlinkCommands.getExtendedCurrentValues.examples['simple request']
        ],
        lrc: 0x7c,
        crc: 0x6a3c,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getExtendedCurrentValues2',
        hex: '0a 13 ee 29 43 03 e5 c9 69 c4 97 e1 e4 8d 31 60 a4 08',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 ee 29 43 03 e5 c9 69 c4 97 e1 e4 8d 31 60 a4 08 cc 46 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getExtendedCurrentValues2.accessLevel,
        commands: [
            downlinkCommands.getExtendedCurrentValues2.examples['simple request']
        ],
        lrc: 0x6b,
        crc: 0x46cc,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getHalfHourDemand',
        hex: '0a 13 8a 7d e8 d9 ef 2f ff 39 65 7f 17 96 27 8e e2 04',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 8a 7d 5d e8 d9 ef 2f ff 39 65 7f 17 96 27 8e e2 04 4e 40 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getHalfHourDemand.accessLevel,
        commands: [
            downlinkCommands.getHalfHourDemand.examples['request archive values for 2024.03.22']
        ],
        lrc: 0x5d,
        crc: 0x404e,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        // does not exist in empro
        name: 'getHalfHourDemandExport',
        hex: '0a 13 85 8b 32 32 cd e4 66 67 2b a8 64 6b b1 34 bb f3',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 85 8b 32 32 cd e4 66 67 2b a8 64 6b b1 34 bb f3 6d 37 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getHalfHourDemandExport.accessLevel,
        commands: [
            downlinkCommands.getHalfHourDemandExport.examples['request archive values for 2024.03.22']
        ],
        lrc: 0x1b,
        crc: 0x376d,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getHalfHourDemandPrevious',
        hex: '0a 13 7a cf f2 19 4d 9b 5c 25 b8 6b 13 47 f4 94 40 92',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 7a cf f2 19 4d 9b 5c 25 b8 6b 7d 33 47 f4 94 40 92 f8 7d 33 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getHalfHourDemandPrevious.accessLevel,
        commands: [
            downlinkCommands.getHalfHourDemandPrevious.examples['simple request']
        ],
        lrc: 0x0d,
        crc: 0x13f8,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        // does not match empro
        name: 'getHalfHourEnergies',
        hex: '0a 10 10 6f 05 2a 43 03 05 03 00 43',
        frameHex: '7e 50 aa aa ff ff 0a 10 10 6f 05 2a 43 03 05 03 00 43 cc fe 7e', // is not used
        messageId: 10,
        accessLevel: downlinkCommands.getHalfHourEnergies.accessLevel,
        commands: [
            downlinkCommands.getHalfHourEnergies.examples['request for halfhours energies']
        ],
        lrc: 0x43,
        crc: 0xfecc,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getMagneticFieldThreshold',
        hex: '0a 13 6f 52 7f 83 e7 39 0f b6 69 03 0b c3 36 45 0f d3',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 6f 52 7f 83 e7 39 0f b6 69 03 0b c3 36 45 0f d3 03 21 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getMagneticFieldThreshold.accessLevel,
        commands: [
            downlinkCommands.getMagneticFieldThreshold.examples['simple request']
        ],
        lrc: 0x2b,
        crc: 0x2103,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        // does not exist in empro
        name: 'getMeterInfo',
        hex: '0a 13 a0 d0 e1 0f 40 49 06 36 39 90 41 40 7b 9e 96 8c',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 a0 d0 e1 0f 40 49 06 36 39 90 41 40 7b 9e 96 8c e3 0c 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getMeterInfo.accessLevel,
        commands: [
            downlinkCommands.getMeterInfo.examples['simple request']
        ],
        lrc: 0x3c,
        crc: 0x0ce3,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getMonthDemand',
        hex: '0a 13 9a 6f bb b5 98 1e 40 eb c5 11 13 19 36 c6 68 b6',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 9a 6f bb b5 98 1e 40 eb c5 7d 31 7d 33 19 36 c6 68 b6 3c 65 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getMonthDemand.accessLevel,
        commands: [
            downlinkCommands.getMonthDemand.examples['request energy for 2024.03']
        ],
        lrc: 0x48,
        crc: 0x653c,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        // does not exist in empro
        name: 'getMonthDemandExport',
        hex: '0a 13 11 94 89 49 57 81 98 99 73 2f db f7 f8 47 ab 28',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 7d 31 94 89 49 57 81 98 99 73 2f db f7 f8 47 ab 28 86 5c 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getMonthDemandExport.accessLevel,
        commands: [
            downlinkCommands.getMonthDemandExport.examples['request energy for 2024.03']
        ],
        lrc: 0x0d,
        crc: 0x5c86,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getMonthMaxDemand',
        hex: '0a 13 ea f0 38 3c 0b b6 3d 7d 0e 3e 20 83 96 09 6e f9',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 ea f0 38 3c 0b b6 3d 7d 5d 0e 3e 20 83 96 09 6e f9 d0 bd 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getMonthMaxDemand.accessLevel,
        commands: [
            downlinkCommands.getMonthMaxDemand.examples['request max power for 2024.03']
        ],
        lrc: 0x6d,
        crc: 0xbdd0,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getMonthMaxDemandExport',
        hex: '0a 13 25 84 0d df c3 16 28 64 68 03 b3 d5 dd a9 92 c2',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 25 84 0d df c3 16 28 64 68 03 b3 d5 dd a9 92 c2 d3 e1 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getMonthMaxDemandExport.accessLevel,
        commands: [
            downlinkCommands.getMonthMaxDemandExport.examples['request max power for 2024.03']
        ],
        lrc: 0x06,
        crc: 0xe1d3,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getOperatorParametersExtended3',
        hex: '0a 13 0d ff f3 10 14 71 c0 b0 25 26 c1 72 a2 82 7e 63',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 0d ff f3 10 14 71 c0 b0 25 26 c1 72 a2 82 7d 5e 63 1f 98 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getOperatorParametersExtended3.accessLevel,
        commands: [
            downlinkCommands.getOperatorParametersExtended3.examples['simple request']
        ],
        lrc: 0x37,
        crc: 0x981f,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getOperatorParameters',
        hex: '0a 13 d4 ec 1c a5 2c a6 46 26 f1 6f 4a 48 aa a1 83 22',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 d4 ec 1c a5 2c a6 46 26 f1 6f 4a 48 aa a1 83 22 a0 c6 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getOperatorParameters.accessLevel,
        commands: [
            downlinkCommands.getOperatorParameters.examples['simple request']
        ],
        lrc: 0x58,
        crc: 0xc6a0,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getRatePlanInfo',
        hex: '0a 13 ac 04 ff dd 6b f6 1c 2d 06 d8 c3 11 f6 5e 4b 97',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 ac 04 ff dd 6b f6 1c 2d 06 d8 c3 7d 31 f6 5e 4b 97 51 4c 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getRatePlanInfo.accessLevel,
        commands: [
            downlinkCommands.getRatePlanInfo.examples['request for table A-']
        ],
        lrc: 0x6a,
        crc: 0x4c51,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getSaldo',
        hex: '0a 13 c4 63 dc 84 55 42 73 2d f9 a4 59 86 a8 46 9c 66',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 c4 63 dc 84 55 42 73 2d f9 a4 59 86 a8 46 9c 66 39 12 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getSaldo.accessLevel,
        commands: [
            downlinkCommands.getSaldo.examples['simple request']
        ],
        lrc: 0x6f,
        crc: 0x1239,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getSaldoParameters',
        hex: '0a 13 2f a5 23 de 3c bf bb 0d 6b f1 1f db 52 05 b4 ba',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 2f a5 23 de 3c bf bb 0d 6b f1 1f db 52 05 b4 ba 04 57 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getSaldoParameters.accessLevel,
        commands: [
            downlinkCommands.getSaldoParameters.examples['simple request']
        ],
        lrc: 0x68,
        crc: 0x5704,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getSeasonProfile',
        hex: '0a 13 00 d0 7e e7 8d eb 4c 39 05 4d 75 aa cf fd 4f 77',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 00 d0 7d 5e e7 8d eb 4c 39 05 4d 75 aa cf fd 4f 77 aa 4b 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getSeasonProfile.accessLevel,
        commands: [
            downlinkCommands.getSeasonProfile.examples['request for passive tariff table A+']
        ],
        lrc: 0x7d,
        crc: 0x4baa,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getSpecialDay',
        hex: '0a 13 51 32 8d fe 15 42 ae 8b 62 d3 c6 72 12 b4 90 09',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 51 32 8d fe 15 42 ae 8b 62 d3 c6 72 12 b4 90 09 57 8a 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getSpecialDay.accessLevel,
        commands: [
            downlinkCommands.getSpecialDay.examples['request for passive tariff table A+']
        ],
        lrc: 0x7c,
        crc: 0x8a57,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getVersion',
        hex: '0a 13 a8 5e b1 b5 57 0a b9 f2 27 3e 27 47 88 bc d3 83',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 a8 5e b1 b5 57 0a b9 f2 27 3e 27 47 88 bc d3 83 ee 5b 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getVersion.accessLevel,
        commands: [
            downlinkCommands.getVersion.examples['simple request']
        ],
        lrc: 0x6e,
        crc: 0x5bee,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'prepareRatePlan',
        hex: '0a 12 de 91 0a aa 47 cd 42 c6 e1 05 ff 7e ca 61 55 97',
        frameHex: '7e 50 aa aa ff ff 0a 12 de 91 0a aa 47 cd 42 c6 e1 05 ff 7d 5e ca 61 55 97 55 96 7e',
        messageId: 10,
        accessLevel: downlinkCommands.prepareRatePlan.accessLevel,
        commands: [
            downlinkCommands.prepareRatePlan.examples['prepare rate plan request']
        ],
        lrc: 0x6b,
        crc: 0x9655,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'resetPowerMaxDay',
        hex: '0a 12 f8 8e 7f 8c 99 33 e9 ba e1 e7 4a aa 81 fe 9f ab',
        frameHex: '7e 50 aa aa ff ff 0a 12 f8 8e 7f 8c 99 33 e9 ba e1 e7 4a aa 81 fe 9f ab 23 e6 7e',
        messageId: 10,
        accessLevel: downlinkCommands.resetPowerMaxDay.accessLevel,
        commands: [
            downlinkCommands.resetPowerMaxDay.examples['simple request']
        ],
        lrc: 0x72,
        crc: 0xe623,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'resetPowerMaxMonth',
        hex: '0a 12 a5 a2 26 c1 8f e8 1a aa 33 20 44 3e 67 53 23 99',
        frameHex: '7e 50 aa aa ff ff 0a 12 a5 a2 26 c1 8f e8 1a aa 33 20 44 3e 67 53 23 99 9b ee 7e',
        messageId: 10,
        accessLevel: downlinkCommands.resetPowerMaxMonth.accessLevel,
        commands: [
            downlinkCommands.resetPowerMaxMonth.examples['simple request']
        ],
        lrc: 0x71,
        crc: 0xee9b,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'runTariffPlan',
        hex: '0a 12 db a4 0e 02 c2 83 a4 6d 3d 1c 74 1d bd d2 1c ca',
        frameHex: '7e 50 aa aa ff ff 0a 12 db a4 0e 02 c2 83 a4 6d 3d 1c 74 1d bd d2 1c ca f5 4b 7e',
        messageId: 10,
        accessLevel: downlinkCommands.runTariffPlan.accessLevel,
        commands: [
            downlinkCommands.runTariffPlan.examples['simple request']
        ],
        lrc: 0x05,
        crc: 0x4bf5,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'setAccessKey',
        hex: '0a 12 f1 b6 e0 a9 84 51 a5 08 c7 b0 3b 82 6c 0b b1 a4 f3 45 64 f3 06 94 d4 a9 93 e3 ea 2c 8a 9b bc 8a',
        frameHex: '7e 50 aa aa ff ff 0a 12 f1 b6 e0 a9 84 51 a5 08 c7 b0 3b 82 6c 0b b1 a4 f3 45 64 f3 06 94 d4 a9 93 e3 ea 2c 8a 9b bc 8a d2 28 7e',
        messageId: 10,
        accessLevel: downlinkCommands.setAccessKey.accessLevel,
        commands: [
            downlinkCommands.setAccessKey.examples['set key for READ_ONLY access level']
        ],
        lrc: 0x5c,
        crc: 0x28d2,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'setCorrectDateTime',
        hex: '0a 13 0e e0 63 a0 22 32 1c e0 84 dd 9e f7 da 78 55 77',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 0e e0 63 a0 22 32 1c e0 84 dd 9e f7 da 78 55 77 40 8e 7e',
        messageId: 10,
        accessLevel: downlinkCommands.setCorrectDateTime.accessLevel,
        commands: [
            downlinkCommands.setCorrectDateTime.examples['shift device time 5 seconds backward']
        ],
        lrc: 0x1c,
        crc: 0x8e40,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'setCorrectTime',
        hex: '0a 12 9a 60 72 38 6a b3 c9 49 2f 6b 3d 32 4f 7f 7c 75',
        frameHex: '7e 50 aa aa ff ff 0a 12 9a 60 72 38 6a b3 c9 49 2f 6b 3d 32 4f 7f 7c 75 85 db 7e',
        messageId: 10,
        accessLevel: downlinkCommands.setCorrectTime.accessLevel,
        commands: [
            downlinkCommands.setCorrectTime.examples['default parameters']
        ],
        lrc: 0x5d,
        crc: 0xdb85,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'setDateTime',
        hex: '0a 13 ed 74 0a ae 4a ba c8 42 c4 1b e7 f5 0d 3c 28 84',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 ed 74 0a ae 4a ba c8 42 c4 1b e7 f5 0d 3c 28 84 61 bb 7e',
        messageId: 10,
        accessLevel: downlinkCommands.setDateTime.accessLevel,
        commands: [
            downlinkCommands.setDateTime.examples['time: 2024.02.19 18:31:55']
        ],
        lrc: 0x77,
        crc: 0xbb61,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'setDayProfile (4 periods)',
        hex: '0a 12 4f e8 4c 59 76 3d b5 fb dd dd 6d f3 8d 0b 69 b8',
        frameHex: '7e 50 aa aa ff ff 0a 12 4f e8 4c 59 76 3d b5 fb dd dd 6d f3 8d 0b 69 b8 92 76 7e',
        messageId: 10,
        accessLevel: downlinkCommands.setDayProfile.accessLevel,
        commands: [
            downlinkCommands.setDayProfile.examples['set day profile with 4 periods']
        ],
        lrc: 0xaa,
        crc: 0x7692,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'setDayProfile (max periods)',
        hex: '0a 12 6d 4b 7a 82 06 2a de a1 79 ff 49 9b a9 c4 cc b4',
        frameHex: '7e 50 aa aa ff ff 0a 12 6d 4b 7a 82 06 2a de a1 79 ff 49 9b a9 c4 cc b4 49 70 7e',
        messageId: 10,
        accessLevel: downlinkCommands.setDayProfile.accessLevel,
        commands: [
            downlinkCommands.setDayProfile.examples['set day profile with max periods']
        ],
        lrc: 0x5e,
        crc: 0x7049,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'setDemandParameters',
        hex: '0a 12 4b 23 7c db f7 26 90 be cb 72 9d e5 92 74 b9 06',
        frameHex: '7e 50 aa aa ff ff 0a 12 4b 23 7c db f7 26 90 be cb 72 9d e5 92 74 b9 06 46 3c 7e',
        messageId: 10,
        accessLevel: downlinkCommands.setDemandParameters.accessLevel,
        commands: [
            downlinkCommands.setDemandParameters.examples['simple request']
        ],
        lrc: 0x83,
        crc: 0x3c46,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'setDisplayParam',
        hex: '0a 12 a2 d2 eb 6b 01 e2 a3 41 9f 9d 56 e5 ff 83 e2 d8',
        frameHex: '7e 50 aa aa ff ff 0a 12 a2 d2 eb 6b 01 e2 a3 41 9f 9d 56 e5 ff 83 e2 d8 62 45 7e',
        messageId: 10,
        accessLevel: downlinkCommands.setDisplayParam.accessLevel,
        commands: [
            downlinkCommands.setDisplayParam.examples['set params with order']
        ],
        lrc: 0x1f,
        crc: 0x4562,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'setOperatorParametersExtended3',
        hex: '0a 12 86 bb 64 fc 64 6e 2f 3c 76 db 6b d7 35 9b f6 02 92 37 b0 e8 d8 2c 12 a0 ef 3a 57 9a 17 2e 07 35',
        frameHex: '7e 50 aa aa ff ff 0a 12 86 bb 64 fc 64 6e 2f 3c 76 db 6b d7 35 9b f6 02 92 37 b0 e8 d8 2c 12 a0 ef 3a 57 9a 17 2e 07 35 bc f7 7e',
        messageId: 10,
        accessLevel: downlinkCommands.setOperatorParametersExtended3.accessLevel,
        commands: [
            downlinkCommands.setOperatorParametersExtended3.examples['simple request']
        ],
        lrc: 0x1c,
        crc: 0xf7bc,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'setOperatorParameters',
        hex: '0a 12 f7 fe 51 bb e6 91 41 38 dd 6d 37 e4 87 cc 4c b4 22 0c 2e 12 c7 73 f8 23 b3 51 c2 f7 7d a9 56 76 e3 b3 49 b4 57 6c fc 89 a4 30 2e cf d8 6c ff c1 84 7b 8e a0 a9 65 a6 10 9f e9 31 2c 33 80 ad 22 08 af 02 26 40 ae e6 68 3e 6f f8 ee 4d 04 b0 75',
        frameHex: '7e 50 aa aa ff ff 0a 12 f7 fe 51 bb e6 91 41 38 dd 6d 37 e4 87 cc 4c b4 22 0c 2e 12 c7 73 f8 23 b3 51 c2 f7 7d 5d a9 56 76 e3 b3 49 b4 57 6c fc 89 a4 30 2e cf d8 6c ff c1 84 7b 8e a0 a9 65 a6 10 9f e9 31 2c 33 80 ad 22 08 af 02 26 40 ae e6 68 3e 6f f8 ee 4d 04 b0 75 36 b9 7e',
        messageId: 10,
        accessLevel: downlinkCommands.setOperatorParameters.accessLevel,
        commands: [
            downlinkCommands.setOperatorParameters.examples['set default operator parameters request']
        ],
        lrc: 0x7b,
        crc: 0xb936,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'setSaldo',
        hex: '0a 12 84 7a 49 26 56 ad 85 d8 fb ce 99 fb e8 09 62 92 14 37 ef 69 d6 c4 3e e6 00 9a b5 21 fc 27 2b c2',
        frameHex: '7e 50 aa aa ff ff 0a 12 84 7a 49 26 56 ad 85 d8 fb ce 99 fb e8 09 62 92 14 37 ef 69 d6 c4 3e e6 00 9a b5 21 fc 27 2b c2 ab 08 7e',
        messageId: 10,
        accessLevel: downlinkCommands.setSaldo.accessLevel,
        commands: [
            downlinkCommands.setSaldo.examples['test request']
        ],
        lrc: 0x5d,
        crc: 0x08ab,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'setSaldoParameters',
        hex: '0a 12 0d fe 89 57 38 c7 9b 7b 77 14 bd 8b 9e f3 eb 44 1b 2e f6 c5 32 4d 34 24 14 15 55 c8 0f 13 cf bc 67 15 9e 5a 97 29 dc 1a 47 86 95 29 61 8d 58 ca',
        frameHex: '7e 50 aa aa ff ff 0a 12 0d fe 89 57 38 c7 9b 7b 77 14 bd 8b 9e f3 eb 44 1b 2e f6 c5 32 4d 34 24 14 15 55 c8 0f 7d 33 cf bc 67 15 9e 5a 97 29 dc 1a 47 86 95 29 61 8d 58 ca a8 9f 7e',
        messageId: 10,
        accessLevel: downlinkCommands.setSaldoParameters.accessLevel,
        commands: [
            downlinkCommands.setSaldoParameters.examples['test parameters']
        ],
        lrc: 0x43,
        crc: 0x9fa8,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'setSeasonProfile (default)',
        hex: '0a 12 93 31 26 0c b6 37 9b d4 7a 77 9c 82 9c 73 71 eb',
        frameHex: '7e 50 aa aa ff ff 0a 12 93 31 26 0c b6 37 9b d4 7a 77 9c 82 9c 73 71 eb fd eb 7e',
        messageId: 10,
        accessLevel: downlinkCommands.setSeasonProfile.accessLevel,
        commands: [
            downlinkCommands.setSeasonProfile.examples['set default season profile']
        ],
        lrc: 0x54,
        crc: 0xebfd,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'setSeasonProfile',
        hex: '0a 12 20 20 65 6d 84 7d 8d 08 fa d6 da c7 ed 73 6a 79',
        frameHex: '7e 50 aa aa ff ff 0a 12 20 20 65 6d 84 7d 5d 8d 08 fa d6 da c7 ed 73 6a 79 fa cb 7e',
        messageId: 10,
        accessLevel: downlinkCommands.setSeasonProfile.accessLevel,
        commands: [
            downlinkCommands.setSeasonProfile.examples['set some season profile']
        ],
        lrc: 0x54,
        crc: 0xcbfa,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'setSpecialDay',
        hex: '0a 12 4c 2a 8a fc f5 5e b0 15 08 94 35 d1 2a 03 54 32',
        frameHex: '7e 50 aa aa ff ff 0a 12 4c 2a 8a fc f5 5e b0 15 08 94 35 d1 2a 03 54 32 55 f4 7e',
        messageId: 10,
        accessLevel: downlinkCommands.setSpecialDay.accessLevel,
        commands: [
            downlinkCommands.setSpecialDay.examples['set special day']
        ],
        lrc: 0x5c,
        crc: 0xf455,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'setSpecialOperation',
        hex: '0a 12 23 01 38 8e 26 57 98 ba 4a e5 07 9e ed 60 18 a5',
        frameHex: '7e 50 aa aa ff ff 0a 12 23 01 38 8e 26 57 98 ba 4a e5 07 9e ed 60 18 a5 94 6f 7e',
        messageId: 10,
        accessLevel: downlinkCommands.setSpecialOperation.accessLevel,
        commands: [
            downlinkCommands.setSpecialOperation.examples['read screens info']
        ],
        lrc: 0xf4,
        crc: 0x6f94,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'turnRelayOff',
        hex: '0a 12 9d 81 66 34 ec 71 c4 62 af 9f 69 f6 c9 eb e8 08',
        frameHex: '7e 50 aa aa ff ff 0a 12 9d 81 66 34 ec 71 c4 62 af 9f 69 f6 c9 eb e8 08 cb 7f 7e',
        messageId: 10,
        accessLevel: downlinkCommands.turnRelayOff.accessLevel,
        commands: [
            downlinkCommands.turnRelayOff.examples['simple request']
        ],
        lrc: 0x5e,
        crc: 0x7fcb,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'turnRelayOn',
        hex: '0a 12 0d 8d 21 54 75 8a 37 a0 21 fa cd a3 c3 f2 00 4b',
        frameHex: '7e 50 aa aa ff ff 0a 12 0d 8d 21 54 75 8a 37 a0 21 fa cd a3 c3 f2 00 4b d2 62 7e',
        messageId: 10,
        accessLevel: downlinkCommands.turnRelayOn.accessLevel,
        commands: [
            downlinkCommands.turnRelayOn.examples['simple request']
        ],
        lrc: 0x5f,
        crc: 0x62d2,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'two read-only encrypted commands',
        hex: '0a 13 66 82 dd f1 e5 58 9b 25 8f c4 dc 28 fc 87 ed 14',
        frameHex: '7e 50 a1 a1 f1 f1 0a 7d 33 66 82 dd f1 e5 58 9b 25 8f c4 dc 28 fc 87 ed 14 62 d8 7e',
        messageId: 10,
        accessLevel: accessLevels.READ_ONLY,
        commands: [
            downlinkCommands.turnRelayOn.examples['simple request'],
            downlinkCommands.turnRelayOff.examples['simple request']
        ],
        lrc: 0x47,
        crc: 0xd862,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xf1f1,
        destination: 0xa1a1
    },
    {
        name: 'many read-only encrypted commands',
        hex: '0a 13 40 3c 61 2c e6 56 3e d5 b8 f1 26 62 2a a7 e1 66 be 89 ba 1c 74 fa 1d 50 af eb 39 5f fe 24 27 bd',
        frameHex: '7e 50 a1 a1 f1 f1 0a 7d 33 40 3c 61 2c e6 56 3e d5 b8 f1 26 62 2a a7 e1 66 be 89 ba 1c 74 fa 1d 50 af eb 39 5f fe 24 27 bd fc 35 7e',
        messageId: 10,
        accessLevel: accessLevels.READ_ONLY,
        commands: [
            downlinkCommands.turnRelayOn.examples['simple request'],
            downlinkCommands.turnRelayOn.examples['simple request'],
            downlinkCommands.turnRelayOn.examples['simple request'],
            downlinkCommands.turnRelayOn.examples['simple request'],
            downlinkCommands.turnRelayOn.examples['simple request'],
            downlinkCommands.turnRelayOn.examples['simple request'],
            downlinkCommands.turnRelayOn.examples['simple request']
        ],
        lrc: 0x5e,
        crc: 0x35fc,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xf1f1,
        destination: 0xa1a1
    },
    {
        name: 'one unencrypted command',
        hex: '0b 10 10 18 00 00 5d',
        frameHex: '7e 50 a2 a3 f2 f3 0b 10 10 18 00 00 5d 3c d4 7e',
        messageId: 11,
        accessLevel: accessLevels.UNENCRYPTED,
        commands: [
            downlinkCommands.turnRelayOn.examples['simple request']
        ],
        lrc: 0x5d,
        crc: 0xd43c,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xf2f3,
        destination: 0xa2a3
    },
    {
        name: 'two unencrypted commands',
        hex: '0b 10 10 18 00 19 00 00 44',
        frameHex: '7e 50 a3 a4 f3 f4 0b 10 10 18 00 19 00 00 44 c3 d4 7e',
        messageId: 11,
        accessLevel: accessLevels.UNENCRYPTED,
        commands: [
            downlinkCommands.turnRelayOn.examples['simple request'],
            downlinkCommands.turnRelayOff.examples['simple request']
        ],
        lrc: 0x44,
        crc: 0xd4c3,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xf3f4,
        destination: 0xa3a4
    }
];

const uplinkMessages: TMessageList = [
    {
        name: 'activateRatePlan',
        hex: '0a 12 83 4d 1e ca 77 1e 00 b9 75 de b3 41 63 bd 47 68',
        frameHex: '7e 51 aa aa ff ff 0a 12 83 4d 1e ca 77 1e 00 b9 75 de b3 41 63 bd 47 68 33 9c 7e',
        messageId: 10,
        accessLevel: uplinkCommands.activateRatePlan.accessLevel,
        commands: [
            uplinkCommands.activateRatePlan.examples['simple response']
        ],
        lrc: 0x54,
        crc: 0x9c33,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'errorResponse',
        hex: '0a 13 b5 c2 74 9b cb c7 60 a7 7a 65 1e 74 b5 5a b9 9e',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 b5 c2 74 9b cb c7 60 a7 7a 65 1e 74 b5 5a b9 9e a8 1f 7e',
        messageId: 10,
        accessLevel: uplinkCommands.errorResponse.accessLevel,
        commands: [
            uplinkCommands.errorResponse.examples['ACCESS_DENIED on TurnRelayOn command']
        ],
        lrc: 0x31,
        crc: 0x1fa8,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getBv',
        hex: '0a 13 9b 4b f7 2a d1 e5 49 a5 09 50 9a 59 7e c2 b5 88',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 9b 4b f7 2a d1 e5 49 a5 09 50 9a 59 7d 5e c2 b5 88 21 54 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getBv.accessLevel,
        commands: [
            uplinkCommands.getBv.examples.test
        ],
        lrc: 0x35,
        crc: 0x5421,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getCorrectTime',
        hex: '0a 13 d4 93 ea 6a b2 92 f9 a6 23 76 16 fc 12 38 9f b6',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 d4 93 ea 6a b2 92 f9 a6 23 76 16 fc 12 38 9f b6 cc 0b 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getCorrectTime.accessLevel,
        commands: [
            uplinkCommands.getCorrectTime.examples['default parameters']
        ],
        lrc: 0x7e,
        crc: 0x0bcc,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        // does not match empro
        name: 'getCurrentStatusMeter',
        hex: '0a 13 40 e0 9b 9f 16 0d 09 5a ea 26 7f 6e 04 76 45 8d 8a db 48 03 11 77 14 eb 80 ad 69 4d d9 a3 b1 07 53 d3 30 df 79 0b d4 38 fc 0a 1c 54 ae 16 d2 c6',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 40 e0 9b 9f 16 0d 09 5a ea 26 7f 6e 04 76 45 8d 8a db 48 03 7d 31 77 14 eb 80 ad 69 4d d9 a3 b1 07 53 d3 30 df 79 0b d4 38 fc 0a 1c 54 ae 16 d2 c6 fb 10 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getCurrentStatusMeter.accessLevel,
        commands: [
            uplinkCommands.getCurrentStatusMeter.examples['simple response']
        ],
        lrc: 0x24,
        crc: 0x10fb,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getCriticalEvent',
        hex: '0a 13 98 c7 84 47 f3 5e de 28 e4 8e 6b 9d 55 da 6a 08',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 98 c7 84 47 f3 5e de 28 e4 8e 6b 9d 55 da 6a 08 5d e2 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getCriticalEvent.accessLevel,
        commands: [
            uplinkCommands.getCriticalEvent.examples['simple response']
        ],
        lrc: 0x2c,
        crc: 0xe25d,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        // does not match empro
        name: 'getCurrentValues',
        hex: '0a 13 7a ee 80 2a 01 36 e8 77 fb 57 cc d9 ba ca 1a af 2d ea 9e 82 20 2b ef 79 e7 a7 be 02 fe 91 37 31 49 41 5f 97 03 1a 28 82 64 81 00 8b e0 19 48 47',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 7a ee 80 2a 01 36 e8 77 fb 57 cc d9 ba ca 1a af 2d ea 9e 82 20 2b ef 79 e7 a7 be 02 fe 91 37 31 49 41 5f 97 03 1a 28 82 64 81 00 8b e0 19 48 47 15 3d 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getCurrentValues.accessLevel,
        commands: [
            uplinkCommands.getCurrentValues.examples['simple response']
        ],
        lrc: 0x06,
        crc: 0x3d15,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getDateTime',
        hex: '0a 13 cb eb 68 e4 a3 14 a6 b1 3a c3 91 2c b3 f3 7f 4f',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 cb eb 68 e4 a3 14 a6 b1 3a c3 91 2c b3 f3 7f 4f d4 80 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getDateTime.accessLevel,
        commands: [
            uplinkCommands.getDateTime.examples['time: 2024.02.19 18:31:55']
        ],
        lrc: 0x78,
        crc: 0x80d4,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getDayDemand',
        hex: '0a 13 a7 eb 54 fe 39 2b ea 0f 3c c9 d3 aa d1 a6 83 ec cd 90 46 f0 92 c2 93 14 8e ab ef 3d 4d 0b a3 b7',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 a7 eb 54 fe 39 2b ea 0f 3c c9 d3 aa d1 a6 83 ec cd 90 46 f0 92 c2 93 14 8e ab ef 3d 4d 0b a3 b7 06 6d 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getDayDemand.accessLevel,
        commands: [
            uplinkCommands.getDayDemand.examples['default A+ energy']
        ],
        lrc: 0x1e,
        crc: 0x6d06,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        // does not exist in empro
        name: 'getDayDemandExport',
        hex: '0a 13 d7 60 08 96 88 4f 56 b0 3a ad bc 4b 83 52 b7 cc 0c 87 93 84 6a b1 84 78 dc 8e 3a 68 db f7 95 36 d8 ae ce 0b 9d ff 64 82 30 2f 3d 81 d9 c7 28 3d',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 d7 60 08 96 88 4f 56 b0 3a ad bc 4b 83 52 b7 cc 0c 87 93 84 6a b1 84 78 dc 8e 3a 68 db f7 95 36 d8 ae ce 0b 9d ff 64 82 30 2f 3d 81 d9 c7 28 3d 4a 15 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getDayDemandExport.accessLevel,
        commands: [
            uplinkCommands.getDayDemandExport.examples['default A- energy'],
            uplinkCommands.getDayDemandExport.examples['received A+ energies']
        ],
        lrc: 0x22,
        crc: 0x154a,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getDayEnergies',
        hex: '0a 10 10 78 0c 2a 43 11 22 00 00 10 00 00 00 20 00 00 5b',
        frameHex: '7e 51 aa aa ff ff 0a 10 10 78 0c 2a 43 7d 31 22 00 00 10 00 00 00 20 00 00 5b 1d 22 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getDayEnergies.accessLevel,
        commands: [
            uplinkCommands.getDayEnergies.examples['get day energies']
        ],
        lrc: 0x5b,
        crc: 0x221d,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getDayMaxDemand',
        hex: '0a 13 f2 c4 07 c3 2e 52 c6 5c bc ee be d4 79 68 15 ee 78 49 7d 33 8a 26 6f 16 02 5f 13 58 5d a3 da 8b',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 f2 c4 07 c3 2e 52 c6 5c bc ee be d4 79 68 15 ee 78 49 7d 5d 33 8a 26 6f 16 02 5f 7d 33 58 5d a3 da 8b 60 da 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getDayMaxDemand.accessLevel,
        commands: [
            uplinkCommands.getDayMaxDemand.examples['response for 2023.03.12']
        ],
        lrc: 0x1c,
        crc: 0xda60,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getDayMaxDemandExport',
        hex: '0a 13 06 50 15 9c 89 bb 12 a8 e8 c6 3e cd a4 bd a3 62 c5 31 cb 4a 3b d9 fe 22 ee 50 15 c6 23 f7 1d fb',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 06 50 15 9c 89 bb 12 a8 e8 c6 3e cd a4 bd a3 62 c5 31 cb 4a 3b d9 fe 22 ee 50 15 c6 23 f7 1d fb e8 fe 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getDayMaxDemandExport.accessLevel,
        commands: [
            uplinkCommands.getDayMaxDemandExport.examples['response for 2023.03.12']
        ],
        lrc: 0x75,
        crc: 0xfee8,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getDayMaxDemandPrevious',
        hex: '0a 13 c9 aa a3 be be 34 65 1d cb e5 d4 07 99 5b e2 5c 24 51 c8 e3 43 de 82 05 a7 9a 0d b8 f0 df b0 0b',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 c9 aa a3 be be 34 65 1d cb e5 d4 07 99 5b e2 5c 24 51 c8 e3 43 de 82 05 a7 9a 0d b8 f0 df b0 0b f2 c8 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getDayMaxDemandPrevious.accessLevel,
        commands: [
            uplinkCommands.getDayMaxDemandPrevious.examples['response for 2023.03.12']
        ],
        lrc: 0x67,
        crc: 0xc8f2,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getDayMaxPower',
        hex: '0a 10 10 79 10 2a 43 11 44 02 03 00 00 10 00 04 05 00 00 20 00 00 20',
        frameHex: '7e 51 aa aa ff ff 0a 10 10 79 10 2a 43 7d 31 44 02 03 00 00 10 00 04 05 00 00 20 00 00 20 5b d0 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getDayMaxPower.accessLevel,
        commands: [
            uplinkCommands.getDayMaxPower.examples['get day max power']
        ],
        lrc: 0x20,
        crc: 0xd05b,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getDayProfile',
        hex: '0a 13 69 11 3f 2e d8 4d d1 ba 20 c4 a1 ec ff 6b 38 74',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 69 7d 31 3f 2e d8 4d d1 ba 20 c4 a1 ec ff 6b 38 74 14 98 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getDayProfile.accessLevel,
        commands: [
            uplinkCommands.getDayProfile.examples['full periods response']
        ],
        lrc: 0x75,
        crc: 0x9814,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getDayProfile (4 periods)',
        hex: '0a 13 d6 40 91 21 77 5b ba 57 f9 92 50 42 4a 16 ae 82',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 d6 40 91 21 77 5b ba 57 f9 92 50 42 4a 16 ae 82 16 10 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getDayProfile.accessLevel,
        commands: [
            uplinkCommands.getDayProfile.examples['response with 4 periods']
        ],
        lrc: 0x87,
        crc: 0x1016,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getDemand (for A+)',
        hex: '0a 13 29 20 8c 56 1e 8a e2 ae 29 f2 77 0c 03 89 40 f6 3c 44 1f 32 ce 07 82 23 64 d7 a2 99 0e 50 bb 13 c5 c9 2c 12 90 1a 66 a9 9d 45 93 09 18 09 5a 6e 28 4a 83 b9 fc 68 87 49 7b 49 05 8f 07 02 d9 3a 3c 44 1f 32 ce 07 82 23 64 d7 a2 99 0e 50 bb 13 27 e2 31 e7 8d 1e de 66 4f 73 40 cd 1c ad ca 1c 20 2f f4 33 fc 78 01 d3 ed ae a5 b6 46 f4 f4 c3',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 29 20 8c 56 1e 8a e2 ae 29 f2 77 0c 03 89 40 f6 3c 44 1f 32 ce 07 82 23 64 d7 a2 99 0e 50 bb 7d 33 c5 c9 2c 12 90 1a 66 a9 9d 45 93 09 18 09 5a 6e 28 4a 83 b9 fc 68 87 49 7b 49 05 8f 07 02 d9 3a 3c 44 1f 32 ce 07 82 23 64 d7 a2 99 0e 50 bb 7d 33 27 e2 31 e7 8d 1e de 66 4f 73 40 cd 1c ad ca 1c 20 2f f4 33 fc 78 01 d3 ed ae a5 b6 46 f4 f4 c3 18 66 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getDemand.accessLevel,
        commands: [
            uplinkCommands.getDemand.examples['response for A+']
        ],
        lrc: 0x6c,
        crc: 0x6618,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getDemand (for A+, period: 60, no tariff)',
        hex: '0a 13 bb 97 68 39 28 c5 c4 9c a6 55 ab 06 cb b8 47 35 3c 44 1f 32 ce 07 82 23 64 d7 a2 99 0e 50 bb 13 c5 c9 2c 12 90 1a 66 a9 9d 45 93 09 18 09 5a 6e 93 48 78 11 a8 3e 69 b1 bb 01 97 94 97 cd ef cf',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 bb 97 68 39 28 c5 c4 9c a6 55 ab 06 cb b8 47 35 3c 44 1f 32 ce 07 82 23 64 d7 a2 99 0e 50 bb 7d 33 c5 c9 2c 12 90 1a 66 a9 9d 45 93 09 18 09 5a 6e 93 48 78 7d 31 a8 3e 69 b1 bb 01 97 94 97 cd ef cf 6a c8 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getDemand.accessLevel,
        commands: [
            uplinkCommands.getDemand.examples['response for A+ (period: 60, no tariff)']
        ],
        lrc: 0x4d,
        crc: 0xc86a,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getDemand (for A+, lastSummerHour)',
        hex: '0a 13 65 c5 26 8d 45 e5 d9 95 5f 41 cb 5f df d4 9b 61',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 65 c5 26 8d 45 e5 d9 95 5f 41 cb 5f df d4 9b 61 b8 2e 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getDemand.accessLevel,
        commands: [
            uplinkCommands.getDemand.examples['response for A+ (lastSummerHour)']
        ],
        lrc: 0x94,
        crc: 0x2eb8,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getDemand (for voltage, period: 60, no tariff)',
        hex: '0a 13 0e b0 e4 7c bf 90 26 9a 40 6a d8 cf d4 cb a1 69',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 0e b0 e4 7c bf 90 26 9a 40 6a d8 cf d4 cb a1 69 c8 31 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getDemand.accessLevel,
        commands: [
            uplinkCommands.getDemand.examples['response for voltage (period: 60, no tariff)']
        ],
        lrc: 0xd1,
        crc: 0x31c8,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getDemand (for voltage 10 min, period: 10, no tariff)',
        hex: '0a 13 e7 e9 77 05 5e 59 63 d9 a5 ac f8 8d bc c0 d0 5b 98 fa 2b 63 8e 9e 6c 66 34 c0 dd 4f fc 2f c3 e4',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 e7 e9 77 05 5e 59 63 d9 a5 ac f8 8d bc c0 d0 5b 98 fa 2b 63 8e 9e 6c 66 34 c0 dd 4f fc 2f c3 e4 82 2e 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getDemand.accessLevel,
        commands: [
            uplinkCommands.getDemand.examples['response for voltage 10 min (lastSummerHour)']
        ],
        lrc: 0x1e,
        crc: 0x2e82,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getDemandParameters',
        hex: '0a 13 28 bb 0b b5 88 59 20 68 99 77 72 e1 f0 5e ca 1f',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 28 bb 0b b5 88 59 20 68 99 77 72 e1 f0 5e ca 1f 92 5e 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getDemandParameters.accessLevel,
        commands: [
            uplinkCommands.getDemandParameters.examples['simple response']
        ],
        lrc: 0x83,
        crc: 0x5e92,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getDeviceId',
        hex: '0a 13 cf 5f a5 a8 36 72 4f c9 7a 07 35 f8 17 d4 96 51',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 cf 5f a5 a8 36 72 4f c9 7a 07 35 f8 17 d4 96 51 fe 54 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getDeviceId.accessLevel,
        commands: [
            uplinkCommands.getDeviceId.examples['simple response']
        ],
        lrc: 0x47,
        crc: 0x54fe,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getDeviceType',
        hex: '0a 13 cf 02 a9 57 43 0a 46 e0 7a 34 22 b7 71 0c 19 29',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 cf 02 a9 57 43 0a 46 e0 7a 34 22 b7 71 0c 19 29 93 54 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getDeviceType.accessLevel,
        commands: [
            uplinkCommands.getDeviceType.examples['type 2']
        ],
        lrc: 0xb0,
        crc: 0x5493,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getDisplayParam',
        hex: '0a 13 41 56 c5 65 bf 04 25 17 8a a5 3b 3e ef 47 17 ae',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 41 56 c5 65 bf 04 25 17 8a a5 3b 3e ef 47 17 ae 9f 8e 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getDisplayParam.accessLevel,
        commands: [
            uplinkCommands.getDisplayParam.examples['mode with order']
        ],
        lrc: 0x1d,
        crc: 0x8e9f,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getEnergy',
        hex: '0a 13 b2 49 f1 cf 51 c5 b9 2a ae 94 f5 e7 1b 2a 5b 36 8b 88 fb 14 6f 1e 94 60 f1 13 ea 8f 3f 64 ca 46',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 b2 49 f1 cf 51 c5 b9 2a ae 94 f5 e7 1b 2a 5b 36 8b 88 fb 14 6f 1e 94 60 f1 7d 33 ea 8f 3f 64 ca 46 d8 1f 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getEnergy.accessLevel,
        commands: [
            uplinkCommands.getEnergy.examples['default A+ energy']
        ],
        lrc: 0x09,
        crc: 0x1fd8,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getEnergyDayPrevious',
        hex: '0a 13 55 e9 39 74 8b e4 b6 a2 ac 0e 27 9c b6 3d a1 3c 74 42 98 60 89 31 d4 ff 70 2b f0 83 95 54 9b e0',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 55 e9 39 74 8b e4 b6 a2 ac 0e 27 9c b6 3d a1 3c 74 42 98 60 89 31 d4 ff 70 2b f0 83 95 54 9b e0 bd 5e 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getEnergyDayPrevious.accessLevel,
        commands: [
            uplinkCommands.getEnergyDayPrevious.examples['simple response']
        ],
        lrc: 0x0b,
        crc: 0x5ebd,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getEnergyExportDayPrevious',
        hex: '0a 13 ab 74 e9 bb 6d a4 64 6d 79 cf 4c d8 92 8c f3 59 e6 f8 a2 f1 27 d5 76 cc 1d 50 e3 c4 d9 9e 41 c3',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 ab 74 e9 bb 6d a4 64 6d 79 cf 4c d8 92 8c f3 59 e6 f8 a2 f1 27 d5 76 cc 1d 50 e3 c4 d9 9e 41 c3 d4 90 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getEnergyExportDayPrevious.accessLevel,
        commands: [
            uplinkCommands.getEnergyExportDayPrevious.examples['response with A- energy by T1, T4']
        ],
        lrc: 0x77,
        crc: 0x90d4,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getEvents',
        hex: '0a 13 03 fd 86 2f ea 14 f8 46 22 ee 0c a6 e9 68 53 49 8a 7f 41 6c ff 14 7c 13 63 12 0e a2 43 45 8c 2b',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 03 fd 86 2f ea 14 f8 46 22 ee 0c a6 e9 68 53 49 8a 7f 41 6c ff 14 7c 7d 33 63 12 0e a2 43 45 8c 2b 52 83 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getEvents.accessLevel,
        commands: [
            uplinkCommands.getEvents.examples['simple response']
        ],
        lrc: 0x17,
        crc: 0x8352,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getEventsCounters',
        hex: '0a 13 04 d8 6a 89 b9 92 b2 8f 97 6d 5a ba 72 42 1e c5 fb f4 6a df 46 7d 49 45 c6 00 d7 f5 bf 02 b2 bc',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 04 d8 6a 89 b9 92 b2 8f 97 6d 5a ba 72 42 1e c5 fb f4 6a df 46 7d 5d 49 45 c6 00 d7 f5 bf 02 b2 bc 6d 60 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getEventsCounters.accessLevel,
        commands: [
            uplinkCommands.getEventsCounters.examples['simple response']
        ],
        lrc: 0x73,
        crc: 0x606d,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getEventStatus',
        hex: '0a 13 5f f6 79 76 86 52 d9 9a 6f 59 72 6c fa b1 3e cf',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 5f f6 79 76 86 52 d9 9a 6f 59 72 6c fa b1 3e cf e5 75 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getEventStatus.accessLevel,
        commands: [
            uplinkCommands.getEventStatus.examples['simple response']
        ],
        lrc: 0xd0,
        crc: 0x75e5,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getExtendedCurrentValues',
        hex: '0a 13 a0 98 97 d0 6c fa 74 56 ef 7a d2 f2 ac 7a 0b 44',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 a0 98 97 d0 6c fa 74 56 ef 7a d2 f2 ac 7a 0b 44 c3 00 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getExtendedCurrentValues.accessLevel,
        commands: [
            uplinkCommands.getExtendedCurrentValues.examples['simple response']
        ],
        lrc: 0x07,
        crc: 0x00c3,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getExtendedCurrentValues2',
        hex: '0a 13 61 6b 4a 60 09 c3 1d 05 12 47 75 dc e7 36 2d 38',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 61 6b 4a 60 09 c3 1d 05 12 47 75 dc e7 36 2d 38 f5 21 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getExtendedCurrentValues2.accessLevel,
        commands: [
            uplinkCommands.getExtendedCurrentValues2.examples['simple response']
        ],
        lrc: 0x99,
        crc: 0x21f5,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getHalfHourDemand',
        hex: '0a 13 01 7c 3f d4 90 8d 93 4e 82 72 e1 3f 1d cd 3d d5 d5 43 5d 19 51 04 14 2f 1d 4b 2c 86 d3 02 69 20 5a 03 4d 02 18 23 f9 75 e0 c4 d0 ae e1 27 e8 db 3f f3 68 cf 35 ed 34 51 53 d8 07 d5 2f 22 6d 89 24 2a be 58 95 14 bf e8 a3 a2 35 7e 0b 8b c9 12 65 ae 3e 94 ca 2e d7 ad 05 1b 32 4a 19 74 1a 04 ae 6a 64 c4 02 4f cc 14 fd c1 3c 2d 77 19 f7 4e',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 01 7c 3f d4 90 8d 93 4e 82 72 e1 3f 1d cd 3d d5 d5 43 5d 19 51 04 14 2f 1d 4b 2c 86 d3 02 69 20 5a 03 4d 02 18 23 f9 75 e0 c4 d0 ae e1 27 e8 db 3f f3 68 cf 35 ed 34 51 53 d8 07 d5 2f 22 6d 89 24 2a be 58 95 14 bf e8 a3 a2 35 7d 5e 0b 8b c9 12 65 ae 3e 94 ca 2e d7 ad 05 1b 32 4a 19 74 1a 04 ae 6a 64 c4 02 4f cc 14 fd c1 3c 2d 77 19 f7 4e 77 b0 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getHalfHourDemand.accessLevel,
        commands: [
            uplinkCommands.getHalfHourDemand.examples['simple response']
        ],
        lrc: 0x87,
        crc: 0xb077,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        // does not exist in empro
        name: 'getHalfHourDemandExport',
        hex: '0a 13 ba f7 d4 77 0a 1f cb 08 02 d2 f4 ae 44 6c a9 d1 d5 43 5d 19 51 04 14 2f 1d 4b 2c 86 d3 02 69 20 5a 03 4d 02 18 23 f9 75 e0 c4 d0 ae e1 27 e8 db 3f f3 68 cf 35 ed 34 51 53 d8 07 d5 2f 22 6d 89 24 2a be 58 95 14 bf e8 a3 a2 35 7e 0b 8b c9 12 65 ae 3e 94 ca 2e d7 ad 05 1b 32 4a 19 74 1a 04 44 08 58 83 cb b5 d7 c2 44 c4 b6 df 32 c1 a3 f1',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 ba f7 d4 77 0a 1f cb 08 02 d2 f4 ae 44 6c a9 d1 d5 43 5d 19 51 04 14 2f 1d 4b 2c 86 d3 02 69 20 5a 03 4d 02 18 23 f9 75 e0 c4 d0 ae e1 27 e8 db 3f f3 68 cf 35 ed 34 51 53 d8 07 d5 2f 22 6d 89 24 2a be 58 95 14 bf e8 a3 a2 35 7d 5e 0b 8b c9 12 65 ae 3e 94 ca 2e d7 ad 05 1b 32 4a 19 74 1a 04 44 08 58 83 cb b5 d7 c2 44 c4 b6 df 32 c1 a3 f1 32 dd 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getHalfHourDemandExport.accessLevel,
        commands: [
            uplinkCommands.getHalfHourDemandExport.examples['simple response']
        ],
        lrc: 0xc1,
        crc: 0xdd32,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getHalfHourDemandPrevious',
        hex: '0a 13 60 df 92 f8 70 a0 13 37 ee 80 2c 35 de 33 4a 18 d5 43 5d 19 51 04 14 2f 1d 4b 2c 86 d3 02 69 20 5a 03 4d 02 18 23 f9 75 e0 c4 d0 ae e1 27 e8 db 3f f3 68 cf 35 ed 34 51 53 d8 07 d5 2f 22 6d 89 24 2a be 58 95 14 bf e8 a3 a2 35 7e 0b 8b c9 12 65 ae 3e 94 ca 2e d7 ad 05 1b 32 4a 19 74 1a 04 c4 96 68 1c a4 f3 99 0d 2e ba ed 45 2b 7f 58 7d',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 60 df 92 f8 70 a0 7d 33 37 ee 80 2c 35 de 33 4a 18 d5 43 5d 19 51 04 14 2f 1d 4b 2c 86 d3 02 69 20 5a 03 4d 02 18 23 f9 75 e0 c4 d0 ae e1 27 e8 db 3f f3 68 cf 35 ed 34 51 53 d8 07 d5 2f 22 6d 89 24 2a be 58 95 14 bf e8 a3 a2 35 7d 5e 0b 8b c9 12 65 ae 3e 94 ca 2e d7 ad 05 1b 32 4a 19 74 1a 04 c4 96 68 1c a4 f3 99 0d 2e ba ed 45 2b 7f 58 7d 5d 57 2e 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getHalfHourDemandPrevious.accessLevel,
        commands: [
            uplinkCommands.getHalfHourDemandPrevious.examples['response for day when DST start/end']
        ],
        lrc: 0x76,
        crc: 0x2e57,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        // does not match empro
        name: 'getHalfHourEnergies',
        hex: '0a 10 10 6f 0d 2a 43 11 01 02 40 00 80 2f 44 d2 b0 39 00 ac',
        frameHex: '7e 51 aa aa ff ff 0a 10 10 6f 0d 2a 43 7d 31 01 02 40 00 80 2f 44 d2 b0 39 00 ac a2 6d 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getHalfHourEnergies.accessLevel,
        commands: [
            uplinkCommands.getHalfHourEnergies.examples['get halfhours energies']
        ],
        lrc: 0xac,
        crc: 0x6da2,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        // does not match empro
        name: 'getMagneticFieldThreshold',
        hex: '0a 13 39 12 e9 f0 90 f0 df 74 bb 28 e5 18 5c cb 35 b3',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 39 12 e9 f0 90 f0 df 74 bb 28 e5 18 5c cb 35 b3 31 b8 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getMagneticFieldThreshold.accessLevel,
        commands: [
            uplinkCommands.getMagneticFieldThreshold.examples['simple response']
        ],
        lrc: 0x55,
        crc: 0xb831,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        // does not exist in empro
        name: 'getMeterInfo',
        hex: '0a 13 1f 3c 50 9e 5f 4d 5c b0 ee 7c f5 b1 6e fa 53 a5',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 1f 3c 50 9e 5f 4d 5c b0 ee 7c f5 b1 6e fa 53 a5 48 45 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getMeterInfo.accessLevel,
        commands: [
            uplinkCommands.getMeterInfo.examples['simple response']
        ],
        lrc: 0x3d,
        crc: 0x4548,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getMonthDemand',
        hex: '0a 13 38 0b a6 84 57 df ec dc 01 cd a9 32 0c 45 a8 db 0d 9c 54 54 50 61 b0 ea ca bd 91 be d3 fc de 75',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 38 0b a6 84 57 df ec dc 01 cd a9 32 0c 45 a8 db 0d 9c 54 54 50 61 b0 ea ca bd 91 be d3 fc de 75 27 cc 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getMonthDemand.accessLevel,
        commands: [
            uplinkCommands.getMonthDemand.examples['response energy for 2024.03']
        ],
        lrc: 0x08,
        crc: 0xcc27,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        // does not exist in empro
        name: 'getMonthDemandExport',
        hex: '0a 13 87 5a ab 91 e4 84 3e fe 23 b2 9c cf 4d fb 00 a0 b8 bc 7e 7c bd 50 2d 37 83 04 c3 98 7e 69 a7 cc',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 87 5a ab 91 e4 84 3e fe 23 b2 9c cf 4d fb 00 a0 b8 bc 7d 5e 7c bd 50 2d 37 83 04 c3 98 7d 5e 69 a7 cc 7d 31 7d 33 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getMonthDemandExport.accessLevel,
        commands: [
            uplinkCommands.getMonthDemandExport.examples['response energy for 2024.03']
        ],
        lrc: 0x4d,
        crc: 0x1311,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getMonthMaxDemand',
        hex: '0a 13 5b 3e 07 78 33 43 93 99 32 e3 e4 0f 68 be 73 4a 2f 38 8f f2 c0 30 66 07 32 95 da 4f ab c3 99 c5 b0 9c 54 0b 37 2e 85 7e 95 1b 07 b7 3b c0 77 75',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 5b 3e 07 78 33 43 93 99 32 e3 e4 0f 68 be 73 4a 2f 38 8f f2 c0 30 66 07 32 95 da 4f ab c3 99 c5 b0 9c 54 0b 37 2e 85 7d 5e 95 1b 07 b7 3b c0 77 75 a4 2f 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getMonthMaxDemand.accessLevel,
        commands: [
            uplinkCommands.getMonthMaxDemand.examples['response max power for 2024.03']
        ],
        lrc: 0xa2,
        crc: 0x2fa4,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getMonthMaxDemandExport',
        hex: '0a 13 d6 63 64 a4 44 cc 49 dc 97 3e f1 16 8b bc e3 c3 2f 38 8f f2 c0 30 66 07 32 95 da 4f ab c3 99 c5 a4 16 b6 a2 98 91 f2 01 dc 0c 60 d1 9c df f6 06',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 d6 63 64 a4 44 cc 49 dc 97 3e f1 16 8b bc e3 c3 2f 38 8f f2 c0 30 66 07 32 95 da 4f ab c3 99 c5 a4 16 b6 a2 98 91 f2 01 dc 0c 60 d1 9c df f6 06 4a ad 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getMonthMaxDemandExport.accessLevel,
        commands: [
            uplinkCommands.getMonthMaxDemandExport.examples['response max power for 2024.03']
        ],
        lrc: 0xc9,
        crc: 0xad4a,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getOperatorParametersExtended3',
        hex: '0a 13 97 a1 04 b0 ec 3c f6 60 02 f3 d3 d3 d2 22 2b 6b f6 81 dc 18 fa e6 1b 6a c7 f3 00 25 11 7d ef a4',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 97 a1 04 b0 ec 3c f6 60 02 f3 d3 d3 d2 22 2b 6b f6 81 dc 18 fa e6 1b 6a c7 f3 00 25 7d 31 7d 5d ef a4 92 6c 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getOperatorParametersExtended3.accessLevel,
        commands: [
            uplinkCommands.getOperatorParametersExtended3.examples['simple response']
        ],
        lrc: 0x1e,
        crc: 0x6c92,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getOperatorParameters',
        hex: '0a 13 a0 05 6f ba 5c 1c 6b 62 b9 37 db 7d 87 e4 c5 8e 22 0c 2e 12 c7 73 f8 23 b3 51 c2 f7 7d a9 56 76 e3 b3 49 b4 57 6c fc 89 a4 30 2e cf d8 6c ff c1 84 7b 8e a0 a9 65 a6 10 9f e9 31 2c 33 80 ad 22 08 af 02 26 40 ae e6 68 3e 6f f8 ee 4d 04 b0 75',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 a0 05 6f ba 5c 1c 6b 62 b9 37 db 7d 5d 87 e4 c5 8e 22 0c 2e 12 c7 73 f8 23 b3 51 c2 f7 7d 5d a9 56 76 e3 b3 49 b4 57 6c fc 89 a4 30 2e cf d8 6c ff c1 84 7b 8e a0 a9 65 a6 10 9f e9 31 2c 33 80 ad 22 08 af 02 26 40 ae e6 68 3e 6f f8 ee 4d 04 b0 75 9f 27 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getOperatorParameters.accessLevel,
        commands: [
            uplinkCommands.getOperatorParameters.examples['get default operator parameters response']
        ],
        lrc: 0x7b,
        crc: 0x279f,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getRatePlanInfo',
        hex: '0a 13 d6 5a c5 38 60 4c c8 90 9e f2 33 f9 06 9d b0 af de b9 0a 05 bc a4 34 c7 95 30 c3 91 d3 71 2e 1b',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 d6 5a c5 38 60 4c c8 90 9e f2 33 f9 06 9d b0 af de b9 0a 05 bc a4 34 c7 95 30 c3 91 d3 71 2e 1b 63 94 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getRatePlanInfo.accessLevel,
        commands: [
            uplinkCommands.getRatePlanInfo.examples['rate plan info response for A- table']
        ],
        lrc: 0x44,
        crc: 0x9463,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getSaldo',
        hex: '0c 13 b3 92 d2 17 c6 97 00 75 1a eb 35 dd 62 76 c4 3a d9 e5 b4 c7 af f2 3c 79 79 a6 08 37 2e dd 9e 07 8a 3f bc 8a bf d1 89 57 ad b5 42 7b 33 fc 35 f8',
        frameHex: '7e 51 aa aa ff ff 0c 7d 33 b3 92 d2 17 c6 97 00 75 1a eb 35 dd 62 76 c4 3a d9 e5 b4 c7 af f2 3c 79 79 a6 08 37 2e dd 9e 07 8a 3f bc 8a bf d1 89 57 ad b5 42 7b 33 fc 35 f8 79 44 7e',
        messageId: 12,
        accessLevel: uplinkCommands.getSaldo.accessLevel,
        commands: [
            uplinkCommands.getSaldo.examples['test response']
        ],
        lrc: 0x4f,
        crc: 0x4479,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getSaldoParameters',
        hex: '0c 13 0d b0 25 08 91 ca 54 e3 a4 cc be a2 73 ae 54 bf 1b 2e f6 c5 32 4d 34 24 14 15 55 c8 0f 13 cf bc 67 15 9e 5a 97 29 dc 1a 47 86 95 29 61 8d 58 ca',
        frameHex: '7e 51 aa aa ff ff 0c 7d 33 0d b0 25 08 91 ca 54 e3 a4 cc be a2 73 ae 54 bf 1b 2e f6 c5 32 4d 34 24 14 15 55 c8 0f 7d 33 cf bc 67 15 9e 5a 97 29 dc 1a 47 86 95 29 61 8d 58 ca 7d 33 f4 7e',
        messageId: 12,
        accessLevel: uplinkCommands.getSaldoParameters.accessLevel,
        commands: [
            uplinkCommands.getSaldoParameters.examples['test response']
        ],
        lrc: 0x43,
        crc: 0xf413,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getSeasonProfile',
        hex: '0c 13 b6 6b 87 aa a9 25 92 39 df 19 ee f7 2c 1e 41 90',
        frameHex: '7e 51 aa aa ff ff 0c 7d 33 b6 6b 87 aa a9 25 92 39 df 19 ee f7 2c 1e 41 90 ca 5a 7e',
        messageId: 12,
        accessLevel: uplinkCommands.getSeasonProfile.accessLevel,
        commands: [
            uplinkCommands.getSeasonProfile.examples['simple response']
        ],
        lrc: 0x71,
        crc: 0x5aca,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getSpecialDay',
        hex: '0a 13 8e b0 81 8d 53 40 b4 1d 24 56 8e 0e 86 8c 89 8f',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 8e b0 81 8d 53 40 b4 1d 24 56 8e 0e 86 8c 89 8f 01 74 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getSpecialDay.accessLevel,
        commands: [
            uplinkCommands.getSpecialDay.examples['special day response']
        ],
        lrc: 0x74,
        crc: 0x7401,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getVersion',
        hex: '0c 13 8f d7 f5 0b b9 60 dc fc 45 73 a5 5b e8 4a 64 ae',
        frameHex: '7e 51 aa aa ff ff 0c 7d 33 8f d7 f5 0b b9 60 dc fc 45 73 a5 5b e8 4a 64 ae 07 4a 7e',
        messageId: 12,
        accessLevel: uplinkCommands.getVersion.accessLevel,
        commands: [
            uplinkCommands.getVersion.examples['simple response']
        ],
        lrc: 0x65,
        crc: 0x4a07,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'prepareRatePlan',
        hex: '0c 12 0b 27 68 f1 39 fe 5c 32 9f 44 45 c3 03 60 a8 b6',
        frameHex: '7e 51 aa aa ff ff 0c 12 0b 27 68 f1 39 fe 5c 32 9f 44 45 c3 03 60 a8 b6 08 c3 7e',
        messageId: 12,
        accessLevel: uplinkCommands.prepareRatePlan.accessLevel,
        commands: [
            uplinkCommands.prepareRatePlan.examples['simple response']
        ],
        lrc: 0x53,
        crc: 0xc308,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'resetPowerMaxDay',
        hex: '0c 12 f8 8e 7f 8c 99 33 e9 ba e1 e7 4a aa 81 fe 9f ab',
        frameHex: '7e 51 aa aa ff ff 0c 12 f8 8e 7f 8c 99 33 e9 ba e1 e7 4a aa 81 fe 9f ab 9a 6d 7e',
        messageId: 12,
        accessLevel: uplinkCommands.resetPowerMaxDay.accessLevel,
        commands: [
            uplinkCommands.resetPowerMaxDay.examples['simple response']
        ],
        lrc: 0x72,
        crc: 0x6d9a,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'resetPowerMaxMonth',
        hex: '0c 12 a5 a2 26 c1 8f e8 1a aa 33 20 44 3e 67 53 23 99',
        frameHex: '7e 51 aa aa ff ff 0c 12 a5 a2 26 c1 8f e8 1a aa 33 20 44 3e 67 53 23 99 22 65 7e',
        messageId: 12,
        accessLevel: uplinkCommands.resetPowerMaxMonth.accessLevel,
        commands: [
            uplinkCommands.resetPowerMaxMonth.examples['simple response']
        ],
        lrc: 0x71,
        crc: 0x6522,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'runTariffPlan',
        hex: '0c 12 0c da 8f aa a2 8d 9c ae 9b 03 33 bf 3e 8b f0 58',
        frameHex: '7e 51 aa aa ff ff 0c 12 0c da 8f aa a2 8d 9c ae 9b 03 33 bf 3e 8b f0 58 80 42 7e',
        messageId: 12,
        accessLevel: uplinkCommands.runTariffPlan.accessLevel,
        commands: [
            uplinkCommands.runTariffPlan.examples['simple response']
        ],
        lrc: 0x01,
        crc: 0x4280,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'setAccessKey',
        hex: '0c 12 e5 f3 8e 60 03 20 e1 2d df 5b b5 dc e1 5e 78 52',
        frameHex: '7e 51 aa aa ff ff 0c 12 e5 f3 8e 60 03 20 e1 2d df 5b b5 dc e1 5e 78 52 a2 ac 7e',
        messageId: 12,
        accessLevel: uplinkCommands.setAccessKey.accessLevel,
        commands: [
            uplinkCommands.setAccessKey.examples['simple response']
        ],
        lrc: 0x4e,
        crc: 0xaca2,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'setCorrectDateTime',
        hex: '0c 13 b0 02 be f0 e6 77 f8 a2 b8 8e d8 a5 6c 0a 8a 1b',
        frameHex: '7e 51 aa aa ff ff 0c 7d 33 b0 02 be f0 e6 77 f8 a2 b8 8e d8 a5 6c 0a 8a 1b 30 21 7e',
        messageId: 12,
        accessLevel: uplinkCommands.setCorrectDateTime.accessLevel,
        commands: [
            uplinkCommands.setCorrectDateTime.examples['simple response']
        ],
        lrc: 0x1a,
        crc: 0x2130,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'setCorrectTime',
        hex: '0c 12 26 85 8e bd de 25 89 90 68 46 6d b8 60 1c fc 83',
        frameHex: '7e 51 aa aa ff ff 0c 12 26 85 8e bd de 25 89 90 68 46 6d b8 60 1c fc 83 f1 d6 7e',
        messageId: 12,
        accessLevel: uplinkCommands.setCorrectTime.accessLevel,
        commands: [
            uplinkCommands.setCorrectTime.examples['simple response']
        ],
        lrc: 0x5b,
        crc: 0xd6f1,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'setDateTime',
        hex: '0c 13 96 f5 83 17 cf b5 6b 9d 94 fb b5 9c c9 e8 ea a6',
        frameHex: '7e 51 aa aa ff ff 0c 7d 33 96 f5 83 17 cf b5 6b 9d 94 fb b5 9c c9 e8 ea a6 84 1e 7e',
        messageId: 12,
        accessLevel: uplinkCommands.setDateTime.accessLevel,
        commands: [
            uplinkCommands.setDateTime.examples['simple response']
        ],
        lrc: 0x4e,
        crc: 0x1e84,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'setDayProfile',
        hex: '0c 12 cb 50 1d 66 88 69 6d 1b 4d 2b fb d6 6a a4 8d 31',
        frameHex: '7e 51 aa aa ff ff 0c 12 cb 50 1d 66 88 69 6d 1b 4d 2b fb d6 6a a4 8d 31 48 83 7e',
        messageId: 12,
        accessLevel: uplinkCommands.setDayProfile.accessLevel,
        commands: [
            uplinkCommands.setDayProfile.examples['simple response']
        ],
        lrc: 0x57,
        crc: 0x8348,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'setDemandParameters',
        hex: '0c 12 71 bc c4 6e 53 43 b1 ef 9c 35 8a f3 36 76 4b 75',
        frameHex: '7e 51 aa aa ff ff 0c 12 71 bc c4 6e 53 43 b1 ef 9c 35 8a f3 36 76 4b 75 81 6d 7e',
        messageId: 12,
        accessLevel: uplinkCommands.setDemandParameters.accessLevel,
        commands: [
            uplinkCommands.setDemandParameters.examples['simple response']
        ],
        lrc: 0x33,
        crc: 0x6d81,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'setDisplayParam',
        hex: '0a 12 ae 17 9c ae bc 0b aa 81 9c f9 39 39 eb da af 99',
        frameHex: '7e 51 aa aa ff ff 0a 12 ae 17 9c ae bc 0b aa 81 9c f9 39 39 eb da af 99 7d 5e d7 7e',
        messageId: 10,
        accessLevel: uplinkCommands.setDisplayParam.accessLevel,
        commands: [
            uplinkCommands.setDisplayParam.examples['simple response']
        ],
        lrc: 0x1a,
        crc: 0xd77e, // special case
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'setOperatorParametersExtended3',
        hex: '0a 12 92 d0 25 2d 1a c8 94 b8 74 31 d7 d7 bb f8 e1 1a',
        frameHex: '7e 51 aa aa ff ff 0a 12 92 d0 25 2d 1a c8 94 b8 74 31 d7 d7 bb f8 e1 1a 9a 09 7e',
        messageId: 10,
        accessLevel: uplinkCommands.setOperatorParametersExtended3.accessLevel,
        commands: [
            uplinkCommands.setOperatorParametersExtended3.examples['simple response']
        ],
        lrc: 0x35,
        crc: 0x099a,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'setOperatorParameters',
        hex: '0a 12 b7 7e 91 e5 84 c7 9e 69 9c 5a 6a 38 b1 d8 c1 02',
        frameHex: '7e 51 aa aa ff ff 0a 12 b7 7d 5e 91 e5 84 c7 9e 69 9c 5a 6a 38 b1 d8 c1 02 01 cb 7e',
        messageId: 10,
        accessLevel: uplinkCommands.setOperatorParameters.accessLevel,
        commands: [
            uplinkCommands.setOperatorParameters.examples['simple response']
        ],
        lrc: 0x58,
        crc: 0xcb01,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'setSaldo',
        hex: '0a 12 a0 c5 af e7 f5 1a b0 89 a8 71 8f a2 e8 60 d8 f5',
        frameHex: '7e 51 aa aa ff ff 0a 12 a0 c5 af e7 f5 1a b0 89 a8 71 8f a2 e8 60 d8 f5 2b 3e 7e',
        messageId: 10,
        accessLevel: uplinkCommands.setSaldo.accessLevel,
        commands: [
            uplinkCommands.setSaldo.examples['simple response']
        ],
        lrc: 0x6d,
        crc: 0x3e2b,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'setSaldoParameters',
        hex: '0a 12 7b 8e 5b 7b 50 32 a8 b2 5b 46 69 04 a4 49 40 ff',
        frameHex: '7e 51 aa aa ff ff 0a 12 7b 8e 5b 7b 50 32 a8 b2 5b 46 69 04 a4 49 40 ff 84 a3 7e',
        messageId: 10,
        accessLevel: uplinkCommands.setSaldoParameters.accessLevel,
        commands: [
            uplinkCommands.setSaldoParameters.examples['simple response']
        ],
        lrc: 0x68,
        crc: 0xa384,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'setSeasonProfile',
        hex: '0a 12 0d 18 99 92 bd c9 f6 f1 06 b5 c1 9b 15 66 a1 6a',
        frameHex: '7e 51 aa aa ff ff 0a 12 0d 18 99 92 bd c9 f6 f1 06 b5 c1 9b 15 66 a1 6a d4 6b 7e',
        messageId: 10,
        accessLevel: uplinkCommands.setSeasonProfile.accessLevel,
        commands: [
            uplinkCommands.setSeasonProfile.examples['simple response']
        ],
        lrc: 0x56,
        crc: 0x6bd4,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'setSpecialDay',
        hex: '0a 12 58 96 e9 31 df b7 cb e9 79 0d 30 4e 02 f0 3f 5e',
        frameHex: '7e 51 aa aa ff ff 0a 12 58 96 e9 31 df b7 cb e9 79 0d 30 4e 02 f0 3f 5e 32 96 7e',
        messageId: 10,
        accessLevel: uplinkCommands.setSpecialDay.accessLevel,
        commands: [
            uplinkCommands.setSpecialDay.examples['simple response']
        ],
        lrc: 0x55,
        crc: 0x9632,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'setSpecialOperation',
        hex: '0a 12 08 53 33 e7 53 69 d7 01 2e b3 62 ad 3d e0 12 0c',
        frameHex: '7e 51 aa aa ff ff 0a 12 08 53 33 e7 53 69 d7 01 2e b3 62 ad 3d e0 12 0c 22 72 7e',
        messageId: 10,
        accessLevel: uplinkCommands.setSpecialOperation.accessLevel,
        commands: [
            uplinkCommands.setSpecialOperation.examples['both screens are present']
        ],
        lrc: 0x21,
        crc: 0x7222,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'turnRelayOff',
        hex: '0a 12 9d 81 66 34 ec 71 c4 62 af 9f 69 f6 c9 eb e8 08',
        frameHex: '7e 51 aa aa ff ff 0a 12 9d 81 66 34 ec 71 c4 62 af 9f 69 f6 c9 eb e8 08 02 f6 7e',
        messageId: 10,
        accessLevel: uplinkCommands.turnRelayOff.accessLevel,
        commands: [
            uplinkCommands.turnRelayOff.examples['simple response']
        ],
        lrc: 0x5e,
        crc: 0xf602,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'turnRelayOn',
        hex: '0a 12 0d 8d 21 54 75 8a 37 a0 21 fa cd a3 c3 f2 00 4b',
        frameHex: '7e 51 aa aa ff ff 0a 12 0d 8d 21 54 75 8a 37 a0 21 fa cd a3 c3 f2 00 4b 1b eb 7e',
        messageId: 10,
        accessLevel: uplinkCommands.turnRelayOn.accessLevel,
        commands: [
            uplinkCommands.turnRelayOn.examples['simple response']
        ],
        lrc: 0x5f,
        crc: 0xeb1b,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'two unencrypted commands',
        hex: '0b 10 10 18 00 18 00 00 45',
        frameHex: '7e 51 a3 a4 f3 f4 0b 10 10 18 00 18 00 00 45 1b a7 7e',
        messageId: 11,
        accessLevel: accessLevels.UNENCRYPTED,
        commands: [
            uplinkCommands.turnRelayOn.examples['simple response'],
            uplinkCommands.turnRelayOn.examples['simple response']
        ],
        lrc: 0x45,
        crc: 0xa71b,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xf3f4,
        destination: 0xa3a4
    },
    {
        name: 'many unencrypted commands',
        hex: '0c 10 10 18 00 18 00 18 00 18 00 18 00 18 00 18 00 18 00 00 45',
        frameHex: '7e 51 a3 a4 f3 f4 0c 10 10 18 00 18 00 18 00 18 00 18 00 18 00 18 00 18 00 00 45 38 67 7e',
        messageId: 12,
        accessLevel: accessLevels.UNENCRYPTED,
        commands: [
            uplinkCommands.turnRelayOn.examples['simple response'],
            uplinkCommands.turnRelayOn.examples['simple response'],
            uplinkCommands.turnRelayOn.examples['simple response'],
            uplinkCommands.turnRelayOn.examples['simple response'],
            uplinkCommands.turnRelayOn.examples['simple response'],
            uplinkCommands.turnRelayOn.examples['simple response'],
            uplinkCommands.turnRelayOn.examples['simple response'],
            uplinkCommands.turnRelayOn.examples['simple response']
        ],
        lrc: 0x45,
        crc: 0x6738,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xf3f4,
        destination: 0xa3a4
    }
];


// strip some fields to simplify tests matching
[...downlinkMessages, ...uplinkMessages].forEach(({commands}) => {
    commands.forEach(item => {
        delete item.maxSize;
        delete item.accessLevel;
    });
});


export const checkMessage = ( messageLink, messageParams: IMessage ) => {
    const {hex, messageId, accessLevel, commands, lrc} = messageParams;
    const {frameHex, frameType, source, destination, crc} = messageParams;
    const messageBytes: TBytes = messageLink.toBytes(commands, {messageId, aesKey, accessLevel});
    const messageData = messageLink.fromBytes(getBytesFromHex(hex), {aesKey});
    const frameBytes: TBytes = frame.toBytes(messageBytes, {type: frameType, source, destination});
    const parsedFrame = frame.fromBytes(getBytesFromHex(frameHex));

    expect(getHexFromBytes(messageBytes)).toEqual(hex);
    expect(getHexFromBytes(frameBytes)).toEqual(frameHex);

    if ( 'bytes' in messageData ) {
        // valid message
        expect(getHexFromBytes([messageData.lrc.calculated])).toEqual(getHexFromBytes([lrc]));
        expect(messageData.messageId).toEqual(messageId);
        expect(messageData.accessLevel).toEqual(accessLevel);
        expect(messageData.commands).toStrictEqual(commands);
    } else if ( 'message' in messageData ) {
        // invalid message
    } else {
        // everything else
        throw new Error('wrong message format');
    }

    if ( 'error' in parsedFrame ) {
        throw new Error('Field error should be missing!');
    } else {
        expect(getHexFromBytes(parsedFrame.payload)).toEqual(hex);
        expect(parsedFrame.crc.calculated.toString(16)).toStrictEqual(crc.toString(16));
        expect(parsedFrame.header?.source).toStrictEqual(source);
        expect(parsedFrame.header?.destination).toStrictEqual(destination);
        expect(parsedFrame.header?.type).toStrictEqual(frameType);
    }
};


describe('downlink messages', () => {
    downlinkMessages.forEach(messageData => {
        test(messageData.name, () => {
            checkMessage(message.downlink, messageData);
        });
    });
});

describe('uplink messages', () => {
    uplinkMessages.forEach(messageData => {
        test(messageData.name, () => {
            checkMessage(message.uplink, messageData);
        });
    });
});
