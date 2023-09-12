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
        // GetObisIdList + GetObisIdList
        hex: '40 07 03 01 02 02 00 09 01  40 07 04 07 03 02 00 09 01',
        commands: [
            {
                parameters: {
                    requestId: 3,
                    meterProfileId: 1,
                    index: 2,
                    obis: {
                        c: 0,
                        d: 9,
                        e: 1
                    }
                },
                command: downlinkCommands.GetObisIdList
            },
            {
                parameters: {
                    requestId: 4,
                    meterProfileId: 7,
                    index: 3,
                    obis: {
                        c: 0,
                        d: 9,
                        e: 1
                    }
                },
                command: downlinkCommands.GetObisIdList
            }
        ],
        isValid: true
    }
];

const uplinkMessages: TMessageList = [
    {
        // AddObisProfileResponse + ObservationReport
        hex: '49 02 07 00  53 0f 04 2d 18 df 80 32 42 09 51 ec 38 42 35 51 ec',
        commands: [
            {
                parameters: {
                    requestId: 7,
                    resultCode: 0
                },
                command: uplinkCommands.AddObisProfileResponse
            },
            {
                parameters: {
                    meterId: 4,
                    time2000: 756604800,
                    obisValueList: [
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
        // GetObisIdList + GetObisIdListResponse
        hex: '40 07 07 09 01 02 00 09 01  41 04 07 01 c5 c6',
        commands: [
            {
                parameters: {
                    requestId: 7,
                    meterProfileId: 9,
                    index: 1,
                    obis: {
                        c: 0,
                        d: 9,
                        e: 1
                    }
                },
                command: downlinkCommands.GetObisIdList
            },
            {
                parameters: {
                    requestId: 7,
                    isCompleted: true,
                    obisIdList: [197, 198]
                },
                command: uplinkCommands.GetObisIdListResponse
            }
        ],
        isValid: true
    }
];


const checkMessage = ( {hex, commands, isValid}: IMessage ) => {
    const messageDataFromHex = message.fromHex(hex);
    const messageDataFromBase64 = message.fromBase64(Buffer.from(hex.replace(/\s/g, ''), 'hex').toString('base64'));

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

describe('mixed messages', () => {
    mixedMessages.forEach((command, index) => {
        test(`test case #${index}`, () => {
            checkMessage(command);
        });
    });
});
