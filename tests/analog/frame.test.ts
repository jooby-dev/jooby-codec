/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as frameUtils from '../../src/analog/utils/frame.js';
import * as messageImplementations from '../../src/analog/message/index.js';
import * as downlinkCommands from '../../src/analog/commands/downlink/index.js';


const command1 = {
    id: downlinkCommands.setTime2000.id,
    parameters: {sequenceNumber: 78, seconds: 733845677}
};
const command2 = {
    id: downlinkCommands.setParameter.id,
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
    id: downlinkCommands.getStatus.id,
    parameters: {}
};


describe('frame validation', () => {
    test('test valid frame', () => {
        const {frame/* , message */} = frameUtils.toFrame(messageImplementations.downlink, [command1, command2]);
        expect(frame.isValid).toBe(true);
        // expect(message.error).toBe(undefined);
    });

    test('test invalid frame', () => {
        const hex = '7e 02 05 4e 2b bd 98 ab 03 07 0a 00 64 0c 96 00 e9 a6 8a 94 7e';
        const {frame/* , message */} = frameUtils.fromHex(messageImplementations.downlink, hex);

        expect(frame.isValid).toBe(false);
        // expect(message.error).toBe(false);
    });
});

// describe('getCommands', () => {
//     test('test valid input', () => {
//         const hex = '7e 02 05 4e 2b bd 98 ad 03 07 0a 00 64 0c 96 00 e9 a6 8a 94 7e';
//         const frame = frame.fromHex(hex);
//         const strictResult = Frame.getCommands(frame, true);

//         expect(frame.frame.isValid).toBe(true);
//         expect(frame.message.isValid).toBe(true);
//         expect(strictResult.length).toBe(2);
//         expect(strictResult[0]).toBeInstanceOf(downlinkCommands.SetTime2000);
//         expect(strictResult[1]).toBeInstanceOf(downlinkCommands.SetParameter);

//         const nonStrictResult = Frame.getCommands(frame, false);

//         expect(nonStrictResult.length).toBe(2);
//         expect(nonStrictResult[0]).toBeInstanceOf(downlinkCommands.SetTime2000);
//         expect(nonStrictResult[1]).toBeInstanceOf(downlinkCommands.SetParameter);

//         expect(strictResult).toStrictEqual(strictResult);
//     });

//     test('test invalid input', () => {
//         const hex = '7e 02 05 4e 2b bd 98 ab 03 07 0a 00 64 0c 96 00 e9 a6 8a 94 7e';
//         const frame = Frame.fromHex(hex);
//         const strictResult = Frame.getCommands(frame, true);

//         expect(frame.frame.isValid).toBe(false);
//         expect(frame.message.isValid).toBe(false);
//         expect(strictResult.length).toBe(0);

//         const nonStrictResult = Frame.getCommands(frame, false);

//         expect(nonStrictResult.length).toBe(2);
//         expect(nonStrictResult[0]).toBeInstanceOf(downlinkCommands.SetTime2000);
//         expect(nonStrictResult[1]).toBeInstanceOf(downlinkCommands.SetParameter);
//     });
// });

describe('test fromFrames', () => {
    test('test 1', () => {
        const frame1 = frameUtils.toFrame(messageImplementations.downlink, [command1, command2]);
        const frame2 = frameUtils.toFrame(messageImplementations.downlink, [command3]);
        const result = frameUtils.fromFrames(messageImplementations.downlink, [frame1.frame, frame2.frame]);
        // message unknown
        // const commands = result.flatMap(({message}) => message.commands);

        expect(result.length).toBe(2);
        // expect(commands.length).toBe(3);
        // expect(commands[0]).toStrictEqual(command1);
        // expect(commands[1]).toStrictEqual(command2);
        // expect(commands[2]).toStrictEqual(command3);
    });
});
