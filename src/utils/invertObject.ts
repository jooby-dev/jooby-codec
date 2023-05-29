/* eslint-disable @typescript-eslint/no-unsafe-return */

export type THashTable = Record<string, unknown>;

/*
    Swap keys and values
    from {a: 1, b: 2, c: 3, d: 4}
    to {1: 'a', 2: 'b', 3: 'c', 4: 'd'}
*/
export default ( source: THashTable ): THashTable => Object.fromEntries(
    Object
        .entries(source)
        .map(([key, value]) => [value, key])
);
