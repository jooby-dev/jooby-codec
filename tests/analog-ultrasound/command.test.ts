import {describe, expect, test} from '@jest/globals';

import {TCommand, ICommandImplementation, getErrorInfo} from '../../src/analog-ultrasound/utils/command.js';
import {commands} from '../../src/analog-ultrasound/index.js';
import getHexFromBytes from '../../src/utils/getHexFromBytes.js';


const {uplink, downlink} = commands;
const SCOPE = 'analog-ultrasound';


const checkExample = (
    {headerSize, fromBytes, toBytes}: ICommandImplementation,
    commandExample: TCommand
) => {
    // valid command
    if ( 'bytes' in commandExample ) {
        const parametersFromBytes = fromBytes(commandExample.bytes?.slice(headerSize) || []);
        const bytesFromParameters = toBytes(commandExample.parameters);

        expect(getHexFromBytes(bytesFromParameters)).toBe(getHexFromBytes(commandExample.bytes || []));
        expect(parametersFromBytes).toStrictEqual(commandExample.parameters);
        // testing parameters for full equality
        expect(JSON.stringify(parametersFromBytes)).toBe(JSON.stringify(commandExample.parameters));
    } else {
        // everything else
        throw new Error('wrong command format');
    }
};


const processExamples = ( scope: string, commandMap: Record<string, ICommandImplementation> ) => {
    for ( const [commandName, commandImplementation] of Object.entries(commandMap) ) {
        // each command should export at least 1 example
        expect(Object.keys(commandImplementation.examples).length).toBeGreaterThan(0);

        // eslint-disable-next-line @typescript-eslint/no-loop-func
        describe(`${scope} ${commandName} 0x${getHexFromBytes([commandImplementation.id])}/${commandImplementation.id}`, () => {
            for ( const [exampleName, example] of Object.entries(commandImplementation.examples) ) {
                test(exampleName, () => checkExample(commandImplementation, example));
            }
        });
    }
};


describe('downlink commands', () => {
    processExamples(`${SCOPE} downlink`, downlink);
});

describe('uplink commands', () => {
    processExamples(`${SCOPE} uplink`, uplink);
});


describe('getErrorInfo from uplink commands', () => {
    test('empty', () => {
        expect(getErrorInfo()).toBeNull();
        expect(getErrorInfo([])).toBeNull();
    });

    test('ok: getDepassivationConfig valid response', () => {
        expect(getErrorInfo([0x07, 0x22, 0x18, 0xc0, 0x5d, 0x20, 0x4e])).toBeNull();
    });

    test('error: setDepassivationConfig failed response', () => {
        const {commandId, error} = getErrorInfo([0x04, 0xa2, 0x19, 0x05]);

        expect(commandId).toEqual(8729);
        expect(error).toEqual({code: 5, name: 'PARAMETER_ERROR'});
    });

    test('error: unimplemented command response', () => {
        const {commandId, error} = getErrorInfo([0x04, 0xa4, 0x01, 0x03]);

        expect(commandId).toEqual(9217);
        expect(error).toEqual({code: 3, name: 'FUNCTION_NOT_FOUND'});
    });
});
