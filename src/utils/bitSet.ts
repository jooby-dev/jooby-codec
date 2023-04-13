export type TBitSetMask = Record<string, number>;

export type TBooleanObject = Record<string, boolean>;


/**
 * Get integer number from object with boolean values values according to the given bit mask.
 *
 * @example
 * ```ts
 * const bitMask: bitSet.TBitSetMask = {
 *     a: 2 ** 0,
 *     b: 2 ** 1,
 *     c: 2 ** 2,
 *     d: 2 ** 3,
 *     g: 2 ** 6
 * };
 *
 * const result = fromObject(bitMask, {a: true, b: true, c: false, d: true, e: true, f: false, g: true});
 * console.log(result.toString(2));
 * // 1001011
 * ```
 */
export const fromObject = ( bitMask: TBitSetMask = {}, booleanObject: TBooleanObject = {} ): number => {
    let result = 0;

    for ( const [name, value] of Object.entries(booleanObject) ) {
        if ( name in bitMask && value ) {
            result |= bitMask[name];
        }
    }

    return result;
};


/**
 * Get object with boolean values values from integer number according to the given bit mask.
 *
 * @example
 * ```ts
 * const bitMask: bitSet.TBitSetMask = {
 *     a: 2 ** 0,
 *     b: 2 ** 1,
 *     c: 2 ** 2,
 *     d: 2 ** 3,
 *     g: 2 ** 6
 * };
 *
 * const result = toObject(bitMask, parseInt('0110100', 2));
 * console.log(result);
 * // {a: false, b: false, c: true, d: false, g: false}
 * ```
 */
export const toObject = ( bitMask: TBitSetMask = {}, value = 0 ): TBooleanObject => {
    const result: TBooleanObject = {};

    for ( const [name, position] of Object.entries(bitMask) ) {
        result[name] = (value & position) !== 0;
    }

    return result;
};
