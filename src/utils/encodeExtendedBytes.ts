/**
 * Encode number with EXTENDED bit flag.
 *
 * @example
 * console.log(encodeExtendedBytes(0x35);
 * // print [ 53 ], extended bit absent, bytes - [0110101]
 *
 *
 * console.log(encodeExtendedBytes(new Uint8Array([0xd5, 0x13])));
 * // print [ 213, 19 ], extended bit present, bytes [11010101, 00010011]
 *
 * @deprecated Use the  CommandBinaryBuffer.setExtendedValue
 */
export default ( value: number ): Array<number> => {
    const data = [];

    let encodedValue = value;

    while ( encodedValue ) {
        data.push(0x80 | (encodedValue & 0x7f));
        // eslint-disable-next-line no-param-reassign
        encodedValue >>= 7;
    }

    const lastByte = data.pop();

    if ( lastByte ) {
        data.push(lastByte & 0x7f);
    }

    return data;
};
