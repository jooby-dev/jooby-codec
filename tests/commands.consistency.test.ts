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
import {commands as mtx3Commands} from '../src/mtx3/index.js';
import {commands as obisObserverCommands} from '../src/obis-observer/index.js';
import * as analogMessage from '../src/analog/message/index.js';
import * as mtxMessage from '../src/mtx/message/index.js';
import * as mtx3Message from '../src/mtx3/message/index.js';
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

const MTX3_DOWNLINK_PATH = path.resolve(__dirname, '../src/mtx3/commands/downlink');
const MTX3_UPLINK_PATH = path.resolve(__dirname, '../src/mtx3/commands/uplink');
const MTX3_MESSAGE_DOWNLINK_PATH = path.resolve(__dirname, '../src/mtx3/message/downlink.ts');
const MTX3_MESSAGE_UPLINK_PATH = path.resolve(__dirname, '../src/mtx3/message/uplink.ts');
const MTX3_DOWNLINK_INDEX_PATH = path.resolve(MTX3_DOWNLINK_PATH, 'index.ts');
const MTX3_UPLINK_INDEX_PATH = path.resolve(MTX3_UPLINK_PATH, 'index.ts');

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
            try {
                expect(uplinkCommands[name].id).toBe(downlinkCommands[name].id);
            } catch ( error ) {
                throw new Error(
                    `ID mismatch for command: ${name}, expected ${uplinkCommands[name].id}, received ${downlinkCommands[name].id}`
                );
            }
        }
    });
};

const getCommandFileNames = dirPath => fs.readdirSync(dirPath)
    .filter(file => file !== 'index.ts')
    .map(file => path.parse(file).name);

const checkCommandNamesConsistency = ( dirPath, importPath, importedCommands ) => {
    const commandFileNames = getCommandFileNames(dirPath);
    const mismatches = [];

    commandFileNames.forEach(fileName => {
        const importedCommandName = importedCommands[fileName];

        if ( !importedCommandName ) {
            mismatches.push(`File: "${fileName}" does not have a corresponding imported command in "${importPath}"`);

            return;
        }

        if ( fileName !== importedCommandName.name ) {
            mismatches.push(`File: "${fileName}" does not match imported command name: "${importedCommandName.name}"`);
        }
    });

    if ( mismatches.length ) {
        throw new Error(
            `Command file names mismatch in directory ${dirPath} compared to imported commands from ${importPath}\n\n`
            + `Mismatches: \n${mismatches.join('\n')}\n\n`
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

    test('mtx3 downlink IDs should match', () => {
        checkIdConsistency(
            mtx3Commands.downlink,
            getCommandIdsFromMessageImport(mtx3Message.downlink),
            MTX3_MESSAGE_DOWNLINK_PATH
        );
    });

    test('mtx3 uplink IDs should match', () => {
        checkIdConsistency(
            mtx3Commands.uplink,
            getCommandIdsFromMessageImport(mtx3Message.uplink),
            MTX3_MESSAGE_UPLINK_PATH
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

    test('mtx3 uplink/downlink IDs should match', () => {
        checkUplinkDownlinkConsistency(mtx3Commands.uplink, mtx3Commands.downlink);
    });

    test('analog command file names should match imported commands', () => {
        checkCommandNamesConsistency(ANALOG_DOWNLINK_PATH, ANALOG_DOWNLINK_INDEX_PATH, analogCommands.downlink);
        checkCommandNamesConsistency(ANALOG_UPLINK_PATH, ANALOG_UPLINK_INDEX_PATH, analogCommands.uplink);
    });

    test('mtx command file names should match imported commands', () => {
        checkCommandNamesConsistency(MTX_DOWNLINK_PATH, MTX_DOWNLINK_INDEX_PATH, mtxCommands.downlink);
        checkCommandNamesConsistency(MTX_UPLINK_PATH, MTX_UPLINK_INDEX_PATH, mtxCommands.uplink);
    });

    test('obis-observer command file names should match imported commands', () => {
        checkCommandNamesConsistency(OBIS_OBSERVER_DOWNLINK_PATH, OBIS_OBSERVER_DOWNLINK_INDEX_PATH, obisObserverCommands.downlink);
        checkCommandNamesConsistency(OBIS_OBSERVER_UPLINK_PATH, OBIS_OBSERVER_UPLINK_INDEX_PATH, obisObserverCommands.uplink);
    });

    test('mtx3 command file names should match imported commands', () => {
        checkCommandNamesConsistency(MTX3_DOWNLINK_PATH, MTX3_DOWNLINK_INDEX_PATH, mtx3Commands.downlink);
        checkCommandNamesConsistency(MTX3_UPLINK_PATH, MTX3_UPLINK_INDEX_PATH, mtx3Commands.uplink);
    });
});
