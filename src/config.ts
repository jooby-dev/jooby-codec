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
