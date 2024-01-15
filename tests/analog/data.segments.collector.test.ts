/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {IDataSegment} from '../../src/analog/CommandBinaryBuffer.js';
import DataSegmentsCollector from '../../src/analog/DataSegmentsCollector.js';
import getBytesFromHex from '../../src/utils/getBytesFromHex.js';
import permutations from '../../src/utils/permutations.js';


const collectedData = getBytesFromHex('00 01 02 03 04 05 06 07 08 09 0a 0b 0c 0d 0e 0f');

const validSequence = [
    {
        sequence: 2,
        last: false,
        fragmentsNumber: 3,
        fragmentIndex: 1,
        data: getBytesFromHex('00 01 02 03 04')
    },
    {
        // invalid section
        sequence: 2,
        last: false,
        fragmentsNumber: 3,
        fragmentIndex: 10,
        data: getBytesFromHex('00 01 02 03 04')
    },
    {
        sequence: 2,
        last: false,
        fragmentsNumber: 3,
        fragmentIndex: 2,
        data: getBytesFromHex('05 06 07')
    },
    {
        sequence: 2,
        last: true,
        fragmentsNumber: 3,
        fragmentIndex: 3,
        data: getBytesFromHex('08 09 0a 0b 0c 0d 0e 0f')
    }
];

const invalidSequences = [
    [
        {
            sequence: 2,
            last: false,
            fragmentsNumber: 3,
            fragmentIndex: 0,
            data: getBytesFromHex('00 01 02 03 04')
        }
    ],
    [
        {
            sequence: 2,
            last: false,
            fragmentsNumber: 3,
            fragmentIndex: 5,
            data: getBytesFromHex('00 01 02 03 04')
        }
    ],
    [
        {
            sequence: 2,
            last: false,
            fragmentsNumber: 3,
            fragmentIndex: 1,
            data: getBytesFromHex('00 01 02 03 04')
        },
        {
            sequence: 2,
            last: false,
            fragmentsNumber: 3,
            fragmentIndex: 2,
            data: getBytesFromHex('05 06 07')
        },
        {
            sequence: 2,
            last: false,
            fragmentsNumber: 3,
            fragmentIndex: 3,
            data: getBytesFromHex('08 09 0a 0b 0c 0d 0e 0f')
        }
    ],
    [
        {
            sequence: 2,
            last: false,
            fragmentsNumber: 3,
            fragmentIndex: 1,
            data: getBytesFromHex('00 01 02 03 04')
        },
        {
            sequence: 2,
            last: false,
            fragmentsNumber: 3,
            fragmentIndex: 2,
            data: getBytesFromHex('05 06 07')
        },
        {
            sequence: 2,
            last: false,
            fragmentsNumber: 3,
            fragmentIndex: 2,
            data: getBytesFromHex('05 06 07')
        },
        {
            sequence: 2,
            last: true,
            fragmentsNumber: 3,
            fragmentIndex: 3,
            data: getBytesFromHex('08 09 0a 0b 0c 0d 0e 0f')
        }
    ],
    [
        {
            sequence: 2,
            last: false,
            fragmentsNumber: 3,
            fragmentIndex: 1,
            data: getBytesFromHex('00 01 02 03 04')
        },
        {
            sequence: 3,
            last: false,
            fragmentsNumber: 3,
            fragmentIndex: 1,
            data: getBytesFromHex('00 01 02 03 04')
        }
    ]
];

const collectCommands = ( sequence: Array<IDataSegment> ) => {
    const collector = new DataSegmentsCollector();

    for ( let index = 0; index < sequence.length; index++ ) {
        const result = collector.push(sequence[index]);

        if ( result?.length !== 0 ) {
            return result;
        }
    }

    return new Uint8Array();
};


describe('valid sequences', () => {
    permutations<IDataSegment>(validSequence).forEach((sequence, index) => {
        test(`test case #${index}`, () => {
            expect(collectCommands(sequence)).toStrictEqual(collectedData);
        });
    });
});

describe('invalid sequences', () => {
    const emptyArray = new Uint8Array();
    invalidSequences.forEach((sequence, index) => {
        test(`test case #${index}`, () => {
            expect(collectCommands(sequence)).toStrictEqual(emptyArray);
        });
    });
});
