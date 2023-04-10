/* eslint-disable */

import Command from '../src/Command.js';
import {commands, constants} from '../src/index.js';
import * as message from '../src/utils/message.js';
import getBytesFromHex from '../src/utils/getBytesFromHex.js';
import getHexFromBytes from '../src/utils/getHexFromBytes.js';


interface ICommand {
    constructor: any,
    name: string,
    parameters: any,
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
        name: 'downlink command 0x0c:CORRECT_TIME_2000',
        parameters: {sequenceNumber: 45, time: -120},
        hex: {
            header: '0c 02',
            body: '2d 88',
            lrc: 'fe'
        }
    },
    {
        constructor: downlink.NewStatus,
        name: 'downlink command 0x14:NEW_STATUS',
        parameters: undefined,
        hex: {
            header: '14 00',
            body: '',
            lrc: '41'
        }
    },
    {
        constructor: downlink.SetTime2000,
        name: 'downlink command 0x02:SET_TIME_2000',
        parameters: {sequenceNumber: 78, time: 123456},
        hex: {
            header: '02 05',
            body: '4e 00 01 e2 40',
            lrc: 'bf'
        }
    },
    {
        constructor: downlink.SoftRestart,
        name: 'downlink command 0x19:SOFT_RESTART',
        parameters: undefined,
        hex: {
            header: '19 00',
            body: '',
            lrc: '4c'
        }
    }
];

const uplinkCommands: TCommandList = [
    {
        constructor: uplink.CorrectTime2000,
        name: 'uplink command 0x0c:CORRECT_TIME_2000',
        parameters: {status: 0},
        hex: {
            header: '0c 01',
            body: '00',
            lrc: '58'
        }
    },
    {
        constructor: uplink.DataDayMul,
        name: 'uplink command 0x16:DATA_DAY_MUL',
        parameters: {
            channels: [
                {value: 131, index: 0},
                {value: 8, index: 1},
                {value: 10, index: 2},
                {value: 12, index: 3}
            ],
            time: 756604800
        },
        hex: {
            header: '16 08',
            body: '2f 97 0f 83 01 08 0a 0c',
            lrc: '70'
        }
    },
    {
        constructor: uplink.DataHourMul,
        name: 'uplink command 0x17:DATA_HOUR_MUL',
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
        hex: {
            header: '17 0d',
            body: '2f 97 0c 0f 83 01 0a 08 0a 08 0a 0c 0a',
            lrc: '7a'
        }
    },
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
            body: '2e 6a 01 64 b9 f3 14',
            lrc: '39'
        }
    },
    {
        constructor: uplink.ExAbsHourMul,
        name: 'uplink command 0xa1f:EX_ABS_HOUR_MUL',
        parameters: {
            channels: [
                {
                    diff: [
                        {
                            value: 128,
                            pulseCoefficient: 100,
                            time: 731764800,
                            meterValue: 3425.85
                        },
                        {
                            value: 100,
                            pulseCoefficient: 100,
                            time: 731768400,
                            meterValue: 3425.57
                        },
                        {
                            value: 32,
                            pulseCoefficient: 100,
                            time: 731775600,
                            meterValue: 3424.89
                        },
                        {
                            value: 50,
                            pulseCoefficient: 100,
                            time: 731786400,
                            meterValue: 3425.07
                        },
                        {
                            value: 0,
                            pulseCoefficient: 100,
                            time: 731800800,
                            meterValue: 3424.57
                        },
                        {
                            value: 2,
                            pulseCoefficient: 100,
                            time: 731818800,
                            meterValue: 3424.59
                        },
                        {
                        value: 5,
                            pulseCoefficient: 100,
                            time: 731840400,
                            meterValue: 3424.62
                        }
                    ],
                    pulseCoefficient: 100,
                    index: 0,
                    value: 342457,
                    meterValue: 3424.57,
                    time: 731764800
                }
            ],
            date: new Date('2023-03-10T12:00:00.000Z')
        },
        hex: {
            header: '1f 0a 10',
            body: '2e 6a ec 01 64 b9 f3 14 80 01 64 20 32 00 02 05',
            lrc: '33'
        }
    },
    {
        constructor: uplink.GetCurrentMul,
        name: 'uplink command 0x18:GET_CURRENT_MUL',
        parameters: {
            channels: [
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
    },
    {
        constructor: uplink.NewEvent,
        name: 'uplink command 0x15:NEW_EVENT',
        parameters: {id: events.BATTERY_ALARM, sequenceNumber: 2, data: {voltage: 3308}},
        hex: {
            header: '15 04',
            body: '05 02 0c ec',
            lrc: 'a3'
        }
    },
    {
        constructor: uplink.NewEvent,
        name: 'uplink command 0x15:NEW_EVENT',
        parameters: {
            id: events.ACTIVATE_MTX,
            sequenceNumber: 2,
            data: {time: 734015840, deviceId: '00 1a 79 88 17 01 23 56'}
        },
        hex: {
            header: '15 0e',
            body: '0b 02 2b c0 31 60 00 1a 79 88 17 01 23 56',
            lrc: '75'
        }
    },
    {
        constructor: uplink.NewEvent,
        name: 'uplink command 0x15:NEW_EVENT',
        parameters: {
            id: events.CONNECT,
            sequenceNumber: 2,
            data: {channel: 0, value: 131}
        },
        hex: {
            header: '15 05',
            body: '0c 02 00 83 01',
            lrc: 'c9'
        }
    },
    {
        constructor: uplink.NewEvent,
        name: 'uplink command 0x15:NEW_EVENT',
        parameters: {
            id: events.DISCONNECT,
            sequenceNumber: 2,
            data: {channel: 0, value: 131}
        },
        hex: {
            header: '15 05',
            body: '0d 02 00 83 01',
            lrc: 'c8'
        }
    },
    {
        constructor: uplink.NewEvent,
        name: 'uplink command 0x15:NEW_EVENT',
        parameters: {
            id: events.EV_MTX,
            sequenceNumber: 2,
            data: {status1: 0, status2: 131}
        },
        hex: {
            header: '15 04',
            body: '11 02 00 83',
            lrc: 'd4'
        }
    },
    {
        constructor: uplink.NewStatus,
        name: 'uplink command 0x14:NEW_STATUS',
        parameters: {
            software: {type: 4, version: 10},
            hardware: {type: 1, version: 1},
            data: {
                voltage: {
                    low: 63,
                    high: 144
                },
                internalResistance: 10034,
                temperature: 14,
                remindedBatteryCapacity: 41,
                lastEventSequenceNumber: 34
            }
        },
        hex: {
            header: '14 0c',
            body: '04 0a 01 01 03 f0 90 27 32 0e 68 22',
            lrc: '71'
        }
    },
    {
        constructor: uplink.SetTime2000,
        name: 'uplink command 0x02:SET_TIME_2000',
        parameters: {status: 1},
        hex: {
            header: '02 01',
            body: '01',
            lrc: '57'
        }
    },
    {
        constructor: uplink.SoftRestart,
        name: 'uplink command 0x19:SOFT_RESTART',
        parameters: undefined,
        hex: {
            header: '19 00',
            body: '',
            lrc: '4c'
        }
    },
    {
        constructor: uplink.Time2000,
        name: 'uplink command 0x09:TIME_2000',
        // time: 2023-04-03T14:01:17.000Z
        parameters: {sequenceNumber: 77, time: 733845677},
        hex: {
            header: '09 05',
            body: '4d 2b bd 98 ad',
            lrc: 'b7'
        }
    }
];


const checkCommand = ( {constructor, name, parameters, hex:{header, body, lrc} }: ICommand ) => {
    const commandHex = (`${header} ${body}`).trim();
    const messageHex = `${commandHex} ${lrc}`;
    const command = new constructor(parameters);
    const commandFromHex = constructor.fromBytes(body ? getBytesFromHex(body) : null);

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
        const messageData = message.fromHex(messageHex, constructor.directionType);
        const [{command: messageCommand, data: commandData}] = messageData.commands;

        expect(messageCommand).toStrictEqual(command);
        expect(commandData.header).toStrictEqual(getBytesFromHex(header));
        expect(commandData.body).toStrictEqual(getBytesFromHex(body));
        expect(lrc).toBe(getHexFromBytes(new Uint8Array([messageData.lrc.actual])));
        expect(messageData.isValid).toBe(true);
    }
};


[
    events.MAGNET_ON, events.MAGNET_OFF, events.ACTIVATE, events.DEACTIVATE,
    events.CAN_OFF, events.INSERT, events.REMOVE, events.COUNTER_OVER,
    events.EV_OPTOFLASH, events.EV_OPTOLOW, events.EV_REJOIN
].forEach(id => {
    const hexId = id.toString(16).padStart(2, '0');

    uplinkCommands.push({
        constructor: uplink.NewEvent,
        name: 'uplink command 0x15:NEW_EVENT',
        // magnet on
        parameters: {id, sequenceNumber: 2, data: {time: 734015840}},
        hex: {
            header: '15 06',
            body: `${hexId} 02 2b c0 31 60`
        }
    });
});


describe('general tests', () => {
    test('downlink commands', () => {
        downlinkCommands.forEach(checkCommand);
    });

    test('uplink commands', () => {
        uplinkCommands.forEach(checkCommand);
    });
});
