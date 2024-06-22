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
