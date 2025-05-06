//import * as command from '../../src/analog/command.js';
import {TCommand, ICommandImplementation} from '../../src/analog/utils/command.js';
import {commands} from '../../src/analog/index.js';
//import calculateLrc from '../../src/utils/calculateLrc.js';
//import getBytesFromHex from '../../src/utils/getBytesFromHex.js';
import getHexFromBytes from '../../src/utils/getHexFromBytes.js';
//import getBase64FromBytes from '../../src/utils/getBase64FromBytes.js';
//import {ICommandExample} from '../../src/analog/types.js';
//import DataSegmentBase from '../../src/analog/commands/DataSegmentBase.js';


const {uplink, downlink} = commands;
const SCOPE = 'analog';


const checkExample = (
    {headerSize, fromBytes, toBytes}: ICommandImplementation,
    commandExample: TCommand
) => {
    // valid command
    if ( 'bytes' in commandExample ) {
        const parametersFromBytes = fromBytes(commandExample.bytes?.slice(headerSize) || [], commandExample.config);
        const bytesFromParameters = toBytes(commandExample.parameters, commandExample.config);

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
        describe(`${scope} ${commandName} ${getHexFromBytes([commandImplementation.id])}/${commandImplementation.id}`, () => {
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
