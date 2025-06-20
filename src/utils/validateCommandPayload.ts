import * as types from '../types.js';
import getHexFromBytes from './getHexFromBytes.js';


/**
 * @todo: support flexible expectedLength formats for commands with variable lengths
 *
 * Some commands do not have a fixed length.
 * This change allows expectedLength to accept complex arguments:
 * {fixedLength: number}
 * {minimalLength: number, maximalLength: number}
 */
export default ( commandName: string, bytes: types.TBytes, expectedLength: number ) => {
    if ( !commandName ) {
        throw new Error('Command name is required.');
    }

    if ( bytes && !Array.isArray(bytes) ) {
        throw new Error(`Invalid payload for ${commandName}. Expected array, got: ${typeof bytes}.`);
    }

    if ( bytes.length !== expectedLength ) {
        const hex = getHexFromBytes(bytes, {separator: ''});

        throw new Error(`Wrong buffer size for ${commandName}: ${bytes.length}. Expected: ${expectedLength}. Payload: 0x${hex}.`);
    }
};
