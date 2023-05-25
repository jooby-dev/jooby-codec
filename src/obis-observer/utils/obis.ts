/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import {IObis} from '../CommandBinaryBuffer.js';


/**
 * Convert to string.
 * https://www.promotic.eu/en/pmdoc/Subsystems/Comm/PmDrivers/IEC62056_OBIS.htm
 *
 * @param obis OBIS object to stringify
 * @returns code with mask A-B:C.D.E*F
 */
export const toString = ( obis: IObis ): string => {
    if ( !obis || typeof obis !== 'object' || Object.keys(obis).length === 0 ) {
        throw new Error('OBIS must be an object with properties.');
    }

    // eslint-disable-next-line object-curly-newline
    const {a, b, c, d, e, f} = obis;

    if ( c === null || c === undefined || d === null || d === undefined ) {
        throw new Error('Properties "c" and "d" are mandatory in OBIS.');
    }

    let result = '';

    if ( a && b ) {
        result += `${a}-${b}:`;
    }

    result += `${c}.${d}`;

    if ( e && f ) {
        result += `.${e}*${f}`;
    } else if ( e ) {
        result += `.${e}`;
    }

    return result;
};
