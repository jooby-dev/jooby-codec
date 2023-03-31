/**
 * Get number from bytes with EXTENDED bit flag.
 *
 * @example
 * console.log(decodeExtendedBytes(new Uint8Array([0x35])));
 * // print { value: 53, position: 1 }, extended bit absent, bytes - [0110101]
 *
 *
 * console.log(decodeExtendedBytes(new Uint8Array([0xd5, 0x13])));
 * // print { value: 2517, position: 2 }, extended bit present, bytes [11010101, 00010011]
 *
 * @deprecated Use the  CommandBinaryBuffer.getExtendedValue
 */
export default ( data: Uint8Array | Array<number>, startPosition = 0 ) => {
    let value = 0;
    let extended = 1;
    let position;

    for ( position = startPosition; extended && position < data.length; position++ ) {
        extended = data[position] & 0x80;
        value += (data[position] & 0x7f) << (7 * (position - startPosition));
    }

    return {value, position};
};
