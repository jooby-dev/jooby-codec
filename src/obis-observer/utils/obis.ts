/**
 * OBIS code/object conversion utils.
 *
 * @packageDocumentation
 */

import invertObject, {THashTable} from '../../utils/invertObject.js';
import {IObis} from './CommandBinaryBuffer.js';


// replacement table for only C and D groups
const letterCodes: THashTable = {
    C: 96,
    F: 97,
    L: 98,
    P: 99
};

const codeLetters = invertObject(letterCodes);


/**
 * Convert object to string.
 * https://www.promotic.eu/en/pmdoc/Subsystems/Comm/PmDrivers/IEC62056_OBIS.htm
 *
 * @param obis OBIS object to stringify
 * @returns code with mask A-B:C.D.E*F
 */
export const toString = ( obis: IObis ): string => {
    if ( !obis || typeof obis !== 'object' || Object.keys(obis).length === 0 ) {
        throw new Error('Must be an object with properties.');
    }

    // eslint-disable-next-line object-curly-newline
    const {a, b, c, d, e, f} = obis;

    // a is missing, b is present
    if ( (a === null || a === undefined) && (b !== null && b !== undefined) ) {
        throw new Error('Property "a" is mandatory when "b" is present.');
    }

    if ( c === null || c === undefined || d === null || d === undefined ) {
        throw new Error('Properties "c" and "d" are mandatory.');
    }

    let result = '';

    if ( a !== null && a !== undefined ) {
        if ( b !== null && b !== undefined ) {
            result += `${a}-${b}:`;
        } else {
            result += `${a}:`;
        }
    }

    // replace some numbers with letters
    // 96.7.0 -> C.7.0
    result += `${(codeLetters[c] ?? c) as string}.${(codeLetters[d] ?? d) as string}`;

    // e and f are independent
    if ( e !== null && e !== undefined ) {
        result += `.${e}`;
    }

    if ( f !== null && f !== undefined ) {
        result += `*${f}`;
    }

    return result;
};


/**
 * Convert string to object.
 *
 * @param obisString string according to the mask A-B:C.D.E*F
 */
export const fromString = ( obisString: string ): IObis => {
    const result: THashTable = {};
    const sortedResult: THashTable = {};
    let unprocessed = obisString;
    let parts: Array<string>;
    let eValue;

    parts = unprocessed.split('-');
    if ( parts.length > 1 ) {
        [result.a, unprocessed] = parts;
    }

    parts = unprocessed.split(':');
    if ( parts.length > 1 ) {
        [result.b, unprocessed] = parts;
    }

    parts = unprocessed.split('*');
    if ( parts.length > 1 ) {
        [unprocessed, result.f] = parts;
    }

    parts = unprocessed.split('.');
    if ( parts.length > 1 ) {
        [result.c, result.d, eValue] = parts;

        if ( eValue ) {
            result.e = eValue;
        }
    }

    // group value can be number or letter, e.g. 96 or "C"
    // so need to convert it to proper number
    Object.keys(result).forEach(groupName => {
        const groupValue = result[groupName] as string;

        if ( groupValue ) {
            const intValue = parseInt(letterCodes[groupValue] as string || groupValue, 10);

            if ( intValue < 0 || intValue > 255 ) {
                throw new Error(`Value for group "${groupName}" should be in range [0..255].`);
            }

            result[groupName] = intValue;
        } else {
            throw new Error(`Value for group "${groupName}" can't be empty.`);
        }
    });

    if ( !('c' in result && 'd' in result) ) {
        throw new Error('Properties "c" and "d" are mandatory.');
    }

    // sort obis object keys alphabetically
    Object.keys(result).sort().forEach(keyName => {
        sortedResult[keyName] = result[keyName];
    });

    return sortedResult as unknown as IObis;
};
