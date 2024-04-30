import crypto from 'crypto-js';

import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../utils/BinaryBuffer.js';
import calculateCrc16 from '../../utils/calculateCrc16.js';
import getBase64FromBytes from '../../utils/getBase64FromBytes.js';


const convertWordArrayToBytes = ( {words}: crypto.lib.WordArray ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(words.length * 4);

    words.forEach(value => {
        buffer.setUint32(value, false);
    });

    return buffer.data;
};


const convertBytesToWordArray = ( bytes: types.TBytes ): crypto.lib.WordArray => {
    const buffer: IBinaryBuffer = new BinaryBuffer(bytes);
    const result: Array<number> = [];

    for ( let position = 0; position < bytes.length; position += 4 ) {
        result.push(buffer.getUint32(false));
    }

    return crypto.lib.WordArray.create(result, bytes.length);
};

const aesConfig = {
    keySize: 16,
    mode: crypto.mode.ECB,
    padding: crypto.pad.NoPadding
};

export const aes = {
    /**
     * AES encrypt
     *
     * @param key - aes key
     * @param value - raw data
     * @return encrypted data
     */
    encrypt: ( key: types.TBytes, value: types.TBytes ): types.TBytes => {
        const {ciphertext} = crypto.AES.encrypt(
            convertBytesToWordArray(value),
            convertBytesToWordArray(key),
            aesConfig
        );

        return convertWordArrayToBytes(ciphertext);
    },

    /**
     * AES decrypt
     *
     * @param key - aes key
     * @param value - encrypted value
     * @return decrypted data
     */
    decrypt: ( key: types.TBytes, value: types.TBytes ): types.TBytes => (
        convertWordArrayToBytes(
            crypto.AES.decrypt(
                getBase64FromBytes(value),
                convertBytesToWordArray(key),
                aesConfig
            )
        )
    )
};

export const calculateCrcBytes = ( value: types.TBytes ): types.TBytes => {
    const number = calculateCrc16(value);
    const buffer: IBinaryBuffer = new BinaryBuffer(2);

    buffer.setUint16(number, true);

    return buffer.data;
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

export const arrayStuff = ( bytes: types.TBytes ): types.TBytes => {
    const result: types.TBytes = [];

    bytes.forEach(byte => {
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

export const arrayUnstuff = ( bytes: types.TBytes ): types.TBytes => {
    const result: types.TBytes = [];
    let position = 0;
    let hasPrevStuffingByte = false;

    bytes.forEach(byte => {
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
