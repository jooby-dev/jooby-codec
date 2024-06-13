import {getEnergyCurrent} from '../../../src/mtx/commands/uplink/index.js';
import {runCommandDlmsTest} from './utils/runCommandDlmsTest.js';


const examples = [
    {
        name: 'simple response',
        parameters: {
            energies: [40301230, 3334244, 2333, 2145623]
        },
        dlms: {
            '1.8.1': 40301230,
            '1.8.2': 3334244,
            '1.8.3': 2333,
            '1.8.4': 2145623
        }
    },
    {
        name: 'energy A+',
        parameters: {
            energyType: 1,
            energies: [40301230, null, null, 2145623]
        },
        dlms: {
            '1.8.1': 40301230,
            '1.8.4': 2145623
        }
    },
    {
        name: 'energy A-',
        parameters: {
            energyType: 2,
            energies: [null, 40301230, null, 2145623]
        },
        dlms: {
            '2.8.2': 40301230,
            '2.8.4': 2145623
        }
    }
];


describe('GetEnergyCurrentResponse dlms tests', () => runCommandDlmsTest(getEnergyCurrent, examples));
