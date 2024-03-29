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
    fromBytesOptions: message.IFromBytesOptions,
    toBytesOptions: message.IToBytesOptions,
    commands: Array<Command>
}

type TMessageList = Array<IMessage>;

const downlinkMessages: TMessageList = [
    {
        name: 'downlink command',
        hex: '0a 10 10 6f 05 2a 43 03 05 03 00 43',
        fromBytesOptions: {
            direction: DOWNLINK
        },
        toBytesOptions: {
            messageId: 10,
            accessLevel: UNENCRYPTED
        },
        commands: [
            new downlinkCommands.GetHalfhoursEnergies({
                date: {
                    year: 21,
                    month: 2,
                    date: 3
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
        hex: '0a 10 10 78 08 2a 43 11 11 10 00 20 00 6f 09 2a 43 01 01 02 10 00 20 00 00 51',
        fromBytesOptions: {
            direction: UPLINK
        },
        toBytesOptions: {
            messageId: 10,
            accessLevel: UNENCRYPTED
        },
        commands: [
            new uplinkCommands.GetDayEnergies({
                date: {
                    year: 21,
                    month: 2,
                    date: 3
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
                    date: 3
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
    const {hex, toBytesOptions, fromBytesOptions: config, commands} = messageParams;
    const messageBytes = message.toBytes(commands, toBytesOptions);
    const messageData = message.fromHex(hex, config);

    expect(getHexFromBytes(messageBytes)).toEqual(hex);
    expect(messageData.messageId).toEqual(toBytesOptions.messageId);
    expect(messageData.accessLevel).toEqual(toBytesOptions.accessLevel);
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
