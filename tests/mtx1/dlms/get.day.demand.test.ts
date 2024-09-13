import {getDayDemand} from '../../../src/mtx1/commands/uplink/index.js';
import {runCommandDlmsTest} from './utils/runCommandDlmsTest.js';


const examples = [
    {
        name: 'simple response',
        parameters: {
            date: {
                year: 24,
                month: 3,
                date: 22
            },
            energies: [40301230, 3334244, 2333, 2145623]
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
            '1.8.4': 2145623
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
            energies: [40301230, null, null, 2145623]
        },
        dlms: {
            date: {
                year: 21,
                month: 2,
                date: 3
            },
            '1.8.1': 40301230,
            '1.8.4': 2145623
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
            energies: [null, 40301230, null, 2145623]
        },
        dlms: {
            date: {
                year: 21,
                month: 2,
                date: 3
            },
            '2.8.2': 40301230,
            '2.8.4': 2145623
        }
    }
];


describe('GetEnergyDayResponse dlms tests', () => runCommandDlmsTest(getDayDemand, examples));
