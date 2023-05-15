/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as message from '../../src/obis-observer/message.js';
import * as downlinkCommands from '../../src/obis-observer/commands/downlink/index.js';
import * as uplinkCommands from '../../src/obis-observer/commands/uplink/index.js';


interface IMessage {
    hex: string,
    commands: Array<{parameters: object, command: unknown}>,
    isValid: boolean
}

type TMessageList = Array<IMessage>;


const downlinkMessages: TMessageList = [
    {
        // GetShortName + GetShortName
        hex: '01 02 00 09 01  01 02 00 09 01',
        commands: [
            {
                parameters: {
                    obis: {
                        c: 0,
                        d: 9,
                        e: 1
                    }
                },
                command: downlinkCommands.GetShortName
            },
            {
                parameters: {
                    obis: {
                        c: 0,
                        d: 9,
                        e: 1
                    }
                },
                command: downlinkCommands.GetShortName
            }
        ],
        isValid: true
    }
];

const uplinkMessages: TMessageList = [
    {
        // AddShortNameProfileResponse + GetShortNameResponse
        hex: '06 20 00  18 0f 2d 18 df 80 32 42 09 51 ec 38 42 35 51 ec',
        commands: [
            {
                parameters: {
                    shortName: 32,
                    resultCode: 0
                },
                command: uplinkCommands.AddShortNameProfileResponse
            },
            {
                parameters: {
                    time: 756604800,
                    shortNameList: [
                        {code: 50, content: 34.33},
                        {code: 56, content: 45.33}
                    ]
                },
                command: uplinkCommands.ObservationReport
            }
        ],
        isValid: true
    }
];

const mixedMessages: TMessageList = [
    {
        // GetShortName + GetShortNameResponse
        hex: '01 02 00 09 01  02 06 02 00 09 01 c5 c6',
        commands: [
            {
                parameters: {
                    obis: {
                        c: 0,
                        d: 9,
                        e: 1
                    }
                },
                command: downlinkCommands.GetShortName
            },
            {
                parameters: {
                    obis: {
                        c: 0,
                        d: 9,
                        e: 1
                    },
                    shortNameList: [197, 198]
                },
                command: uplinkCommands.GetShortNameResponse
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

describe('mixed messages', () => {
    mixedMessages.forEach((command, index) => {
        test(`test case #${index}`, () => {
            checkMessage(command);
        });
    });
});
