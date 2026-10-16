import {describe, expect, test} from '@jest/globals';

import * as demandTypes from '../../src/mtx1/constants/demandTypes.js';
import * as getCurrentDemand from '../../src/mtx1/commands/uplink/getCurrentDemand.js';
import * as getDemand from '../../src/mtx1/commands/uplink/getDemand.js';
import * as getDemandCumulative from '../../src/mtx1/commands/uplink/getDemandCumulative.js';


const date = {
    year: 24,
    month: 10,
    date: 2
};


describe('MTX1 getDemand', () => {
    test.each([
        [[], 0],
        [[{energy: 1}], 1],
        [[{energy: 1}, {energy: 2}, {energy: 3}], 3]
    ])('rejects a mismatched value count', (values, actualCount) => {
        expect(() => getDemand.toBytes({
            date,
            demandType: demandTypes.A_PLUS,
            firstIndex: 0,
            count: 2,
            period: 60,
            demands: values as never
        })).toThrow(`Invalid demand count: expected 2, actual ${actualCount}.`);
    });

    test('rejects a missing values array', () => {
        expect(() => getDemand.toBytes({
            date,
            demandType: demandTypes.A_PLUS,
            firstIndex: 0,
            count: 0,
            period: 60,
            demands: undefined
        })).toThrow('Invalid demands: array expected.');
    });

    test('rejects more than 48 records when encoding and decoding', () => {
        expect(() => getDemand.toBytes({
            date,
            demandType: demandTypes.A_PLUS,
            firstIndex: 0,
            count: 49,
            period: 1,
            demands: new Array(49).fill(null)
        })).toThrow('Invalid demand count: expected 0..48, actual 49.');

        const body = [0x31, 0x42, demandTypes.A_PLUS, 0, 0, 49, 1, ...new Array(49 * 2).fill(0xff)];

        expect(() => getDemand.fromBytes(body)).toThrow('Invalid demand count: expected 0..48, actual 49.');
    });

    test('rejects values with a shape that does not match the record index', () => {
        expect(() => getDemand.toBytes({
            date,
            demandType: demandTypes.A_PLUS,
            firstIndex: 25,
            count: 1,
            period: 60,
            demands: [{energy: 100}]
        })).toThrow('Invalid demand value: lastSummerHour expected.');

        expect(() => getDemand.toBytes({
            date,
            demandType: demandTypes.A_PLUS,
            firstIndex: 26,
            count: 1,
            period: 60,
            demands: [{lastSummerHour: 4}]
        })).toThrow('Invalid demand value: lastSummerHour is only valid at the last summer hour index.');

        expect(() => getDemand.toBytes({
            date,
            demandType: demandTypes.A_PLUS,
            firstIndex: 0,
            count: 1,
            period: 60,
            demands: [{voltage: 220}]
        })).toThrow('Invalid demand value: energy expected.');

        expect(() => getDemand.toBytes({
            date,
            demandType: demandTypes.VOLTAGE,
            firstIndex: 0,
            count: 1,
            period: 60,
            demands: [{energy: 100}]
        })).toThrow('Invalid demand value: voltage expected.');
    });

    test('round-trips a range entirely after the last summer hour', () => {
        const parameters = {
            date,
            demandType: demandTypes.A_PLUS,
            firstIndex: 26,
            count: 2,
            period: 60,
            demands: [
                {energy: 100},
                {energy: 200}
            ]
        };
        const bytes = getDemand.toBytes(parameters);

        expect(bytes).toHaveLength(getDemand.headerSize + 7 + 4);
        expect(getDemand.fromBytes(bytes.slice(getDemand.headerSize))).toStrictEqual(parameters);
    });

    test('treats period 0 as 30 minutes for the last summer hour', () => {
        const parameters = {
            date,
            demandType: demandTypes.A_PLUS,
            firstIndex: 50,
            count: 1,
            period: 0,
            demands: [{lastSummerHour: 4}]
        };
        const bytes = getDemand.toBytes(parameters);

        expect(getDemand.fromBytes(bytes.slice(getDemand.headerSize))).toStrictEqual(parameters);
    });

    test('rejects truncated and overlong bodies', () => {
        const bytes = getDemand.toBytes({
            date,
            demandType: demandTypes.A_PLUS,
            firstIndex: 0,
            count: 1,
            period: 60,
            demands: [{energy: 100}]
        });
        const body = bytes.slice(getDemand.headerSize);

        expect(() => getDemand.fromBytes(body.slice(0, -1))).toThrow('Invalid uplink GetDemand demands byte length.');
        expect(() => getDemand.fromBytes([...body, 0])).toThrow('Invalid uplink GetDemand demands byte length.');
    });

    test('exports the maximum response body size', () => {
        expect(getDemand.maxSize).toBe(7 + 48 * 2);

        const bytes = getDemand.toBytes({
            date,
            demandType: demandTypes.A_PLUS,
            firstIndex: 0,
            count: 48,
            period: 1,
            demands: new Array(48).fill(null)
        });

        expect(bytes.length - getDemand.headerSize).toBe(getDemand.maxSize);
    });
});


describe('MTX1 getCurrentDemand', () => {
    test('rejects more than 48 records when encoding and decoding', () => {
        expect(() => getCurrentDemand.toBytes({
            date,
            firstIndex: 0,
            count: 49,
            period: 1,
            demands: [{
                demandType: demandTypes.A_PLUS,
                values: new Array(49).fill(null)
            }]
        })).toThrow('Invalid demand count: expected 0..48, actual 49.');

        const body = [0x31, 0x42, 0, 0, 49, 1, demandTypes.A_PLUS, ...new Array(49 * 2).fill(0xff)];

        expect(() => getCurrentDemand.fromBytes(body)).toThrow('Invalid demand count: expected 0..48, actual 49.');
    });

    test('rejects values with a shape that does not match the record index or demand type', () => {
        expect(() => getCurrentDemand.toBytes({
            date,
            firstIndex: 25,
            count: 1,
            period: 60,
            demands: [{demandType: demandTypes.A_PLUS, values: [{energy: 100}]}]
        })).toThrow('Invalid demand value: lastSummerHour expected.');

        expect(() => getCurrentDemand.toBytes({
            date,
            firstIndex: 0,
            count: 1,
            period: 60,
            demands: [{demandType: demandTypes.A_PLUS, values: [{voltage: 220}]}]
        })).toThrow('Invalid demand value: energy expected.');

        expect(() => getCurrentDemand.toBytes({
            date,
            firstIndex: 0,
            count: 1,
            period: 60,
            demands: [{demandType: demandTypes.VOLTAGE, values: [{energy: 100}]}]
        })).toThrow('Invalid demand value: voltage expected.');
    });

    test('round-trips a zero-valued last summer hour', () => {
        const parameters = {
            date,
            firstIndex: 24,
            count: 2,
            period: 60,
            demands: [{
                demandType: demandTypes.A_PLUS,
                values: [{energy: 100}, {lastSummerHour: 0}]
            }]
        };
        const bytes = getCurrentDemand.toBytes(parameters);

        expect(bytes.slice(-2)).toStrictEqual([0x00, 0xff]);
        expect(getCurrentDemand.fromBytes(bytes.slice(getCurrentDemand.headerSize))).toStrictEqual(parameters);
    });
});


describe('MTX1 getDemandCumulative', () => {
    test.each([
        [[], 0],
        [[1], 1],
        [[1, 2, 3], 3]
    ])('rejects a mismatched value count', (values, actualCount) => {
        expect(() => getDemandCumulative.toBytes({
            date,
            demandType: demandTypes.A_PLUS,
            firstIndex: 0,
            count: 2,
            period: 60,
            demands: values as never
        })).toThrow(`Invalid demand count: expected 2, actual ${actualCount}.`);
    });

    test('rejects a missing values array', () => {
        expect(() => getDemandCumulative.toBytes({
            date,
            demandType: demandTypes.A_PLUS,
            firstIndex: 0,
            count: 0,
            period: 60,
            demands: undefined
        })).toThrow('Invalid demands: array expected.');
    });

    test('rejects more than 48 records when encoding and decoding', () => {
        expect(() => getDemandCumulative.toBytes({
            date,
            demandType: demandTypes.A_PLUS,
            firstIndex: 0,
            count: 49,
            period: 1,
            demands: new Array(49).fill(null)
        })).toThrow('Invalid demand count: expected 0..48, actual 49.');

        const body = [0x31, 0x42, demandTypes.A_PLUS, 0, 0, 49, 1, ...new Array(49 * 4).fill(0xff)];

        expect(() => getDemandCumulative.fromBytes(body)).toThrow(
            'Invalid demand count: expected 0..48, actual 49.'
        );
    });

    test('round-trips a range entirely after the last summer hour', () => {
        const parameters = {
            date,
            demandType: demandTypes.A_PLUS,
            firstIndex: 26,
            count: 2,
            period: 60,
            demands: [0x01020304, null]
        };
        const bytes = getDemandCumulative.toBytes(parameters);

        expect(bytes).toHaveLength(getDemandCumulative.headerSize + 7 + 8);
        expect(getDemandCumulative.fromBytes(bytes.slice(getDemandCumulative.headerSize))).toStrictEqual(parameters);
    });

    test('treats period 0 as 30 minutes for the last summer hour', () => {
        const parameters = {
            date,
            demandType: demandTypes.A_PLUS,
            firstIndex: 50,
            count: 1,
            period: 0,
            demands: [{lastSummerHour: 4}]
        };
        const bytes = getDemandCumulative.toBytes(parameters);

        expect(bytes).toHaveLength(getDemandCumulative.headerSize + 7 + 2);
        expect(getDemandCumulative.fromBytes(bytes.slice(getDemandCumulative.headerSize))).toStrictEqual(parameters);
    });

    test('uses width-specific missing sentinels', () => {
        const ordinaryBytes = getDemandCumulative.toBytes({
            date,
            demandType: demandTypes.A_PLUS,
            firstIndex: 24,
            count: 1,
            period: 60,
            demands: [null]
        });
        const specialBytes = getDemandCumulative.toBytes({
            date,
            demandType: demandTypes.A_PLUS,
            firstIndex: 25,
            count: 1,
            period: 60,
            demands: [null]
        });

        expect(ordinaryBytes.slice(-4)).toStrictEqual([0xff, 0xff, 0xff, 0xff]);
        expect(specialBytes.slice(-2)).toStrictEqual([0xff, 0xff]);
    });

    test('rejects invalid value shapes at ordinary and special indexes', () => {
        expect(() => getDemandCumulative.toBytes({
            date,
            demandType: demandTypes.A_PLUS,
            firstIndex: 25,
            count: 1,
            period: 60,
            demands: [100]
        })).toThrow('Invalid demand value: lastSummerHour expected.');

        expect(() => getDemandCumulative.toBytes({
            date,
            demandType: demandTypes.A_PLUS,
            firstIndex: 24,
            count: 1,
            period: 60,
            demands: [{lastSummerHour: 4}]
        })).toThrow('Invalid demand value: lastSummerHour is only valid at the last summer hour index.');
    });

    test('rejects short, truncated, and overlong bodies with command-specific errors', () => {
        expect(() => getDemandCumulative.fromBytes([0, 0, 0, 0, 0, 0])).toThrow(
            'Invalid uplink GetDemandCumulative byte length.'
        );

        const bytes = getDemandCumulative.toBytes({
            date,
            demandType: demandTypes.A_PLUS,
            firstIndex: 25,
            count: 1,
            period: 60,
            demands: [{lastSummerHour: 4}]
        });
        const body = bytes.slice(getDemandCumulative.headerSize);

        expect(() => getDemandCumulative.fromBytes(body.slice(0, -1))).toThrow(
            'Invalid uplink GetDemandCumulative demands byte length.'
        );
        expect(() => getDemandCumulative.fromBytes([...body, 0])).toThrow(
            'Invalid uplink GetDemandCumulative demands byte length.'
        );
    });

    test('exports the maximum response body size', () => {
        expect(getDemandCumulative.maxSize).toBe(7 + 48 * 4);

        const bytes = getDemandCumulative.toBytes({
            date,
            demandType: demandTypes.A_PLUS,
            firstIndex: 0,
            count: 48,
            period: 1,
            demands: new Array(48).fill(null)
        });

        expect(bytes.length - getDemandCumulative.headerSize).toBe(getDemandCumulative.maxSize);
    });
});
