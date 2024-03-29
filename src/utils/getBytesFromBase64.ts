import {TBytes} from '../types.js';


/**
 * Convert base64 string to byte array.
 *
 * @param base64 - input bytes base64 representation
 *
 * @example
 * input: 'yc2LYup'
 * output: [0xc9, 0xcd, 0x8b, 0x62, 0xea]
 */
export default ( base64: string ): TBytes => Array.from(
    atob(base64),
    char => char.charCodeAt(0)
);
