import * as message from '../../src/obis-observer/message.js';
import * as downlinkCommands from '../../src/obis-observer/commands/downlink/index.js';
import * as uplinkCommands from '../../src/obis-observer/commands/uplink/index.js';


interface IMessage {
    hex: string,
    commands: Array<{parameters: object, command: unknown}>
}

type TMessageList = Array<IMessage>;


const downlinkMessages: TMessageList = [
    {
        // GetObisIdList + GetMeterIdList
        hex: '40 03 03 05 01  74 02 05 03',
        commands: [
            {
                parameters: {
                    requestId: 3,
                    meterProfileId: 5,
                    index: 1
                },
                command: downlinkCommands.GetObisIdList
            },
            {
                parameters: {
                    requestId: 5,
                    index: 3
                },
                command: downlinkCommands.GetMeterIdList
            }
        ]
    }
];

const uplinkMessages: TMessageList = [
    {
        // SetupObisResponse + ObservationReport
        hex: '43 01 07 53 12 00 00 00 04 2d 18 df 80 32 42 09 51 ec 38 42 35 51 ec',
        commands: [
            {
                parameters: {
                    requestId: 7
                },
                command: uplinkCommands.SetupObisResponse
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
        ]
    }
];

const mixedMessages: TMessageList = [
    {
        // GetObisIdList + GetObisIdListResponse
        hex: '40 03 03 05 01  41 03 04 01 02',
        commands: [
            {
                parameters: {
                    requestId: 3,
                    meterProfileId: 5,
                    index: 1
                },
                command: downlinkCommands.GetObisIdList
            },
            {
                parameters: {
                    requestId: 4,
                    isCompleted: true,
                    obisIdList: [2]
                },
                command: uplinkCommands.GetObisIdListResponse
            }
        ]
    }
];


const checkMessage = ( {hex, commands}: IMessage ) => {
    const messageDataFromHex = message.fromHex(hex);
    const messageDataFromBase64 = message.fromBase64(Buffer.from(hex.replace(/\s/g, ''), 'hex').toString('base64'));

    messageDataFromHex.commands.forEach((messageCommand, index) => {
        expect(messageCommand.command.parameters).toStrictEqual(commands[index].parameters);
    });

    expect(messageDataFromHex).toStrictEqual(messageDataFromBase64);
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
