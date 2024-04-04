/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-cond-assign */
/* eslint-disable no-self-compare */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-param-reassign */
/* eslint-disable operator-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-var */
/* eslint-disable one-var */
/* eslint-disable one-var-declaration-per-line */
/* eslint-disable prefer-exponentiation-operator */

import {
    TBytes, TInt8, TInt16, TInt32, TUint8, TUint16, TUint32, TFloat32
} from '../types.js';
import {host} from '../config.js';


// number of bytes
const INT8_SIZE = 1;
const INT16_SIZE = 2;
const INT32_SIZE = 4;


/**
 * https://gist.github.com/mika76/20b86c76afb77c35e0b4
 */

// eslint-disable-next-line no-restricted-properties
const {log, pow, LN2} = Math;

// Joyent copyright applies to readFloat and writeFloat

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

const readFloat = ( buffer, offset, isLittleEndian, mLen, bytes ) => {
    var e, m,
        eLen = bytes * 8 - mLen - 1,
        eMax = (1 << eLen) - 1,
        eBias = eMax >> 1,
        nBits = -7,
        i = host.isLittleEndian && isLittleEndian ? bytes - 1 : 0,
        d = host.isLittleEndian && isLittleEndian ? -1 : 1,
        s = buffer[offset + i];

    i += d;

    e = s & ((1 << (-nBits)) - 1);
    s >>= (-nBits);
    nBits += eLen;
    for (; nBits > 0; e = e * 0x100 + buffer[offset + i], i += d, nBits -= 8);

    m = e & ((1 << (-nBits)) - 1);
    e >>= (-nBits);
    nBits += mLen;
    for (; nBits > 0; m = m * 0x100 + buffer[offset + i], i += d, nBits -= 8);

    if (e === 0) {
        e = 1 - eBias;
    } else if (e === eMax) {
        return m ? NaN : s ? -Infinity : Infinity;
    } else {
        m = m + pow(2, mLen);
        e = e - eBias;
    }

    return (s ? -1 : 1) * m * pow(2, e - mLen);
};

const writeFloat = ( buffer, offset, value, isLittleEndian, mLen, bytes ) => {
    var e, m, c,
        eLen = bytes * 8 - mLen - 1,
        eMax = (1 << eLen) - 1,
        eBias = eMax >> 1,
        rt = (mLen === 23 ? pow(2, -24) - pow(2, -77) : 0),
        i = host.isLittleEndian && isLittleEndian ? 0 : bytes - 1,
        d = host.isLittleEndian && isLittleEndian ? 1 : -1,
        s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

    value < 0 && (value = -value);

    if (value !== value || value === Infinity) {
        m = value !== value ? 1 : 0;
        e = eMax;
    } else {
        e = (log(value) / LN2) | 0;
        if (value * (c = pow(2, -e)) < 1) {
            e--;
            c *= 2;
        }
        if (e + eBias >= 1) {
            value += rt / c;
        } else {
            value += rt * pow(2, 1 - eBias);
        }
        if (value * c >= 2) {
            e++;
            c /= 2;
        }

        if (e + eBias >= eMax) {
            m = 0;
            e = eMax;
        } else if (e + eBias >= 1) {
            m = (value * c - 1) * pow(2, mLen);
            e = e + eBias;
        } else {
            m = value * pow(2, eBias - 1) * pow(2, mLen);
            e = 0;
        }
    }

    for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 0x100, mLen -= 8);

    e = (e << mLen) | m;
    eLen += mLen;
    for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 0x100, eLen -= 8);

    buffer[offset + i - d] |= s * 0x80;
};

const be2 = [1, 0];
const be4 = [3, 2, 1, 0];
const le2 = [0, 1];
const le4 = [0, 1, 2, 3];

const readUint8 = ( buffer, offset ) => buffer[offset];

const readUint16 = ( buffer, offset, isLittleEndian ) => {
    const order = host.isLittleEndian && isLittleEndian ? le2 : be2;
    const b0 = buffer[offset + order[0]];
    const b1 = buffer[offset + order[1]] << 8;

    return b0 | b1;
};

const readUint32 = ( buffer, offset, isLittleEndian ) => {
    const order = host.isLittleEndian && isLittleEndian ? le4 : be4;
    const b0 = buffer[offset + order[3]] * 0x1000000;
    const b1 = buffer[offset + order[2]] * 0x10000;
    const b2 = buffer[offset + order[1]] * 0x100;
    const b3 = buffer[offset + order[0]];

    return b0 + b1 + b2 + b3;
};

const writeUint8 = ( buffer, offset, value ) => {
    buffer[offset] = value & 0xff;
};

const writeUint16 = ( buffer, offset, value, isLittleEndian ) => {
    //console.log('isLittleEndian:', isLittleEndian);
    const order = host.isLittleEndian && isLittleEndian ? le2 : be2;

    buffer[offset + order[0]] = value & 0xff;
    buffer[offset + order[1]] = value >>> 8 & 0xff;
};

const writeUint32 = ( buffer, offset, value, isLittleEndian ) => {
    const order = host.isLittleEndian && isLittleEndian ? le4 : be4;

    buffer[offset + order[0]] = value & 0xff;
    buffer[offset + order[1]] = value >>> 8 & 0xff;
    buffer[offset + order[2]] = value >>> 16 & 0xff;
    buffer[offset + order[3]] = value >>> 24 & 0xff;
};


export interface IBinaryBuffer {
    data: TBytes,
    offset: number,
    isLittleEndian: boolean,

    size: number,
    isEmpty: boolean,
    bytesLeft: number,
    position: number,

    seek ( position: number ): void,

    setUint8 ( value: TUint8 ): void,
    getUint8 (): TUint8,
    setInt8 ( value: TInt8 ): void,
    getInt8 (): TInt8,

    setUint16 ( value: TUint16, isLittleEndian?: boolean ): void,
    getUint16 ( isLittleEndian?: boolean ): TUint16,
    setInt16 ( value: TInt16, isLittleEndian?: boolean ): void,
    getInt16 ( isLittleEndian?: boolean ): TInt16,

    setUint32 ( value: TUint32, isLittleEndian?: boolean ): void,
    getUint32 ( isLittleEndian?: boolean ): TUint32,
    setInt32 ( value: TInt32, isLittleEndian?: boolean ): void,
    getInt32 ( isLittleEndian?: boolean ): TInt32,

    setFloat32 ( value: TFloat32, isLittleEndian?: boolean ): void,
    getFloat32 ( isLittleEndian?: boolean ): TFloat32,

    getBytes ( length: number, offset?: number ): TBytes,
    setBytes ( data: TBytes, offset?: number ): void,

    getBytesToOffset ( offset?: number ): TBytes
}

function BinaryBuffer ( this: IBinaryBuffer, dataOrLength: TBytes | number, isLittleEndian = true ) {
    if ( typeof dataOrLength === 'number' ) {
        const bytes = new Array(dataOrLength);

        // no support of Array.fill in Otto
        for ( let i = 0; i < dataOrLength; ++i ) {
            bytes[i] = 0;
        }

        this.data = bytes;
    } else {
        this.data = dataOrLength;
    }

    this.offset = 0;
    this.isLittleEndian = isLittleEndian;
}

BinaryBuffer.prototype = {
    toUint8Array (): TBytes {
        return this.data;
    },

    seek ( position: number ) {
        if ( position < 0 || position >= this.data.length ) {
            throw new Error('Invalid position.');
        }

        this.offset = position;
    },

    setInt8 ( value: TInt8 ) {
        writeUint8(this.data, this.offset, value < 0 ? value | 0x100 : value);

        this.offset += INT8_SIZE;
    },

    getInt8 (): TInt8 {
        const result = readUint8(this.data, this.offset);

        this.offset += INT8_SIZE;

        return result & 0x80 ? result ^ -0x100 : result;
    },

    setUint8 ( value: TUint8 ) {
        writeUint8(this.data, this.offset, value);

        this.offset += INT8_SIZE;
    },

    getUint8 (): TUint8 {
        const result = readUint8(this.data, this.offset);

        this.offset += INT8_SIZE;

        return result;
    },

    setInt16 ( value: TInt16, isLittleEndian = this.isLittleEndian ) {
        writeUint16(this.data, this.offset, value < 0 ? value | 0x10000 : value, isLittleEndian);

        this.offset += INT16_SIZE;
    },

    getInt16 ( isLittleEndian = this.isLittleEndian ): TInt16 {
        const result = readUint16(this.data, this.offset, isLittleEndian);

        this.offset += INT16_SIZE;

        return result & 0x8000 ? result ^ -0x10000 : result;
    },

    setUint16 ( value: TUint16, isLittleEndian = this.isLittleEndian ) {
        writeUint16(this.data, this.offset, value, isLittleEndian);

        this.offset += INT16_SIZE;
    },

    getUint16 ( isLittleEndian = this.isLittleEndian ): TUint16 {
        const result = readUint16(this.data, this.offset, isLittleEndian);

        this.offset += INT16_SIZE;

        return result;
    },

    setInt32 ( value: TInt32, isLittleEndian = this.isLittleEndian ) {
        writeUint32(this.data, this.offset, value < 0 ? value | 0x100000000 : value, isLittleEndian);

        this.offset += INT32_SIZE;
    },

    getInt32 ( isLittleEndian = this.isLittleEndian ): TInt32 {
        const result = readUint32(this.data, this.offset, isLittleEndian);

        this.offset += INT32_SIZE;

        return result & 0x80000000 ? result ^ -0x100000000 : result;
    },

    setUint32 ( value: TUint32, isLittleEndian = this.isLittleEndian ) {
        writeUint32(this.data, this.offset, value, isLittleEndian);

        this.offset += INT32_SIZE;
    },

    getUint32 ( isLittleEndian = this.isLittleEndian ): TUint32 {
        const result = readUint32(this.data, this.offset, isLittleEndian);

        this.offset += INT32_SIZE;

        return result;
    },

    setFloat32 ( value: TFloat32, isLittleEndian = this.isLittleEndian ) {
        writeFloat(this.data, this.offset, value, isLittleEndian, 23, 4);

        this.offset += INT32_SIZE;
    },

    getFloat32 ( isLittleEndian = this.isLittleEndian ): TFloat32 {
        const result = readFloat(this.data, this.offset, isLittleEndian, 23, 4);

        this.offset += INT32_SIZE;

        return result;
    },

    setString ( value: string ) {
        this.setUint8(value.length);

        for ( let index = 0; index < value.length; ++index ) {
            this.setUint8(value.charCodeAt(index));
        }
    },

    getString (): string {
        const size: TUint8 = this.getUint8();
        const endIndex = this.offset + size;
        const chars = [];

        while ( this.offset < endIndex ) {
            chars.push(String.fromCharCode(this.getUint8()));
        }

        return chars.join('');
    },

    /**
     * Get bytes from start to offset.
     *
     * @param offset - current offset by default
     *
     * @returns sliced byte array
     */
    getBytesToOffset ( offset = this.offset ): TBytes {
        return this.data.slice(0, offset);
    },

    getBytesLeft () {
        return this.getBytes(this.bytesLeft);
    },

    getBytes ( length: number, offset = this.offset ) {
        // move offset pointer
        this.offset = offset + length;

        return this.data.slice(offset, this.offset);
    },

    setBytes ( data: TBytes, offset = this.offset ) {
        const bytes = this.data;

        // overwrite
        //bytes.set(data, offset);
        bytes.splice(offset, data.length, ...data);

        this.data = bytes;

        // move offset pointer
        this.offset = offset + data.length;
    }
};


Object.defineProperties(BinaryBuffer.prototype, {
    size: {
        get () {
            return this.data.length;
        }
    },

    isEmpty: {
        get () {
            return this.data.length - this.offset === 0;
        }
    },

    bytesLeft: {
        get () {
            return this.data.length - this.offset;
        }
    },

    position: {
        get () {
            return this.offset;
        }
    }
});


export default BinaryBuffer;
