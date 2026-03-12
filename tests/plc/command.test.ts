import {commands} from '../../src/plc/index.js';
import {processExamples} from '../mtx1/command.test.js';


const {uplink, downlink} = commands;
const SCOPE = 'plc';


describe('downlink commands', () => {
    processExamples(`${SCOPE} downlink`, downlink);
});

describe('uplink commands', () => {
    processExamples(`${SCOPE} uplink`, uplink);
});
