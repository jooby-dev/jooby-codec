import {TCommand, ICommandImplementation} from '../../src/obis-observer/utils/command.js';
import {commands} from '../../src/obis-observer/index.js';
import getHexFromBytes from '../../src/utils/getHexFromBytes.js';


const {uplink, downlink} = commands;


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

const processExamples = ( commandMap: Record<string, ICommandImplementation> ) => {
    for ( const [commandName, commandImplementation] of Object.entries(commandMap) ) {
        // each command should export at least 1 example
        expect(Object.keys(commandImplementation.examples).length).toBeGreaterThan(0);

        // eslint-disable-next-line @typescript-eslint/no-loop-func
        describe(`${commandName} ${getHexFromBytes([commandImplementation.id])}/${commandImplementation.id}`, () => {
            for ( const [exampleName, example] of Object.entries(commandImplementation.examples) ) {
                test(exampleName, () => checkExample(commandImplementation, example));
            }
        });
    }
};


describe('downlink commands', () => {
    processExamples(downlink);
});

describe('uplink commands', () => {
    processExamples(uplink);
});
