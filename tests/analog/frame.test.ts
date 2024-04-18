/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as Frame from '../../src/analog/utils/frame.js';
import * as downlinkCommands from '../../src/analog/commands/downlink/index.js';


const command1 = new downlinkCommands.SetTime2000({sequenceNumber: 78, seconds: 733845677});
const command2 = new downlinkCommands.SetParameter({
    id: 10,
    data: {
        loadTime: 100,
        internalResistance: 3222,
        lowVoltage: 233
    }
});
const command3 = new downlinkCommands.GetStatus();


describe('frame validation', () => {
    test('test valid frame', () => {
        const {frame, message} = Frame.toFrame([command1, command2]);
        expect(frame.isValid).toBe(true);
        expect(message.isValid).toBe(true);
    });

    test('test invalid frame', () => {
        const hex = '7e 02 05 4e 2b bd 98 ab 03 07 0a 00 64 0c 96 00 e9 a6 8a 94 7e';
        const {frame, message} = Frame.fromHex(hex);

        expect(frame.isValid).toBe(false);
        expect(message.isValid).toBe(false);
    });
});

describe('getCommands', () => {
    test('test valid input', () => {
        const hex = '7e 02 05 4e 2b bd 98 ad 03 07 0a 00 64 0c 96 00 e9 a6 8a 94 7e';
        const frame = Frame.fromHex(hex);
        const strictResult = Frame.getCommands(frame, true);

        expect(frame.frame.isValid).toBe(true);
        expect(frame.message.isValid).toBe(true);
        expect(strictResult.length).toBe(2);
        expect(strictResult[0]).toBeInstanceOf(downlinkCommands.SetTime2000);
        expect(strictResult[1]).toBeInstanceOf(downlinkCommands.SetParameter);

        const nonStrictResult = Frame.getCommands(frame, false);

        expect(nonStrictResult.length).toBe(2);
        expect(nonStrictResult[0]).toBeInstanceOf(downlinkCommands.SetTime2000);
        expect(nonStrictResult[1]).toBeInstanceOf(downlinkCommands.SetParameter);

        expect(strictResult).toStrictEqual(strictResult);
    });

    test('test invalid input', () => {
        const hex = '7e 02 05 4e 2b bd 98 ab 03 07 0a 00 64 0c 96 00 e9 a6 8a 94 7e';
        const frame = Frame.fromHex(hex);
        const strictResult = Frame.getCommands(frame, true);

        expect(frame.frame.isValid).toBe(false);
        expect(frame.message.isValid).toBe(false);
        expect(strictResult.length).toBe(0);

        const nonStrictResult = Frame.getCommands(frame, false);

        expect(nonStrictResult.length).toBe(2);
        expect(nonStrictResult[0]).toBeInstanceOf(downlinkCommands.SetTime2000);
        expect(nonStrictResult[1]).toBeInstanceOf(downlinkCommands.SetParameter);
    });
});

describe('test fromFrames', () => {
    test('test 1', () => {
        const frame1 = Frame.toFrame([command1, command2]);
        const frame2 = Frame.toFrame([command3]);
        const result = Frame.fromFrames([frame1.frame, frame2.frame]);
        const commands = result.flatMap(frame => Frame.getCommands(frame));

        expect(result.length).toBe(2);
        expect(commands.length).toBe(3);
        expect(commands[0]).toStrictEqual(command1);
        expect(commands[1]).toStrictEqual(command2);
        expect(commands[2]).toStrictEqual(command3);
    });
});
