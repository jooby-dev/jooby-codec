import {getCurrentValues} from '../../../src/mtx3/commands/uplink/index.js';
import {runCommandDlmsTest} from '../../mtx1/dlms/utils/runCommandDlmsTest.js';


const example = {
    name: 'getCurrentValues',
    parameters: {
        vaRms: 230000,
        vbRms: 231000,
        vcRms: 229000,
        iaRms: 5000,
        ibRms: 4900,
        icRms: 5050,
        powerA: 1150000,
        powerB: 1120000,
        powerC: 1160000,
        varA: 200000,
        varB: 195000,
        varC: 205000,
        iNeutral: 1500
    },
    dlms: {
        '32.7.0': 230000,
        '52.7.0': 231000,
        '72.7.0': 229000,
        '31.7.0': 5000,
        '51.7.0': 4900,
        '71.7.0': 5050,
        '1.21.7.0': 1150000,
        '1.41.7.0': 1120000,
        '1.61.7.0': 1160000,
        '91.7.0': 1500,
        '1.23.7.0': 200000,
        '1.43.7.0': 195000,
        '1.63.7.0': 205000
    }
};


describe('GetCurrentValuesResponse dlms tests', () => runCommandDlmsTest(getCurrentValues, [example]));
