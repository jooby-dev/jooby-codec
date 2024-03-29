import {TBytes} from '../types.js';

/**
 * Calculate LRC
 *
 * @param data - byte array
 *
 * @return LRC
 */
export default ( data: TBytes, initialLrc = 0x55 ): number => {
    let lrc = initialLrc;

    data.forEach(item => {
        lrc ^= item;
    });

    return lrc;
};
