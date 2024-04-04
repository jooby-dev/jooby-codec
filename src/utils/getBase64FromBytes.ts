import {TBytes} from '../types.js';


/**
 * Convert byte array to base64 string.
 *
 * @param buffer - input data to convert
 *
 * @example
 * input: [0x02, 0x05, 0x0c, 0xff, 0x69, 0x8b, 0x7d]
 * output: 'AgUM/2mLfQ=='
 */
export default ( bytes: TBytes ) => btoa(
    bytes
        .map(byte => String.fromCharCode(byte))
        .join('')
);
