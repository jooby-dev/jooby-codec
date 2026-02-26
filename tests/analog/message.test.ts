/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import * as message from '../../src/analog/message/index.js';
import {TMessage, TMessageExamples} from '../../src/analog/message/types.js';
import {ICommandConfig} from '../../src/analog/utils/command.js';
import * as downlinkCommands from '../../src/analog/commands/downlink/index.js';
import * as uplinkCommands from '../../src/analog/commands/uplink/index.js';
import getBytesFromHex from '../../src/utils/getBytesFromHex.js';
import getHexFromBytes from '../../src/utils/getHexFromBytes.js';
import * as hardwareTypes from '../../src/analog/constants/hardwareTypes.js';
import {TBytes} from '../../src/types.js';


const validDownlinkMessages: TMessageExamples = {
    'correctTime2000 request': {
        bytes: getBytesFromHex('0c 02 2d 88  fe'),
        commands: [
            {
                id: downlinkCommands.correctTime2000.id,
                name: 'correctTime2000',
                headerSize: 2,
                parameters: {sequenceNumber: 45, seconds: -120},
                bytes: getBytesFromHex('0c 02 2d 88')
            }
        ],
        lrc: {
            received: 0xfe,
            calculated: 0xfe
        }
    },
    'setParameters + getParameters': {
        bytes: getBytesFromHex('03 02 04 0c  03 0b 1a 42 09 b8 52 42 2d b8 52 00 17  04 01 04  04 01 1a  63'),
        commands: [
            {
                id: downlinkCommands.setParameter.id,
                name: 'setParameter',
                headerSize: 2,
                parameters: {id: 4, name: 'DAY_CHECKOUT_HOUR', data: {value: 12}},
                bytes: getBytesFromHex('03 02 04 0c')
            },
            {
                id: downlinkCommands.setParameter.id,
                name: 'setParameter',
                headerSize: 2,
                parameters: {
                    id: 26,
                    name: 'GEOLOCATION',
                    data: {
                        latitude: 34.43,
                        longitude: 43.43,
                        altitude: 23
                    }
                },
                bytes: getBytesFromHex('03 0b 1a 42 09 b8 52 42 2d b8 52 00 17')
            },
            {
                id: downlinkCommands.getParameter.id,
                name: 'getParameter',
                headerSize: 2,
                parameters: {id: 4, name: 'DAY_CHECKOUT_HOUR', data: null},
                bytes: getBytesFromHex('04 01 04')
            },
            {
                id: downlinkCommands.getParameter.id,
                name: 'getParameter',
                headerSize: 2,
                parameters: {id: 26, name: 'GEOLOCATION', data: null},
                bytes: getBytesFromHex('04 01 1a')
            }
        ],
        lrc: {
            received: 0x63,
            calculated: 0x63
        }
    },
    'multiple commands in the message': {
        bytes: getBytesFromHex(`
            1f 30 05 2f 97 0c 02 01
            1f 0d 04 2f 98 01 01
            1f 0c 04 2f 97 0c 01
            1f 0c 04 2f 97 0c 01
            1f 05 00
            1f 02 00
            1b 04 2e 6a 01 01
            1a 04 2f 97 2c 01
            18 00
            0b 05 2b bd 98 ad 04
            09 00
            07 00
            06 03 2e 6a 01
            05 04 2f 97 0c 02
            f6
        `),
        commands: [
            {
                id: downlinkCommands.getArchiveHoursMcEx.id,
                name: 'getArchiveHoursMcEx',
                headerSize: 3,
                parameters: {
                    startTime2000: 756648000,
                    hour: 12,
                    hours: 2,
                    channelList: [
                        1
                    ]
                },
                bytes: getBytesFromHex('1f 30 05 2f 97 0c 02 01')
            },
            {
                id: downlinkCommands.getExAbsArchiveDaysMc.id,
                name: 'getExAbsArchiveDaysMc',
                headerSize: 3,
                parameters: {
                    startTime2000: 756691200,
                    days: 1,
                    channelList: [
                        1
                    ]
                },
                bytes: getBytesFromHex('1f 0d 04 2f 98 01 01')
            },
            {
                id: downlinkCommands.getExAbsArchiveHoursMc.id,
                name: 'getExAbsArchiveHoursMc',
                headerSize: 3,
                parameters: {
                    channelList: [
                        1
                    ],
                    hours: 1,
                    startTime2000: 756648000
                },
                bytes: getBytesFromHex('1f 0c 04 2f 97 0c 01')
            },
            {
                id: downlinkCommands.getExAbsArchiveHoursMc.id,
                name: 'getExAbsArchiveHoursMc',
                headerSize: 3,
                parameters: {
                    channelList: [
                        1
                    ],
                    hours: 1,
                    startTime2000: 756648000
                },
                bytes: getBytesFromHex('1f 0c 04 2f 97 0c 01')
            },
            {
                id: downlinkCommands.getBatteryStatus.id,
                name: 'getBatteryStatus',
                headerSize: 3,
                parameters: {},
                bytes: getBytesFromHex('1f 05 00')
            },
            {
                id: downlinkCommands.getLmicInfo.id,
                name: 'getLmicInfo',
                headerSize: 3,
                parameters: {},
                bytes: getBytesFromHex('1f 02 00')
            },
            {
                id: downlinkCommands.getArchiveDaysMc.id,
                name: 'getArchiveDaysMc',
                headerSize: 2,
                parameters: {
                    startTime2000: 731721600,
                    days: 1,
                    channelList: [
                        1
                    ]
                },
                bytes: getBytesFromHex('1b 04 2e 6a 01 01')
            },
            {
                id: downlinkCommands.getArchiveHoursMc.id,
                name: 'getArchiveHoursMc',
                headerSize: 2,
                parameters: {
                    startTime2000: 756648000,
                    hours: 2,
                    channelList: [
                        1
                    ]
                },
                bytes: getBytesFromHex('1a 04 2f 97 2c 01')
            },
            {
                id: downlinkCommands.getCurrentMc.id,
                name: 'getCurrentMc',
                headerSize: 2,
                parameters: {},
                bytes: getBytesFromHex('18 00')
            },
            {
                id: downlinkCommands.getArchiveEvents.id,
                name: 'getArchiveEvents',
                headerSize: 2,
                parameters: {
                    startTime2000: 733845677,
                    events: 4
                },
                bytes: getBytesFromHex('0b 05 2b bd 98 ad 04')
            },
            {
                id: downlinkCommands.getTime2000.id,
                name: 'getTime2000',
                headerSize: 2,
                parameters: {},
                bytes: getBytesFromHex('09 00')
            },
            {
                id: downlinkCommands.getCurrent.id,
                name: 'getCurrent',
                headerSize: 2,
                parameters: {},
                bytes: getBytesFromHex('07 00')
            },
            {
                id: downlinkCommands.getArchiveDays.id,
                name: 'getArchiveDays',
                headerSize: 2,
                parameters: {
                    startTime2000: 731721600,
                    days: 1
                },
                bytes: getBytesFromHex('06 03 2e 6a 01')
            },
            {
                id: downlinkCommands.getArchiveHours.id,
                name: 'getArchiveHours',
                headerSize: 2,
                parameters: {
                    startTime2000: 756648000,
                    hours: 2
                },
                bytes: getBytesFromHex('05 04 2f 97 0c 02')
            }
        ],
        lrc: {
            received: 0xf6,
            calculated: 0xf6
        }
    }
};

const invalidDownlinkMessages: TMessageExamples = {
    'correctTime2000 response': {
        message: {
            bytes: getBytesFromHex('0c 02 2d 88  00'),
            commands: [
                {
                    id: downlinkCommands.correctTime2000.id,
                    name: 'correctTime2000',
                    headerSize: 2,
                    parameters: {sequenceNumber: 45, seconds: -120},
                    bytes: getBytesFromHex('0c 02 2d 88')
                }
            ],
            lrc: {
                received: 0,
                calculated: 0xfe
            }
        },
        error: 'Mismatch LRC.'
    },
    'get parameters + set parameters': {
        message: {
            bytes: getBytesFromHex('04 01 17  04 01 18  03 02 0d 00  03 07 0a 00 64 0c 96 00 e9  4c'),
            commands: [
                {
                    id: downlinkCommands.getParameter.id,
                    name: 'getParameter',
                    headerSize: 2,
                    parameters: {id: 23, name: 'ABSOLUTE_DATA', data: null},
                    bytes: getBytesFromHex('04 01 17')
                },
                {
                    id: downlinkCommands.getParameter.id,
                    name: 'getParameter',
                    headerSize: 2,
                    parameters: {id: 24, name: 'ABSOLUTE_DATA_ENABLE', data: null},
                    bytes: getBytesFromHex('04 01 18')
                },
                {
                    id: downlinkCommands.setParameter.id,
                    name: 'setParameter',
                    headerSize: 2,
                    parameters: {id: 13, name: 'CHANNELS_CONFIG', data: {value: 0}},
                    bytes: getBytesFromHex('03 02 0d 00')
                },
                {
                    id: downlinkCommands.setParameter.id,
                    name: 'setParameter',
                    headerSize: 2,
                    parameters: {
                        id: 10,
                        name: 'BATTERY_DEPASSIVATION_INFO',
                        data: {
                            loadTime: 100,
                            internalResistance: 3222,
                            lowVoltage: 233
                        }
                    },
                    bytes: getBytesFromHex('03 07 0a 00 64 0c 96 00 e9')
                }
            ],
            lrc: {
                received: 0x4c,
                calculated: 0x4f
            }
        },
        error: 'Mismatch LRC.'
    }
};

const validUplinkMessages: TMessageExamples = {
    'correctTime2000 response': {
        bytes: getBytesFromHex('0c 01 00  58'),
        commands: [
            {
                id: uplinkCommands.correctTime2000.id,
                name: 'correctTime2000',
                headerSize: 2,
                config: {
                    hardwareType: hardwareTypes.GASIC
                },
                parameters: {status: 0},
                bytes: getBytesFromHex('0c 01 00')
            }
        ],
        lrc: {
            received: 0x58,
            calculated: 0x58
        }
    },
    'setTime2000 + currentMc + dayMc': {
        bytes: getBytesFromHex('02 01 01  18 06 0f 83 01 08 0a 0c  16 08 2f 97 55 0c 83 01 08 0a  b5'),
        commands: [
            {
                id: uplinkCommands.setTime2000.id,
                name: 'setTime2000',
                headerSize: 2,
                config: {
                    hardwareType: hardwareTypes.GASIC
                },
                parameters: {status: 1},
                bytes: getBytesFromHex('02 01 01')
            },
            {
                id: uplinkCommands.currentMc.id,
                name: 'currentMc',
                headerSize: 2,
                config: {
                    hardwareType: hardwareTypes.GASIC
                },
                parameters: {
                    channelList: [
                        {index: 1, value: 131},
                        {index: 2, value: 8},
                        {index: 3, value: 10},
                        {index: 4, value: 12}
                    ]
                },
                bytes: getBytesFromHex('18 06 0f 83 01 08 0a 0c')
            },
            {
                id: uplinkCommands.dayMc.id,
                name: 'dayMc',
                headerSize: 2,
                config: {
                    hardwareType: hardwareTypes.GASIC
                },
                parameters: {
                    startTime2000: 756604800,
                    channelList: [
                        {index: 1, value: 12},
                        {index: 3, value: 131},
                        {index: 5, value: 8},
                        {index: 7, value: 10}
                    ]
                },
                bytes: getBytesFromHex('16 08 2f 97 55 0c 83 01 08 0a')
            }
        ],
        lrc: {
            received: 0xb5,
            calculated: 0xb5
        }
    },
    'old status + currentMc': {
        bytes: getBytesFromHex('14 0c 02 84 0c 01 e3 5c 0c 69 10 17 fe 62  18 03 01 b9 17  33'),
        commands: [
            {
                id: uplinkCommands.status.id,
                name: 'status',
                headerSize: 2,
                config: {
                    hardwareType: hardwareTypes.GASIC
                },
                parameters: {
                    software: {
                        type: 2,
                        version: 132
                    },
                    hardware: {
                        type: hardwareTypes.GASIC,
                        version: 1
                    },
                    data: {
                        batteryVoltage: {
                            underLowLoad: 3637,
                            underHighLoad: 3084
                        },
                        batteryInternalResistance: 26896,
                        temperature: 23,
                        remainingBatteryCapacity: 100,
                        lastEventSequenceNumber: 98
                    }
                },
                bytes: getBytesFromHex('14 0c 02 84 0c 01 e3 5c 0c 69 10 17 fe 62')
            },
            {
                id: uplinkCommands.currentMc.id,
                name: 'currentMc',
                headerSize: 2,
                config: {
                    hardwareType: hardwareTypes.GASIC
                },
                parameters: {
                    channelList: [
                        {index: 1, value: 3001}
                    ]
                },
                bytes: getBytesFromHex('18 03 01 b9 17')
            }
        ],
        lrc: {
            received: 0x33,
            calculated: 0x33
        }
    },
    'new status + currentMc': {
        bytes: getBytesFromHex('14 0d 02 84 0c 01 e3 5c 0c 69 10 17 fd 62 64  18 03 01 b9 17  55'),
        commands: [
            {
                id: uplinkCommands.status.id,
                name: 'status',
                headerSize: 2,
                config: {
                    hardwareType: hardwareTypes.GASIC
                },
                parameters: {
                    software: {
                        type: 2,
                        version: 132
                    },
                    hardware: {
                        type: hardwareTypes.GASIC,
                        version: 1
                    },
                    data: {
                        batteryVoltage: {
                            underLowLoad: 3637,
                            underHighLoad: 3084
                        },
                        batteryInternalResistance: 26896,
                        temperature: 23,
                        remainingBatteryCapacity: 99.6,
                        lastEventSequenceNumber: 98,
                        downlinkQuality: 100
                    }
                },
                bytes: getBytesFromHex('14 0d 02 84 0c 01 e3 5c 0c 69 10 17 fd 62 64')
            },
            {
                id: uplinkCommands.currentMc.id,
                name: 'currentMc',
                headerSize: 2,
                config: {
                    hardwareType: hardwareTypes.GASIC
                },
                parameters: {
                    channelList: [
                        {index: 1, value: 3001}
                    ]
                },
                bytes: getBytesFromHex('18 03 01 b9 17')
            }
        ],
        lrc: {
            received: 0x55,
            calculated: 0x55
        }
    },
    'currentMc + lastEvent response': {
        bytes: getBytesFromHex('18 03 01 8a 12  62 ed 00  58'),
        commands: [
            {
                id: uplinkCommands.currentMc.id,
                name: 'currentMc',
                headerSize: 2,
                config: {
                    hardwareType: hardwareTypes.GASIC
                },
                parameters: {
                    channelList: [
                        {
                            value: 2314,
                            index: 1
                        }
                    ]
                },
                bytes: getBytesFromHex('18 03 01 8a 12')
            },
            {
                id: uplinkCommands.lastEvent.id,
                name: 'lastEvent',
                headerSize: 1,
                config: {
                    hardwareType: hardwareTypes.GASIC
                },
                parameters: {
                    sequenceNumber: 237,
                    status: {
                        isBatteryLow: false,
                        isMagneticInfluence: false,
                        isButtonReleased: false,
                        isConnectionLost: false
                    }
                },
                bytes: getBytesFromHex('62 ed 00')
            }
        ],
        lrc: {
            received: 0x58,
            calculated: 0x58
        }
    },
    'hourMc + lastEvent response': {
        bytes: getBytesFromHex('17 06 00 6f 0c 01 99 35  62 bc 00  54'),
        commands: [
            {
                id: uplinkCommands.hourMc.id,
                name: 'hourMc',
                headerSize: 2,
                config: {
                    hardwareType: hardwareTypes.GASIC
                },
                parameters: {
                    startTime2000: 6436800,
                    hours: 1,
                    channelList: [
                        {
                            value: 6809,
                            diff: [],
                            index: 1
                        }
                    ]
                },
                bytes: getBytesFromHex('17 06 00 6f 0c 01 99 35')
            },
            {
                id: uplinkCommands.lastEvent.id,
                name: 'lastEvent',
                headerSize: 1,
                config: {
                    hardwareType: hardwareTypes.GASIC
                },
                parameters: {
                    sequenceNumber: 188,
                    status: {
                        isBatteryLow: false,
                        isMagneticInfluence: false,
                        isButtonReleased: false,
                        isConnectionLost: false
                    }
                },
                bytes: getBytesFromHex('62 bc 00')
            }
        ],
        lrc: {
            received: 0x54,
            calculated: 0x54
        }
    },
    'time2000 + new status response': {
        bytes: getBytesFromHex('09 05 00 00 62 2c 58  14 0d 02 76 0c 01 e3 6c 83 4f 93 19 fd bc 51  f6'),
        commands: [
            {
                id: uplinkCommands.time2000.id,
                name: 'time2000',
                headerSize: 2,
                config: {
                    hardwareType: hardwareTypes.GASIC
                },
                parameters: {
                    sequenceNumber: 0,
                    time2000: 6433880
                },
                bytes: getBytesFromHex('09 05 00 00 62 2c 58')
            },
            {
                id: uplinkCommands.status.id,
                name: 'status',
                headerSize: 2,
                config: {
                    hardwareType: hardwareTypes.GASIC
                },
                parameters: {
                    software: {
                        type: 2,
                        version: 118
                    },
                    hardware: {
                        type: 12,
                        version: 1
                    },
                    data: {
                        batteryVoltage: {
                            underLowLoad: 3638,
                            underHighLoad: 3203
                        },
                        batteryInternalResistance: 20371,
                        temperature: 25,
                        remainingBatteryCapacity: 99.6,
                        lastEventSequenceNumber: 188,
                        downlinkQuality: 81
                    }
                },
                bytes: getBytesFromHex('14 0d 02 76 0c 01 e3 6c 83 4f 93 19 fd bc 51')
            }
        ],
        lrc: {
            received: 0xf6,
            calculated: 0xf6
        }
    },
    'exAbsHourMc + lastEvent response': {
        bytes: getBytesFromHex('1f 0a 0e 30 c7 e5 01 82 f4 52 00 00 00 00 00 00 00  62 62 00  79'),
        commands: [
            {
                id: uplinkCommands.exAbsHourMc.id,
                name: 'exAbsHourMc',
                headerSize: 3,
                config: {
                    hardwareType: hardwareTypes.GASIC
                },
                parameters: {
                    startTime2000: 771051600,
                    hours: 8,
                    channelList: [
                        {
                            diff: [0, 0, 0, 0, 0, 0, 0],
                            value: 10612,
                            pulseCoefficient: 10,
                            index: 1
                        }
                    ]
                },
                bytes: getBytesFromHex('1f 0a 0e 30 c7 e5 01 82 f4 52 00 00 00 00 00 00 00')
            },
            {
                id: uplinkCommands.lastEvent.id,
                name: 'lastEvent',
                headerSize: 1,
                config: {
                    hardwareType: hardwareTypes.GASIC
                },
                parameters: {
                    sequenceNumber: 98,
                    status: {
                        isBatteryLow: false,
                        isMagneticInfluence: false,
                        isButtonReleased: false,
                        isConnectionLost: false
                    }
                },
                bytes: getBytesFromHex('62 62 00')
            }
        ],
        lrc: {
            received: 0x79,
            calculated: 0x79
        }
    }
};

const validMultichannelUplinkMessages: TMessageExamples = {
    'multichannel hourMc + lastEvent': {
        bytes: getBytesFromHex(`
            17 33 00 68 ec 0f ad b0 48 c6 08 c8 08 c6 08 c4 08 be 08 b4 08 b9 08 b3 ed 2d
            00 00 00 00 00 00 00 8d b0 5a 00 00 00 00 00 00 00 8f de 2a 00 00 00 00 00 00 00
            63 39 80 00
            ad
        `),
        commands: [
            {
                id: uplinkCommands.hourMc.id,
                name: 'hourMc',
                headerSize: 2,
                config: {
                    hardwareType: hardwareTypes.IMP4EU
                },
                parameters: {
                    startTime2000: 5832000,
                    hours: 8,
                    channelList: [
                        {
                            value: 1185837,
                            diff: [1094, 1096, 1094, 1092, 1086, 1076, 1081],
                            index: 1
                        },
                        {
                            value: 751283,
                            diff: [0, 0, 0, 0, 0, 0, 0],
                            index: 2
                        },
                        {
                            value: 1480717,
                            diff: [0, 0, 0, 0, 0, 0, 0],
                            index: 3
                        },
                        {
                            value: 700175,
                            diff: [0, 0, 0, 0, 0, 0, 0],
                            index: 4
                        }
                    ]
                },
                bytes: getBytesFromHex(`
                    17 33 00 68 ec 0f ad b0 48 c6 08 c8 08 c6 08 c4 08 be 08 b4 08 b9 08 b3 ed 2d
                    00 00 00 00 00 00 00 8d b0 5a 00 00 00 00 00 00 00 8f de 2a 00 00 00 00 00 00 00
                `)
            },
            {
                id: uplinkCommands.lastEvent.id,
                name: 'lastEvent',
                headerSize: 1,
                config: {
                    hardwareType: hardwareTypes.IMP4EU
                },
                parameters: {
                    sequenceNumber: 57,
                    status: {
                        isBatteryLow: false,
                        isConnectionLost: false,
                        isFirstChannelInactive: false,
                        isSecondChannelInactive: false,
                        isThirdChannelInactive: false,
                        isForthChannelInactive: false
                    }
                },
                bytes: getBytesFromHex('63 39 80 00')
            }
        ],
        lrc: {
            received: 0xad,
            calculated: 0xad
        }
    }
};

const invalidUplinkMessages: TMessageExamples = {
    'correctTime2000 response': {
        message: {
            bytes: getBytesFromHex('0c 01 00  00'),
            commands: [
                {
                    id: uplinkCommands.correctTime2000.id,
                    name: 'correctTime2000',
                    headerSize: 2,
                    parameters: {status: 0},
                    bytes: getBytesFromHex('0c 01 00')
                }
            ],
            lrc: {
                received: 0,
                calculated: 0x58
            }
        },
        error: 'Mismatch LRC.'
    },
    'time2000 + new status': {
        message: {
            bytes: getBytesFromHex('09 05 4e 2c 26 53 d6  14 0d 02 76 0c 01 e2 bc 0c 67 2a 17 fd bc 62  dd'),
            commands: [
                {
                    id: uplinkCommands.time2000.id,
                    name: 'time2000',
                    headerSize: 2,
                    parameters: {
                        sequenceNumber: 78,
                        time2000: 740709334
                    },
                    bytes: getBytesFromHex('09 05 4e 2c 26 53 d6')
                },
                {
                    id: uplinkCommands.status.id,
                    name: 'status',
                    headerSize: 2,
                    parameters: {
                        software: {
                            type: 2,
                            version: 118
                        },
                        hardware: {
                            type: 12,
                            version: 1
                        },
                        data: {
                            batteryVoltage: {
                                underLowLoad: 3627,
                                underHighLoad: 3084
                            },
                            batteryInternalResistance: 26410,
                            temperature: 23,
                            remainingBatteryCapacity: 99.6,
                            lastEventSequenceNumber: 188,
                            downlinkQuality: 98
                        }
                    },
                    bytes: getBytesFromHex('14 0d 02 76 0c 01 e2 bc 0c 67 2a 17 fd bc 62')
                }
            ],
            lrc: {
                received: 0xdd,
                calculated: 0xd3
            }
        },
        error: 'Mismatch LRC.'
    }
};

const mtxUplinkMessages: TMessageExamples = {
    'mtx uplink segment #1': {
        bytes: getBytesFromHex('1e28c4314d1010796430280fff011d00000008001a00000008001d00000008011d00000008001a00000033'),
        commands: [
            {
                id: uplinkCommands.dataSegment.id,
                name: 'dataSegment',
                headerSize: 2,
                config: {
                    hardwareType: hardwareTypes.MTXLORA
                },
                parameters: {
                    segmentationSessionId: 196,
                    segmentIndex: 1,
                    segmentsNumber: 3,
                    isLast: false,
                    data: getBytesFromHex('4d1010796430280fff011d00000008001a00000008001d00000008011d00000008001a000000')
                },
                bytes: getBytesFromHex('1e28c4314d1010796430280fff011d00000008001a00000008001d00000008011d00000008001a000000')
            }
        ],
        lrc: {
            received: 0x33,
            calculated: 0x33
        }
    },
    'mtx uplink segment #2': {
        bytes: getBytesFromHex('1e21c4b31d00000008013a00000008013a00000008013a00000008013a00000008000063d0b90507'),
        commands: [
            {
                id: uplinkCommands.dataSegment.id,
                name: 'dataSegment',
                headerSize: 2,
                config: {
                    hardwareType: hardwareTypes.MTXLORA
                },
                parameters: {
                    segmentationSessionId: 196,
                    segmentIndex: 3,
                    segmentsNumber: 3,
                    isLast: true,
                    data: getBytesFromHex('1d00000008013a00000008013a00000008013a00000008013a000000080000')
                },
                bytes: getBytesFromHex('1e21c4b31d00000008013a00000008013a00000008013a00000008013a000000080000')
            },
            {
                id: uplinkCommands.lastEvent.id,
                name: 'lastEvent',
                headerSize: 1,
                config: {
                    hardwareType: hardwareTypes.MTXLORA
                },
                parameters: {
                    sequenceNumber: 208,
                    status: {
                        isLockedOut: true,
                        isMagneticInfluence: false,
                        isMeterCaseOpen: true,
                        isMeterFailure: true,
                        isMeterProgramRestarted: true,
                        isMeterTerminalBoxOpen: false,
                        isModuleCompartmentOpen: true,
                        isNewTariffPlanReceived: false,
                        isParametersSetLocally: true,
                        isParametersSetRemotely: false,
                        isTariffPlanChanged: false,
                        isTimeCorrected: true,
                        isTimeSet: false,
                        isElectromagneticInfluenceReset: false,
                        isMagneticInfluenceReset: false
                    }
                },
                bytes: getBytesFromHex('63d0b905')
            }
        ],
        lrc: {
            received: 0x07,
            calculated: 0x07
        }
    }
};


const checkDownlinkMessage = ( implementation, exampleMessage: TMessage, config?: ICommandConfig ) => {
    let messageFromBytes: TMessage;
    let bytesFromMessage: TBytes;

    if ( 'bytes' in exampleMessage ) {
        // valid message
        messageFromBytes = implementation.fromBytes(exampleMessage.bytes, config);
        bytesFromMessage = implementation.toBytes(exampleMessage.commands);

        expect(getHexFromBytes(bytesFromMessage)).toBe(getHexFromBytes(exampleMessage.bytes));
    } else if ( 'message' in exampleMessage ) {
        // invalid message
        messageFromBytes = implementation.fromBytes(exampleMessage.message.bytes, config);
    } else {
        // everything else
        throw new Error('wrong message format');
    }

    expect(messageFromBytes).toStrictEqual(exampleMessage);
};

const checkMessages = ( description: string, implementation, messagesExamples: TMessageExamples, config?: ICommandConfig ) => (
    describe(description, () => {
        for ( const [exampleName, exampleMessage] of Object.entries(messagesExamples) ) {
            test(exampleName, () => {
                checkDownlinkMessage(implementation, exampleMessage, config);
            });
        }
    })
);


checkMessages('valid downlink messages', message.downlink, validDownlinkMessages);
checkMessages('invalid downlink messages', message.downlink, invalidDownlinkMessages);
checkMessages('valid uplink messages', message.uplink, validUplinkMessages, {hardwareType: hardwareTypes.GASIC});
checkMessages('valid multichannel uplink messages', message.uplink, validMultichannelUplinkMessages, {hardwareType: hardwareTypes.IMP4EU});
checkMessages('invalid uplink messages', message.uplink, invalidUplinkMessages);
checkMessages('mtx uplink messages', message.uplink, mtxUplinkMessages, {hardwareType: hardwareTypes.MTXLORA});

describe('additional message validation', () => {
    test('valid input', () => {
        const bytes = getBytesFromHex('02 05 4e 2b bd 98 ad 03 07 0a 00 64 0c 96 00 e9  a6');
        const messageFromBytes = message.downlink.fromBytes(bytes);

        if ( 'error' in messageFromBytes ) {
            throw new Error('wrong message');
        }
    });

    test('invalid input', () => {
        const bytes = getBytesFromHex('02 05 4e 2b bd 98 ab 03 07 0a 00 64 0c 96 00 e9  a6');
        const messageFromBytes = message.downlink.fromBytes(bytes);

        if ( !('error' in messageFromBytes) ) {
            throw new Error('wrong message');
        }
    });

    test('invalid commands direction in message', () => {
        const bytes = getBytesFromHex('17 0d 2e d5 f3 01 99 35 00 00 00 00 00 00 00 62 bc 00  34');
        const messageFromBytes = message.downlink.fromBytes(bytes);

        if ( 'commands' in messageFromBytes ) {
            messageFromBytes.commands.forEach(command => {
                if ( !('error' in command) ) {
                    throw new Error('expected error in commands, but not found it');
                }
            });
        }
    });
});
