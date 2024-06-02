/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
// @ts-nocheck
import {commands as analogCommands} from '../src/analog/index.js';
import {commands as mtxCommands} from '../src/mtx/index.js';
import {commands as obisObserverCommands} from '../src/obis-observer/index.js';
import * as analogMessage from '../src/analog/message/index.js';
import * as mtxMessage from '../src/mtx/message/index.js';
import * as obisObserverMessage from '../src/obis-observer/message/index.js';


const getCommandIdsFromCommandsImport = commandsData => Object.values(commandsData).map(({id}) => id);

const getCommandIdsFromMessageImport = messageData => {
    const result = {};

    ['toBytesMap', 'fromBytesMap', 'nameMap'].forEach(key => {
        result[key] = Object.keys(messageData[key]).map(Number);
    });

    return result;
};

const checkIdConsistency = ( commandIds, messageIds ) => {
    commandIds.forEach(id => {
        expect(messageIds.toBytesMap).toContain(id);
        expect(messageIds.fromBytesMap).toContain(id);
        expect(messageIds.nameMap).toContain(id);
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


describe('commands consistency', () => {
    test('analog downlink IDs should match', () => {
        checkIdConsistency(
            getCommandIdsFromCommandsImport(analogCommands.downlink),
            getCommandIdsFromMessageImport(analogMessage.downlink)
        );
    });

    test('analog uplink IDs should match', () => {
        checkIdConsistency(
            getCommandIdsFromCommandsImport(analogCommands.uplink),
            getCommandIdsFromMessageImport(analogMessage.uplink)
        );
    });

    test('mtx downlink IDs should match', () => {
        checkIdConsistency(
            getCommandIdsFromCommandsImport(mtxCommands.downlink),
            getCommandIdsFromMessageImport(mtxMessage.downlink)
        );
    });

    test('mtx uplink IDs should match', () => {
        checkIdConsistency(
            getCommandIdsFromCommandsImport(mtxCommands.uplink),
            getCommandIdsFromMessageImport(mtxMessage.uplink)
        );
    });

    test('obis-observer downlink IDs should match', () => {
        checkIdConsistency(
            getCommandIdsFromCommandsImport(obisObserverCommands.downlink),
            getCommandIdsFromMessageImport(obisObserverMessage.downlink)
        );
    });

    test('obis-observer uplink IDs should match', () => {
        checkIdConsistency(
            getCommandIdsFromCommandsImport(obisObserverCommands.uplink),
            getCommandIdsFromMessageImport(obisObserverMessage.uplink)
        );
    });

    test('analog uplink/downlink IDs should match', () => {
        checkUplinkDownlinkConsistency(analogCommands.uplink, analogCommands.downlink);
    });

    test('mtx uplink/downlink IDs should match', () => {
        checkUplinkDownlinkConsistency(mtxCommands.uplink, mtxCommands.downlink);
    });
});
