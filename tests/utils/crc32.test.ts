import {calculateCrc32, Crc32Type} from '../../src/utils/calculateCrc32.js';


describe('check crc32 calculation', () => {
    test('check crc32 IEEE_8023 calculation', () => {
        const testSequence = [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f];

        expect(calculateCrc32(Crc32Type.IEEE_8023, testSequence)).toBe(0xcecee288);
        expect(calculateCrc32(Crc32Type.IEEE_8023, new Uint8Array(testSequence))).toBe(0xcecee288);
    });
});
