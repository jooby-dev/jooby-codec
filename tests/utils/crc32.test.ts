import calculateCrc32 from '../../src/utils/calculateCrc32.js';
import getBytesFromHex from '../../src/utils/getBytesFromHex.js';


describe('check crc32 calculation', () => {
    test('IEEE_8023', () => {
        const testSequence = '00 01 02 03 04 05 06 07 08 09 0a 0b 0c 0d 0e 0f';
        const testBytes = getBytesFromHex(testSequence);
        const testArray = Array.from(testBytes);
        const expectedCrc = 0xcecee288;

        expect(calculateCrc32(testBytes)).toBe(expectedCrc);
        expect(calculateCrc32(testArray)).toBe(expectedCrc);
    });
});
