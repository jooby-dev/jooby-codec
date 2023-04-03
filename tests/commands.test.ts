/* eslint-disable */

import Command from '../src/Command.js';
import {commands} from '../src/index.js';
import getBytesFromHex from '../src/utils/getBytesFromHex.js';
import { toHex } from '../src/utils/header';


interface ICommand {
    constructor: any,
    name: string,
    parameters: any
    hex: {
        header: string,
        body: string
    }
}

type TCommandList = Array<ICommand>;


const {uplink, downlink} = commands;

const downlinkCommands: TCommandList = [
    {
        constructor: downlink.SetTime2000,
        name: 'downlink command 0x02:SET_TIME_2000',
        parameters: {sequenceNumber: 78, time: 123456},
        hex: {
            header: '02 05',
            body: '4e 00 01 e2 40'
        }
    }
];

const uplinkCommands = [
    // {
    //     constructor: uplink.SetTime2000,
    //     name: 'uplink command 0x02:SET_TIME_2000',
    //     parameters: {status: 1},
    //     hex: {
    //         header: '02 01',
    //         body: '01'
    //     }
    // },
    // {
    //     constructor: uplink.GetCurrentMul,
    //     name: 'uplink command 0x18:GET_CURRENT_MUL',
    //     parameters: {
    //         channels: [
    //             {index: 0, value: 131},
    //             {index: 1, value: 8},
    //             {index: 2, value: 10},
    //             {index: 3, value: 12}
    //         ]
    //     },
    //     hex: {
    //         header: '18 06',
    //         body: '0f 83 01 08 0a 0c'
    //     }
    // },
    // {
    //     constructor: uplink.DataDayMul,
    //     name: 'uplink command 0x16:DATA_DAY_MUL',
    //     parameters: {
    //         channels: [
    //             {value: 131, index: 0},
    //             {value: 8, index: 1},
    //             {value: 10, index: 2},
    //             {value: 12, index: 3}
    //         ],
    //         time: 756604800
    //     },
    //     hex: {
    //         header: '16 08',
    //         body: '2f 97 0f 83 01 08 0a 0c'
    //     }
    // },
    // {
    //     constructor: uplink.DataHourMul,
    //     name: 'uplink command 0x17:DATA_HOUR_MUL',
    //     parameters: {
    //         channels: [
    //             {
    //                 value: 131,
    //                 index: 0,
    //                 time: 756648000,
    //                 diff: [{value: 10, time: 756648000}]
    //             },
    //             {
    //                 value: 8,
    //                 index: 1,
    //                 time: 756648000,
    //                 diff: [{value: 10, time: 756648000}]
    //             },
    //             {
    //                 value: 8,
    //                 index: 2,
    //                 time: 756648000,
    //                 diff: [{value: 10, time: 756648000}]
    //             },
    //             {
    //                 value: 12,
    //                 index: 3,
    //                 time: 756648000,
    //                 diff: [{value: 10, time: 756648000}]
    //             }
    //         ]
    //     },
    //     hex: {
    //         header: '17 0d',
    //         body: '2f 97 0c 0f 83 01 0a 08 0a 08 0a 0c 0a'
    //     }
    // },
    // {
    //     constructor: uplink.ExAbsHourMul,
    //     name: 'uplink command 0xa1f:EX_ABS_HOUR_MUL',
    //     parameters: {
    //         channels: [
    //             {
    //                 diff: [
    //                     {
    //                         value: 128,
    //                         pulseCoefficient: 100,
    //                         time: 731764800,
    //                         meterValue: 3425.85
    //                     },
    //                     {
    //                         value: 100,
    //                         pulseCoefficient: 100,
    //                         time: 731768400,
    //                         meterValue: 3425.57
    //                     },
    //                     {
    //                         value: 32,
    //                         pulseCoefficient: 100,
    //                         time: 731775600,
    //                         meterValue: 3424.89
    //                     },
    //                     {
    //                         value: 50,
    //                         pulseCoefficient: 100,
    //                         time: 731786400,
    //                         meterValue: 3425.07
    //                     },
    //                     {
    //                         value: 0,
    //                         pulseCoefficient: 100,
    //                         time: 731800800,
    //                         meterValue: 3424.57
    //                     },
    //                     {
    //                         value: 2,
    //                         pulseCoefficient: 100,
    //                         time: 731818800,
    //                         meterValue: 3424.59
    //                     },
    //                     {
    //                     value: 5,
    //                         pulseCoefficient: 100,
    //                         time: 731840400,
    //                         meterValue: 3424.62
    //                     }
    //                 ],
    //                 pulseCoefficient: 100,
    //                 index: 0,
    //                 value: 342457,
    //                 meterValue: 3424.57,
    //                 time: 731764800
    //             }
    //         ],
    //         date: new Date('2023-03-10T12:00:00.000Z')
    //     },
    //     hex: {
    //         header: '1f 0a 10',
    //         body: '2e 6a ec 01 64 b9 f3 14 80 01 64 20 32 00 02 05'
    //     }
    // },
    {
        constructor: uplink.ExAbsDayMul,
        name: 'uplink command 0xb1f:EX_ABS_DAY_MUL',
        parameters: {
            channels: [
                {
                    pulseCoefficient: 100,
                    index: 0,
                    value: 342457,
                    meterValue: 3424.57,
                    time: 731721600
                }
            ],
            date: new Date('2023-03-10T00:00:00.000Z')
        },
        hex: {
            header: '1f 0b 07',
            body: '2e 6a 01 64 b9 f3 14'
        }
    }
];

const checkCommand = ( {constructor, name, parameters, hex:{header, body} }: ICommand ) => {
    const hex = `${header} ${body}`;

    const command = new constructor(parameters);
    const commandFromHex = constructor.fromBytes(getBytesFromHex(body));

    expect(constructor.getName()).toBe(name);

    expect(command).toBeInstanceOf(constructor);
    expect(command).toBeInstanceOf(Command);
    expect(command.parameters).toBe(parameters);
    expect(command.getParameters()).toBe(parameters);
    expect(command.toHex()).toBe(hex);
    expect(command.toJson()).toBe(JSON.stringify(command.getParameters()));

    expect(commandFromHex).toStrictEqual(command);
    expect(commandFromHex.toHex()).toBe(hex);
    expect(commandFromHex.parameters).toStrictEqual(parameters);
    expect(commandFromHex.getParameters()).toStrictEqual(parameters);
};



describe('general tests', () => {
    test('downlink commands', () => {
        downlinkCommands.forEach(checkCommand);
    });

    test('uplink commands', () => {
        uplinkCommands.forEach(checkCommand);
    });
});
