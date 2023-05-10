/* eslint-disable */

import Command, {ICommandExample} from '../../src/analog/Command.js';
import {commands} from '../../src/analog/index.js';
import * as message from '../../src/analog/message.js';
import getBytesFromHex from '../../src/utils/getBytesFromHex.js';
import getHexFromBytes from '../../src/utils/getHexFromBytes.js';


const {uplink, downlink} = commands;


const checkExample = ( constructor: any, {parameters, hardwareType, hex: {header, body} }: ICommandExample ) => {
    const commandHex = getHexFromBytes(getBytesFromHex(`${header} ${body}`));
    const commandBytes = getBytesFromHex(commandHex);
    const messageHex = `${commandHex} ${message.calculateLrc(commandBytes)}`;
    const command = new constructor(parameters, hardwareType);
    const commandFromHex = constructor.fromBytes(body ? getBytesFromHex(body) : null, hardwareType);

    expect(command).toBeInstanceOf(constructor);
    expect(command).toBeInstanceOf(Command);
    expect(command.parameters).toBe(parameters);
    expect(command.getParameters()).toBe(parameters);
    expect(command.toHex()).toBe(commandHex);
    expect(command.toJson()).toBe(JSON.stringify(command.getParameters()));

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
