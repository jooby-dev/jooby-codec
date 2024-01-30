/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as message from '../../src/mtxLora/message.js';
import Command from '../../src/mtxLora/Command.js';
import * as downlinkCommands from '../../src/mtxLora/commands/downlink/index.js';
import * as uplinkCommands from '../../src/mtxLora/commands/uplink/index.js';
import {UNENCRYPTED} from '../../src/mtx/constants/accessLevels.js';
import getHexFromBytes from '../../src/utils/getHexFromBytes.js';
import {DOWNLINK, UPLINK} from '../../src/constants/directions.js';


interface IMessage {
    name: string,
    hex: string,
    direction: number,
    messageId: number,
    accessLevel: number,
    commands: Array<Command>
}

type TMessageList = Array<IMessage>;

const downlinkMessages: TMessageList = [
    {
        name: 'downlink command',
        hex: '0a 10 10 69 05 2a 43 03 05 03',
        messageId: 10,
        direction: DOWNLINK,
        accessLevel: UNENCRYPTED,
        commands: [
            new downlinkCommands.GetHalfhoursEnergies({
                date: {
                    year: 21,
                    month: 2,
                    day: 3
                },
                firstHalfhour: 5,
                halfhoursNumber: 3,
                energies: {
                    'A+': true,
                    'A+R+': true,
                    'A+R-': false,
                    'A-': false,
                    'A-R+': false,
                    'A-R-': false
                }
            })
        ]
    }
];

const uplinkMessages: TMessageList = [
    {
        name: 'uplink commands',
        hex: '10 10 10 78 0c 2a 43 11 11 00 00 10 00 00 00 20 00 69 0d 2a 43 01 01 02 00 00 10 00 00 00 20 00',
        messageId: 16,
        direction: UPLINK,
        accessLevel: UNENCRYPTED,
        commands: [
            new uplinkCommands.GetDayEnergies({
                date: {
                    year: 21,
                    month: 2,
                    day: 3
                },
                energies: [
                    {
                        'A+': 0x1000,
                        'A-R+': 0x2000
                    }
                ]
            }),
            new uplinkCommands.GetHalfhoursEnergies({
                date: {
                    year: 21,
                    month: 2,
                    day: 3
                },
                firstHalfhour: 1,
                halfhoursNumber: 2,
                energies: {
                    'A+': [0x1000, 0x2000]
                }
            })
        ]
    }];


const checkMessage = ( messageParams: IMessage ) => {
    const {hex, messageId, accessLevel, direction, commands} = messageParams;
    const messageBytes = message.toBytes(messageId, accessLevel, commands);
    const messageData = message.fromHex(hex, {direction});

    expect(getHexFromBytes(messageBytes)).toEqual(hex);
    expect(messageData.messageId).toEqual(messageId);
    expect(messageData.accessLevel).toEqual(accessLevel);
    expect(messageData.commands?.map(item => item.command)).toStrictEqual(commands);
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
