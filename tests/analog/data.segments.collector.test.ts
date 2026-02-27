import {IDataSegment} from '../../src/analog/utils/binary/buffer.js';
import DataSegmentsCollector from '../../src/analog/utils/DataSegmentsCollector.js';
import permutations from '../../src/utils/permutations.js';
import getBytesFromHex from '../../src/utils/getBytesFromHex.js';


const collectedData = getBytesFromHex('00 01 02 03 04 05 06 07 08 09 0a 0b 0c 0d 0e 0f');

const validSequence = [
    {
        segmentationSessionId: 2,
        isLast: false,
        segmentsNumber: 3,
        segmentIndex: 1,
        data: getBytesFromHex('00 01 02 03 04')
    },
    {
        // invalid section
        segmentationSessionId: 2,
        isLast: false,
        segmentsNumber: 3,
        segmentIndex: 10,
        data: getBytesFromHex('00 01 02 03 04')
    },
    {
        segmentationSessionId: 2,
        isLast: false,
        segmentsNumber: 3,
        segmentIndex: 2,
        data: getBytesFromHex('05 06 07')
    },
    {
        segmentationSessionId: 2,
        isLast: true,
        segmentsNumber: 3,
        segmentIndex: 3,
        data: getBytesFromHex('08 09 0a 0b 0c 0d 0e 0f')
    }
];

const invalidSequences = [
    [
        {
            segmentationSessionId: 2,
            isLast: false,
            segmentsNumber: 3,
            segmentIndex: 0,
            data: getBytesFromHex('00 01 02 03 04')
        }
    ],
    [
        {
            segmentationSessionId: 2,
            isLast: false,
            segmentsNumber: 3,
            segmentIndex: 5,
            data: getBytesFromHex('00 01 02 03 04')
        }
    ],
    [
        {
            segmentationSessionId: 2,
            isLast: false,
            segmentsNumber: 3,
            segmentIndex: 1,
            data: getBytesFromHex('00 01 02 03 04')
        },
        {
            segmentationSessionId: 2,
            isLast: false,
            segmentsNumber: 3,
            segmentIndex: 2,
            data: getBytesFromHex('05 06 07')
        },
        {
            segmentationSessionId: 2,
            isLast: false,
            segmentsNumber: 3,
            segmentIndex: 3,
            data: getBytesFromHex('08 09 0a 0b 0c 0d 0e 0f')
        }
    ],
    [
        {
            segmentationSessionId: 2,
            isLast: false,
            segmentsNumber: 3,
            segmentIndex: 1,
            data: getBytesFromHex('00 01 02 03 04')
        },
        {
            segmentationSessionId: 2,
            isLast: false,
            segmentsNumber: 3,
            segmentIndex: 2,
            data: getBytesFromHex('05 06 07')
        },
        {
            segmentationSessionId: 2,
            isLast: false,
            segmentsNumber: 3,
            segmentIndex: 2,
            data: getBytesFromHex('05 06 07')
        },
        {
            segmentationSessionId: 2,
            isLast: true,
            segmentsNumber: 3,
            segmentIndex: 3,
            data: getBytesFromHex('08 09 0a 0b 0c 0d 0e 0f')
        }
    ],
    [
        {
            segmentationSessionId: 2,
            isLast: false,
            segmentsNumber: 3,
            segmentIndex: 1,
            data: getBytesFromHex('00 01 02 03 04')
        },
        {
            segmentationSessionId: 3,
            isLast: false,
            segmentsNumber: 3,
            segmentIndex: 1,
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

    return [];
};


describe('valid sequences', () => {
    permutations<IDataSegment>(validSequence).forEach((sequence, index) => {
        test(`test case #${index}`, () => {
            expect(collectCommands(sequence)).toStrictEqual(collectedData);
        });
    });
});

describe('invalid sequences', () => {
    const emptyArray = [];
    invalidSequences.forEach((sequence, index) => {
        test(`test case #${index}`, () => {
            expect(collectCommands(sequence)).toStrictEqual(emptyArray);
        });
    });
});
