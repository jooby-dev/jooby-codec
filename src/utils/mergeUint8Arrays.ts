/**
 * Concat all given arrays.
 */
export default ( ...arrays: Array<Uint8Array> ): Uint8Array => {
    const totalLength = arrays.reduce((total, array) => total + array.length, 0);
    const mergedArray = new Uint8Array(totalLength);
    let offset = 0;

    for ( const array of arrays ) {
        mergedArray.set(array, offset);
        offset += array.length;
    }

    return mergedArray;
};
