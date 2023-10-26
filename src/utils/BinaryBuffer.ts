import {IHexFormatOptions} from '../config.js';
import getBytesFromHex from './getBytesFromHex.js';
import getHexFromBytes from './getHexFromBytes.js';


// the number of bytes
const INT8_SIZE = 1;
const INT16_SIZE = 2;
const INT32_SIZE = 4;


const createView = ( buffer: BinaryBuffer, numberSize: number ): DataView => {
    if ( buffer.offset + numberSize > buffer.data.byteLength ) {
        throw new Error(`Wrong attempt to read ${numberSize} byte(s) from [${getHexFromBytes(buffer.toUint8Array())}] offset: ${buffer.offset}`);
    }

    return new DataView(buffer.data, buffer.offset, numberSize);
};


/**
 * Byte array manipulation.
 */
class BinaryBuffer {
    data: ArrayBuffer;

    offset: number;

    isLittleEndian: boolean;

    /**
     * Create a buffer stream.
     *
     * @param data - the instance of Uint8Array or ArrayBuffer size
     * @param isLittleEndian - if true then little endian will be used, big endian otherwise
     */
    constructor ( dataOrLength: Uint8Array | number | string, isLittleEndian = true ) {
        if ( typeof dataOrLength === 'number' ) {
            this.data = new ArrayBuffer(dataOrLength);
        } else if ( typeof dataOrLength === 'string' ) {
            this.data = getBytesFromHex(dataOrLength).buffer;
        } else {
            this.data = dataOrLength.buffer;
        }

        this.offset = 0;
        this.isLittleEndian = isLittleEndian;
    }

    toHex ( options: IHexFormatOptions = {} ): string {
        return getHexFromBytes(this.toUint8Array(), options);
    }

    toUint8Array (): Uint8Array {
        return new Uint8Array(this.data);
    }

    get size (): number {
        return this.data.byteLength;
    }

    get isEmpty (): boolean {
        return this.data.byteLength - this.offset === 0;
    }

    get bytesLeft (): number {
        return this.data.byteLength - this.offset;
    }

    get position (): number {
        return this.offset;
    }

    seek ( position: number ): void {
        if ( position < 0 || position >= this.data.byteLength ) {
            throw new Error('Invalid position.');
        }

        this.offset = position;
    }

    setInt8 ( value: number ): void {
        const view = createView(this, INT8_SIZE);

        view.setInt8(0, value);
        this.offset += INT8_SIZE;
    }

    getInt8 (): number {
        const result = createView(this, INT8_SIZE).getInt8(0);

        this.offset += INT8_SIZE;

        return result;
    }

    setUint8 ( value: number ): void {
        createView(this, INT8_SIZE).setUint8(0, value);
        this.offset += INT8_SIZE;
    }

    getUint8 (): number {
        const result = createView(this, INT8_SIZE).getUint8(0);

        this.offset += INT8_SIZE;

        return result;
    }

    setInt16 ( number: number, isLittleEndian = this.isLittleEndian ): void {
        createView(this, INT16_SIZE).setInt16(0, number, isLittleEndian);
        this.offset += INT16_SIZE;
    }

    getInt16 ( isLittleEndian = this.isLittleEndian ): number {
        const result = createView(this, INT16_SIZE).getInt16(0, isLittleEndian);

        this.offset += INT16_SIZE;

        return result;
    }

    setUint16 ( value: number, isLittleEndian = this.isLittleEndian ): void {
        createView(this, INT16_SIZE).setUint16(0, value, isLittleEndian);
        this.offset += INT16_SIZE;
    }

    getUint16 ( isLittleEndian = this.isLittleEndian ): number {
        const result = createView(this, INT16_SIZE).getUint16(0, isLittleEndian);

        this.offset += INT16_SIZE;

        return result;
    }

    setInt32 ( value: number, isLittleEndian = this.isLittleEndian ): void {
        createView(this, INT32_SIZE).setInt32(0, value, isLittleEndian);
        this.offset += INT32_SIZE;
    }

    getInt32 ( isLittleEndian = this.isLittleEndian ): number {
        const result = createView(this, INT32_SIZE).getInt32(0, isLittleEndian);

        this.offset += INT32_SIZE;

        return result;
    }

    setUint32 ( value: number, isLittleEndian = this.isLittleEndian ): void {
        createView(this, INT32_SIZE).setUint32(0, value, isLittleEndian);
        this.offset += INT32_SIZE;
    }

    getUint32 ( isLittleEndian = this.isLittleEndian ): number {
        const result = createView(this, INT32_SIZE).getUint32(0, isLittleEndian);

        this.offset += INT32_SIZE;

        return result;
    }

    setFloat32 ( value: number, isLittleEndian = this.isLittleEndian ): void {
        createView(this, INT32_SIZE).setFloat32(0, value, isLittleEndian);
        this.offset += INT32_SIZE;
    }

    getFloat32 ( isLittleEndian = this.isLittleEndian ): number {
        const result = createView(this, INT32_SIZE).getFloat32(0, isLittleEndian);

        this.offset += INT32_SIZE;

        return result;
    }

    setString ( value: string ): void {
        this.setUint8(value.length);

        for ( let index = 0; index < value.length; ++index ) {
            this.setUint8(value.charCodeAt(index));
        }
    }

    getString (): string {
        const size = this.getUint8();
        const endIndex = this.offset + size;
        const chars = [];

        while ( this.offset < endIndex ) {
            chars.push(String.fromCharCode(this.getUint8()));
        }

        return chars.join('');
    }

    /**
     * Get bytes from start to offset.
     *
     * @param offset - current offset by default
     *
     * @returns sliced byte array
     */
    getBytesToOffset ( offset = this.offset ): Uint8Array {
        const bytes = this.toUint8Array();

        return bytes.slice(0, offset);
    }

    getBytes ( length: number, offset = this.offset ): Uint8Array {
        const bytes = this.toUint8Array();

        // move offset pointer
        this.offset = offset + length;

        return bytes.slice(offset, this.offset);
    }

    setBytes ( data: Uint8Array, offset = this.offset ) {
        const bytes = this.toUint8Array();

        // overwrite
        bytes.set(data, offset);

        this.data = bytes.buffer;

        // move offset pointer
        this.offset = offset + data.length;
    }
}


export default BinaryBuffer;
