import crypto from 'crypto-js';

import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../utils/binary/BinaryBuffer.js';
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
