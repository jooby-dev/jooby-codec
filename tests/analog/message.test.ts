/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as message from '../../src/analog/message.js';
import * as downlinkCommands from '../../src/analog/commands/downlink/index.js';
import * as uplinkCommands from '../../src/analog/commands/uplink/index.js';


interface IMessage {
    hex: string,
    commands: Array<{parameters: object, command: unknown}>,
    isValid: boolean
}

type TMessageList = Array<IMessage>;


const downlinkMessages: TMessageList = [
    {
        // SetTime2000 + SetTime2000 + LRC
        hex: '02 05 4e 00 01 e2 40  02 05 4e 00 01 e2 40  55',
        commands: [
            {
                parameters: {sequenceNumber: 78, seconds: 123456},
                command: downlinkCommands.SetTime2000
            },
            {
                parameters: {sequenceNumber: 78, seconds: 123456},
                command: downlinkCommands.SetTime2000
            }
        ],
        isValid: true
    },
    {
        // SetTime2000 + SetTime2000 (no LRC)
        hex: '02 05 4e 00 01 e2 40  02 05 4e 00 01 e2 40',
        commands: [
            {
                parameters: {sequenceNumber: 78, seconds: 123456},
                command: downlinkCommands.SetTime2000
            },
            {
                parameters: {sequenceNumber: 78, seconds: 123456},
                command: downlinkCommands.SetTime2000
            }
        ],
        isValid: false
    }
];

const uplinkMessages: TMessageList = [
    {
        // SetTime2000Response + CurrentMC + DayMC + LRC
        hex: '02 01 01  18 06 0f 83 01 08 0a 0c  16 08 2f 97 55 0c 83 01 08 0a  b5',
        commands: [
            {
                parameters: {status: 1},
                command: uplinkCommands.SetTime2000Response
            },
            {
                parameters: {
                    channelList: [
                        {index: 1, value: 131},
                        {index: 2, value: 8},
                        {index: 3, value: 10},
                        {index: 4, value: 12}
                    ]
                },
                command: uplinkCommands.CurrentMC
            },
            {
                parameters: {
                    startTime2000: 756604800,
                    channelList: [
                        {index: 1, value: 12},
                        {index: 3, value: 131},
                        {index: 5, value: 8},
                        {index: 7, value: 10}
                    ]
                },
                command: uplinkCommands.DayMC
            }
        ],
        isValid: true
    }
];


const checkMessage = ( {hex, commands, isValid}: IMessage ) => {
    const messageData = message.fromHex(hex);

    messageData.commands.forEach((messageCommand, index) => {
        expect(messageCommand.command.parameters).toStrictEqual(commands[index].parameters);
    });

    expect(messageData.isValid).toBe(isValid);
};


describe('downlink messages', () => {
    downlinkMessages.forEach((command, index) => {
        test(`test case #${index}`, () => {
            checkMessage(command);
        });
    });
});

describe('uplink messages', () => {
    uplinkMessages.forEach((command, index) => {
        test(`test case #${index}`, () => {
            checkMessage(command);
        });
    });
});
