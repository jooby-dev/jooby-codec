import * as frameUtils from '../../src/analog/utils/frame.js';
import * as downlinkMessage from '../../src/analog/message/downlink.js';
import * as downlinkCommands from '../../src/analog/commands/downlink/index.js';
import {IInvalidMessage, IMessage} from '../../src/analog/message/types.js';
import {ICommand} from '../../src/analog/utils/command.js';


const command1 = {
    bytes: [0x02, 0x05, 0x4e, 0x2b, 0xbd, 0x98, 0xad],
    headerSize: 2,
    id: downlinkCommands.setTime2000.id,
    name: 'setTime2000',
    parameters: {sequenceNumber: 78, seconds: 733845677}
};
const command2 = {
    bytes: [0x03, 0x07, 0x0a, 0x00, 0x64, 0x0c, 0x96, 0x00, 0xe9],
    id: 0x03,
    headerSize: 2,
    name: 'setParameter',
    parameters: {
        id: 10,
        data: {
            loadTime: 100,
            internalResistance: 3222,
            lowVoltage: 233
        }
    }
};
const command3 = {
    bytes: [0x14, 0x00],
    id: 0x14,
    headerSize: 2,
    name: 'getStatus',
    parameters: {}
};


describe('frame validation', () => {
    test('test valid frame', () => {
        const {frame, message: anyMessage} = frameUtils.toFrame(downlinkMessage, [command1, command2]);
        const message = anyMessage as IInvalidMessage;

        expect(frame.isValid).toBe(true);
        expect(message.error).toBe(undefined);
    });

    test('test invalid frame', () => {
        const hex = '7e 02 05 4e 2b bd 98 ab 03 07 0a 00 64 0c 96 00 e9 a6 8a 94 7e';
        const {frame, message: anyMessage} = frameUtils.fromHex(downlinkMessage, hex);
        const message = anyMessage as IInvalidMessage;

        expect(frame.isValid).toBe(false);
        expect(message.error).toBe('mismatch LRC');
    });
});

describe('getCommands', () => {
    test('test valid input', () => {
        const hex = '7e 02 05 4e 2b bd 98 ad 03 07 0a 00 64 0c 96 00 e9 a6 8a 94 7e';
        const {frame, message: anyMessage} = frameUtils.fromHex(downlinkMessage, hex);
        // it must be valid, but need to access to 'error' property which exists only in invalid message
        const invalidMessage = anyMessage as IInvalidMessage;
        const message = anyMessage as IMessage;
        const setTime2000Command = message.commands[0] as ICommand;
        const setParameterCommand = message.commands[1] as ICommand;

        expect(frame.isValid).toBe(true);
        expect(invalidMessage.error).toBe(undefined);
        expect(message.commands.length).toBe(2);
        expect(setTime2000Command.id).toEqual(downlinkCommands.setTime2000.id);
        expect(setParameterCommand.id).toEqual(downlinkCommands.setParameter.id);
    });

    test('test invalid input', () => {
        const hex = '7e 02 05 4e 2b bd 98 ab 03 07 0a 00 64 0c 96 00 e9 a6 8a 94 7e';
        const {frame, message: anyMessage} = frameUtils.fromHex(downlinkMessage, hex);
        const invalidMessage = anyMessage as IInvalidMessage;
        const message = anyMessage as IMessage;

        expect(frame.isValid).toBe(false);
        expect(invalidMessage.error).toBe('mismatch LRC');
        expect(message.commands).toBe(undefined);
    });
});

describe('test fromFrames', () => {
    test('test 1', () => {
        const frame1 = frameUtils.toFrame(downlinkMessage, [command1, command2]);
        const frame2 = frameUtils.toFrame(downlinkMessage, [command3]);
        const result = frameUtils.fromFrames(downlinkMessage, [frame1.frame, frame2.frame]);
        const commands = result.flatMap(({message: anyMessage}) => {
            const message = anyMessage as IMessage;

            return message.commands;
        });

        expect(result.length).toBe(2);
        expect(commands.length).toBe(3);
        expect(commands[0]).toStrictEqual(command1);
        expect(commands[1]).toStrictEqual(command2);
        expect(commands[2]).toStrictEqual(command3);
    });
});
