/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as message from '../src/utils/message.js';
import * as downlinkCommands from '../src/commands/downlink/index.js';
import {DOWNLINK, UPLINK} from '../src/constants/directions.js';


interface IMessage {
    hex: string,
    commands: Array<{parameters: object, command: unknown}>,
    isValid: boolean
}

type TMessageList = Array<IMessage>;


const downlinkMessages: TMessageList = [
    {
        // GetShortName + GetShortName
        hex: '01 0a 08 00 09 01  01 0a 07 00 09 01',
        commands: [
            {
                parameters: {
                    obis: {
                        groupA: 8,
                        groupC: 0,
                        groupD: 9,
                        groupE: 1
                    }
                },
                command: downlinkCommands.GetShortName
            },
            {
                parameters: {
                    obis: {
                        groupA: 7,
                        groupC: 0,
                        groupD: 9,
                        groupE: 1
                    }
                },
                command: downlinkCommands.GetShortName
            }
        ],
        isValid: true
    }
];

const uplinkMessages: TMessageList = [];


const checkMessage = ( {hex, commands, isValid}: IMessage, direction: typeof DOWNLINK | typeof UPLINK ) => {
    const messageData = message.fromHex(hex, direction);

    messageData.commands.forEach((messageCommand, index) => {
        expect(messageCommand.command.parameters).toStrictEqual(commands[index].parameters);
    });

    expect(messageData.isValid).toBe(isValid);
};


describe('downlink messages', () => {
    downlinkMessages.forEach((command, index) => {
        test(`test case #${index}`, () => {
            checkMessage(command, DOWNLINK);
        });
    });
});

describe.skip('uplink messages', () => {
    uplinkMessages.forEach((command, index) => {
        test(`test case #${index}`, () => {
            checkMessage(command, UPLINK);
        });
    });
});
