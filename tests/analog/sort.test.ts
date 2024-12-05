/* eslint-disable @typescript-eslint/no-unused-vars */
import * as fs from 'fs';
import * as analogDownlink from '../../src/analog/commands/downlink/index.js';
import * as analogUplink from '../../src/analog/commands/uplink/index.js';
import * as mtx1Downlink from '../../src/mtx1/commands/downlink/index.js';
import * as mtx1Uplink from '../../src/mtx1/commands/uplink/index.js';
import * as mtx3Downlink from '../../src/mtx3/commands/downlink/index.js';
import * as mtx3Uplink from '../../src/mtx3/commands/uplink/index.js';
import * as obisDownlink from '../../src/obis-observer/commands/downlink/index.js';
import * as obisUplink from '../../src/obis-observer/commands/uplink/index.js';


interface Command {
    id: number,
    name: string
}

const printCommands = ( commands: object, filename: string ) => {
    const names = Object.entries(commands).map(([, command]) => {
        const {id, name} = command as Command;

        return {id, name};
    });

    names.sort((a, b) => a.id - b.id);

    const ws = fs.createWriteStream(filename);
    names.forEach(({id, name}) => ws.write(`export const ${name} = 0x${id.toString(16)}; // ${id}\n`));
    ws.end();
};


describe('sort commands', () => {
    test('test case', () => {
        //printCommands(analogDownlink, './src/analog/constants/downlinkIds.ts');
        //printCommands(analogUplink, './src/analog/constants/uplinkIds.ts');
        //printCommands(mtx1Downlink, './src/mtx1/constants/downlinkIds.ts');
        //printCommands(mtx1Uplink, './src/mtx1/constants/uplinkIds.ts');
        //printCommands(mtx3Downlink, './src/mtx3/constants/downlinkIds.ts');
        //printCommands(mtx3Uplink, './src/mtx3/constants/uplinkIds.ts');
        //printCommands(obisDownlink, './src/obis-observer/constants/downlinkIds.ts');
        //printCommands(obisUplink, './src/obis-observer/constants/uplinkIds.ts');
    });
});
