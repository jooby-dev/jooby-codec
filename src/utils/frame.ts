import calculateCrc16 from './calculateCrc16.js';
import getBytesFromHex from './getBytesFromHex.js';
import getBytesFromBase64 from './getBytesFromBase64.js';
import BinaryBuffer from './BinaryBuffer.js';


const STUFFING_BYTE = 0x7d;
const byteStuffMap: Record<number, number> = {0x13: 0x33, 0x11: 0x31, 0x7d: 0x5d, 0x7e: 0x5e};
const byteUnstuffMap: Record<number, number> = {0x33: 0x13, 0x31: 0x11, 0x5d: 0x7d, 0x5e: 0x7e};

const byteStuff = ( byte: number ): number => byteStuffMap[byte] || byte;

const byteUnstuff = ( byte: number ): number => byteUnstuffMap[byte] || byte;

export const arrayStuff = ( data: Uint8Array | Array<number> ): Uint8Array => {
    const result: Array<number> = [];

    data.forEach(byte => {
        const stuff = byteStuff(byte & 0xff);

        if ( stuff === byte ) {
            result.push(byte);
        } else {
            result.push(STUFFING_BYTE);
            result.push(stuff);
        }
    });

    return new Uint8Array(result);
};

export const arrayUnstuff = ( data: Uint8Array | Array<number> ): Uint8Array => {
    const result: Array<number> = [];
    let position = 0;
    let hasPrevStuffingByte = false;

    data.forEach(value => {
        const byte = value & 0xff;

        if ( byte === STUFFING_BYTE ) {
            hasPrevStuffingByte = true;
        } else if ( hasPrevStuffingByte ) {
            hasPrevStuffingByte = false;
            result[position++] = byteUnstuff(byte);
        } else {
            result[position++] = byte;
        }
    });

    return new Uint8Array(result);
};

const convertCrcToBytes = ( crc: number ) => {
    const buffer = new BinaryBuffer(2);

    buffer.setUint16(crc);

    return buffer.toUint8Array();
};

const getFrameCrc = ( frame: Uint8Array ): number | undefined => {
    let crc;

    if ( frame.length >= 2 ) {
        const crcBuffer = new BinaryBuffer(frame.slice(-2));

        crc = crcBuffer.getUint16();
    }

    return crc;
};


export interface IFrame {
    content: Uint8Array,
    buffer:Uint8Array,
    crc: {
        expected: number | undefined,
        actual: number
    }
}


export const toFrame = ( content: Uint8Array ): IFrame => {
    const crc = calculateCrc16(content);
    const crcBytes = convertCrcToBytes(crc);
    const stuffed = content.length === 0 ? [] : arrayStuff([...content, ...crcBytes]);

    return {
        content,
        buffer: new Uint8Array(stuffed),
        crc: {
            actual: crc,
            expected: undefined
        }
    };
};

export const fromBytes = ( data: Uint8Array ): IFrame => {
    const unstuffed = arrayUnstuff(data);
    const expectedCrc = getFrameCrc(unstuffed);
    const content = unstuffed.slice(0, unstuffed.length - 2);
    const actualCrc = calculateCrc16(content);

    return {
        content,
        buffer: data,
        crc: {
            actual: actualCrc,
            expected: expectedCrc
        }
    };
};

export const fromHex = ( data: string ) => (
    fromBytes(getBytesFromHex(data))
);

export const fromBase64 = ( data: string ) => (
    fromBytes(getBytesFromBase64(data))
);
