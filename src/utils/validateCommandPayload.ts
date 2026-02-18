import * as types from '../types.js';
import getHexFromBytes from './getHexFromBytes.js';


export const validateRangeCommandPayload = ( commandName: string, bytes: types.TBytes, range: {min?: number; max?: number} ) => {
    if ( !commandName ) {
        throw new Error('Command name is required.');
    }

    if ( bytes && !Array.isArray(bytes) ) {
        throw new Error(`Invalid payload for ${commandName}. Expected array, got: ${typeof bytes}.`);
    }

    if ( (range.min > 0 && bytes.length < range.min ) || (range.max > 0 && bytes.length > range.max ) ) {
        const hex = getHexFromBytes(bytes, {separator: ''});
        const expectedLengthReport = range.min === range.max
            ? `${range.max}`
            : JSON.stringify(range);

        throw new Error(`Wrong buffer size for ${commandName}: ${bytes.length}. Expected: ${expectedLengthReport}. Payload: 0x${hex}.`);
    }
};

export const validateFixedCommandPayload = ( commandName: string, bytes: types.TBytes, expectedLength: number ) => (
    validateRangeCommandPayload(commandName, bytes, {min: expectedLength, max: expectedLength})
);


export default validateFixedCommandPayload;
