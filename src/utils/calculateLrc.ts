/**
 * Calculate LRC
 *
 * @param data - byte array
 *
 * @return LRC
 */
export default ( data: Uint8Array, initialLrc = 0x55 ) => {
    let lrc = initialLrc;

    data.forEach(item => {
        lrc ^= item;
    });

    return lrc;
};
