import {calculateCrc16, Crc16Type} from '../../src/utils/calculateCrc16.js';


describe('check crc16 calculation', () => {
    test('check crc16 x25 calculation', () => {
        const testSequence = new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f]);

        expect(calculateCrc16(Crc16Type.X25, testSequence)).toBe(0x13E9);
    });
});
