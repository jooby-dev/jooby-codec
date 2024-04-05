export type THashTable = Record<string | number, string | number>;

/*
    Swap keys and values
    from {a: 1, b: 2, c: 3, d: 4}
    to {1: 'a', 2: 'b', 3: 'c', 4: 'd'}
*/
export default ( source: THashTable ): THashTable => {
    const target: THashTable = {};

    // eslint-disable-next-line guard-for-in
    for ( const property in source ) {
        const value = source[property];

        target[value] = property;
    }

    return target;
};
