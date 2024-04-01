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


const checkExample = (
    {headerSize, fromBytes, toBytes}: ICommandImplementation,
    commandExample: TCommand
    // {parameters: exampleParameters, config, bytes: exampleBytes}
) => {
    // valid command
    if ( 'bytes' in commandExample ) {
        const parametersFromBytes = fromBytes(commandExample.bytes?.slice(headerSize) || [], commandExample.config);
        const bytesFromParameters = toBytes(commandExample.parameters, commandExample.config);

        // console.log('bytesFromParameters:', bytesFromParameters);
        // console.log('parametersFromBytes:', parametersFromBytes);
        expect(getHexFromBytes(bytesFromParameters)).toBe(getHexFromBytes(commandExample.bytes || []));
        expect(parametersFromBytes).toStrictEqual(commandExample.parameters);
    } else {
        // everything else
        throw new Error('wrong command format');
    }

    //const exampleHex = getHexFromBytes(getBytesFromHex(`${header} ${body}`));
    //const exampleBytes = getBytesFromHex(exampleHex);
    //const exampleBytes = getBytesFromHex(`${header} ${body}`);
    //const commandBase64 = getBase64FromBytes(exampleBytes);
    //const messageHex = `${exampleHex} ${calculateLrc(exampleBytes).toString(16)}`;
    //console.log('messageHex:', messageHex);

    //const command = new constructor(parameters, config);
    //    const parametersFromHex = fromBytes(body ? getBytesFromHex(body) : [], config);
    //    const bytesFromParameters = toBytes(exampleParameters, config);
    //console.log('parametersFromHex:', parametersFromHex);
    //console.log('bytes:', bytesFromParameters);
    //    expect(exampleBytes).toStrictEqual(bytesFromParameters);
    //    expect(exampleParameters).toStrictEqual(parametersFromHex);
    //    expect(toBytes(parametersFromHex, config)).toStrictEqual(exampleBytes);

    //expect(command).toBeInstanceOf(command);
    //expect(command).toBeInstanceOf(Command);
    //expect(command.parameters).toStrictEqual(parameters);
    //expect(command.getParameters()).toStrictEqual(parameters);
    //expect(command.toHex()).toBe(exampleHex);
    // if ( !(command instanceof DataSegmentBase) ) {
    //     expect(command.toJson()).toBe(JSON.stringify(command.getParameters()));
    // }
    //expect(command.toBase64()).toBe(commandBase64);

    // expect(parametersFromHex).toStrictEqual(command);
    // expect(parametersFromHex.toHex()).toBe(exampleHex);
    // expect(parametersFromHex.parameters).toStrictEqual(parameters);
    // expect(parametersFromHex.getParameters()).toStrictEqual(parameters);
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

            // command.examples.forEach((example: ICommandExample) => {
            //     test(example.name, () => checkExample(command, example));
            // });
        });
    }
};


describe('downlink commands', () => {
    processExamples(downlink);
});

describe('uplink commands', () => {
    processExamples(uplink);
});
