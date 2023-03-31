import BinaryBuffer from './BinaryBuffer.js';


/**
 * Command specific byte array manipulation.
 */
class CommandBinaryBuffer extends BinaryBuffer {
    getExtendedValue (): number {
        let value = 0;
        let extended = 1;
        // byte offset
        let position = 0;

        while ( extended && this.offset <= this.data.byteLength ) {
            const byte = this.getUint8();

            extended = byte & 0x80;
            value += (byte & 0x7f) << (7 * position);
            ++position;
        }

        return value;
    }

    setExtendedValue ( value: number ): void {
        const data = [];
        let encodedValue = value;

        while ( encodedValue ) {
            data.push(0x80 | (encodedValue & 0x7f));
            encodedValue >>= 7;
        }

        const lastByte = data.pop();

        if ( lastByte ) {
            // clear EXTENDED bit flag for last value
            data.push(lastByte & 0x7f);
        }

        data.forEach(extendedValue => this.setUint8(extendedValue));
    }
}


export default CommandBinaryBuffer;
