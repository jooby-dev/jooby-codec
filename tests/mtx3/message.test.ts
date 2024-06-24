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
    },
    {
        name: 'setOpParams',
        hex: '0a 12 96 47 d0 20 3b ad 40 62 ff 98 d6 cf 55 01 c3 c4 22 0c 2e 12 c7 73 f8 23 b3 51 c2 f7 7d a9 56 76 3b 2c de 60 5c e8 90 a3 e4 ce e1 76 f8 49 52 40 74 61 2e da 5c 95 90 16 92 ec 4e 4e 35 2e 3a 96 6c 61 c4 1f bf 6f b0 f2 97 65 46 f8 45 e6 2d 4a 18 46 72 bc 8d 76 03 9d bb 71 84 81 af 7c 7c 6e ab 48 65 47 bb c2 85 20 67 35 e6 e8 c1 7d 35 b6',
        frameHex: '7e 50 aa aa ff ff 0a 12 96 47 d0 20 3b ad 40 62 ff 98 d6 cf 55 01 c3 c4 22 0c 2e 12 c7 73 f8 23 b3 51 c2 f7 7d 5d a9 56 76 3b 2c de 60 5c e8 90 a3 e4 ce e1 76 f8 49 52 40 74 61 2e da 5c 95 90 16 92 ec 4e 4e 35 2e 3a 96 6c 61 c4 1f bf 6f b0 f2 97 65 46 f8 45 e6 2d 4a 18 46 72 bc 8d 76 03 9d bb 71 84 81 af 7c 7c 6e ab 48 65 47 bb c2 85 20 67 35 e6 e8 c1 7d 5d 35 b6 5a 79 7e',
        messageId: 10,
        accessLevel: downlinkCommands.setOpParams.accessLevel,
        commands: [
            downlinkCommands.setOpParams.examples['set default operator parameters request']
        ],
        lrc: 0x3c,
        crc: 0x795a,
        frameType: frameTypes.DATA_REQUEST,
        source: 0xffff,
        destination: 0xaaaa
    }
];

const uplinkMessages: TMessageList = [
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
        name: 'getOpParams',
        hex: '0a 13 bf 75 d5 5d 05 b1 3c 7a 01 f8 4d 3c 76 3c 4f a4 22 0c 2e 12 c7 73 f8 23 b3 51 c2 f7 7d a9 56 76 3b 2c de 60 5c e8 90 a3 e4 ce e1 76 f8 49 52 40 74 61 2e da 5c 95 90 16 92 ec 4e 4e 35 2e 3a 96 6c 61 c4 1f bf 6f b0 f2 97 65 46 f8 45 e6 2d 4a 18 46 72 bc 8d 76 03 9d bb 71 84 81 af 7c 7c 6e ab 48 65 47 bb c2 85 20 67 35 e6 e8 c1 7d 35 b6',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 bf 75 d5 5d 05 b1 3c 7a 01 f8 4d 3c 76 3c 4f a4 22 0c 2e 12 c7 73 f8 23 b3 51 c2 f7 7d 5d a9 56 76 3b 2c de 60 5c e8 90 a3 e4 ce e1 76 f8 49 52 40 74 61 2e da 5c 95 90 16 92 ec 4e 4e 35 2e 3a 96 6c 61 c4 1f bf 6f b0 f2 97 65 46 f8 45 e6 2d 4a 18 46 72 bc 8d 76 03 9d bb 71 84 81 af 7c 7c 6e ab 48 65 47 bb c2 85 20 67 35 e6 e8 c1 7d 5d 35 b6 23 8b 7e',
        messageId: 10,
        accessLevel: uplinkCommands.getOpParams.accessLevel,
        commands: [
            uplinkCommands.getOpParams.examples['get default operator parameters response']
        ],
        lrc: 0x3c,
        crc: 0x8b23,
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
