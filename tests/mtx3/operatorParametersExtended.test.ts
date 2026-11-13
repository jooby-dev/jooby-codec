import {describe, expect, test} from '@jest/globals';

import * as getOperatorParametersExtended from '../../src/mtx3/commands/uplink/getOperatorParametersExtended.js';
import * as setOperatorParametersExtended from '../../src/mtx3/commands/downlink/setOperatorParametersExtended.js';


describe.each([
    {name: 'uplink getOperatorParametersExtended', command: getOperatorParametersExtended},
    {name: 'downlink setOperatorParametersExtended', command: setOperatorParametersExtended}
])('$name', ({command}) => {
    test.each([
        [0x00, false, 0x00],
        [0x04, true, 0x0c],
        [0x08, true, 0x0c],
        [0x0c, true, 0x0c],
        [0xa3, false, 0xa3],
        [0xa7, true, 0xaf],
        [0xab, true, 0xaf],
        [0xaf, true, 0xaf]
    ])('decodes define1 %i and encodes both optoport bits when enabled', (define1, blocked, encodedDefine1) => {
        const parameters = command.fromBytes([1, define1, 0, 5, 0, 0, 0, 0, 0]);
        const otherFlags = (define1 & 0xa3) !== 0;

        expect(parameters).toStrictEqual({
            timeoutRelayOn: 1,
            define1: {
                RESET_DAY_MAX_POWER_KEY: otherFlags,
                RESET_MONTH_MAX_POWER_KEY: otherFlags,
                BLOCK_KEY_OPTOPORT: blocked,
                MAGNET_SCREEN_CONST: otherFlags,
                ALLOW_BROWNOUT_INDICATION: otherFlags
            },
            timeoutRelayKey: 0,
            timeoutRelayAuto: 5
        });
        expect(command.toBytes(parameters)).toStrictEqual([
            command.id, command.maxSize,
            1, encodedDefine1, 0, 5, 0, 0, 0, 0, 0
        ]);
    });
});
