/* eslint-disable */

import Command from '../src/Command.js';
import * as downlinkConstructors from '../src/commands/downlink/index.js';
import * as uplinkConstructors from '../src/commands/uplink/index.js';


interface ICommand {
    constructor: any,
    name: string,
    parameters: any
    hex: string
}

type TCommandList = Array<ICommand>;


const downlinkCommands: TCommandList = [
    {
        constructor: downlinkConstructors.SetTime2000,
        name: 'DownlinkCommand 0x02:SET_TIME_2000',
        parameters: {sequenceNumber: 78, time: 123456},
        hex: '02 05 4e 00 01 e2 40'
    }
];

const uplinkCommands: TCommandList = [
    {
        constructor: uplinkConstructors.SetTime2000,
        name: 'UplinkCommand 0x02:SET_TIME_2000',
        parameters: {status: 1},
        hex: '02 01 01'
    },
    {
        constructor: uplinkConstructors.GetCurrentMul,
        name: 'UplinkCommand 0x18:GET_CURRENT_MUL',
        parameters: {
            channels: [
                {index: 0, value: 131},
                {index: 1, value: 8},
                {index: 2, value: 10},
                {index: 3, value: 12}
            ]
        },
        hex: '18 06 0f 83 01 08 0a 0c'
    },
    {
        constructor: uplinkConstructors.DataDayMul,
        name: 'UplinkCommand 0x16:DATA_DAY_MUL',
        parameters: {
            channels: [
                {value: 131, index: 0},
                {value: 8, index: 1},
                {value: 10, index: 2},
                {value: 12, index: 3}
            ],
            time: 756604800
        },
        hex: '16 08 2f 97 0f 83 01 08 0a 0c'
    },
    {
        constructor: uplinkConstructors.DataHourMul,
        name: 'UplinkCommand 0x17:DATA_HOUR_MUL',
        parameters: {
            channels: [
                {
                    value: 131,
                    index: 0,
                    time: 756648000,
                    diff: [{value: 10, time: 756648000}]
                },
                {
                    value: 8,
                    index: 1,
                    time: 756648000,
                    diff: [{value: 10, time: 756648000}]
                },
                {
                    value: 8,
                    index: 2,
                    time: 756648000,
                    diff: [{value: 10, time: 756648000}]
                },
                {
                    value: 12,
                    index: 3,
                    time: 756648000,
                    diff: [{value: 10, time: 756648000}]
                }
            ]
        },
        hex: '17 0d 2f 97 0c 0f 83 01 0a 08 0a 08 0a 0c 0a'
    }
];

// checker generator
const getCheckCommand = ( CommandAncestor: any ) => ( {constructor, name, parameters, hex}: ICommand ) => {
    const command = new constructor(parameters);
    const commandFromHex = CommandAncestor.fromHex(hex);

    expect(constructor.getName()).toBe(name);
    expect(CommandAncestor.children[constructor.id]).toBe(constructor);

    expect(command).toBeInstanceOf(constructor);
    expect(command).toBeInstanceOf(Command);
    expect(command).toBeInstanceOf(CommandAncestor);
    expect(command.parameters).toBe(parameters);
    expect(command.getParameters()).toBe(parameters);
    expect(command.toHex()).toBe(hex);
    expect(command.toJSON()).toBe(JSON.stringify(command.getParameters()));

    expect(commandFromHex).toStrictEqual(command);
    expect(commandFromHex.toHex()).toBe(hex);
    expect(commandFromHex.parameters).toStrictEqual(parameters);
    expect(commandFromHex.getParameters()).toStrictEqual(parameters);
};


// const checkDownlinkCommand = getCheckCommand(DownlinkCommand);
// const checkUplinkCommand = getCheckCommand(UplinkCommand);


describe('general tests', () => {
    test.skip('downlink commands', () => {
        //downlinkCommands.forEach(checkDownlinkCommand);
    });

    test.skip('uplink commands', () => {
        //uplinkCommands.forEach(checkUplinkCommand);
    });
});
