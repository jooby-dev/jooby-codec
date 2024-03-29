/**
 * Global package configuration.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import {config} from 'jooby-codec';
 *
 * const {hexFormatOptions} = config;
 *
 * // set format options for all library methods
 * hexFormatOptions.separator = '';
 * hexFormatOptions.prefix = '0x';
 * ```
 */

/**
 * Hex string format options.
 */
export interface IHexFormatOptions {
    /**
     * String to separate bytes.
     * @defaultValue one space character
     */
    separator?: string,
    /**
     * Leading string to add to each byte.
     * @defaultValue empty string
     */
    prefix?: string
}


export const hexFormatOptions: IHexFormatOptions = {
    separator: ' ',
    prefix: ''
};


/**
 * Host run-time options.
 */
export const host = {
    /**
     * Endianness (big-endian or little-endian, BE/LE) is a byte order.
     * Value `512` can be represented as BE `0x0200` or LE `0x0002`.
     * The `IA-32` and `x86-64` instruction set architectures use the little-endian format.
     */
    isLittleEndian: true
};
