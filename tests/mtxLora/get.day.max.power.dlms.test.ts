import {GetDayEnergies} from '../../src/mtxLora/commands/uplink/index.js';
import {runCommandDlmsTest} from './utils/runCommandDlmsTest.js';


const examples = [
    {
        name: 'small',
        parameters: {
            date: {
                year: 21,
                month: 2,
                day: 3
            },
            energies: [
                {
                    'A+': 0x1000,
                    'A-R+': 0x2000
                }
            ]
        },
        dlms: {
            date: {
                year: 21,
                month: 2,
                day: 3
            },
            '1.8.1': 0x1000,
            '7.8.1': 0x2000
        }
    },
    {
        name: 'custom',
        parameters: {
            date: {
                year: 21,
                month: 2,
                day: 3
            },
            energies: [
                {
                    'A+': 0,
                    'A-': 3,
                    'A-R+': 4,
                    'A-R-': 5
                },
                {
                    'A+': 6,
                    'A+R+': 7,
                    'A+R-': 8
                },
                undefined,
                {
                    'A+R+': 19,
                    'A+R-': 20,
                    'A-R+': 22
                }
            ]
        },
        dlms: {
            date: {
                year: 21,
                month: 2,
                day: 3
            },
            '1.8.1': 0,
            '2.8.1': 3,
            '7.8.1': 4,
            '8.8.1': 5,
            '1.8.2': 6,
            '3.8.2': 7,
            '4.8.2': 8,
            '3.8.4': 19,
            '4.8.4': 20,
            '7.8.4': 22
        }
    },
    {
        name: 'complete',
        parameters: {
            date: {
                year: 21,
                month: 2,
                day: 3
            },
            energies: [
                {
                    'A+': 0,
                    'A+R+': 1,
                    'A+R-': 2,
                    'A-': 3,
                    'A-R+': 4,
                    'A-R-': 5
                },
                {
                    'A+': 6,
                    'A+R+': 7,
                    'A+R-': 8,
                    'A-': 9,
                    'A-R+': 10,
                    'A-R-': 11
                },
                {
                    'A+': 12,
                    'A+R+': 13,
                    'A+R-': 14,
                    'A-': 15,
                    'A-R+': 16,
                    'A-R-': 17
                },
                {
                    'A+': 18,
                    'A+R+': 19,
                    'A+R-': 20,
                    'A-': 21,
                    'A-R+': 22,
                    'A-R-': 23
                }
            ]
        },
        dlms: {
            date: {
                year: 21,
                month: 2,
                day: 3
            },
            '1.8.1': 0,
            '3.8.1': 1,
            '4.8.1': 2,
            '2.8.1': 3,
            '7.8.1': 4,
            '8.8.1': 5,
            '1.8.2': 6,
            '3.8.2': 7,
            '4.8.2': 8,
            '2.8.2': 9,
            '7.8.2': 10,
            '8.8.2': 11,
            '1.8.3': 12,
            '3.8.3': 13,
            '4.8.3': 14,
            '2.8.3': 15,
            '7.8.3': 16,
            '8.8.3': 17,
            '1.8.4': 18,
            '3.8.4': 19,
            '4.8.4': 20,
            '2.8.4': 21,
            '7.8.4': 22,
            '8.8.4': 23
        }
    }
];


describe('GetDayEnergies dlms tests', () => runCommandDlmsTest(GetDayEnergies, examples));
