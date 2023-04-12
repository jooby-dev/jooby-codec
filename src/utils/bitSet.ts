export type TBitSetMask = Record<string, number>;

export type TBooleanObject = Record<string, boolean>;


/**
 * Get integer number from object with boolean values values according to the given bit mask.
 */
export const fromObject = ( bitMask: TBitSetMask, booleanObject: TBooleanObject ): number => {
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
 */
export const toObject = ( bitMask: TBitSetMask, value: number ): TBooleanObject => {
    const result: TBooleanObject = {};

    for ( const [name, position] of Object.entries(bitMask) ) {
        result[name] = (value & position) !== 0;
    }

    return result;
};
