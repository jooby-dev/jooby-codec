/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import * as message from '../../src/mtx/message/index.js';
//import * as downlinkCommands from '../../src/mtx/commands/downlink/index.js';
//import * as uplinkCommands from '../../src/mtx/commands/uplink/index.js';
//import * as accessLevels from '../../src/mtx/constants/accessLevels.js';
//import * as frameTypes from '../../src/mtx/constants/frameTypes.js';
import {checkMessage, TMessageList} from '../mtx/message.test.js';


const downlinkMessages: TMessageList = [
    // {
    //     name: 'getBuildVersion',
    //     hex: '0a 13 2e a2 48 fd 55 cd 7b a3 d0 b0 c5 3d 2b 18 05 29',
    //     frameHex: '7e 50 aa aa ff ff 0a 7d 33 2e a2 48 fd 55 cd 7b a3 d0 b0 c5 3d 2b 18 05 29 30 fc 7e',
    //     messageId: 10,
    //     accessLevel: downlinkCommands.getBuildVersion.accessLevel,
    //     commands: [
    //         downlinkCommands.getBuildVersion.examples['simple request']
    //     ],
    //     lrc: 0x36,
    //     crc: 0xfc30,
    //     frameType: frameTypes.DATA_REQUEST,
    //     source: 0xffff,
    //     destination: 0xaaaa
    // }
];

const uplinkMessages: TMessageList = [
    // {
    //     name: 'getBuildVersion',
    //     hex: '0a 13 9b 4b f7 2a d1 e5 49 a5 09 50 9a 59 7e c2 b5 88',
    //     frameHex: '7e 51 aa aa ff ff 0a 7d 33 9b 4b f7 2a d1 e5 49 a5 09 50 9a 59 7d 5e c2 b5 88 21 54 7e',
    //     messageId: 10,
    //     accessLevel: uplinkCommands.getBuildVersion.accessLevel,
    //     commands: [
    //         uplinkCommands.getBuildVersion.examples['2021.09.16/0.0.9']
    //     ],
    //     lrc: 0x35,
    //     crc: 0x5421,
    //     frameType: frameTypes.DATA_RESPONSE,
    //     source: 0xffff,
    //     destination: 0xaaaa
    // }
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
