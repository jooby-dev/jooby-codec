import {getDayDemand} from '../../../src/mtx3/commands/uplink/index.js';
import {runCommandDlmsTest} from '../../mtx/dlms/utils/runCommandDlmsTest.js';


const examples = [
    {
        name: 'default A+ energy',
        parameters: {
            date: {
                year: 24,
                month: 3,
                date: 22
            },
            energies: {
                wh: [40301230, 3334244, 2333, 2145623],
                vari: [25000, 1234567, 789456, 9876543],
                vare: [987654, 654321, 123456, 789012]
            }
        },
        dlms: {
            date: {
                year: 24,
                month: 3,
                date: 22
            },
            '1.8.1': 40301230,
            '1.8.2': 3334244,
            '1.8.3': 2333,
            '1.8.4': 2145623,
            '3.8.1': 25000,
            '3.8.2': 1234567,
            '3.8.3': 789456,
            '3.8.4': 9876543,
            '4.8.1': 987654,
            '4.8.2': 654321,
            '4.8.3': 123456,
            '4.8.4': 789012
        }
    },
    {
        name: 'energy A+',
        parameters: {
            date: {
                year: 21,
                month: 2,
                date: 3
            },
            energyType: 1,
            energies: {
                wh: [40301230, null, null, 2145623],
                vari: [25000, null, null, 9876543],
                vare: [987654, null, null, 789012]
            }
        },
        dlms: {
            date: {
                year: 21,
                month: 2,
                date: 3
            },
            '1.8.1': 40301230,
            '1.8.4': 2145623,
            '3.8.1': 25000,
            '3.8.4': 9876543,
            '4.8.1': 987654,
            '4.8.4': 789012
        }
    },
    {
        name: 'energy A-',
        parameters: {
            date: {
                year: 21,
                month: 2,
                date: 3
            },
            energyType: 2,
            energies: {
                wh: [null, 40301230, null, 2145623],
                vari: [null, 25000, null, 9876543],
                vare: [null, 987654, null, 789012]
            }
        },
        dlms: {
            date: {
                year: 21,
                month: 2,
                date: 3
            },
            '2.8.2': 40301230,
            '2.8.4': 2145623,
            '6.8.2': 25000,
            '6.8.4': 9876543,
            '7.8.2': 987654,
            '7.8.4': 789012
        },
        isGreen: true
    }
];


describe('GetDayDemand dlms tests', () => runCommandDlmsTest(getDayDemand, examples));
