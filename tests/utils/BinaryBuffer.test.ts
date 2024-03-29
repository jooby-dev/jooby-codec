import {TBytes} from '../../src/types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../src/utils/BinaryBuffer.js';
import getBytesFromHex from '../../src/utils/getBytesFromHex.js';
import getHexFromBytes from '../../src/utils/getHexFromBytes.js';


const HEX_DATA = '00 02 0c 05 01 e2 40 ff 10 aa 28 9b ae 63 f4 35';

const UINT8_DATA = getBytesFromHex(HEX_DATA);
const INT8_DATA = [...new Int8Array(UINT8_DATA)];

const UINT16_DATA: TBytes = [...new Uint16Array(new Uint8Array(UINT8_DATA).buffer)];
const INT16_DATA: TBytes = [...new Int16Array(new Uint8Array(UINT8_DATA).buffer)];

const UINT32_DATA: TBytes = [...new Uint32Array(new Uint8Array(UINT8_DATA).buffer)];
const INT32_DATA: TBytes = [...new Int32Array(new Uint8Array(UINT8_DATA).buffer)];

// [0,2, 0,4] -> [2,0, 4,0]
const UINT8_16_BE_DATA: TBytes = [...new Uint16Array(new Uint8Array(UINT8_DATA).buffer)]
    .map(value => [...new Uint8Array(new Uint16Array([value]).buffer)].reverse()).flat();

// [0,1,2,3, 4,5,6,7] -> [3,2,1,0, 7,6,5,4]
const UINT8_32_BE_DATA: TBytes = [...new Uint32Array(new Uint8Array(UINT8_DATA).buffer)]
    .map(value => [...new Uint8Array(new Uint32Array([value]).buffer)].reverse()).flat();


const checkBuffer = ( buffer: IBinaryBuffer, dataOrHex: TBytes | string, offset = 0, isLittleEndian = true ) => {
    let bytes: TBytes;
    let hex: string;

    if ( typeof dataOrHex === 'string' ) {
        hex = dataOrHex;
        bytes = getBytesFromHex(hex);
    } else {
        bytes = dataOrHex;
        hex = getHexFromBytes(bytes);
    }

    // metadata
    expect(buffer.data).toBeInstanceOf(Array);
    expect(buffer.data.length).toBe(bytes.length);
    expect(buffer.offset).toBe(offset);
    expect(buffer.isLittleEndian).toBe(isLittleEndian);
    expect(buffer.size).toBe(bytes.length);
    expect(buffer.position).toBe(offset);
    expect(buffer.bytesLeft).toBe(bytes.length - offset);

    // content
    // console.log('buffer.data:', buffer.data);
    // console.log('bytes:', bytes);
    expect(buffer.data).toStrictEqual(bytes);
    //expect(buffer.data).toStrictEqual(data);
    expect(getHexFromBytes(buffer.data)).toBe(hex);
    expect(buffer.isEmpty).toBe(offset === bytes.length);
};


describe('positive cases', () => {
    test('create empty instance', () => {
        const bufferSize = 0;
        const buffer: IBinaryBuffer = new BinaryBuffer(bufferSize);

        checkBuffer(buffer, '');
    });

    test('create instance from empty Array', () => {
        const buffer: IBinaryBuffer = new BinaryBuffer([]);

        checkBuffer(buffer, '');
    });

    test('create instance from empty hex string', () => {
        const buffer: IBinaryBuffer = new BinaryBuffer(getBytesFromHex(''));

        checkBuffer(buffer, '');
    });

    test('create instance with zeros of given size', () => {
        const bufferSize = 20;
        const buffer: IBinaryBuffer = new BinaryBuffer(bufferSize);

        // zeros
        checkBuffer(buffer, new Array(bufferSize).fill(0));
    });

    test('create instance from template', () => {
        const buffer: IBinaryBuffer = new BinaryBuffer(UINT8_DATA);

        checkBuffer(buffer, HEX_DATA);
    });

    test('create instance from hex string', () => {
        const buffer: IBinaryBuffer = new BinaryBuffer(getBytesFromHex(HEX_DATA));

        checkBuffer(buffer, HEX_DATA);
    });

    test('check Uint8 methods', () => {
        const buffer: IBinaryBuffer = new BinaryBuffer(UINT8_DATA.length);

        // fill
        UINT8_DATA.forEach((item, index) => {
            expect(buffer.position).toBe(index);
            buffer.setUint8(item);
        });

        checkBuffer(buffer, UINT8_DATA, UINT8_DATA.length);
        //console.log('buffer:', buffer);

        // reset
        buffer.seek(0);

        checkBuffer(buffer, UINT8_DATA, 0);

        // read
        UINT8_DATA.forEach((item, index) => {
            checkBuffer(buffer, UINT8_DATA, index);
            expect(buffer.getUint8()).toBe(UINT8_DATA[index]);
        });
    });

    test('check Int8 methods', () => {
        const buffer: IBinaryBuffer = new BinaryBuffer(INT8_DATA.length);

        // fill
        INT8_DATA.forEach((item, index) => {
            expect(buffer.position).toBe(index);
            buffer.setInt8(item);
            //console.log('item:', item);
        });

        //console.log('buffer:', buffer);
        checkBuffer(buffer, UINT8_DATA, UINT8_DATA.length);

        // reset
        buffer.seek(0);

        checkBuffer(buffer, UINT8_DATA, 0);

        // read
        INT8_DATA.forEach((item, index) => {
            checkBuffer(buffer, UINT8_DATA, index);
            expect(buffer.getInt8()).toBe(INT8_DATA[index]);
        });
    });

    test('check LE/BE uint8', () => {
        const bufferLE: IBinaryBuffer = new BinaryBuffer(1);
        const bufferBE: IBinaryBuffer = new BinaryBuffer(1, false);

        // 135
        bufferLE.setUint8(0x87);
        bufferBE.setUint8(0x87);

        checkBuffer(bufferLE, '87', bufferLE.offset);
        checkBuffer(bufferBE, '87', bufferBE.offset, false);
    });

    test('check LE/BE uint16', () => {
        const bufferLE: IBinaryBuffer = new BinaryBuffer(2);
        const bufferBE: IBinaryBuffer = new BinaryBuffer(2, false);

        // 0x0200
        bufferLE.setUint16(512);
        bufferBE.setUint16(512);

        checkBuffer(bufferLE, '00 02', bufferLE.offset);
        checkBuffer(bufferBE, '02 00', bufferBE.offset, false);
    });

    test('check LE/BE uint32', () => {
        const bufferLE: IBinaryBuffer = new BinaryBuffer(4);
        const bufferBE: IBinaryBuffer = new BinaryBuffer(4, false);

        bufferLE.setUint32(0x052082fe);
        bufferBE.setUint32(0x052082fe);

        checkBuffer(bufferLE, 'fe 82 20 05', bufferLE.offset);
        checkBuffer(bufferBE, '05 20 82 fe', bufferBE.offset, false);
    });

    test('check Uint16 methods', () => {
        const bufferLE: IBinaryBuffer = new BinaryBuffer(UINT16_DATA.length * 2);
        const bufferBE: IBinaryBuffer = new BinaryBuffer(UINT16_DATA.length * 2, false);

        // fill
        UINT16_DATA.forEach((value, index) => {
            expect(bufferLE.position).toBe(index * 2);
            bufferLE.setUint16(value);
        });
        UINT16_DATA.forEach((value, index) => {
            expect(bufferBE.position).toBe(index * 2);
            bufferBE.setUint16(value);
        });

        checkBuffer(bufferLE, UINT8_DATA, UINT8_DATA.length);
        checkBuffer(bufferBE, UINT8_16_BE_DATA, UINT8_16_BE_DATA.length, false);

        // reset
        bufferLE.seek(0);
        bufferBE.seek(0);

        checkBuffer(bufferLE, UINT8_DATA, 0);
        checkBuffer(bufferBE, UINT8_16_BE_DATA, 0, false);

        // read
        UINT16_DATA.forEach((value, index) => {
            checkBuffer(bufferLE, UINT8_DATA, index * 2);
            expect(bufferLE.getUint16()).toBe(UINT16_DATA[index]);
        });
        UINT16_DATA.forEach((value, index) => {
            checkBuffer(bufferBE, UINT8_16_BE_DATA, index * 2, false);
            expect(bufferBE.getUint16()).toBe(UINT16_DATA[index]);
        });
    });

    test('check Int16 methods', () => {
        const bufferLE: IBinaryBuffer = new BinaryBuffer(INT16_DATA.length * 2);
        const bufferBE: IBinaryBuffer = new BinaryBuffer(INT16_DATA.length * 2, false);

        // fill
        INT16_DATA.forEach((value, index) => {
            expect(bufferLE.position).toBe(index * 2);
            bufferLE.setInt16(value);
        });
        INT16_DATA.forEach((value, index) => {
            expect(bufferBE.position).toBe(index * 2);
            bufferBE.setInt16(value);
        });

        checkBuffer(bufferLE, UINT8_DATA, UINT8_DATA.length);
        checkBuffer(bufferBE, UINT8_16_BE_DATA, UINT8_16_BE_DATA.length, false);

        // reset
        bufferLE.seek(0);
        bufferBE.seek(0);

        checkBuffer(bufferLE, UINT8_DATA, 0);
        checkBuffer(bufferBE, UINT8_16_BE_DATA, 0, false);

        // read
        INT16_DATA.forEach((value, index) => {
            checkBuffer(bufferLE, UINT8_DATA, index * 2);
            expect(bufferLE.getInt16()).toBe(INT16_DATA[index]);
        });
        INT16_DATA.forEach((value, index) => {
            checkBuffer(bufferBE, UINT8_16_BE_DATA, index * 2, false);
            expect(bufferBE.getInt16()).toBe(INT16_DATA[index]);
        });
    });

    test('check Uint32 methods', () => {
        const bufferLE: IBinaryBuffer = new BinaryBuffer(UINT8_DATA.length);
        const bufferBE: IBinaryBuffer = new BinaryBuffer(UINT8_DATA.length, false);

        // fill
        UINT32_DATA.forEach((value, index) => {
            expect(bufferLE.position).toBe(index * 4);
            bufferLE.setUint32(value);
        });
        UINT32_DATA.forEach((value, index) => {
            expect(bufferBE.position).toBe(index * 4);
            bufferBE.setUint32(value);
        });

        checkBuffer(bufferLE, UINT8_DATA, UINT8_DATA.length);
        checkBuffer(bufferBE, UINT8_32_BE_DATA, UINT8_32_BE_DATA.length, false);

        // reset
        bufferLE.seek(0);
        bufferBE.seek(0);

        checkBuffer(bufferLE, UINT8_DATA, 0);
        checkBuffer(bufferBE, UINT8_32_BE_DATA, 0, false);

        // read
        UINT32_DATA.forEach((value, index) => {
            checkBuffer(bufferLE, UINT8_DATA, index * 4);
            expect(bufferLE.getUint32()).toBe(UINT32_DATA[index]);
        });
        UINT32_DATA.forEach((value, index) => {
            checkBuffer(bufferBE, UINT8_32_BE_DATA, index * 4, false);
            expect(bufferBE.getUint32()).toBe(UINT32_DATA[index]);
        });
    });

    test('check Int32 methods', () => {
        const bufferLE: IBinaryBuffer = new BinaryBuffer(UINT8_DATA.length);
        const bufferBE: IBinaryBuffer = new BinaryBuffer(UINT8_DATA.length, false);

        // fill
        INT32_DATA.forEach((value, index) => {
            expect(bufferLE.position).toBe(index * 4);
            bufferLE.setInt32(value);
        });
        INT32_DATA.forEach((value, index) => {
            expect(bufferBE.position).toBe(index * 4);
            bufferBE.setInt32(value);
        });

        checkBuffer(bufferLE, UINT8_DATA, UINT8_DATA.length);
        checkBuffer(bufferBE, UINT8_32_BE_DATA, UINT8_32_BE_DATA.length, false);

        // reset
        bufferLE.seek(0);
        bufferBE.seek(0);

        checkBuffer(bufferLE, UINT8_DATA, 0);
        checkBuffer(bufferBE, UINT8_32_BE_DATA, 0, false);

        // read
        INT32_DATA.forEach((value, index) => {
            checkBuffer(bufferLE, UINT8_DATA, index * 4);
            expect(bufferLE.getInt32()).toBe(INT32_DATA[index]);
        });
        INT32_DATA.forEach((value, index) => {
            checkBuffer(bufferBE, UINT8_32_BE_DATA, index * 4, false);
            expect(bufferBE.getInt32()).toBe(INT32_DATA[index]);
        });
    });

    test('check getBytes/setBytes methods', () => {
        const buffer: IBinaryBuffer = new BinaryBuffer(UINT8_DATA);
        let part: TBytes;

        // read 3 bytes from the buffer
        part = buffer.getBytes(3);
        expect(part).toStrictEqual(UINT8_DATA.slice(0, 3));
        expect(buffer.offset).toBe(3);

        // read 2 bytes more from the buffer
        part = buffer.getBytes(2);
        expect(part).toStrictEqual(UINT8_DATA.slice(3, 5));
        expect(buffer.offset).toBe(5);

        // read from position
        part = buffer.getBytes(3, 4);
        expect(part).toStrictEqual(UINT8_DATA.slice(4, 7));
        expect(buffer.offset).toBe(7);

        // write from current offset
        buffer.setBytes(part);
        expect(getHexFromBytes(buffer.data)).toStrictEqual('00 02 0c 05 01 e2 40 01 e2 40 28 9b ae 63 f4 35');

        // write from the given offset
        buffer.setBytes(part, 1);
        expect(getHexFromBytes(buffer.data)).toStrictEqual('00 01 e2 40 01 e2 40 01 e2 40 28 9b ae 63 f4 35');
    });
});
