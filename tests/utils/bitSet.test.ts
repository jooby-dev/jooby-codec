/* eslint-disable object-curly-newline */

import * as bitSet from '../../src/utils/bitSet.js';


interface IObjectTestCase {
    mask?: bitSet.TBitSetMask,
    object?: bitSet.TBooleanObject,
    bits: string
}

interface IExtractBitsTestCase {
    value: number,
    bitsNumber: number,
    startIndex: number,
    result: number
}

interface IFillBitsTestCase {
    value: number,
    bitsNumber: number,
    startIndex: number,
    valueToSet: number,
    result: number
}

type TObjectTestCases = Array<IObjectTestCase>;
type TExtractBitsTestCases = Array<IExtractBitsTestCase>;
type TFillBitsTestCases = Array<IFillBitsTestCase>;


const bitMask: bitSet.TBitSetMask = {
    a: 2 ** 0,
    b: 2 ** 1,
    c: 2 ** 2,
    d: 2 ** 3,
    // e, f are skipped
    g: 2 ** 6
};

const fromObjectTestCases: TObjectTestCases = [
    {
        mask: undefined,
        object: undefined,
        bits: '0'
    },
    {
        mask: {},
        object: {},
        bits: '0'
    },
    {
        mask: {},
        object: {a: true, b: false},
        bits: '0'
    },
    {
        mask: bitMask,
        object: {},
        bits: '0'
    },
    {
        mask: bitMask,
        object: {a: false, c: false},
        bits: '0'
    },
    {
        mask: bitMask,
        object: {e: true, f: true},
        bits: '0'
    },
    {
        mask: bitMask,
        object: {a: true, b: true, c: false, d: true, e: true, f: false, g: true},
        bits: '1001011'
    }
];

const toObjectTestCases: TObjectTestCases = [
    {
        mask: undefined,
        object: {},
        bits: '0'
    },
    {
        mask: {},
        object: {},
        bits: '0'
    },
    {
        mask: {},
        object: {},
        bits: '1001011'
    },
    {
        mask: bitMask,
        object: {a: false, b: false, c: false, d: false, g: false},
        bits: '0'
    },
    {
        mask: bitMask,
        object: {a: true, b: true, c: true, d: true, g: true},
        bits: '1111111'
    },
    {
        mask: bitMask,
        object: {a: true, b: true, c: true, d: true, g: true},
        bits: '1001111'
    },
    {
        mask: bitMask,
        object: {a: false, b: false, c: true, d: false, g: false},
        bits: '0110100'
    }
];

const extractBitsTestCases: TExtractBitsTestCases = [
    {
        value: 0,
        bitsNumber: 1,
        startIndex: 1,
        result: 0
    },
    {
        value: 0,
        bitsNumber: 3,
        startIndex: 3,
        result: 0
    },
    {
        value: 0b11111111,
        bitsNumber: 3,
        startIndex: 3,
        result: 0b111
    },
    {
        value: 0b11011011,
        bitsNumber: 3,
        startIndex: 1,
        result: 0b011
    },
    {
        value: 0b11011011,
        bitsNumber: 3,
        startIndex: 3,
        result: 0b110
    },
    {
        value: 0b11011011,
        bitsNumber: 8,
        startIndex: 1,
        result: 0b11011011
    }
];

const fillBitsTestCases: TFillBitsTestCases = [
    {
        value: 0,
        bitsNumber: 1,
        startIndex: 1,
        valueToSet: 0,
        result: 0
    },
    {
        value: 0,
        bitsNumber: 1,
        startIndex: 1,
        valueToSet: 1,
        result: 0b00000001
    },
    {
        value: 0,
        bitsNumber: 2,
        startIndex: 2,
        valueToSet: 0b11,
        result: 0b00000110
    },
    {
        value: 0,
        bitsNumber: 3,
        startIndex: 3,
        valueToSet: 0b101,
        result: 0b00010100
    },
    {
        value: 0b11011011,
        bitsNumber: 4,
        startIndex: 3,
        valueToSet: 0b1101,
        result: 0b11110111
    }
];


const checkFromObject = ( {mask, object, bits}: IObjectTestCase ) => {
    expect(bitSet.fromObject(mask, object).toString(2)).toBe(bits);
};

const checkToObject = ( {mask, object, bits}: IObjectTestCase ) => {
    expect(bitSet.toObject(mask, parseInt(bits, 2))).toStrictEqual(object);
};

const checkExtractBits = ( {value, bitsNumber, startIndex, result}: IExtractBitsTestCase ) => {
    expect(bitSet.extractBits(value, bitsNumber, startIndex)).toStrictEqual(result);
};

const checkFillBits = ( {value, bitsNumber, startIndex, valueToSet, result}: IFillBitsTestCase ) => {
    expect(bitSet.fillBits(value, bitsNumber, startIndex, valueToSet)).toStrictEqual(result);
};


describe('number from object', () => {
    fromObjectTestCases.forEach((testCase, index) => {
        test(`test case #${index}`, () => {
            checkFromObject(testCase);
        });
    });
});

describe('object from number', () => {
    toObjectTestCases.forEach((testCase, index) => {
        test(`test case #${index}`, () => {
            checkToObject(testCase);
        });
    });
});

describe('extract bits', () => {
    extractBitsTestCases.forEach((testCase, index) => {
        test(`test case #${index}`, () => {
            checkExtractBits(testCase);
        });
    });
});

describe('fill bits', () => {
    fillBitsTestCases.forEach((testCase, index) => {
        test(`test case #${index}`, () => {
            checkFillBits(testCase);
        });
    });
});
