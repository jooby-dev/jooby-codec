/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as Message from '../../src/analog/message.js';
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
    const messageDataFromHex = Message.fromHex(hex);
    const messageDataFromBase64 = Message.fromBase64(Buffer.from(hex.replace(/\s/g, ''), 'hex').toString('base64'));

    messageDataFromHex.commands.forEach((messageCommand, index) => {
        expect(messageCommand.command.parameters).toStrictEqual(commands[index].parameters);
    });

    expect(messageDataFromHex).toStrictEqual(messageDataFromBase64);
    expect(messageDataFromHex.isValid).toBe(isValid);
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

describe('message validation', () => {
    test('test valid input', () => {
        const hex = '02 05 4e 2b bd 98 ad 03 07 0a 00 64 0c 96 00 e9 a6';
        const message = Message.fromHex(hex);

        expect(message.isValid).toBe(true);
    });

    test('test invalid input', () => {
        const hex = '02 05 4e 2b bd 98 ab 03 07 0a 00 64 0c 96 00 e9 a6';
        const message = Message.fromHex(hex);

        expect(message.isValid).toBe(false);
    });
});

describe('getCommands', () => {
    test('test valid input', () => {
        const hex = '02 05 4e 2b bd 98 ad 03 07 0a 00 64 0c 96 00 e9 a6';
        const message = Message.fromHex(hex);
        const strictResult = Message.getCommands(message, true);

        expect(strictResult.length).toBe(2);
        expect(strictResult[0]).toBeInstanceOf(downlinkCommands.SetTime2000);
        expect(strictResult[1]).toBeInstanceOf(downlinkCommands.SetParameter);

        const nonStrictResult = Message.getCommands(message, false);

        expect(nonStrictResult.length).toBe(2);
        expect(nonStrictResult[0]).toBeInstanceOf(downlinkCommands.SetTime2000);
        expect(nonStrictResult[1]).toBeInstanceOf(downlinkCommands.SetParameter);

        expect(strictResult).toStrictEqual(strictResult);
    });

    describe('test invalid input', () => {
        const hex = '02 05 4e 2b bd 98 ab 03 07 0a 00 64 0c 96 00 e9 a6';
        const message = Message.fromHex(hex);
        const strictResult = Message.getCommands(message, true);

        expect(message.isValid).toBe(false);
        expect(strictResult.length).toBe(0);

        const nonStrictResult = Message.getCommands(message, false);

        expect(message.isValid).toBe(false);
        expect(nonStrictResult.length).toBe(2);
        expect(nonStrictResult[0]).toBeInstanceOf(downlinkCommands.SetTime2000);
        expect(nonStrictResult[1]).toBeInstanceOf(downlinkCommands.SetParameter);
    });
});
