import FrameCollector from '../../src/utils/frameCollector.js';
import getBytesFromHex from '../../src/utils/getBytesFromHex.js';
import getHexFromBytes from '../../src/utils/getHexFromBytes.js';


const collectFrames = ( sequence: Array<string> ): Array<string> => {
    const frameCollector = new FrameCollector();
    let frames: Array<string> = [];

    sequence.forEach( data => {
        const result = frameCollector.process(getBytesFromHex(data));
        const resultHex = result.map(value => getHexFromBytes(value));

        frames = [...frames, ...resultHex];
    });

    return frames;
};


describe('frame collector', () => {
    test('empty data', () => {
        expect(new FrameCollector().process([])).toStrictEqual([]);
    });

    test('wrong sequence', () => {
        const hex = '00 01 02 03 04 7e 02';
        const bytes = getBytesFromHex(hex);

        expect(new FrameCollector().process(bytes)).toStrictEqual([]);
    });

    test('correct sequence 1', () => {
        const input = ['7e 52 ff fe ff fe 51 14 7e'];

        expect(collectFrames(input)).toStrictEqual(['7e 52 ff fe ff fe 51 14 7e']);
    });

    test('correct sequence 2', () => {
        const input = [
            '7e 52 ff',
            'fe ff fe 51 14 7e'
        ];

        expect(collectFrames(input)).toStrictEqual(['7e 52 ff fe ff fe 51 14 7e']);
    });

    test('correct sequence 3', () => {
        const input = [
            '7e 52 ff fe ff fe 51 14 7e 7e 52 ff',
            'fe ff fe 51 14 7e'
        ];

        expect(collectFrames(input)).toStrictEqual([
            '7e 52 ff fe ff fe 51 14 7e',
            '7e 52 ff fe ff fe 51 14 7e'
        ]);
    });

    test('correct sequence 4', () => {
        const input = ['22 43 7e 52 ff fe ff fe 51 14 7e'];

        expect(collectFrames(input)).toStrictEqual(['7e 52 ff fe ff fe 51 14 7e']);
    });
});
