import BinaryBuffer from '../src/BinaryBuffer.js';
import getBytesFromHex from '../src/utils/getBytesFromHex.js';
import getHexFromBytes from '../src/utils/getHexFromBytes.js';


const HEX_DATA = '02 05 0c 00 01 e2 40 ff 10 aa 28 9b ae 63 f4 35';
const UINT8_DATA = getBytesFromHex(HEX_DATA);
const UINT16_DATA = new Uint16Array(UINT8_DATA.buffer);
const UINT32_DATA = new Uint32Array(UINT8_DATA.buffer);

// @todo INT8, INT16, INT32


const checkBuffer = ( buffer: BinaryBuffer, dataOrHex: Uint8Array | string, offset = 0, isLittleEndian = true ) => {
    let data: Uint8Array;
    let hex: string;

    if ( typeof dataOrHex === 'string' ) {
        hex = dataOrHex;
        data = getBytesFromHex(hex);
    } else {
        data = dataOrHex;
        hex = getHexFromBytes(data);
    }

    // metadata
    expect(buffer.data).toBeInstanceOf(ArrayBuffer);
    expect(buffer.data.byteLength).toBe(data.length);
    expect(buffer.offset).toBe(offset);
    expect(buffer.isLittleEndian).toBe(isLittleEndian);
    expect(buffer.size).toBe(data.length);
    expect(buffer.position).toBe(offset);
    expect(buffer.bytesLeft).toBe(data.length - offset);

    // content
    expect(buffer.data).toStrictEqual(data.buffer);
    expect(buffer.toUint8Array()).toStrictEqual(data);
    expect(buffer.toHex()).toBe(hex);
    expect(buffer.isEmpty).toBe(offset === data.length);
};


describe('positive cases', () => {
    test('create empty instance', () => {
        const bufferSize = 0;
        const buffer = new BinaryBuffer(bufferSize);

        checkBuffer(buffer, '');
    });

    test('create instance from empty Uint8Array', () => {
        const buffer = new BinaryBuffer(new Uint8Array([]));

        checkBuffer(buffer, '');
    });

    test('create instance from empty hex string', () => {
        const buffer = new BinaryBuffer('');

        checkBuffer(buffer, '');
    });

    test('create instance with zeros of given size', () => {
        const bufferSize = 20;
        const buffer = new BinaryBuffer(bufferSize);

        // zeros
        checkBuffer(buffer, new Uint8Array(new Array(bufferSize).fill(0)));
    });

    test('create instance from Uint8Array', () => {
        const buffer = new BinaryBuffer(UINT8_DATA);

        checkBuffer(buffer, HEX_DATA);
    });

    test('create instance from hex string', () => {
        const buffer = new BinaryBuffer(HEX_DATA);

        checkBuffer(buffer, HEX_DATA);
    });

    test('check Uint8 methods', () => {
        const buffer = new BinaryBuffer(UINT8_DATA.length);

        // fill
        UINT8_DATA.forEach((item, index) => {
            expect(buffer.position).toBe(index);
            buffer.setUint8(item);
        });

        checkBuffer(buffer, UINT8_DATA, UINT8_DATA.length);

        // reset
        buffer.seek(0);

        checkBuffer(buffer, UINT8_DATA, 0);

        // read
        UINT8_DATA.forEach((item, index) => {
            checkBuffer(buffer, UINT8_DATA, index);
            expect(buffer.getUint8()).toBe(UINT8_DATA[index]);
        });
    });

    test('check Uint16 methods', () => {
        const buffer = new BinaryBuffer(UINT8_DATA.length);

        // fill
        UINT16_DATA.forEach((item, index) => {
            expect(buffer.position).toBe(index * 2);
            buffer.setUint16(item);
        });

        checkBuffer(buffer, UINT8_DATA, UINT8_DATA.length);

        // reset
        buffer.seek(0);

        checkBuffer(buffer, UINT8_DATA, 0);

        // read
        UINT16_DATA.forEach((item, index) => {
            checkBuffer(buffer, UINT8_DATA, index * 2);
            expect(buffer.getUint16()).toBe(UINT16_DATA[index]);
        });
    });

    test('check Uint32 methods', () => {
        const buffer = new BinaryBuffer(UINT8_DATA.length);

        // fill
        UINT32_DATA.forEach((item, index) => {
            expect(buffer.position).toBe(index * 4);
            buffer.setUint32(item);
        });

        checkBuffer(buffer, UINT8_DATA, UINT8_DATA.length);

        // reset
        buffer.seek(0);

        checkBuffer(buffer, UINT8_DATA, 0);

        // read
        UINT32_DATA.forEach((item, index) => {
            checkBuffer(buffer, UINT8_DATA, index * 4);
            expect(buffer.getUint32()).toBe(UINT32_DATA[index]);
        });
    });
});
