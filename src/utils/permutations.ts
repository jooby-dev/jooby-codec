/**
 * Generates all permutations of elements in the given sequence.
 *
 * @template T - The type of elements in the sequence.
 * @param {Array<T>} sequence - The array of elements for which permutations are generated.
 * @returns {Array<Array<T>>} - An array of arrays representing all permutations of the input sequence.
 *
 * @example Generates all permutations of element for the [1, 2, 3] array
 * ```js
 * const inputArray = [1, 2, 3];
 * const result = permutations(inputArray);
 * console.log(result);
 * // Output: [
 * //   [1, 2, 3],
 * //   [1, 3, 2],
 * //   [2, 1, 3],
 * //   [2, 3, 1],
 * //   [3, 1, 2],
 * //   [3, 2, 1]
 * // ]
 * ```
 */
const permutations = <T>( sequence: Array<T> ): Array<Array<T>> => {
    const result = new Array<Array<T>>();

    for ( let i = 0; i < sequence.length; i++ ) {
        if ( sequence.length === 1 ) {
            return [[sequence[i]]];
        }

        const remaining = permutations(sequence.filter((_value, index) => i !== index));

        for ( const rest of remaining ) {
            result.push([sequence[i], ...rest]);
        }
    }

    return result;
};

export default permutations;
