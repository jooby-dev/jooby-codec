import {describe, expect, test} from '@jest/globals';

import * as frame from '../../src/plc/utils/frame.js';
import * as block from '../../src/plc/utils/block.js';
import getBytesFromHex from '../../src/utils/getBytesFromHex.js';


const frames = [
    {
        type: 'downlinkController' as const,
        hex: '7e0017000080002a9001001a7915192dc79e06100700000038637e'
    },
    {
        type: 'uplinkController' as const,
        hex: '7e3400bdc30000ac9001001a7915192dc79e0610071c0403029a0000031f0f0800107d317d3103000000000100000000000c734d0000bb5a7e'
    }
];


describe('PLC frame', () => {
    frames.forEach(({type, hex}) => {
        test(type, () => {
            const parsedFrame = frame.fromBytes(type, getBytesFromHex(hex));
            let bytes = frame.toBytes(parsedFrame);

            expect(parsedFrame.type).toBe(type);
            if ( parsedFrame.type === 'invalid' ) {
                throw new Error('Frame should be valid');
            }

            expect(bytes).toEqual(getBytesFromHex(hex));

            const parsedBlock = block.fromBytes(parsedFrame.payload);

            bytes = block.toBytes(parsedBlock);

            expect(bytes).toEqual(parsedFrame.payload);
        });
    });
});
