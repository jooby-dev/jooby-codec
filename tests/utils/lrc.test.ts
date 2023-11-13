/* eslint-disable object-curly-newline */

import calculateLrc from '../../src/utils/calculateLrc.js';
import getBytesFromHex from '../../src/utils/getBytesFromHex.js';


describe('check lrc calculation', () => {
    test('simple sequence', () => {
        const testSequence = '00 01 02 03 04 05 06 07 08 09 0a 0b 0c 0d 0e 0f 55';
        const testBytes = getBytesFromHex(testSequence);

        expect(calculateLrc(testBytes)).toBe(0);
    });
});
