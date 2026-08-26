import {describe, expect, test} from '@jest/globals';

import * as getDayMaxPower from '../../src/mtx1/commands/uplink/getDayMaxPower.js';


describe('loraBuffer setAPlusTariffPowerMax', () => {
    test('roundtrip keeps distinct A+R+ and A+R- values', () => {
        const parameters = {
            date: {
                year: 21,
                month: 2,
                date: 3
            },
            tariffs: [
                {
                    'A+': {hours: 1, minutes: 2, power: 10},
                    'A+R+': {hours: 3, minutes: 4, power: 20},
                    'A+R-': {hours: 5, minutes: 6, power: 30}
                },
                null,
                null,
                null
            ]
        };

        const bytes = getDayMaxPower.toBytes(parameters);
        const decoded = getDayMaxPower.fromBytes(bytes.slice(getDayMaxPower.headerSize));

        expect(decoded).toStrictEqual(parameters);
    });
});
