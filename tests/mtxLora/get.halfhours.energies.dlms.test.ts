import {GetHalfhoursEnergies} from '../../src/mtxLora/commands/uplink/index.js';
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
            firstHalfhour: 1,
            halfhoursNumber: 2,
            energies: {
                'A+': [0, 1],
                'A-R+': [2, 3]
            }
        },
        dlms: {
            date: {
                year: 21,
                month: 2,
                date: 3
            },
            firstHalfhour: 1,
            halfhoursNumber: 2,
            '1.5.1': 0,
            '1.5.2': 1,
            '6.5.1': 2,
            '6.5.2': 3
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
            firstHalfhour: 1,
            halfhoursNumber: 2,
            energies: {
                'A+': [0, 1, 2, 3],
                'A+R+': [4, 5, 6, 7],
                'A+R-': [8, 9, 10, 11],
                'A-': [12, 13, 14, 15],
                'A-R+': [16, 17, 18, 19],
                'A-R-': [20, 21, 22, 23]
            }
        },
        dlms: {
            date: {
                year: 21,
                month: 2,
                date: 3
            },
            firstHalfhour: 1,
            halfhoursNumber: 2,
            '1.5.1': 0,
            '1.5.2': 1,
            '1.5.3': 2,
            '1.5.4': 3,
            '3.5.1': 4,
            '3.5.2': 5,
            '3.5.3': 6,
            '3.5.4': 7,
            '4.5.1': 8,
            '4.5.2': 9,
            '4.5.3': 10,
            '4.5.4': 11,
            '2.5.1': 12,
            '2.5.2': 13,
            '2.5.3': 14,
            '2.5.4': 15,
            '6.5.1': 16,
            '6.5.2': 17,
            '6.5.3': 18,
            '6.5.4': 19,
            '7.5.1': 20,
            '7.5.2': 21,
            '7.5.3': 22,
            '7.5.4': 23
        }
    }
];


describe('GetDayEnergies dlms tests', () => runCommandDlmsTest(GetHalfhoursEnergies, examples));
