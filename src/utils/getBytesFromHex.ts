/**
 * Convert hex string to byte array.
 *
 * @example
 * input: '02 05 0c ff 69 8b 7d' or '02050cff698b7d' or ' 0x23 0xaa 0x00'
 * output: [2, 5, 12, 255, 105, 139, 125]
 */
export default ( hex: string ): Uint8Array => {
    let cleanHex = hex.replace(/\s+|0x/g, '');

    // correct wrong input
    if ( cleanHex.length % 2 !== 0 ) {
        cleanHex = `0${cleanHex}`;
    }

    const resultLength = cleanHex.length / 2;
    const result = new Uint8Array(resultLength);

    for ( let index = 0; index < resultLength; index++ ) {
        result[index] = parseInt(cleanHex.substring(index * 2, index * 2 + 2), 16);
    }

    return result;
};
