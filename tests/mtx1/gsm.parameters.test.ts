/* eslint-disable max-len */
import * as types from '../../src/mtx1/types.js';
import getHexFromBytes from '../../src/utils/getHexFromBytes.js';
import {Collector, split, Parameters} from '../../src/mtx1/utils/gsmParameters.js';
import * as gsmBlocks from './helpers/gsmBlocks.js';


describe('gsm parameters', () => {
    const testGsmParameters = (
        isDownlink: boolean,
        originalParameters: Parameters,
        expectedBlockNumber: types.TUint8
    ) => {
        const originalBlocks = split(originalParameters);

        expect(originalBlocks.length).toBe(expectedBlockNumber);

        const frames = gsmBlocks.toFrames(isDownlink, originalBlocks);

        frames.forEach( value => (
            console.log(`[${value.length}] ${getHexFromBytes(value, {separator: ''})}`)
        ));

        const restoredBlocks = frames.map(gsmBlocks.fromFrame);
        const collector = new Collector();
        const restoredParameters = gsmBlocks.collect(collector, restoredBlocks);

        expect(restoredParameters).toStrictEqual(originalParameters);
    };

    test('gsm status', () => {
        const status: Parameters = {
            type: 'status',
            data: {
                version: 18,
                data: {
                    hardwareVersion: {
                        major: 17,
                        minor: 2
                    },
                    softwareVersion: {
                        major: 1,
                        minor: 2
                    },
                    uptime: 40,
                    allocatedMessageCount: 1,
                    allocatedDataBlockCount: 1,
                    attributes: {
                        MESSAGE_SYSTEM_LOCKED: false,
                        OPERATION_ERROR_PRESENT: false,
                        SAVE_PARAMETERS_NOT_SUPPORTED: false,
                        USING_METER_CONFIGURATION: true,
                        CONFIGURATION_DATA_SAVED: false,
                        DEVICE_LONG_ADDRESS_SET: true,
                        DEVICE_SHORT_ADDRESS_SET: true,
                        DEVICE_CONFIGURATION_RECEIVED: true,
                        CONFIGURATION_SAVE_REQUIRED: false,
                        CONFIGURATION_VALID: false,
                        READY_FOR_OPERATION: true
                    },
                    ip: [
                        77,
                        52,
                        159,
                        99
                    ],
                    rssi: 14,
                    ber: 0,
                    lastErrorStatus: 0,
                    INTCON1: 0,
                    INTCON2: 0,
                    lastErrorRCON: 3,
                    lastErrorINTTREG: 0,
                    mtxState: 5,
                    gsmState: 4,
                    tcpState: 5,
                    maxMtxRequestCount: 0,
                    mtxErrorCount: 0,
                    maxTcpRequestCount: 0,
                    tcpErrorCount: 37160
                }
            }
        };
        const expectedBlockNumber = 1;

        testGsmParameters(false, status, expectedBlockNumber);
    });

    test('get gsm configuration', () => {
        const configuration: Parameters = {
            type: 'configuration',
            data: {
                blockVersion: 22,
                configurationId: 0,
                gsmAccessTypes: 2,
                gprsAccessPoint: 'STATIC',
                gprsUserName: '',
                gprsPassword: '',
                commandServerPort: 15820,
                activityServerPort: 16820,
                activityPingIntervalSec: 1280,
                activityPingIp: [0x12, 0x34, 0x56, 0x78],
                activityPingPort: 1234
            }
        };
        const expectedBlockNumber = 2;

        testGsmParameters(false, configuration, expectedBlockNumber);
    });

    test('set gsm configuration', () => {
        const configuration: Parameters = {
            type: 'configuration',
            data: {
                blockVersion: 22,
                configurationId: 0,
                gsmAccessTypes: 2,
                gprsAccessPoint: 'STATIC',
                gprsUserName: '',
                gprsPassword: '',
                commandServerPort: 15820,
                activityServerPort: 16820,
                activityPingIntervalSec: 1280,
                activityPingIp: [0x12, 0x34, 0x56, 0x78],
                activityPingPort: 1234
            }
        };
        const expectedBlockNumber = 2;

        testGsmParameters(true, configuration, expectedBlockNumber);
    });
});
