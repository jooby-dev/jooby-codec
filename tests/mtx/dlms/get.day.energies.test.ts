import {getDayMaxPower} from '../../../src/mtx/commands/uplink/index.js';
import {runCommandDlmsTest} from './utils/runCommandDlmsTest.js';


const examples = [
    {
        name: 'small',
        parameters: {
            date: {
                year: 21,
                month: 2,
                date: 3
            },
            tariffs: [
                {
                    'A+': {
                        hours: 1,
                        minutes: 2,
                        power: 3
                    },
                    'A-R+': {
                        hours: 4,
                        minutes: 5,
                        power: 6
                    }
                }
            ]
        },
        dlms: {
            date: {
                year: 21,
                month: 2,
                date: 3
            },
            '1.6.1': {
                hours: 1,
                minutes: 2,
                power: 3
            },
            '7.6.1': {
                hours: 4,
                minutes: 5,
                power: 6
            }
        }
    },
    {
        name: 'custom',
        parameters: {
            date: {
                year: 21,
                month: 2,
                date: 3
            },
            tariffs: [
                {
                    'A+': {
                        hours: 0,
                        minutes: 1,
                        power: 2
                    },
                    'A+R+': {
                        hours: 3,
                        minutes: 4,
                        power: 5
                    },
                    'A-R-': {
                        hours: 15,
                        minutes: 16,
                        power: 17
                    }
                },
                undefined,
                {
                    'A+R+': {
                        hours: 15,
                        minutes: 16,
                        power: 17
                    }
                },
                {
                    'A+': {
                        hours: 6,
                        minutes: 7,
                        power: 8
                    },
                    'A+R-': {
                        hours: 12,
                        minutes: 13,
                        power: 14
                    },
                    'A-R+': {
                        hours: 18,
                        minutes: 19,
                        power: 20
                    }
                }
            ]
        },
        dlms: {
            date: {
                year: 21,
                month: 2,
                date: 3
            },
            '1.6.1': {
                hours: 0,
                minutes: 1,
                power: 2
            },
            '3.6.1': {
                hours: 3,
                minutes: 4,
                power: 5
            },
            '8.6.1': {
                hours: 15,
                minutes: 16,
                power: 17
            },
            '3.6.3': {
                hours: 15,
                minutes: 16,
                power: 17
            },
            '1.6.4': {
                hours: 6,
                minutes: 7,
                power: 8
            },
            '4.6.4': {
                hours: 12,
                minutes: 13,
                power: 14
            },
            '7.6.4': {
                hours: 18,
                minutes: 19,
                power: 20
            }
        }
    },
    {
        name: 'complete',
        parameters: {
            date: {
                year: 21,
                month: 2,
                date: 3
            },
            tariffs: [
                {
                    'A+': {
                        hours: 0,
                        minutes: 1,
                        power: 2
                    },
                    'A+R+': {
                        hours: 3,
                        minutes: 4,
                        power: 5
                    },
                    'A+R-': {
                        hours: 6,
                        minutes: 7,
                        power: 8
                    },
                    'A-': {
                        hours: 9,
                        minutes: 10,
                        power: 11
                    },
                    'A-R+': {
                        hours: 12,
                        minutes: 13,
                        power: 14
                    },
                    'A-R-': {
                        hours: 15,
                        minutes: 16,
                        power: 17
                    }
                },
                {
                    'A+': {
                        hours: 18,
                        minutes: 19,
                        power: 20
                    },
                    'A+R+': {
                        hours: 21,
                        minutes: 22,
                        power: 23
                    },
                    'A+R-': {
                        hours: 0,
                        minutes: 1,
                        power: 2
                    },
                    'A-': {
                        hours: 3,
                        minutes: 4,
                        power: 5
                    },
                    'A-R+': {
                        hours: 6,
                        minutes: 7,
                        power: 8
                    },
                    'A-R-': {
                        hours: 9,
                        minutes: 10,
                        power: 11
                    }
                },
                {
                    'A+': {
                        hours: 12,
                        minutes: 13,
                        power: 14
                    },
                    'A+R+': {
                        hours: 15,
                        minutes: 16,
                        power: 17
                    },
                    'A+R-': {
                        hours: 18,
                        minutes: 19,
                        power: 20
                    },
                    'A-': {
                        hours: 21,
                        minutes: 22,
                        power: 23
                    },
                    'A-R+': {
                        hours: 0,
                        minutes: 1,
                        power: 2
                    },
                    'A-R-': {
                        hours: 3,
                        minutes: 4,
                        power: 5
                    }
                },
                {
                    'A+': {
                        hours: 6,
                        minutes: 7,
                        power: 8
                    },
                    'A+R+': {
                        hours: 9,
                        minutes: 10,
                        power: 11
                    },
                    'A+R-': {
                        hours: 12,
                        minutes: 13,
                        power: 14
                    },
                    'A-': {
                        hours: 15,
                        minutes: 16,
                        power: 17
                    },
                    'A-R+': {
                        hours: 18,
                        minutes: 19,
                        power: 20
                    },
                    'A-R-': {
                        hours: 21,
                        minutes: 22,
                        power: 23
                    }
                }
            ]
        },
        dlms: {
            date: {
                year: 21,
                month: 2,
                date: 3
            },
            '1.6.1': {
                hours: 0,
                minutes: 1,
                power: 2
            },
            '3.6.1': {
                hours: 3,
                minutes: 4,
                power: 5
            },
            '4.6.1': {
                hours: 6,
                minutes: 7,
                power: 8
            },
            '2.6.1': {
                hours: 9,
                minutes: 10,
                power: 11
            },
            '7.6.1': {
                hours: 12,
                minutes: 13,
                power: 14
            },
            '8.6.1': {
                hours: 15,
                minutes: 16,
                power: 17
            },
            '1.6.2': {
                hours: 18,
                minutes: 19,
                power: 20
            },
            '3.6.2': {
                hours: 21,
                minutes: 22,
                power: 23
            },
            '4.6.2': {
                hours: 0,
                minutes: 1,
                power: 2
            },
            '2.6.2': {
                hours: 3,
                minutes: 4,
                power: 5
            },
            '7.6.2': {
                hours: 6,
                minutes: 7,
                power: 8
            },
            '8.6.2': {
                hours: 9,
                minutes: 10,
                power: 11
            },
            '1.6.3': {
                hours: 12,
                minutes: 13,
                power: 14
            },
            '3.6.3': {
                hours: 15,
                minutes: 16,
                power: 17
            },
            '4.6.3': {
                hours: 18,
                minutes: 19,
                power: 20
            },
            '2.6.3': {
                hours: 21,
                minutes: 22,
                power: 23
            },
            '7.6.3': {
                hours: 0,
                minutes: 1,
                power: 2
            },
            '8.6.3': {
                hours: 3,
                minutes: 4,
                power: 5
            },
            '1.6.4': {
                hours: 6,
                minutes: 7,
                power: 8
            },
            '3.6.4': {
                hours: 9,
                minutes: 10,
                power: 11
            },
            '4.6.4': {
                hours: 12,
                minutes: 13,
                power: 14
            },
            '2.6.4': {
                hours: 15,
                minutes: 16,
                power: 17
            },
            '7.6.4': {
                hours: 18,
                minutes: 19,
                power: 20
            },
            '8.6.4': {
                hours: 21,
                minutes: 22,
                power: 23
            }
        }
    }
];


describe('GetDayEnergies dlms tests', () => runCommandDlmsTest(getDayMaxPower, examples));
