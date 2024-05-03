import {getEnergyDay} from '../../../src/mtx/commands/uplink/index.js';
import {A_MINUS_ENERGY_TYPE, A_PLUS_ENERGY_TYPE} from '../../../src/mtx/utils/CommandBinaryBuffer.js';
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
            energyType: A_PLUS_ENERGY_TYPE,
            energies: [40301230, undefined, undefined, 2145623]
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
            energyType: A_MINUS_ENERGY_TYPE,
            energies: [undefined, 40301230, undefined, 2145623]
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


describe('GetEnergyDayResponse dlms tests', () => runCommandDlmsTest(getEnergyDay, examples));
