import crypto from 'crypto-js';
import getBase64FromBytes from '../../utils/getBase64FromBytes.js';


const convertWordArrayToUint8Array = ( {words}: crypto.lib.WordArray ) => {
    const uint32Array = new Uint32Array(words.length);
    words.forEach((value, index) => {
        // swap bytes
        uint32Array[index] = ((value & 0xFF) << 24)
            | ((value & 0xFF00) << 8)
            | ((value >> 8) & 0xFF00)
            | ((value >> 24) & 0xFF);
    });

    return new Uint8Array(uint32Array.buffer);
};

const convertUint8ArrayToWordArray = ( data: Uint8Array ): crypto.lib.WordArray => {
    const result: Array<number> = [];

    const dv = new DataView(data.buffer, data.byteOffset, data.byteLength);
    for ( let pos = 0; pos < data.byteLength; pos += 4 ) {
        result.push(dv.getUint32(pos, false));
    }

    return crypto.lib.WordArray.create(result, data.byteLength);
};

export const aes = {
    config: {
        keySize: 16,
        mode: crypto.mode.ECB,
        padding: crypto.pad.NoPadding
    },

    /**
     * AES encrypt
     *
     * @param key - aes key
     * @param value - raw data
     * @return encrypted data
     */
    encrypt: ( key: Uint8Array, value: Uint8Array ): Uint8Array => {
        const {ciphertext} = crypto.AES.encrypt(
            convertUint8ArrayToWordArray(value),
            convertUint8ArrayToWordArray(key),
            aes.config
        );

        return convertWordArrayToUint8Array(ciphertext);
    },

    /**
     * AES decrypt
     *
     * @param key - aes key
     * @param value - encrypted value
     * @return decrypted data
     */
    decrypt: ( key: Uint8Array, value: Uint8Array ): Uint8Array => (
        convertWordArrayToUint8Array(
            crypto.AES.decrypt(
                getBase64FromBytes(value),
                convertUint8ArrayToWordArray(key),
                aes.config
            )
        )
    )
};

/**
 * Calculate LRC
 *
 * @param data - byte array
 *
 * @return LRC
 */
export const calculateLrc = ( data: Uint8Array, initialLrc = 0x55 ) => {
    let lrc = initialLrc;

    data.forEach(item => {
        lrc ^= item;
    });

    return lrc;
};

/**
 * Calculate CRC
 *
 * @param value - byte array
 *
 * @return CRC value
 */
export const calculateCrc = ( value: Uint8Array ): number => {
    let crc = 0xFFFF;

    for ( let index = 0; index < value.length; index++ ) {
        // Compute combined value.
        let data = value[index] ^ (crc & 0xFF);

        data ^= (data << 4) & 0xFF;

        crc = (data << 3) ^ (data << 8) ^ (crc >> 8) ^ (data >> 4);
    }

    return ((crc & 0xFF00) ^ 0xFF00) | ((crc & 0xFF) ^ 0xFF);
};

export const calculateCrcBytes = ( value: Uint8Array ): Uint8Array => {
    const number = calculateCrc(value);
    const buffer = new ArrayBuffer(2);
    const view = new DataView(buffer);

    view.setUint16(0, number, true);

    return new Uint8Array(buffer);
};

const byteStuff = ( byte: number ): number => {
    switch ( byte ) {
        case 0x13: return 0x33;
        case 0x11: return 0x31;
        case 0x7D: return 0x5D;
        case 0x7E: return 0x5E;
        default:
            break;
    }

    return byte;
};

const byteUnstuff = ( byte: number ): number => {
    switch ( byte ) {
        case 0x33: return 0x13;
        case 0x31: return 0x11;
        case 0x5D: return 0x7D;
        case 0x5E: return 0x7E;
        default:
            break;
    }

    return byte;
};

export const STUFFING_BYTE = 0x7d;

export const arrayStuff = ( data: Array<number> ): Array<number> => {
    const result: Array<number> = [];

    data.forEach(byte => {
        const stuff = byteStuff(byte);

        if ( stuff === byte ) {
            result.push(byte);
        } else {
            result.push(STUFFING_BYTE);
            result.push(stuff);
        }
    });

    return result;
};

export const arrayUnstuff = ( data: Array<number> ): Array<number> => {
    const result: Array<number> = [];
    let position = 0;
    let hasPrevStuffingByte = false;

    data.forEach(byte => {
        if ( byte === STUFFING_BYTE ) {
            hasPrevStuffingByte = true;
        } else if ( hasPrevStuffingByte ) {
            hasPrevStuffingByte = false;
            result[position++] = byteUnstuff(byte);
        } else {
            result[position++] = byte;
        }
    });

    return result;
};
