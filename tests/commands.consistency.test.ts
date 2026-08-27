/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
// @ts-nocheck

import fs from 'fs';
import path from 'path';

import {commands as analogCommands} from '../src/analog/index.js';
import {commands as analogUltrasoundCommands} from '../src/analog-ultrasound/index.js';
import {commands as mtx1Commands} from '../src/mtx1/index.js';
import {commands as mtx3Commands} from '../src/mtx3/index.js';
import {commands as obisObserverCommands} from '../src/obis-observer/index.js';
import {commands as plcCommands} from '../src/plc/index.js';
import * as analogMessage from '../src/analog/message/index.js';
import * as analogUltrasoundMessage from '../src/analog-ultrasound/message/index.js';
import * as mtx1Message from '../src/mtx1/message/index.js';
import * as mtx3Message from '../src/mtx3/message/index.js';
import * as obisObserverMessage from '../src/obis-observer/message/index.js';
import * as plcModemDownlink from '../src/plc/message/modem/downlink.js';
import * as plcModemUplink from '../src/plc/message/modem/uplink.js';
import * as plcConnectionDownlink from '../src/plc/message/connection/downlink.js';
import * as plcConnectionUplink from '../src/plc/message/connection/uplink.js';


const ANALOG_DOWNLINK_PATH = path.resolve(__dirname, '../src/analog/commands/downlink');
const ANALOG_UPLINK_PATH = path.resolve(__dirname, '../src/analog/commands/uplink');
const ANALOG_MESSAGE_DOWNLINK_PATH = path.resolve(__dirname, '../src/analog/message/downlink.ts');
const ANALOG_MESSAGE_UPLINK_PATH = path.resolve(__dirname, '../src/analog/message/uplink.ts');
const ANALOG_DOWNLINK_INDEX_PATH = path.resolve(ANALOG_DOWNLINK_PATH, 'index.ts');
const ANALOG_UPLINK_INDEX_PATH = path.resolve(ANALOG_UPLINK_PATH, 'index.ts');

const MTX1_DOWNLINK_PATH = path.resolve(__dirname, '../src/mtx1/commands/downlink');
const MTX1_UPLINK_PATH = path.resolve(__dirname, '../src/mtx1/commands/uplink');
const MTX1_MESSAGE_DOWNLINK_PATH = path.resolve(__dirname, '../src/mtx1/message/downlink.ts');
const MTX1_MESSAGE_UPLINK_PATH = path.resolve(__dirname, '../src/mtx1/message/uplink.ts');
const MTX1_DOWNLINK_INDEX_PATH = path.resolve(MTX1_DOWNLINK_PATH, 'index.ts');
const MTX1_UPLINK_INDEX_PATH = path.resolve(MTX1_UPLINK_PATH, 'index.ts');

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

const ANALOG_ULTRASOUND_DOWNLINK_PATH = path.resolve(__dirname, '../src/analog-ultrasound/commands/downlink');
const ANALOG_ULTRASOUND_UPLINK_PATH = path.resolve(__dirname, '../src/analog-ultrasound/commands/uplink');
const ANALOG_ULTRASOUND_MESSAGE_DOWNLINK_PATH = path.resolve(__dirname, '../src/analog-ultrasound/message/downlink.ts');
const ANALOG_ULTRASOUND_MESSAGE_UPLINK_PATH = path.resolve(__dirname, '../src/analog-ultrasound/message/uplink.ts');
const ANALOG_ULTRASOUND_DOWNLINK_INDEX_PATH = path.resolve(ANALOG_ULTRASOUND_DOWNLINK_PATH, 'index.ts');
const ANALOG_ULTRASOUND_UPLINK_INDEX_PATH = path.resolve(ANALOG_ULTRASOUND_UPLINK_PATH, 'index.ts');

const PLC_DOWNLINK_PATH = path.resolve(__dirname, '../src/plc/commands/downlink');
const PLC_UPLINK_PATH = path.resolve(__dirname, '../src/plc/commands/uplink');
const PLC_MESSAGE_DOWNLINK_PATH = path.resolve(__dirname, '../src/plc/message/modem/downlink.ts');
const PLC_MESSAGE_UPLINK_PATH = path.resolve(__dirname, '../src/plc/message/modem/uplink.ts');
const PLC_DOWNLINK_INDEX_PATH = path.resolve(PLC_DOWNLINK_PATH, 'index.ts');
const PLC_UPLINK_INDEX_PATH = path.resolve(PLC_UPLINK_PATH, 'index.ts');


const mergeMessageMaps = ( ...messages ) => ({
    toBytesMap: Object.assign({}, ...messages.map(item => item.toBytesMap)),
    fromBytesMap: Object.assign({}, ...messages.map(item => item.fromBytesMap)),
    nameMap: Object.assign({}, ...messages.map(item => item.nameMap))
});

const checkIdConsistency = ( commands, messageData, messagePath ) => {
    Object.values(commands).forEach(({name, id, fromBytes, toBytes}) => {
        try {
            expect(messageData.toBytesMap[id]).toBe(toBytes);
        } catch {
            throw new Error(`Command ${name} (ID ${id}) toBytes is missing or not bound in toBytesMap at ${messagePath}`);
        }

        try {
            expect(messageData.fromBytesMap[id]).toBe(fromBytes);
        } catch {
            throw new Error(`Command ${name} (ID ${id}) fromBytes is missing or not bound in fromBytesMap at ${messagePath}`);
        }

        try {
            expect(id in messageData.nameMap).toBe(true);
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
            analogMessage.downlink,
            ANALOG_MESSAGE_DOWNLINK_PATH
        );
    });

    test('analog uplink IDs should match', () => {
        checkIdConsistency(
            analogCommands.uplink,
            analogMessage.uplink,
            ANALOG_MESSAGE_UPLINK_PATH
        );
    });

    test('mtx1 downlink IDs should match', () => {
        checkIdConsistency(
            mtx1Commands.downlink,
            mtx1Message.downlink,
            MTX1_MESSAGE_DOWNLINK_PATH
        );
    });

    test('mtx1 uplink IDs should match', () => {
        checkIdConsistency(
            mtx1Commands.uplink,
            mtx1Message.uplink,
            MTX1_MESSAGE_UPLINK_PATH
        );
    });

    test('mtx3 downlink IDs should match', () => {
        checkIdConsistency(
            mtx3Commands.downlink,
            mtx3Message.downlink,
            MTX3_MESSAGE_DOWNLINK_PATH
        );
    });

    test('mtx3 uplink IDs should match', () => {
        checkIdConsistency(
            mtx3Commands.uplink,
            mtx3Message.uplink,
            MTX3_MESSAGE_UPLINK_PATH
        );
    });

    test('obis-observer downlink IDs should match', () => {
        checkIdConsistency(
            obisObserverCommands.downlink,
            obisObserverMessage.downlink,
            OBIS_OBSERVER_MESSAGE_DOWNLINK_PATH
        );
    });

    test('obis-observer uplink IDs should match', () => {
        checkIdConsistency(
            obisObserverCommands.uplink,
            obisObserverMessage.uplink,
            OBIS_OBSERVER_MESSAGE_UPLINK_PATH
        );
    });

    test('analog-ultrasound downlink IDs should match', () => {
        checkIdConsistency(
            analogUltrasoundCommands.downlink,
            analogUltrasoundMessage.downlink,
            ANALOG_ULTRASOUND_MESSAGE_DOWNLINK_PATH
        );
    });

    test('analog-ultrasound uplink IDs should match', () => {
        checkIdConsistency(
            analogUltrasoundCommands.uplink,
            analogUltrasoundMessage.uplink,
            ANALOG_ULTRASOUND_MESSAGE_UPLINK_PATH
        );
    });

    test('plc downlink IDs should match', () => {
        checkIdConsistency(
            plcCommands.downlink,
            mergeMessageMaps(plcModemDownlink, plcConnectionDownlink),
            PLC_MESSAGE_DOWNLINK_PATH
        );
    });

    test('plc uplink IDs should match', () => {
        checkIdConsistency(
            plcCommands.uplink,
            mergeMessageMaps(plcModemUplink, plcConnectionUplink),
            PLC_MESSAGE_UPLINK_PATH
        );
    });

    test('analog uplink/downlink IDs should match', () => {
        checkUplinkDownlinkConsistency(analogCommands.uplink, analogCommands.downlink);
    });

    test('mtx1 uplink/downlink IDs should match', () => {
        checkUplinkDownlinkConsistency(mtx1Commands.uplink, mtx1Commands.downlink);
    });

    test('mtx3 uplink/downlink IDs should match', () => {
        checkUplinkDownlinkConsistency(mtx3Commands.uplink, mtx3Commands.downlink);
    });

    test('analog-ultrasound uplink/downlink IDs should match', () => {
        checkUplinkDownlinkConsistency(analogUltrasoundCommands.uplink, analogUltrasoundCommands.downlink);
    });

    test('analog command file names should match imported commands', () => {
        checkCommandNamesConsistency(ANALOG_DOWNLINK_PATH, ANALOG_DOWNLINK_INDEX_PATH, analogCommands.downlink);
        checkCommandNamesConsistency(ANALOG_UPLINK_PATH, ANALOG_UPLINK_INDEX_PATH, analogCommands.uplink);
    });

    test('mtx1 command file names should match imported commands', () => {
        checkCommandNamesConsistency(MTX1_DOWNLINK_PATH, MTX1_DOWNLINK_INDEX_PATH, mtx1Commands.downlink);
        checkCommandNamesConsistency(MTX1_UPLINK_PATH, MTX1_UPLINK_INDEX_PATH, mtx1Commands.uplink);
    });

    test('obis-observer command file names should match imported commands', () => {
        checkCommandNamesConsistency(OBIS_OBSERVER_DOWNLINK_PATH, OBIS_OBSERVER_DOWNLINK_INDEX_PATH, obisObserverCommands.downlink);
        checkCommandNamesConsistency(OBIS_OBSERVER_UPLINK_PATH, OBIS_OBSERVER_UPLINK_INDEX_PATH, obisObserverCommands.uplink);
    });

    test('mtx3 command file names should match imported commands', () => {
        checkCommandNamesConsistency(MTX3_DOWNLINK_PATH, MTX3_DOWNLINK_INDEX_PATH, mtx3Commands.downlink);
        checkCommandNamesConsistency(MTX3_UPLINK_PATH, MTX3_UPLINK_INDEX_PATH, mtx3Commands.uplink);
    });

    test('analog-ultrasound command file names should match imported commands', () => {
        checkCommandNamesConsistency(
            ANALOG_ULTRASOUND_DOWNLINK_PATH,
            ANALOG_ULTRASOUND_DOWNLINK_INDEX_PATH,
            analogUltrasoundCommands.downlink
        );
        checkCommandNamesConsistency(
            ANALOG_ULTRASOUND_UPLINK_PATH,
            ANALOG_ULTRASOUND_UPLINK_INDEX_PATH,
            analogUltrasoundCommands.uplink
        );
    });

    test('plc command file names should match imported commands', () => {
        checkCommandNamesConsistency(PLC_DOWNLINK_PATH, PLC_DOWNLINK_INDEX_PATH, plcCommands.downlink);
        checkCommandNamesConsistency(PLC_UPLINK_PATH, PLC_UPLINK_INDEX_PATH, plcCommands.uplink);
    });
});
