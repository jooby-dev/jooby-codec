/* eslint-disable */

import Command, {ICommandExample, TCommandExampleList} from '../src/Command.js';
import {commands, constants} from '../src/index.js';
import * as message from '../src/utils/message.js';
import getBytesFromHex from '../src/utils/getBytesFromHex.js';
import getHexFromBytes from '../src/utils/getHexFromBytes.js';
import * as hardwareTypes from '../src/constants/hardwareTypes.js';
import * as deviceParameters from '../src/constants/deviceParameters.js';


interface ICommand {
    constructor: any,
    name: string,
    parameters?: any,
    hardwareType?: number,
    hex: {
        header: string,
        body: string,
        lrc?: string
    }
}

type TCommandList = Array<ICommand>;


const {uplink, downlink} = commands;
const {events} = constants;

const downlinkCommands: TCommandList = [
    {
        constructor: downlink.CorrectTime2000,
        name: 'downlink command 0x0c:CorrectTime2000',
        parameters: {sequenceNumber: 45, seconds: -120},
        hex: {
            header: '0c 02',
            body: '2d 88',
            lrc: 'fe'
        }
    },
    {
        constructor: downlink.GetExAbsArchiveDaysMC,
        name: 'downlink command 0xd1f:GetExAbsArchiveDaysMC',
        parameters: {channelList: [0], days: 1, startTime: 731721600},
        hex: {
            header: '1f 0d 04',
            body: '2e 6a 01 01',
            lrc: '07'
        }
    },
    {
        constructor: downlink.GetExAbsArchiveHoursMC,
        name: 'downlink command 0xc1f:GetExAbsArchiveHoursMC',
        parameters: {channelList: [0], hours: 1, startTime: 756648000},
        hex: {
            header: '1f 0c 04',
            body: '2f 97 0c 01',
            lrc: 'f7'
        }
    },
    {
        constructor: downlink.GetExAbsCurrentMC,
        name: 'downlink command 0xf1f:GetExAbsCurrentMC',
        hex: {
            header: '1f 0f 00',
            body: '',
            lrc: '45'
        }
    },
    {
        constructor: downlink.GetArchiveDaysMC,
        name: 'downlink command 0x1b:GetArchiveDaysMC',
        parameters: {channelList: [0], days: 1, startTime: 731721600},
        hex: {
            header: '1b 04',
            body: '2e 6a 01 01',
            lrc: '0e'
        }
    },
    {
        constructor: downlink.GetArchiveHoursMC,
        name: 'downlink command 0x1a:GetArchiveHoursMC',
        parameters: {channelList: [0], hours: 2, startTime: 756648000},
        hex: {
            header: '1a 04',
            body: '2f 97 4c 01',
            lrc: 'be'
        }
    },
    {
        constructor: downlink.SetTime2000,
        name: 'downlink command 0x02:SetTime2000',
        parameters: {sequenceNumber: 78, seconds: 123456},
        hex: {
            header: '02 05',
            body: '4e 00 01 e2 40',
            lrc: 'bf'
        }
    },
    {
        constructor: downlink.SoftRestart,
        name: 'downlink command 0x19:SoftRestart',
        hex: {
            header: '19 00',
            body: '',
            lrc: '4c'
        }
    }
];

const uplinkCommands: TCommandList = [
    {
        constructor: uplink.ExAbsCurrentMC,
        name: 'uplink command 0xf1f:ExAbsCurrentMC',
        parameters: {
            channelList: [
                {
                    pulseCoefficient: 100,
                    index: 3,
                    value: 342
                }
            ]
        },
        hex: {
            header: '1f 0f 04',
            body: '08 64 d6 02',
            lrc: 'f9'
        }
    },
    {
        constructor: uplink.ExAbsDayMC,
        name: 'uplink command 0xb1f:ExAbsDayMC',
        parameters: {
            startTime: 731721600,
            channelList: [
                {
                    pulseCoefficient: 100,
                    index: 0,
                    value: 342
                }
            ]
        },
        hex: {
            header: '1f 0b 06',
            body: '2e 6a 01 64 d6 02',
            lrc: 'b2'
        }
    },
    {
        constructor: uplink.CurrentMC,
        name: 'uplink command 0x18:CurrentMC',
        parameters: {
            channelList: [
                {index: 0, value: 131},
                {index: 1, value: 8},
                {index: 2, value: 10},
                {index: 3, value: 12}
            ]
        },
        hex: {
            header: '18 06',
            body: '0f 83 01 08 0a 0c',
            lrc: 'c8'
        }
    }
];


const checkCommand = ( {constructor, name, parameters, hardwareType, hex: {header, body, lrc} }: ICommand ) => {
    const commandHex = (`${header} ${body}`).trim();
    const messageHex = `${commandHex} ${lrc}`;
    const command = new constructor(parameters, hardwareType);
    const commandFromHex = constructor.fromBytes(body ? getBytesFromHex(body) : null, hardwareType);

    expect(constructor.getName()).toBe(name);

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

    if ( lrc ) {
        const messageData = message.fromHex(messageHex, constructor.directionType, hardwareType);
        const [{command: messageCommand, data: commandData}] = messageData.commands;

        expect(messageCommand).toStrictEqual(command);
        expect(commandData.header).toStrictEqual(getBytesFromHex(header));
        expect(commandData.body).toStrictEqual(getBytesFromHex(body));
        expect(lrc).toBe(getHexFromBytes(new Uint8Array([messageData.lrc.actual])));
        expect(messageData.isValid).toBe(true);
    }
};

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
        // some commands may inherit examples from another commands
        const parentExamples = Object.getPrototypeOf(constructor).examples;

        // skip inherited examples
        // @todo: remove parentExamples when all command tests will be in classes
        if ( constructor.examples && constructor.examples !== parentExamples ) {
            describe(constructor.name, () => {
                constructor.examples.forEach((example: ICommandExample) => {
                    test(example.name, () => {
                        checkExample(constructor, example);
                    });
                });
            });
        }
    }
};


describe('downlink commands', () => {
    // legacy
    downlinkCommands.forEach(command => {
        test(command.constructor.name, () => {
            checkCommand(command);
        });
    });

    // new approach
    processExamples(downlink);
});

describe('uplink commands', () => {
    // legacy
    uplinkCommands.forEach(command => {
        test(command.constructor.name, () => {
            checkCommand(command);
        });
    });

    // new approach
    processExamples(uplink);
});
