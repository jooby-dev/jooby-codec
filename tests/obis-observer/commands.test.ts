/* eslint-disable */

import Command, {ICommandExample} from '../../src/obis-observer/Command.js';
import {commands} from '../../src/obis-observer/index.js';
import getBytesFromHex from '../../src/utils/getBytesFromHex.js';
import getHexFromBytes from '../../src/utils/getHexFromBytes.js';
import getBase64FromBytes from '../../src/utils/getBase64FromBytes.js';


const {uplink, downlink} = commands;


const checkExample = ( constructor: any, {parameters, hex: {header, body} }: ICommandExample ) => {
    const commandHex = header + ' ' + body;
    const commandBytes = getBytesFromHex(commandHex);
    const commandBase64 = getBase64FromBytes(commandBytes);
    const command = new constructor(parameters);
    const commandFromHex = constructor.fromBytes(body ? getBytesFromHex(body) : null);

    expect(command).toBeInstanceOf(constructor);
    expect(command).toBeInstanceOf(Command);
    expect(command.parameters).toStrictEqual(parameters);
    expect(command.getParameters()).toStrictEqual(parameters);
    expect(command.toHex()).toBe(commandHex);
    expect(command.toJson()).toBe(JSON.stringify(command.getParameters()));
    expect(command.toBase64()).toBe(commandBase64);

    expect(commandFromHex).toStrictEqual(command);
    expect(commandFromHex.toHex()).toBe(commandHex);
    expect(commandFromHex.parameters).toStrictEqual(parameters);
    expect(commandFromHex.getParameters()).toStrictEqual(parameters);
};

const processExamples = ( commands: Record<string, any> ) => {
    for ( const [name, constructor] of Object.entries(commands) ) {
        // each command should export at least 1 example
        expect(Array.isArray(constructor.examples)).toBe(true);
        expect(constructor.examples.length).toBeGreaterThan(0);

        describe(constructor.name, () => {
            constructor.examples.forEach((example: ICommandExample) => {
                test(example.name, () => {
                    checkExample(constructor, example);
                });
            });
        });
    }
};


describe('downlink commands', () => {
    processExamples(downlink);
});

describe('uplink commands', () => {
    processExamples(uplink);
});
