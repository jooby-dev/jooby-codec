import calculateLrc from '../../src/utils/calculateLrc.js';
import getBytesFromHex from '../../src/utils/getBytesFromHex.js';


describe('check lrc calculation', () => {
    test('empty data', () => {
        expect(calculateLrc([])).toBe(0x55);
    });

    test('simple sequence', () => {
        const hex = '00 01 02 03 04 05 06 07 08 09 0a 0b 0c 0d 0e 0f 55';
        const bytes = getBytesFromHex(hex);

        expect(calculateLrc(bytes)).toBe(0);
    });
});
