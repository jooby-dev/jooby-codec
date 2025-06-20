import * as types from '../types.js';


export default ( commandName: string, bytes: types.TBytes, expectedLength: number ) => {
    if ( !commandName ) {
        throw new Error('Command name is required.');
    }

    if ( bytes && !Array.isArray(bytes) ) {
        throw new Error(`Invalid payload for ${commandName}. Expected array, got: ${typeof bytes}.`);
    }

    if ( bytes.length !== expectedLength ) {
        throw new Error(`Wrong buffer size for ${commandName}: ${bytes.length}. Expected: ${expectedLength}. Payload: [${bytes.join(', ')}].`);
    }
};
