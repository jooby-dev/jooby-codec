/* eslint-disable object-curly-newline */

import * as bitSet from '../src/utils/bitSet.js';


interface ITestCase {
    mask: bitSet.TBitSetMask,
    object: bitSet.TBooleanObject,
    bits: string
}

type TTestCases = Array<ITestCase>;


const bitMask: bitSet.TBitSetMask = {
    a: 2 ** 0,
    b: 2 ** 1,
    c: 2 ** 2,
    d: 2 ** 3,
    // e, f are skipped
    g: 2 ** 6
};

const fromObjectTestCases: TTestCases = [
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

const toObjectTestCases: TTestCases = [
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


const checkFromObject = ( {mask, object, bits}: ITestCase ) => {
    expect(bitSet.fromObject(mask, object).toString(2)).toBe(bits);
};

const checkToObject = ( {mask, object, bits}: ITestCase ) => {
    expect(bitSet.toObject(mask, parseInt(bits, 2))).toStrictEqual(object);
};


describe('bitSet conversions', () => {
    test('number from object', () => {
        fromObjectTestCases.forEach(checkFromObject);
    });

    test('object from number', () => {
        toObjectTestCases.forEach(checkToObject);
    });
});
