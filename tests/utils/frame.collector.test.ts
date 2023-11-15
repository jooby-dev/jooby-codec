import {IFrame} from '../../src/utils/frame.js';
import FrameCollector from '../../src/utils/frameCollector.js';
import getBytesFromHex from '../../src/utils/getBytesFromHex.js';


describe('frame collector tests', () => {
    const collectFrames = ( hexArray: Array<string> ): Array<IFrame> => {
        const frameCollector = new FrameCollector();
        let frames: Array<IFrame> = [];

        for ( let index = 0; index < hexArray.length; index++ ) {
            frames = frames.concat(frameCollector.process(getBytesFromHex(hexArray[index])));
        }

        return frames;
    };

    test('test sequence without frame', () => {
        const sequence = [
            '50 ff ff ff',
            '50 ff ff 7e',
            '50 ff ff ff'
        ];
        const frames = collectFrames(sequence);

        expect(frames.length).toBe(0);
    });

    test('test sequence with empty frame', () => {
        const sequence = [
            '50 ff ff ff',
            '50 ff ff 7e',
            '7e ff ff ff'
        ];
        const frames = collectFrames(sequence);

        expect(frames.length).toBe(0);
    });

    test('test sequence with small frame', () => {
        const sequence = [
            '50 ff ff ff',
            '50 ff ff 7e',
            '10 10 7e ff'
        ];
        const frames = collectFrames(sequence);

        expect(frames.length).toBe(1);
        expect(frames[0].crc.actual !== frames[0].crc.expected).toBe(true);
    });

    test('test sequence with broken frame', () => {
        const sequence = [
            '0f 7e 7d 31 ee 76',
            '78 54 7f 48 3a b8 ed 69',
            '7e ff ff ff'
        ];
        const frames = collectFrames(sequence);

        expect(frames.length).toBe(1);
        expect(frames[0].crc.actual !== frames[0].crc.expected).toBe(true);
    });

    test('test sequence with valid frame', () => {
        const frameBytes = getBytesFromHex(
            '7d 31 20 ee 76 78 54 7f 48 3a b8 ed 69'
        );

        const checkFrame = ( frame: IFrame ) => {
            expect(frame.buffer).toStrictEqual(frameBytes);
            expect(frame.content.length !== 0).toBe(true);
            expect(frame.crc.actual).toStrictEqual(frame.crc.expected);
        };

        const sequence1 = [
            '7e 7d 31 20 ee 76 78 54 7f 48 3a b8 ed 69 7e'
        ];

        let frames = collectFrames(sequence1);
        expect(frames.length).toBe(1);
        checkFrame(frames[0]);

        const sequence2 = [
            '7e 7d 31 20 ee',
            '76 78 54 7f 48 3a b8 ed 69 7e'
        ];
        frames = collectFrames(sequence2);
        expect(frames.length).toBe(1);
        checkFrame(frames[0]);

        const sequence3 = [
            '0f 7e 7d 31 20 ee',
            '76 78 54 7f 48 3a b8 ed 69 7e 89 89'
        ];
        frames = collectFrames(sequence3);
        expect(frames.length).toBe(1);
        checkFrame(frames[0]);

        const sequence4 = [
            '7e 7d 31 20 ee 76 78 54 7f 48 3a b8 ed 69 7e 7e 7d 31 20 ee 76 78 54 7f 48 3a b8 ed 69 7e'
        ];
        frames = collectFrames(sequence4);
        expect(frames.length).toBe(2);
        checkFrame(frames[0]);
        checkFrame(frames[1]);

        const sequence5 = [
            '89 88 7e 7d 31',
            '20 ee 76 78 54 7f 48 3a b8',
            'ed 69 7e 90 90 09 7e 7d 31 20',
            'ee 76 78 54 7f',
            '48 3a b8 ed 69 7e 06 08'
        ];
        frames = collectFrames(sequence5);
        expect(frames.length).toBe(2);
        checkFrame(frames[0]);
        checkFrame(frames[1]);
    });
});
