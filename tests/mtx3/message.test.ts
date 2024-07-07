/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import * as message from '../../src/mtx3/message/index.js';
import * as downlinkCommands from '../../src/mtx3/commands/downlink/index.js';
import * as uplinkCommands from '../../src/mtx3/commands/uplink/index.js';
// import * as accessLevels from '../../src/mtx/constants/accessLevels.js';
import * as frameTypes from '../../src/mtx/constants/frameTypes.js';
import {checkMessage, TMessageList} from '../mtx/message.test.js';


const downlinkMessages: TMessageList = [
    {
        name: 'getEnergy',
        hex: '0a 13 14 ee 60 6a d8 13 2a 14 34 b6 a4 a1 1b 5d 92 3b',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 14 ee 60 6a d8 7d 33 2a 14 34 b6 a4 a1 1b 5d 92 3b 77 3f 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getEnergy.accessLevel,
        commands: [
            downlinkCommands.getEnergy.examples['simple request']
        ],
        lrc: 0x49,
        crc: 0x3f77,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getOperatorParametersExtended',
        hex: '0a 13 c4 8d a8 85 69 3a 11 17 ac 56 fa 46 f0 cc 2a 94',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 c4 8d a8 85 69 3a 7d 31 17 ac 56 fa 46 f0 cc 2a 94 95 75 7e',
        messageId: 10,
        accessLevel: downlinkCommands.getOperatorParametersExtended.accessLevel,
        commands: [
            downlinkCommands.getOperatorParametersExtended.examples['simple request']
        ],
        lrc: 0x79,
        crc: 0x7595,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'setOperatorParameters',
        hex: '0a 12 96 47 d0 20 3b ad 40 62 ff 98 d6 cf 55 01 c3 c4 22 0c 2e 12 c7 73 f8 23 b3 51 c2 f7 7d a9 56 76 3b 2c de 60 5c e8 90 a3 e4 ce e1 76 f8 49 52 40 74 61 2e da 5c 95 90 16 92 ec 4e 4e 35 2e 3a 96 6c 61 c4 1f bf 6f b0 f2 97 65 46 f8 45 e6 2d 4a 18 46 72 bc 8d 76 03 9d bb 71 84 81 af 7c 7c 6e ab 48 65 47 bb c2 85 20 67 35 e6 e8 c1 7d 35 b6',
        frameHex: '7e 50 aa aa ff ff 0a 12 96 47 d0 20 3b ad 40 62 ff 98 d6 cf 55 01 c3 c4 22 0c 2e 12 c7 73 f8 23 b3 51 c2 f7 7d 5d a9 56 76 3b 2c de 60 5c e8 90 a3 e4 ce e1 76 f8 49 52 40 74 61 2e da 5c 95 90 16 92 ec 4e 4e 35 2e 3a 96 6c 61 c4 1f bf 6f b0 f2 97 65 46 f8 45 e6 2d 4a 18 46 72 bc 8d 76 03 9d bb 71 84 81 af 7c 7c 6e ab 48 65 47 bb c2 85 20 67 35 e6 e8 c1 7d 5d 35 b6 5a 79 7e',
        messageId: 10,
        accessLevel: downlinkCommands.setOperatorParameters.accessLevel,
        commands: [
            downlinkCommands.setOperatorParameters.examples['set default operator parameters request']
        ],
        lrc: 0x3c,
        crc: 0x795a,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'setOperatorParametersExtended',
        hex: '0a 12 00 b3 e2 55 db 0d c3 ca 3f 77 96 bf 89 8b 73 dc',
        frameHex: '7e 50 aa aa ff ff 0a 12 00 b3 e2 55 db 0d c3 ca 3f 77 96 bf 89 8b 73 dc 82 22 7e',
        messageId: 10,
        accessLevel: downlinkCommands.setOperatorParametersExtended.accessLevel,
        commands: [
            downlinkCommands.setOperatorParametersExtended.examples['simple request']
        ],
        lrc: 0x0a,
        crc: 0x2282,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    }
];

const uplinkMessages: TMessageList = [
    {
        name: 'getCurrentStatusMeter',
        hex: '0a 13 cd 8b 0b ef e9 3a 93 85 80 a9 7f 29 e6 fd ea a7 2f 65 27 8a 47 4c e7 12 3d c0 b4 8e 6e 7e 4e 02 a2 94 45 77 ff 55 03 6a 10 89 76 82 1e 97 44 82',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 cd 8b 0b ef e9 3a 93 85 80 a9 7f 29 e6 fd ea a7 2f 65 27 8a 47 4c e7 12 3d c0 b4 8e 6e 7d 5e 4e 02 a2 94 45 77 ff 55 03 6a 10 89 76 82 1e 97 44 82 88 04 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getCurrentStatusMeter.accessLevel,
        commands: [
            uplinkCommands.getCurrentStatusMeter.examples['simple response']
        ],
        lrc: 0x42,
        crc: 0x0488,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getCurrentValues',
        hex: '0a 13 ff 1a 78 5a c9 f1 27 a6 22 6a c8 2f 2d dd d8 dc d8 fa 47 ff df 8e d4 55 6a b4 84 aa 73 5a 04 13 52 ab cf e2 61 65 b0 7e 52 d3 7a 1b 73 34 6c f9 92 5f 1c cc f9 5a d9 98 88 e8 8b 2a 5a b7 17 b4',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 ff 1a 78 5a c9 f1 27 a6 22 6a c8 2f 2d dd d8 dc d8 fa 47 ff df 8e d4 55 6a b4 84 aa 73 5a 04 7d 33 52 ab cf e2 61 65 b0 7d 5e 52 d3 7a 1b 73 34 6c f9 92 5f 1c cc f9 5a d9 98 88 e8 8b 2a 5a b7 17 b4 ef a9 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getCurrentValues.accessLevel,
        commands: [
            uplinkCommands.getCurrentValues.examples['simple response']
        ],
        lrc: 0xd5,
        crc: 0xa9ef,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getEnergy',
        hex: '0a 13 c1 c0 fc 0c c6 46 d4 1c 61 5e 1f 80 98 3d a3 f0 91 1e 7a 8f cd 2f f6 e5 cf 7d 78 fc d0 35 56 0c 16 bb d7 df 0e 2b dc 26 fc 8e 6b 59 c0 fc b3 fd 6f 43 26 0d 72 8d b6 7d bb 60 22 b4 14 cc c0 85',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 c1 c0 fc 0c c6 46 d4 1c 61 5e 1f 80 98 3d a3 f0 91 1e 7a 8f cd 2f f6 e5 cf 7d 5d 78 fc d0 35 56 0c 16 bb d7 df 0e 2b dc 26 fc 8e 6b 59 c0 fc b3 fd 6f 43 26 0d 72 8d b6 7d 5d bb 60 22 b4 14 cc c0 85 3b ac 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getEnergy.accessLevel,
        commands: [
            uplinkCommands.getEnergy.examples['simple response']
        ],
        lrc: 0x76,
        crc: 0xac3b,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getEnergyDayPrevious',
        hex: '0a 13 05 78 ce e7 4d d2 eb 76 a4 d7 9c 24 ba ca 21 c3 6b 48 f6 84 b0 72 2d f3 68 13 5c 86 ec ee 5e f7 e6 6f 7a 9a a0 d1 92 d1 44 e5 1b 29 72 26 c5 4e ff 70 21 00 c6 13 99 9a a7 a8 91 0f 6e bc ab ad 92 cb b8 77 3a dd ee 66 4f 0d 2a 25 22 25 3d 36 d9 24 21 2b 8a d5 b6 d6 04 ee aa ee 2f 8a 57 e9',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 05 78 ce e7 4d d2 eb 76 a4 d7 9c 24 ba ca 21 c3 6b 48 f6 84 b0 72 2d f3 68 7d 33 5c 86 ec ee 5e f7 e6 6f 7a 9a a0 d1 92 d1 44 e5 1b 29 72 26 c5 4e ff 70 21 00 c6 7d 33 99 9a a7 a8 91 0f 6e bc ab ad 92 cb b8 77 3a dd ee 66 4f 0d 2a 25 22 25 3d 36 d9 24 21 2b 8a d5 b6 d6 04 ee aa ee 2f 8a 57 e9 a5 ec 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getEnergyDayPrevious.accessLevel,
        commands: [
            uplinkCommands.getEnergyDayPrevious.examples['simple response'],
            uplinkCommands.getEnergyDayPrevious.examples['response with A-R+R- energy by T1, T4 only']
        ],
        lrc: 0xdb,
        crc: 0xeca5,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getExtendedCurrentValues',
        hex: '0a 13 d2 9b 82 27 38 1d 2a 4c 17 49 86 bd 02 22 3a 93 f3 34 2c 46 fa 17 ec 6e 1e 8d 60 93 a8 41 59 69 70 9f 95 0c c9 c4 77 83 5b 12 74 7f 7a 6a a2 f2',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 d2 9b 82 27 38 1d 2a 4c 17 49 86 bd 02 22 3a 93 f3 34 2c 46 fa 17 ec 6e 1e 8d 60 93 a8 41 59 69 70 9f 95 0c c9 c4 77 83 5b 12 74 7f 7a 6a a2 f2 b0 a5 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getExtendedCurrentValues.accessLevel,
        commands: [
            uplinkCommands.getExtendedCurrentValues.examples['simple response']
        ],
        lrc: 0x3b,
        crc: 0xa5b0,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getHalfHourDemand',
        hex: '0a 13 6a 23 e6 48 a9 0a 82 e1 8f 32 91 17 aa 1e db e5 d4 18 77 83 74 b0 d3 d8 1e 0d 74 13 f6 83 35 76 02 76 1f aa 1d a8 60 67 a9 ba c1 c0 79 e3 ae 8e 6d 79 9f 5f af 31 69 b7 70 06 4d 9e d2 03 4f 24 b8 b3 99 2d 06 87 ed 52 48 e8 af a8 32 31 d1 9f 6e 8e 3f cd 4e 1b bd 03 8e 78 48 18 02 f9 de 1d a0 00 6c 8d 10 44 ee 11 e0 e0 2c 17 79 fe 84 22 b9 a5 c1 c5 0c 41 c0 92 c6 63 76 9b 6d 66 9b b9 9b 45 49 d5 e1 5d 30 91 a4 8c dc ef cc 8c 8c b3 ec 45 0e 78 fc 25 3b 2d 2e 14 b6 4b f2 20 10 a7 3b f7 e1 06 5c 3e 8d 19 02 9a 93 d1 e1 9c 52 3c 7a 1c 24 46 f7 e9 c5 04 b6 ad 00 2c 92 93 8f 50 f6 6f bf 08 73 22 1b cb 0b 4a b5 08 ce ff 15 90 79 3b 0c cd 53 79 e6 36 55 7c e2 19 0f 4c fc 39',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 6a 23 e6 48 a9 0a 82 e1 8f 32 91 17 aa 1e db e5 d4 18 77 83 74 b0 d3 d8 1e 0d 74 7d 33 f6 83 35 76 02 76 1f aa 1d a8 60 67 a9 ba c1 c0 79 e3 ae 8e 6d 79 9f 5f af 31 69 b7 70 06 4d 9e d2 03 4f 24 b8 b3 99 2d 06 87 ed 52 48 e8 af a8 32 31 d1 9f 6e 8e 3f cd 4e 1b bd 03 8e 78 48 18 02 f9 de 1d a0 00 6c 8d 10 44 ee 7d 31 e0 e0 2c 17 79 fe 84 22 b9 a5 c1 c5 0c 41 c0 92 c6 63 76 9b 6d 66 9b b9 9b 45 49 d5 e1 5d 30 91 a4 8c dc ef cc 8c 8c b3 ec 45 0e 78 fc 25 3b 2d 2e 14 b6 4b f2 20 10 a7 3b f7 e1 06 5c 3e 8d 19 02 9a 93 d1 e1 9c 52 3c 7a 1c 24 46 f7 e9 c5 04 b6 ad 00 2c 92 93 8f 50 f6 6f bf 08 73 22 1b cb 0b 4a b5 08 ce ff 15 90 79 3b 0c cd 53 79 e6 36 55 7c e2 19 0f 4c fc 39 da a6 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getHalfHourDemand.accessLevel,
        commands: [
            uplinkCommands.getHalfHourDemand.examples['simple response'],
            uplinkCommands.getHalfHourDemand.examples['response for day when DST start/end']
        ],
        lrc: 0x1e,
        crc: 0xa6da,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getOperatorParameters',
        hex: '0a 13 bf 75 d5 5d 05 b1 3c 7a 01 f8 4d 3c 76 3c 4f a4 22 0c 2e 12 c7 73 f8 23 b3 51 c2 f7 7d a9 56 76 3b 2c de 60 5c e8 90 a3 e4 ce e1 76 f8 49 52 40 74 61 2e da 5c 95 90 16 92 ec 4e 4e 35 2e 3a 96 6c 61 c4 1f bf 6f b0 f2 97 65 46 f8 45 e6 2d 4a 18 46 72 bc 8d 76 03 9d bb 71 84 81 af 7c 7c 6e ab 48 65 47 bb c2 85 20 67 35 e6 e8 c1 7d 35 b6',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 bf 75 d5 5d 05 b1 3c 7a 01 f8 4d 3c 76 3c 4f a4 22 0c 2e 12 c7 73 f8 23 b3 51 c2 f7 7d 5d a9 56 76 3b 2c de 60 5c e8 90 a3 e4 ce e1 76 f8 49 52 40 74 61 2e da 5c 95 90 16 92 ec 4e 4e 35 2e 3a 96 6c 61 c4 1f bf 6f b0 f2 97 65 46 f8 45 e6 2d 4a 18 46 72 bc 8d 76 03 9d bb 71 84 81 af 7c 7c 6e ab 48 65 47 bb c2 85 20 67 35 e6 e8 c1 7d 5d 35 b6 23 8b 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getOperatorParameters.accessLevel,
        commands: [
            uplinkCommands.getOperatorParameters.examples['get default operator parameters response']
        ],
        lrc: 0x3c,
        crc: 0x8b23,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'getOperatorParametersExtended',
        hex: '0a 13 23 47 e6 9f 48 af 43 94 a7 49 ba 8d 4c 81 1b d3',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 23 47 e6 9f 48 af 43 94 a7 49 ba 8d 4c 81 1b d3 d8 10 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getOperatorParametersExtended.accessLevel,
        commands: [
            uplinkCommands.getOperatorParametersExtended.examples['simple response']
        ],
        lrc: 0x74,
        crc: 0x10d8,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    },
    {
        name: 'setOperatorParametersExtended',
        hex: '0a 12 07 c9 cc 32 94 4c 2a 43 61 2c 00 d1 a6 58 26 b4',
        frameHex: '7e 51 aa aa ff ff 0a 12 07 c9 cc 32 94 4c 2a 43 61 2c 00 d1 a6 58 26 b4 1e 07 7e',
        messageId: 10,
        accessLevel: uplinkCommands.setOperatorParametersExtended.accessLevel,
        commands: [
            uplinkCommands.setOperatorParametersExtended.examples['simple response']
        ],
        lrc: 0x07,
        crc: 0x071e,
        frameType: frameTypes.DATA_RESPONSE,
        source: 0xffff,
        destination: 0xaaaa
    }
];


// strip some fields to simplify tests matching
[...downlinkMessages, ...uplinkMessages].forEach(({commands}) => {
    commands.forEach(item => {
        delete item.maxSize;
        delete item.accessLevel;
    });
});


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
