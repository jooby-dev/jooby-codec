/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
// @ts-nocheck

import fs from 'fs';
import path from 'path';

import {commands as analogCommands} from '../src/analog/index.js';
import {commands as mtxCommands} from '../src/mtx/index.js';
import {commands as obisObserverCommands} from '../src/obis-observer/index.js';
import * as analogMessage from '../src/analog/message/index.js';
import * as mtxMessage from '../src/mtx/message/index.js';
import * as obisObserverMessage from '../src/obis-observer/message/index.js';


const ANALOG_DOWNLINK_PATH = path.resolve(__dirname, '../src/analog/commands/downlink');
const ANALOG_UPLINK_PATH = path.resolve(__dirname, '../src/analog/commands/uplink');
const ANALOG_MESSAGE_DOWNLINK_PATH = path.resolve(__dirname, '../src/analog/message/downlink.ts');
const ANALOG_MESSAGE_UPLINK_PATH = path.resolve(__dirname, '../src/analog/message/uplink.ts');
const ANALOG_DOWNLINK_INDEX_PATH = path.resolve(ANALOG_DOWNLINK_PATH, 'index.ts');
const ANALOG_UPLINK_INDEX_PATH = path.resolve(ANALOG_UPLINK_PATH, 'index.ts');

const MTX_DOWNLINK_PATH = path.resolve(__dirname, '../src/mtx/commands/downlink');
const MTX_UPLINK_PATH = path.resolve(__dirname, '../src/mtx/commands/uplink');
const MTX_MESSAGE_DOWNLINK_PATH = path.resolve(__dirname, '../src/mtx/message/downlink.ts');
const MTX_MESSAGE_UPLINK_PATH = path.resolve(__dirname, '../src/mtx/message/uplink.ts');
const MTX_DOWNLINK_INDEX_PATH = path.resolve(MTX_DOWNLINK_PATH, 'index.ts');
const MTX_UPLINK_INDEX_PATH = path.resolve(MTX_UPLINK_PATH, 'index.ts');

const OBIS_OBSERVER_DOWNLINK_PATH = path.resolve(__dirname, '../src/obis-observer/commands/downlink');
const OBIS_OBSERVER_UPLINK_PATH = path.resolve(__dirname, '../src/obis-observer/commands/uplink');
const OBIS_OBSERVER_MESSAGE_DOWNLINK_PATH = path.resolve(__dirname, '../src/obis-observer/message/downlink.ts');
const OBIS_OBSERVER_MESSAGE_UPLINK_PATH = path.resolve(__dirname, '../src/obis-observer/message/uplink.ts');
const OBIS_OBSERVER_DOWNLINK_INDEX_PATH = path.resolve(OBIS_OBSERVER_DOWNLINK_PATH, 'index.ts');
const OBIS_OBSERVER_UPLINK_INDEX_PATH = path.resolve(OBIS_OBSERVER_UPLINK_PATH, 'index.ts');


const getCommandIdsFromMessageImport = messageData => {
    const result = {};

    ['toBytesMap', 'fromBytesMap', 'nameMap'].forEach(key => {
        result[key] = Object.keys(messageData[key]).map(Number);
    });

    return result;
};

const checkIdConsistency = ( commands, messageIds, messagePath ) => {
    Object.values(commands).forEach(({name, id}) => {
        try {
            expect(messageIds.toBytesMap).toContain(id);
        } catch {
            throw new Error(`Command ${name} (ID ${id}) is missing in toBytesMap at ${messagePath}`);
        }

        try {
            expect(messageIds.fromBytesMap).toContain(id);
        } catch {
            throw new Error(`Command ${name} (ID ${id}) is missing in fromBytesMap at ${messagePath}`);
        }

        try {
            expect(messageIds.nameMap).toContain(id);
        } catch {
            throw new Error(`Command ${name} (ID ${id}) is missing in nameMap at ${messagePath}`);
        }
    });
};

const checkUplinkDownlinkConsistency = ( uplinkCommands, downlinkCommands ) => {
    const uplinkNames = Object.keys(uplinkCommands);

    uplinkNames.forEach(name => {
        if ( downlinkCommands[name] ) {
            if ( downlinkCommands[name] ) {
                try {
                    expect(uplinkCommands[name].id).toBe(downlinkCommands[name].id);
                } catch ( error ) {
                    throw new Error(
                        `ID mismatch for command: ${name}, expected ${uplinkCommands[name].id}, received ${downlinkCommands[name].id}`
                    );
                }
            }
        }
    });
};

const getCommandFileNames = dirPath => fs.readdirSync(dirPath)
    .filter(file => file !== 'index.ts')
    .map(file => path.parse(file).name);

const checkCommandFileNames = ( dirPath, importPath, importedCommands ) => {
    const commandFileNames = getCommandFileNames(dirPath).sort();
    const importedCommandNames = Object.keys(importedCommands).sort();

    const missingInFiles = importedCommandNames.filter(name => !commandFileNames.includes(name));
    const missingInImports = commandFileNames.filter(name => !importedCommandNames.includes(name));

    try {
        expect(commandFileNames).toStrictEqual(importedCommandNames);
    } catch ( error ) {
        throw new Error(
            `Command file names mismatch in directory ${dirPath} compared to imported commands from ${importPath}\n\n`
             + `Expected: ${importedCommandNames.join(', ')}\n\n`
             + `Received: ${commandFileNames.join(', ')}\n\n`
             + `Missing in files: ${missingInFiles.join(', ')}\n\n`
             + `Missing in imports: ${missingInImports.join(', ')}`
        );
    }
};


describe('commands consistency', () => {
    test('analog downlink IDs should match', () => {
        checkIdConsistency(
            analogCommands.downlink,
            getCommandIdsFromMessageImport(analogMessage.downlink),
            ANALOG_MESSAGE_DOWNLINK_PATH
        );
    });

    test('analog uplink IDs should match', () => {
        checkIdConsistency(
            analogCommands.uplink,
            getCommandIdsFromMessageImport(analogMessage.uplink),
            ANALOG_MESSAGE_UPLINK_PATH
        );
    });

    test('mtx downlink IDs should match', () => {
        checkIdConsistency(
            mtxCommands.downlink,
            getCommandIdsFromMessageImport(mtxMessage.downlink),
            MTX_MESSAGE_DOWNLINK_PATH
        );
    });

    test('mtx uplink IDs should match', () => {
        checkIdConsistency(
            mtxCommands.uplink,
            getCommandIdsFromMessageImport(mtxMessage.uplink),
            MTX_MESSAGE_UPLINK_PATH
        );
    });

    test('obis-observer downlink IDs should match', () => {
        checkIdConsistency(
            obisObserverCommands.downlink,
            getCommandIdsFromMessageImport(obisObserverMessage.downlink),
            OBIS_OBSERVER_MESSAGE_DOWNLINK_PATH
        );
    });

    test('obis-observer uplink IDs should match', () => {
        checkIdConsistency(
            obisObserverCommands.uplink,
            getCommandIdsFromMessageImport(obisObserverMessage.uplink),
            OBIS_OBSERVER_MESSAGE_UPLINK_PATH
        );
    });

    test('analog uplink/downlink IDs should match', () => {
        checkUplinkDownlinkConsistency(analogCommands.uplink, analogCommands.downlink);
    });

    test('mtx uplink/downlink IDs should match', () => {
        checkUplinkDownlinkConsistency(mtxCommands.uplink, mtxCommands.downlink);
    });

    test('analog command file names should match imported commands', () => {
        checkCommandFileNames(ANALOG_DOWNLINK_PATH, ANALOG_DOWNLINK_INDEX_PATH, analogCommands.downlink);
        checkCommandFileNames(ANALOG_UPLINK_PATH, ANALOG_UPLINK_INDEX_PATH, analogCommands.uplink);
    });

    test('mtx command file names should match imported commands', () => {
        checkCommandFileNames(MTX_DOWNLINK_PATH, MTX_DOWNLINK_INDEX_PATH, mtxCommands.downlink);
        checkCommandFileNames(MTX_UPLINK_PATH, MTX_UPLINK_INDEX_PATH, mtxCommands.uplink);
    });

    test('obis-observer command file names should match imported commands', () => {
        checkCommandFileNames(OBIS_OBSERVER_DOWNLINK_PATH, OBIS_OBSERVER_DOWNLINK_INDEX_PATH, obisObserverCommands.downlink);
        checkCommandFileNames(OBIS_OBSERVER_UPLINK_PATH, OBIS_OBSERVER_UPLINK_INDEX_PATH, obisObserverCommands.uplink);
    });
});
