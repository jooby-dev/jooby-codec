import {TBytes} from '../types.js';
import {hexFormatOptions, IHexFormatOptions} from '../config.js';


/**
 * Convert byte array to hex string.
 *
 * @param bytes - input data to convert
 * @param options - formatting parameters
 *
 * @example
 * input: [2, 5, 12, 255, 105, 139, 125]
 * output: '02 05 0c ff 69 8b 7d' or '0x02 0x05 0x0c 0xff 0x69 0x8b 0x7d'
 */
export default ( bytes: TBytes, options: IHexFormatOptions = {} ): string => {
    const {separator, prefix} = Object.assign({}, hexFormatOptions, options);

    return bytes
        .map((byte: number) => `${prefix}${byte.toString(16).padStart(2, '0')}`)
        .join(separator);
};
