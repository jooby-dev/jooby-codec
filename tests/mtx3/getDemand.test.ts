import {describe, expect, test} from '@jest/globals';

import * as demandTypes from '../../src/mtx3/constants/demandTypes.js';
import * as getDemand from '../../src/mtx3/commands/uplink/getDemand.js';


const date = {
    year: 24,
    month: 10,
    date: 2
};


describe('MTX3 getDemand', () => {
    test.each([
        [[], 0],
        [[1], 1],
        [[1, 2, 3], 3]
    ])('rejects a mismatched value count', (values, actualCount) => {
        expect(() => getDemand.toBytes({
            date,
            demandType: demandTypes.ACTIVE_ENERGY_A_PLUS,
            firstIndex: 0,
            count: 2,
            period: 60,
            demands: values as never
        })).toThrow(`Invalid demand count: expected 2, actual ${actualCount}.`);
    });

    test('rejects a missing values array', () => {
        expect(() => getDemand.toBytes({
            date,
            demandType: demandTypes.ACTIVE_ENERGY_A_PLUS,
            firstIndex: 0,
            count: 0,
            period: 60,
            demands: undefined
        })).toThrow('Invalid demands: array expected.');
    });

    test('rejects more than 48 records when encoding and decoding', () => {
        expect(() => getDemand.toBytes({
            date,
            demandType: demandTypes.ACTIVE_ENERGY_A_PLUS,
            firstIndex: 0,
            count: 49,
            period: 1,
            demands: new Array(49).fill(null)
        })).toThrow('Invalid demand count: expected 0..48, actual 49.');

        const body = [
            0x31, 0x42, demandTypes.ACTIVE_ENERGY_A_PLUS, 0, 0, 49, 1,
            ...new Array(49 * 2).fill(0xff)
        ];

        expect(() => getDemand.fromBytes(body)).toThrow('Invalid demand count: expected 0..48, actual 49.');
    });

    test('rejects values with a shape that does not match the record index', () => {
        expect(() => getDemand.toBytes({
            date,
            demandType: demandTypes.ACTIVE_ENERGY_A_PLUS,
            firstIndex: 25,
            count: 1,
            period: 60,
            demands: [100]
        })).toThrow('Invalid demand value: lastSummerHour expected.');

        expect(() => getDemand.toBytes({
            date,
            demandType: demandTypes.ACTIVE_ENERGY_A_PLUS,
            firstIndex: 26,
            count: 1,
            period: 60,
            demands: [{lastSummerHour: 4}]
        })).toThrow('Invalid demand value: lastSummerHour is only valid at the last summer hour index.');
    });

    test('round-trips a range entirely after the last summer hour', () => {
        const parameters = {
            date,
            demandType: demandTypes.ACTIVE_ENERGY_A_PLUS,
            firstIndex: 26,
            count: 2,
            period: 60,
            demands: [100, null]
        };
        const bytes = getDemand.toBytes(parameters);

        expect(bytes).toHaveLength(getDemand.headerSize + 7 + 4);
        expect(getDemand.fromBytes(bytes.slice(getDemand.headerSize))).toStrictEqual(parameters);
    });

    test('treats period 0 as 30 minutes for the last summer hour', () => {
        const parameters = {
            date,
            demandType: demandTypes.ACTIVE_ENERGY_A_PLUS,
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
            demandType: demandTypes.ACTIVE_ENERGY_A_PLUS,
            firstIndex: 0,
            count: 1,
            period: 60,
            demands: [100]
        });
        const body = bytes.slice(getDemand.headerSize);

        expect(() => getDemand.fromBytes(body.slice(0, -1))).toThrow('Invalid uplink GetDemand demands byte length.');
        expect(() => getDemand.fromBytes([...body, 0])).toThrow('Invalid uplink GetDemand demands byte length.');
    });

    test('exports the maximum response body size', () => {
        expect(getDemand.maxSize).toBe(7 + 48 * 2);

        const bytes = getDemand.toBytes({
            date,
            demandType: demandTypes.ACTIVE_ENERGY_A_PLUS,
            firstIndex: 0,
            count: 48,
            period: 1,
            demands: new Array(48).fill(null)
        });

        expect(bytes.length - getDemand.headerSize).toBe(getDemand.maxSize);
    });
});
