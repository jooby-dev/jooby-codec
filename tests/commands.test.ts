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
    parameters: any,
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
        name: 'downlink command 0x0c:CORRECT_TIME_2000',
        parameters: {sequenceNumber: 45, seconds: -120},
        hex: {
            header: '0c 02',
            body: '2d 88',
            lrc: 'fe'
        }
    },
    {
        constructor: downlink.ExAbsArchiveDaysMC,
        name: 'downlink command 0xd1f:EX_ABS_ARCHIVE_DAYS_MC',
        parameters: {channelList: [0], days: 1, startTime: 731721600},
        hex: {
            header: '1f 0d 04',
            body: '2e 6a 01 01',
            lrc: '07'
        }
    },
    {
        constructor: downlink.ExAbsArchiveHoursMC,
        name: 'downlink command 0xc1f:EX_ABS_ARCHIVE_HOUR_MC',
        parameters: {channelList: [0], hours: 1, startTime: 756648000},
        hex: {
            header: '1f 0c 04',
            body: '2f 97 0c 01',
            lrc: 'f7'
        }
    },
    {
        constructor: downlink.ExAbsCurrentMC,
        name: 'downlink command 0xf1f:EX_ABS_CURRENT_MC',
        parameters: undefined,
        hex: {
            header: '1f 0f 00',
            body: '',
            lrc: '45'
        }
    },
    {
        constructor: downlink.GetArchiveDaysMC,
        name: 'downlink command 0x1b:GET_ARCHIVE_DAYS_MC',
        parameters: {channelList: [0], days: 1, startTime: 731721600},
        hex: {
            header: '1b 04',
            body: '2e 6a 01 01',
            lrc: '0e'
        }
    },
    {
        constructor: downlink.GetArchiveHoursMC,
        name: 'downlink command 0x1a:GET_ARCHIVE_HOURS_MC',
        parameters: {channelList: [0], hours: 2, startTime: 756648000},
        hex: {
            header: '1a 04',
            body: '2f 97 4c 01',
            lrc: 'be'
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
        constructor: downlink.SetParameter,
        name: 'downlink command 0x03:SET_PARAMETER',
        parameters: {
            id: deviceParameters.INITIAL_DATA,
            data: {value: 2023, meterValue: 204, pulseCoefficient: 100}
        },
        hex: {
            header: '03 0a',
            body: '17 00 00 00 cc 82 00 00 07 e7',
            lrc: 'e5'
        }
    },
    {
        constructor: downlink.SetParameter,
        name: 'downlink command 0x03:SET_PARAMETER',
        parameters: {id: deviceParameters.ABSOLUTE_DATA_STATUS, data: {status: 1}},
        hex: {
            header: '03 02',
            body: '18 01',
            lrc: '4d'
        }
    },
    {
        constructor: downlink.SetParameter,
        name: 'downlink command 0x03:SET_PARAMETER',
        parameters: {
            id: deviceParameters.INITIAL_DATA_MULTI_CHANNEL,
            data: {value: 2032, meterValue: 402, pulseCoefficient: 1000, channel: 1}
        },
        hex: {
            header: '03 0b',
            body: '1d 01 00 00 01 92 80 00 00 07 f0',
            lrc: 'a5'
        }
    },
    {
        constructor: downlink.SetParameter,
        name: 'downlink command 0x03:SET_PARAMETER',
        parameters: {
            id: deviceParameters.ABSOLUTE_DATA_STATUS_MULTI_CHANNEL,
            data: {status: 0, channel: 2}
        },
        hex: {
            header: '03 03',
            body: '1e 02 00',
            lrc: '49'
        }
    },
    {
        constructor: downlink.SetTime2000,
        name: 'downlink command 0x02:SET_TIME_2000',
        parameters: {sequenceNumber: 78, seconds: 123456},
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
        constructor: uplink.DataDayMC,
        name: 'uplink command 0x16:DATA_DAY_MC',
        parameters: {
            startTime: 756604800,
            channelList: [
                {value: 131, index: 3},
                {value: 8, index: 5},
                {value: 10, index: 7},
                {value: 12, index: 1}
            ]
        },
        hex: {
            header: '16 09',
            body: '2f 97 aa 01 0c 83 01 08 0a',
            lrc: 'd5'
        }
    },
    {
        constructor: uplink.DataHourMC,
        name: 'uplink command 0x17:DATA_HOUR_MC',
        parameters: {
            startTime: 756648000,
            hours: 1,
            channelList: [
                {
                    value: 131,
                    index: 0,
                    diff: [10]
                },
                {
                    value: 832,
                    index: 1,
                    diff: [12]
                },
                {
                    value: 38,
                    index: 2,
                    diff: [8]
                },
                {
                    value: 234,
                    index: 3,
                    diff: [11]
                }
            ]
        },
        hex: {
            header: '17 0f',
            body: '2f 97 0c 0f 83 01 0a c0 06 0c 26 08 ea 01 0b',
            lrc: '7a'
        }
    },
    {
        constructor: uplink.ExAbsArchiveDaysMC,
        name: 'uplink command 0xd1f:EX_ABS_ARCHIVE_DAYS_MC',
        parameters: {
            startTime: 731721600,
            days: 2,
            channelList: [
                {
                    index: 4,
                    dayList: [5524, 5674]
                }
            ]
        },
        hex: {
            header: '1f 0d 08',
            body: '2e 6a 10 02 94 2b aa 2c',
            lrc: '20'
        }
    },
    {
        constructor: uplink.ExAbsArchiveHoursMC,
        name: 'uplink command 0xc1f:EX_ABS_ARCHIVE_HOUR_MC',
        parameters: {
            startTime: 756648000,
            hours: 1,
            channelList: [
                {value: 234, index: 2, diff: [2]}
            ]
        },
        hex: {
            header: '1f 0c 07',
            body: '2f 97 0c 04 ea 01 02',
            lrc: '18'
        }
    },
    {
        constructor: uplink.ExAbsCurrentMC,
        name: 'uplink command 0xf1f:EX_ABS_CURRENT_MC',
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
        name: 'uplink command 0xb1f:EX_ABS_DAY_MC',
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
        constructor: uplink.ExAbsHourMC,
        name: 'uplink command 0xa1f:EX_ABS_HOUR_MC',
        parameters: {
            startTime: 731764800,
            hours: 1,
            channelList: [
                {
                    pulseCoefficient: 100,
                    index: 0,
                    value: 342457,
                    diff: [128]
                }
            ]
        },
        hex: {
            header: '1f 0a 0a',
            body: '2e 6a 0c 01 64 b9 f3 14 80 01',
            lrc: 'b8'
        }
    },
    {
        constructor: uplink.GetArchiveHoursMC,
        name: 'uplink command 0x1a:GET_ARCHIVE_HOURS',
        parameters: {
            startTime: 756648000,
            hours: 1,
            channelList: [
                {
                    value: 131,
                    index: 0,
                    diff: [10]
                },
                {
                    value: 8,
                    index: 1,
                    diff: [10]
                },
                {
                    value: 8,
                    index: 2,
                    diff: [10]
                },
                {
                    value: 12,
                    index: 3,
                    diff: [10]
                }
            ]
        },
        hex: {
            header: '1a 0d',
            body: '2f 97 0c 0f 83 01 0a 08 0a 08 0a 0c 0a',
            lrc: '77'
        }
    },
    {
        constructor: uplink.GetCurrentMC,
        name: 'uplink command 0x18:GET_CURRENT_MC',
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
    },
    {
        constructor: uplink.LastEvent,
        name: 'uplink command 0x60:LAST_EVENT',
        parameters: {
            sequenceNumber: 32,
            status: {
                isBatteryLow: true,
                isButtonReleased: false,
                isConnectionLost: true,
                isMagneticInfluence: false
            }
        },
        hardwareType: hardwareTypes.GAZM0NEW,
        hex: {
            header: '62',
            body: '20 09',
            lrc: '1e'
        }
    },
    {
        constructor: uplink.LastEvent,
        name: 'uplink command 0x60:LAST_EVENT',
        parameters: {
            sequenceNumber: 16,
            status: {
                // first byte: 11100001 = e1 (225)
                isBatteryLow: true,
                isConnectionLost: false,
                isFirstChannelInactive: false,
                isSecondChannelInactive: true,
                isThirdChannelInactive: true,
                // second byte: 00000001 = 01
                isForthChannelInactive: true
            }
        },
        hardwareType: hardwareTypes.IMP4EU,
        hex: {
            header: '63',
            body: '10 e1 01',
            lrc: 'c6'
        }
    },
    {
        constructor: uplink.LastEvent,
        name: 'uplink command 0x60:LAST_EVENT',
        parameters: {
            sequenceNumber: 48,
            status: {
                // first byte: 10000011 = 83 (131)
                isMeterCaseOpen: true,
                isMagneticInfluence: true,
                isParametersSetRemotely: false,
                isParametersSetLocally: false,
                isMeterProgramRestarted: false,
                isLockedOut: false,
                isTimeSet: false,
                isTimeCorrected: true,
                // second byte: 00001010 = 0a (10)
                isMeterFailure: false,
                isMeterTerminalBoxOpen: true,
                isModuleCompartmentOpen: false,
                isTariffPlanChanged: true,
                isNewTariffPlanReceived: false
            }
        },
        hardwareType: hardwareTypes.MTXLORA,
        hex: {
            header: '63',
            body: '30 83 0a',
            lrc: '8f'
        }
    },
    {
        constructor: uplink.NewEvent,
        name: 'uplink command 0x15:NEW_EVENT',
        parameters: {
            id: events.BATTERY_ALARM,
            sequenceNumber: 2,
            data: {voltage: 3308}
        },
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
            data: {seconds: 734015840, deviceId: '00 1a 79 88 17 01 23 56'}
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
                voltage: {low: 63, high: 144},
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
        parameters: {sequenceNumber: 77, seconds: 733845677},
        hex: {
            header: '09 05',
            body: '4d 2b bd 98 ad',
            lrc: 'b7'
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


[
    events.MAGNET_ON, events.MAGNET_OFF, events.ACTIVATE, events.DEACTIVATE,
    events.CAN_OFF, events.INSERT, events.REMOVE, events.COUNTER_OVER,
    events.EV_OPTOFLASH, events.EV_OPTOLOW, events.EV_REJOIN
].forEach(id => {
    const hexId = id.toString(16).padStart(2, '0');

    uplinkCommands.push({
        constructor: uplink.NewEvent,
        name: 'uplink command 0x15:NEW_EVENT',
        parameters: {id, sequenceNumber: 2, data: {seconds: 734015840}},
        hex: {
            header: '15 06',
            body: `${hexId} 02 2b c0 31 60`
        }
    });
});

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
