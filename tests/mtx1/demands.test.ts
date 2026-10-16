import {describe, expect, test} from '@jest/globals';

import * as demands from '../../src/mtx1/utils/demands.js';


describe('demand period and record indexes', () => {
    test.each([
        [60, 25],
        [30, 50],
        [15, 100],
        [10, 150],
        [5, 300],
        [3, 500],
        [1, 1500],
        [0, 50]
    ])('period %i has last summer hour at index %i', (period, expectedIndex) => {
        expect(demands.getLastSummerHourIndex(period)).toBe(expectedIndex);
    });

    test('period 0 is normalized to 30 minutes', () => {
        expect(demands.normalizeDemandPeriod(0)).toBe(30);
        expect(demands.getRecordIndex(25, 0, 0)).toBe(50);
        expect(demands.getRecordTime(1, 0)).toBe('0:30');
    });
});


describe('last summer hour range', () => {
    test.each([
        [{firstIndex: 0, count: 0, period: 60}, false],
        [{firstIndex: 0, count: 24, period: 60}, false],
        [{firstIndex: 0, count: 25, period: 60}, false],
        [{firstIndex: 0, count: 26, period: 60}, true],
        [{firstIndex: 23, count: 3, period: 60}, true],
        [{firstIndex: 25, count: 1, period: 60}, true],
        [{firstIndex: 26, count: 1, period: 60}, false],
        [{firstIndex: 30, count: 3, period: 60}, false],
        [{firstIndex: 50, count: 1, period: 0}, true],
        [{firstIndex: 51, count: 1, period: 0}, false]
    ])('detects whether %o includes the special record', (range, expected) => {
        expect(demands.hasLastSummerHour(range)).toBe(expected);
    });

    test.each([
        [{firstIndex: 0, count: 0, period: 60}, 4, 2, 0],
        [{firstIndex: 24, count: 1, period: 60}, 4, 2, 4],
        [{firstIndex: 25, count: 1, period: 60}, 4, 2, 2],
        [{firstIndex: 26, count: 1, period: 60}, 4, 2, 4],
        [{firstIndex: 23, count: 3, period: 60}, 4, 2, 10],
        [{firstIndex: 50, count: 1, period: 0}, 4, 2, 2],
        [{firstIndex: 25, count: 1, period: 60}, 2, 2, 2]
    ])(
        'calculates the value size for %o',
        (range, valueSize, lastSummerHourValueSize, expected) => {
            expect(demands.getDemandValuesSize(range, valueSize, lastSummerHourValueSize)).toBe(expected);
        }
    );
});


describe('demand count validation', () => {
    test.each([0, 1, 48])('accepts count %i', count => {
        expect(() => demands.validateDemandCount(count)).not.toThrow();
    });

    test.each([-1, 49, 1.5])('rejects unsupported count %s', count => {
        expect(() => demands.validateDemandCount(count)).toThrow(
            `Invalid demand count: expected 0..48, actual ${count}.`
        );
    });

    test.each([
        [[], 2, 0],
        [[1], 2, 1],
        [[1, 2, 3], 2, 3]
    ])('rejects values %o when count is %i', (values, expectedCount, actualCount) => {
        expect(() => demands.validateDemandValues(values, {firstIndex: 0, count: expectedCount, period: 60})).toThrow(
            `Invalid demand count: expected ${expectedCount}, actual ${actualCount}.`
        );
    });

    test.each([undefined, null])('rejects a missing values array', (values: null | undefined) => {
        expect(() => demands.validateDemandValues(values, {firstIndex: 0, count: 0, period: 60})).toThrow(
            'Invalid demands: array expected.'
        );
    });

    test('accepts an exact value count', () => {
        expect(() => demands.validateDemandValues([1, 2], {firstIndex: 0, count: 2, period: 60})).not.toThrow();
        expect(() => demands.validateDemandValues([], {firstIndex: 0, count: 0, period: 60})).not.toThrow();
    });

    test('requires the last summer hour value only at its record index', () => {
        expect(() => demands.validateDemandValues(
            [100],
            {firstIndex: 25, count: 1, period: 60}
        )).toThrow('Invalid demand value: lastSummerHour expected.');
        expect(() => demands.validateDemandValues(
            [{lastSummerHour: 4}],
            {firstIndex: 26, count: 1, period: 60}
        )).toThrow('Invalid demand value: lastSummerHour is only valid at the last summer hour index.');
    });

    test.each([
        ['energy', {voltage: 220}],
        ['voltage', {energy: 100}],
        ['number', {energy: 100}]
    ] as const)('requires %s values at ordinary indexes', (valueType, value) => {
        expect(() => demands.validateDemandValues(
            [value],
            {firstIndex: 0, count: 1, period: 60},
            valueType
        )).toThrow(`Invalid demand value: ${valueType} expected.`);
    });
});


describe('MTX1 demand words', () => {
    test('keeps existing energy and voltage conversions', () => {
        expect(demands.energyToBinary([
            {tariff: 0, energy: 177},
            {tariff: 2, energy: 32},
            null,
            {lastSummerHour: 4}
        ])).toStrictEqual([0x00b1, 0x8020, 0xffff, 0x04ff]);

        expect(demands.voltageToBinary([
            {voltage: 2201},
            null,
            {lastSummerHour: 4}
        ])).toStrictEqual([0x0899, 0xffff, 0x04ff]);
    });

    test('period 0 decodes its last summer hour like period 30', () => {
        expect(demands.energyFromBinary([0x04ff], 50, 0)).toStrictEqual([{lastSummerHour: 4}]);
        expect(demands.voltageFromBinary([0x04ff], 50, 0)).toStrictEqual([{lastSummerHour: 4}]);
    });

    test('encodes a zero-valued last summer hour', () => {
        expect(demands.energyToWord({lastSummerHour: 0})).toBe(0x00ff);
        expect(demands.voltageToWord({lastSummerHour: 0})).toBe(0x00ff);
    });
});
