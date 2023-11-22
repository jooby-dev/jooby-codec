import * as Frame from '../../src/utils/frame.js';
import calculateCrc16 from '../../src/utils/calculateCrc16.js';
import getBytesFromHex from '../../src/utils/getBytesFromHex.js';


const randomInRange = ( min: number, max: number ): number => Math.floor(Math.random() * (max - min + 1)) + min;
const randomArray = ( size: number ) => Array(size).fill(0).map(() => randomInRange(1, 0xff));

describe('frame tests', () => {
    test('test stuff/unstuff', () => {
        const unstuffedBytes = getBytesFromHex(
            '50 ff ff ff fe 25 13 8c 0d ff a4 ee d7 59 71 d7 12 bd e8 e8 5c 7e 2d a3 c3'
        );
        const stuffedBytes = getBytesFromHex(
            '50 ff ff ff fe 25 7d 33 8c 0d ff a4 ee d7 59 71 d7 12 bd e8 e8 5c 7d 5e 2d a3 c3'
        );

        expect(Frame.arrayUnstuff(stuffedBytes)).toStrictEqual(unstuffedBytes);
        expect(Frame.arrayStuff(unstuffedBytes)).toStrictEqual(stuffedBytes);
    });

    test('toFrame on empty array', () => {
        const frame = Frame.toFrame(new Uint8Array());

        expect(frame.buffer).toStrictEqual(new Uint8Array());
        expect(frame.content).toStrictEqual(new Uint8Array());
        expect(frame.crc.actual).toBe(0);
        expect(frame.crc.expected).toBe(undefined);
    });

    test('fromBytes on empty array', () => {
        const frame = Frame.fromBytes(new Uint8Array());

        expect(frame.buffer).toStrictEqual(new Uint8Array());
        expect(frame.content).toStrictEqual(new Uint8Array());
        expect(frame.crc.actual).toBe(0);
        expect(frame.crc.expected).toBe(undefined);
    });

    test('fromBytes with short frame', () => {
        const frameBytes = getBytesFromHex('7e 01 02 7e');
        const frame = Frame.fromBytes(frameBytes);

        expect(frame.buffer).toStrictEqual(frameBytes);
        expect(frame.content).toStrictEqual(new Uint8Array());
        expect(frame.crc.actual).toBe(0);
        expect(frame.crc.expected).toBe(0x0201);
    });

    test('fromBytes with invalid crc', () => {
        const frameBytes = getBytesFromHex(
            '7e 7d 31 20 ee 76 78 54 7f 48 3a b8 69 ed 7e'
        );
        const validFrame = Frame.fromBytes(frameBytes);

        expect(validFrame.buffer).toStrictEqual(frameBytes);
        expect(validFrame.crc.actual).toBe(validFrame.crc.expected);

        // broke crc value
        frameBytes[frameBytes.length - 2] += 1;

        const invalidFrame = Frame.fromBytes(frameBytes);

        expect(invalidFrame.buffer).toStrictEqual(frameBytes);
        expect(invalidFrame.crc.actual === validFrame.crc.actual).toBe(true);
        expect(invalidFrame.crc.actual === invalidFrame.crc.expected).toBe(false);
    });

    test('frame for simple content', () => {
        const contentBytes = getBytesFromHex(
            '00 01 02 03 04 05 06 07 08 09 0a 0b 0c 0d 0e 0f'
        );
        const expectedCrc = 0x13e9;
        const frameBytes = getBytesFromHex(
            '7e 00 01 02 03 04 05 06 07 08 09 0a 0b 0c 0d 0e 0f e9 7d 33 7e'
        );
        const frameTo = Frame.toFrame(contentBytes);
        const frameFrom = Frame.fromBytes(frameTo.buffer);

        expect(frameTo.buffer).toStrictEqual(frameBytes);
        expect(frameTo.content).toStrictEqual(contentBytes);
        expect(frameTo.crc.actual).toBe(expectedCrc);
        expect(frameTo.crc.expected).toBe(expectedCrc);

        expect(frameTo.buffer).toStrictEqual(frameFrom.buffer);
        expect(frameTo.content).toStrictEqual(frameFrom.content);
        expect(frameTo.crc.actual).toBe(frameFrom.crc.actual);
        expect(frameFrom.crc.expected).toBe(expectedCrc);
    });

    test('frame with stuffing', () => {
        const contentBytes = getBytesFromHex(
            '50 ff ff ff fe 25 13 8c 0d ff a4 ee d7 59 71 d7 12 bd e8 e8 5c 7e 2d a3 c3'
        );
        const expectedCrc = calculateCrc16(contentBytes);
        const frameBytes = getBytesFromHex(
            '7e 50 ff ff ff fe 25 7d 33 8c 0d ff a4 ee d7 59 71 d7 12 bd e8 e8 5c 7d 5e 2d a3 c3 47 0f 7e'
        );
        const frameTo = Frame.toFrame(contentBytes);
        const frameFrom = Frame.fromBytes(frameTo.buffer);

        expect(frameTo.buffer).toStrictEqual(frameBytes);
        expect(frameTo.content).toStrictEqual(contentBytes);
        expect(frameTo.crc.actual).toBe(expectedCrc);
        expect(frameTo.crc.expected).toBe(expectedCrc);

        expect(frameTo.buffer).toStrictEqual(frameFrom.buffer);
        expect(frameTo.content).toStrictEqual(frameFrom.content);
        expect(frameTo.crc.actual).toBe(expectedCrc);
        expect(frameFrom.crc.expected).toBe(expectedCrc);
    });

    test('random frame', () => {
        const attempts = 20;

        for ( let attempt = 0; attempt < attempts; attempt++ ) {
            const contentSize = randomInRange(10, 90);
            const contentBytes = new Uint8Array(randomArray(contentSize));
            const expectedCrc = calculateCrc16(contentBytes);
            const frameTo = Frame.toFrame(contentBytes);
            const frameFrom = Frame.fromBytes(frameTo.buffer);

            expect(frameTo.content).toStrictEqual(contentBytes);
            expect(frameTo.crc.actual).toBe(expectedCrc);
            expect(frameTo.crc.expected).toBe(expectedCrc);

            expect(frameTo.content).toStrictEqual(frameFrom.content);
            expect(frameTo.crc.actual).toBe(expectedCrc);
            expect(frameFrom.crc.expected).toBe(expectedCrc);
        }
    });
});
