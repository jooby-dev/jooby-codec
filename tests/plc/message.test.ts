import {describe, expect, test} from '@jest/globals';

import * as plcMessage from '../../src/plc/utils/message.js';
import * as mtx1Uplink from '../../src/mtx1/message/uplink.js';
import * as mtx3Uplink from '../../src/mtx3/message/uplink.js';
import * as mtx1Commands from '../../src/mtx1/commands/uplink/index.js';
import * as mtx3Commands from '../../src/mtx3/commands/uplink/index.js';
import * as subsystemIds from '../../src/plc/constants/subsystemIds.js';
import {ICommand} from '../../src/mtx1/utils/command.js';


const aesKey = [...Array(16).keys()];

const getValidExample = ( example: object ): ICommand & {accessLevel: number} => {
    if ( !('id' in example) || typeof (example as ICommand).accessLevel !== 'number' ) {
        throw new Error('expected a valid command example');
    }

    return example as ICommand & {accessLevel: number};
};


describe('PLC MTX type', () => {
    test('bytesFromMessage uses mtx3 codec when mtxType is mtx3', () => {
        const example = getValidExample(mtx3Commands.getEnergy.examples['simple response']);
        const commands = [{
            id: example.id,
            parameters: example.parameters,
            accessLevel: example.accessLevel
        }];
        const options = {
            accessLevel: example.accessLevel,
            aesKey,
            messageId: 1
        };

        const plcBytes = plcMessage.bytesFromMessage(commands, false, subsystemIds.MTX, {
            ...options,
            mtxType: 'mtx3'
        });

        expect(plcBytes).toEqual(mtx3Uplink.bytesFromMessage(commands, options));
    });

    test('messageFromBlock decodes mtx3 payload when mtxType is mtx3', () => {
        const example = getValidExample(mtx3Commands.getEnergy.examples['simple response']);
        const commands = [{
            id: example.id,
            parameters: example.parameters,
            accessLevel: example.accessLevel
        }];
        const payload = plcMessage.bytesFromMessage(commands, false, subsystemIds.MTX, {
            accessLevel: example.accessLevel,
            aesKey,
            messageId: 1,
            mtxType: 'mtx3'
        });

        expect(payload).toBeDefined();

        if ( !payload ) {
            throw new Error('expected encoded MTX3 payload');
        }

        const decoded = plcMessage.messageFromBlock(
            {
                kind: 'subsystem',
                id: 1,
                isDownlink: false,
                shortAddress: 1,
                hop: 0,
                isEndDevice: true,
                subsystemId: subsystemIds.MTX,
                dataAttributes: 0,
                accessLevel: example.accessLevel,
                messageId: 1,
                payload
            },
            {mtxType: 'mtx3', aesKey}
        );

        expect(decoded).toMatchObject({
            commands: [
                {
                    id: example.id,
                    parameters: example.parameters
                }
            ]
        });
    });

    test('bytesFromMessage defaults to mtx1', () => {
        const example = getValidExample(mtx1Commands.getEnergy.examples['default A+ energy']);
        const commands = [{
            id: example.id,
            parameters: example.parameters,
            accessLevel: example.accessLevel
        }];
        const options = {
            accessLevel: example.accessLevel,
            aesKey,
            messageId: 1
        };

        expect(plcMessage.bytesFromMessage(commands, false, subsystemIds.MTX, options))
            .toEqual(mtx1Uplink.bytesFromMessage(commands, options));
    });

    test('messageFromBlock defaults to mtx1', () => {
        const example = getValidExample(mtx1Commands.getEnergy.examples['default A+ energy']);
        const commands = [{
            id: example.id,
            parameters: example.parameters,
            accessLevel: example.accessLevel
        }];
        const payload = plcMessage.bytesFromMessage(commands, false, subsystemIds.MTX, {
            accessLevel: example.accessLevel,
            aesKey,
            messageId: 1
        });

        expect(payload).toBeDefined();

        if ( !payload ) {
            throw new Error('expected encoded MTX1 payload');
        }

        const decoded = plcMessage.messageFromBlock(
            {
                kind: 'subsystem',
                id: 1,
                isDownlink: false,
                shortAddress: 1,
                hop: 0,
                isEndDevice: true,
                subsystemId: subsystemIds.MTX,
                dataAttributes: 0,
                accessLevel: example.accessLevel,
                messageId: 1,
                payload
            },
            {aesKey}
        );

        expect(decoded).toMatchObject({
            commands: [
                {
                    id: example.id,
                    parameters: example.parameters
                }
            ]
        });
    });
});
