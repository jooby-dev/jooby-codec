import calculateCrc16 from '../../src/utils/calculateCrc16.js';
import getBytesFromHex from '../../src/utils/getBytesFromHex.js';


describe('check crc16 calculation', () => {
    test('x25', () => {
        const testSequence = '00 01 02 03 04 05 06 07 08 09 0a 0b 0c 0d 0e 0f';
        const testBytes = getBytesFromHex(testSequence);
        const expectedCrc = 0x13e9;

        expect(calculateCrc16(testBytes)).toBe(expectedCrc);
    });
});
