/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as Message from '../../src/analog/message.js';
import * as downlinkCommands from '../../src/analog/commands/downlink/index.js';
import * as uplinkCommands from '../../src/analog/commands/uplink/index.js';
import getBytesFromHex from '../../src/utils/getBytesFromHex.js';
import {DOWNLINK, UPLINK} from '../../src/constants/directions.js';
import {MTXLORA} from '../../src/analog/constants/hardwareTypes.js';


interface IMessage {
    hex: string,
    commands: Array<{parameters: object, command: unknown, config?: unknown}>,
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

const mtxUplinkMessages: TMessageList = [
    {
        hex: '1e28c4314d1010796430280fff011d00000008001a00000008001d00000008011d00000008001a00000033',
        commands: [
            {
                parameters: {
                    sequence: 196,
                    fragmentIndex: 1,
                    fragmentsNumber: 3,
                    last: false,
                    data: getBytesFromHex('4d1010796430280fff011d00000008001a00000008001d00000008011d00000008001a000000')
                },
                command: uplinkCommands.MtxCommand
            }
        ],
        isValid: true
    },
    {
        hex: '1e21c4b31d00000008013a00000008013a00000008013a00000008013a00000008000063d0b9e5e7',
        commands: [
            {
                parameters: {
                    sequence: 196,
                    fragmentIndex: 3,
                    fragmentsNumber: 3,
                    last: true,
                    data: getBytesFromHex('1d00000008013a00000008013a00000008013a00000008013a000000080000')
                },
                command: uplinkCommands.MtxCommand
            },
            {
                parameters: {
                    sequenceNumber: 208,
                    status: {
                        isLockedOut: true,
                        isMagneticInfluence: false,
                        isMeterCaseOpen: true,
                        isMeterFailure: true,
                        isMeterProgramRestarted: true,
                        isMeterTerminalBoxOpen: false,
                        isModuleCompartmentOpen: true,
                        isNewTariffPlanReceived: false,
                        isParametersSetLocally: true,
                        isParametersSetRemotely: false,
                        isTariffPlanChanged: false,
                        isTimeCorrected: true,
                        isTimeSet: false
                    }
                },
                config: {hardwareType: MTXLORA},
                command: uplinkCommands.LastEvent
            }
        ],
        isValid: true
    }
];

const checkMessage = ( {hex, commands, isValid}: IMessage, config?: Message.IMessageConfig ) => {
    const messageDataFromHex = Message.fromHex(hex, config);
    const messageDataFromBase64 = Message.fromBase64(Buffer.from(hex.replace(/\s/g, ''), 'hex').toString('base64'), config);

    messageDataFromHex.commands.forEach((messageCommand, index) => {
        expect(messageCommand.command.parameters).toStrictEqual(commands[index].parameters);
    });

    expect(messageDataFromHex).toStrictEqual(messageDataFromBase64);
    expect(messageDataFromHex.isValid).toBe(isValid);
};

const checkMessages = ( description: string, messages: TMessageList, config?: Message.IMessageConfig ) => (
    describe(description, () => {
        messages.forEach((commands, index) => {
            test(`test case #${index}`, () => {
                checkMessage(commands, config);
            });
        });
    })
);


checkMessages('downlink messages', downlinkMessages);
checkMessages('downlink messages with config', downlinkMessages, {direction: DOWNLINK});

checkMessages('uplink messages', uplinkMessages);
checkMessages('uplink messages with config', uplinkMessages, {direction: UPLINK});

checkMessages('mtx uplink messages', mtxUplinkMessages, {direction: UPLINK, hardwareType: MTXLORA});

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

    test('test invalid input', () => {
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
