import {commands} from '../../src/mtx3/index.js';
import {processExamples} from '../mtx/command.test.js';


const {uplink, downlink} = commands;


describe('downlink commands', () => {
    processExamples(downlink);
});

describe('uplink commands', () => {
    processExamples(uplink);
});
