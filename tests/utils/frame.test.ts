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

    test('test stuff/unstuff with 7 data bits wide', () => {
        const unstuffedBytes = getBytesFromHex('65 03 02 01 82 7c fe');
        const stuffedBytes = getBytesFromHex('65 03 02 01 7c 02 7d 5c 7d 5f');

        expect(Frame.arrayUnstuff(stuffedBytes, 7)).toStrictEqual(unstuffedBytes);
        expect(Frame.arrayStuff(unstuffedBytes, 7)).toStrictEqual(stuffedBytes);
    });

    test('toFrame on empty array', () => {
        const frame = Frame.toFrame(new Uint8Array());

        expect(frame.bytes).toStrictEqual(new Uint8Array());
        expect(frame.content).toStrictEqual(new Uint8Array());
        expect(frame.crc.actual).toBe(0);
        expect(frame.crc.expected).toBe(undefined);
    });

    test('fromBytes on empty array', () => {
        const frame = Frame.fromBytes(new Uint8Array());

        expect(frame.bytes).toStrictEqual(new Uint8Array());
        expect(frame.content).toStrictEqual(new Uint8Array());
        expect(frame.crc.actual).toBe(0);
        expect(frame.crc.expected).toBe(undefined);
    });

    test('fromBytes with short frame', () => {
        const frameBytes = getBytesFromHex('7e 01 02 7e');
        const frame = Frame.fromBytes(frameBytes);

        expect(frame.bytes).toStrictEqual(frameBytes);
        expect(frame.content).toStrictEqual(new Uint8Array());
        expect(frame.crc.actual).toBe(0);
        expect(frame.crc.expected).toBe(0x0201);
    });

    test('fromBytes with invalid crc', () => {
        const frameBytes = getBytesFromHex(
            '7e 7d 31 20 ee 76 78 54 7f 48 3a b8 69 ed 7e'
        );
        const validFrame = Frame.fromBytes(frameBytes);

        expect(validFrame.bytes).toStrictEqual(frameBytes);
        expect(validFrame.crc.actual).toBe(validFrame.crc.expected);

        // broke crc value
        frameBytes[frameBytes.length - 2] += 1;

        const invalidFrame = Frame.fromBytes(frameBytes);

        expect(invalidFrame.bytes).toStrictEqual(frameBytes);
        expect(invalidFrame.crc.actual === validFrame.crc.actual).toBe(true);
        expect(invalidFrame.crc.actual === invalidFrame.crc.expected).toBe(false);
    });

    const checkFrame = ( frame: string, content: string, dataBits: 7 | 8 = 8 ) => {
        const contentBytes = getBytesFromHex(content);
        const expectedCrc = calculateCrc16(contentBytes);
        const frameBytes = getBytesFromHex(frame);
        const frameTo = Frame.toFrame(contentBytes, dataBits);
        const frameFrom = Frame.fromBytes(frameTo.bytes, dataBits);

        expect(frameTo.bytes).toStrictEqual(frameBytes);
        expect(frameTo.content).toStrictEqual(contentBytes);
        expect(frameTo.crc.actual).toBe(expectedCrc);
        expect(frameTo.crc.expected).toBe(expectedCrc);

        expect(frameTo.bytes).toStrictEqual(frameFrom.bytes);
        expect(frameTo.content).toStrictEqual(frameFrom.content);
        expect(frameTo.crc.actual).toBe(frameFrom.crc.actual);
        expect(frameFrom.crc.expected).toBe(expectedCrc);
    };

    test('frame for simple content', () => {
        checkFrame(
            '7e 00 01 02 03 04 05 06 07 08 09 0a 0b 0c 0d 0e 0f e9 7d 33 7e',
            '00 01 02 03 04 05 06 07 08 09 0a 0b 0c 0d 0e 0f'
        );
    });

    test('frame with stuffing', () => {
        checkFrame(
            '7e 50 ff ff ff fe 25 7d 33 8c 0d ff a4 ee d7 59 71 d7 12 bd e8 e8 5c 7d 5e 2d a3 c3 47 0f 7e',
            '50 ff ff ff fe 25 13 8c 0d ff a4 ee d7 59 71 d7 12 bd e8 e8 5c 7e 2d a3 c3'
        );
    });

    test('frame with stuffing 7 data bits wide', () => {
        checkFrame(
            '7e 65 03 02 01 7c 02 27 66 7e',
            '65 03 02 01 82',
            7
        );
    });

    test('random frame', () => {
        const attempts = 20;

        for ( let attempt = 0; attempt < attempts; attempt++ ) {
            const contentSize = randomInRange(10, 90);
            const contentBytes = new Uint8Array(randomArray(contentSize));
            const expectedCrc = calculateCrc16(contentBytes);
            const frameTo = Frame.toFrame(contentBytes);
            const frameFrom = Frame.fromBytes(frameTo.bytes);

            expect(frameTo.content).toStrictEqual(contentBytes);
            expect(frameTo.crc.actual).toBe(expectedCrc);
            expect(frameTo.crc.expected).toBe(expectedCrc);

            expect(frameTo.content).toStrictEqual(frameFrom.content);
            expect(frameTo.crc.actual).toBe(expectedCrc);
            expect(frameFrom.crc.expected).toBe(expectedCrc);
        }
    });
});
