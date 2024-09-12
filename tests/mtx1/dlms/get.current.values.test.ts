import {getCurrentValues} from '../../../src/mtx1/commands/uplink/index.js';
import {runCommandDlmsTest} from './utils/runCommandDlmsTest.js';


const example = {
    name: 'getCurrentValues',
    parameters: {
        powerA: 2349234,
        iaRms: 4061779,
        vavbRms: 302729,
        varA: 106789,
        pfA: 3267,
        ibRms: 304779,
        powerB: 106280,
        varB: 107292,
        pfB: 3767
    },
    dlms: {
        '21.7.0': 2349234,
        '31.7.0': 4061779,
        '32.7.0': 302729,
        '23.7.0': 106789,
        '33.7.0': 3267,
        '51.7.0': 304779,
        '41.7.0': 106280,
        '43.7.0': 107292,
        '53.7.0': 3767
    }
};


describe('GetCurrentValuesResponse dlms tests', () => runCommandDlmsTest(getCurrentValues, [example]));
