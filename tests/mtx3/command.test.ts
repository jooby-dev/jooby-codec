import {commands} from '../../src/mtx3/index.js';
import {processExamples} from '../mtx1/command.test.js';


const {uplink, downlink} = commands;
const SCOPE = 'mtx3';


describe('downlink commands', () => {
    processExamples(`${SCOPE} downlink`, downlink);
});

describe('uplink commands', () => {
    processExamples(`${SCOPE} uplink`, uplink);
});
