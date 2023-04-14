/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as message from '../src/utils/message.js';
import getBytesFromHex from '../src/utils/getBytesFromHex.js';
import SetTime2000 from '../src/commands/downlink/SetTime2000.js';


interface IMessage {
    //id: number,
    //size: number,
    hex: string,
    commands: Array<unknown>
}

type TMessageList = Array<IMessage>;


const downlinkMessages: TMessageList = [
    {
        // SetTime2000 + SetTime2000 + LRC
        hex: '02 05 4e 00 01 e2 40  02 05 4e 00 01 e2 40  55',
        // @todo
        commands: [
            {
                parameters: {},
                command: SetTime2000
            }
        ]
    }
];

const uplinkMessages: TMessageList = [
    {
        // SetTime2000 + GetCurrentMC + DataDayMC + LRC
        hex: '02 01 01  18 06 0f 83 01 08 0a 0c  16 08 2f 97 0f 83 01 08 0a 0c  ef',
        commands: []
    }
    // {
    //     // DataHourMC + UnknownCommand + LRC
    //     hex: '17 0c 00 66 f1 01 44 00 00 00 00 00 00 00  5f 3b 00  fe',
    //     commands: []
    // }
];


const checkMessage = ( {hex}: IMessage ) => {
    const messageData = message.fromHex(hex);

    const commands = messageData.commands.map(messageCommand => {
        const commandData = messageCommand.command.toBytes();
        const mergedData = new Uint8Array(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            [...(messageCommand.data.header)].concat([...messageCommand.data.body])
        );

        expect(commandData).toStrictEqual(mergedData);

        return messageCommand.command;
    });

    const bytes = message.toBytes(commands);

    expect(bytes).toStrictEqual(getBytesFromHex(hex));
    expect(messageData.isValid).toBe(true);
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
