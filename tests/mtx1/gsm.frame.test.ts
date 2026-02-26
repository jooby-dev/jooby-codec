/* eslint-disable max-len */
import getBytesFromHex from '../../src/utils/getBytesFromHex.js';
import {Collector, Parameters} from '../../src/mtx1/utils/gsmParameters.js';
import * as gsmBlocks from './helpers/gsmBlocks.js';


interface IGsmFrameTestData {
    frames: Array<string>,
    parameters: Parameters
}

const testsData: Array<IGsmFrameTestData> = [
    {
        parameters: {
            type: 'configuration',
            data: {
                blockVersion: 22,
                configurationId: 0,
                gsmAccessTypes: 2,
                gprsAccessPoint: 'STATICIP',
                gprsUserName: '',
                gprsPassword: '',
                commandServerPort: 15820,
                activityServerPort: 16820,
                activityPingIntervalSec: 1280,
                activityPingIp: [0, 0, 0, 0],
                activityPingPort: 1234
            }
        },
        frames: [
            '7e51fffec7bf017d339e7d5ebfa7a5870bfa6edb80e59bd10ad820ebbb4f913a9eec07b0f11874d2d815c6a13b37878f5b826f4f8162a1c8d879c6a13b37878f5b826f4f8162a1c8d8798e745708bb253d2dd8483cd2d2e27d31a5276e7e',
            '7e51fffec7bf027d339dea5a67166c49322657c26745acb7ee52d47cbca6d3bbd63f02a4b19708ecccc6a13b37878f5b826f4f8162a1c8d879c6a13b37878f5b826f4f8162a1c8d87905b9e9af4bff276749e59c980dcc628e27f47e'
        ]
    },
    {
        parameters: {
            type: 'configuration',
            data: {
                blockVersion: 18,
                configurationId: 1771925753,
                gsmAccessTypes: 2,
                gprsAccessPoint: 'INTERNET',
                gprsUserName: '',
                gprsPassword: '',
                commandServerPort: 15829,
                activityServerPort: 0,
                activityPingIntervalSec: 0,
                activityPingIp: [0, 0, 0, 0],
                activityPingPort: 0
            }
        },
        frames: [
            '7e505dfcffff021266f4dde276eb74577f65f665580c5ce1dacd96acaba39d4c87c73751dfcf0890c6a13b37878f5b826f4f8162a1c8d879c6a13b37878f5b826f4f8162a1c8d879957d333a44c1da2cdd5129a2473936569feba37e',
            '7e505dfcffff0312ca0b50630ab39747d6c398ccb5b401e0e7d1bf4184deeefff7e6ecdadd74eaa1c6a13b37878f5b826f4f8162a1c8d879c6a13b37878f5b826f4f8162a1c8d879eb59aa26ab6155234d6436ed84afa825d3777e'
        ]
    },
    {
        parameters: {
            type: 'configuration',
            data: {
                blockVersion: 18,
                configurationId: 1771925753,
                gsmAccessTypes: 2,
                gprsAccessPoint: 'INTERNET',
                gprsUserName: '',
                gprsPassword: '',
                commandServerPort: 15829,
                activityServerPort: 0,
                activityPingIntervalSec: 0,
                activityPingIp: [0, 0, 0, 0],
                activityPingPort: 0
            }
        },
        frames: [
            '7e51ffff5dfc017d33a89e0f0e175d7d3157400e957657500ed1dacd96acaba39d4c87c73751dfcf0890c6a13b37878f5b826f4f8162a1c8d879c6a13b37878f5b826f4f8162a1c8d879957d333a44c1da2cdd5129a2473936569f335d7e',
            '7e51ffff5dfc027d3392a8ffcd95f07d5ee8dce8a607f02561d8e7d1bf4184deeefff7e6ecdadd74eaa1c6a13b37878f5b826f4f8162a1c8d879c6a13b37878f5b826f4f8162a1c8d879eb59aa26ab6155234d6436ed84afa825323c7e'
        ]
    },
    {
        parameters: {
            type: 'status',
            data: {
                version: 18,
                data: {
                    hardwareVersion: {major: 17, minor: 2},
                    softwareVersion: {major: 1, minor: 2},
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
                    ip: [77, 52, 159, 99],
                    rssi: 14,
                    ber: 0,
                    lastErrorStatus: 0,
                    mtxState: 5,
                    gsmState: 4,
                    tcpState: 5,
                    maxMtxRequestCount: 0,
                    mtxErrorCount: 0,
                    maxTcpRequestCount: 0,
                    tcpErrorCount: 37160
                }
            }
        },
        frames: [
            '7e51ffff446b037d33d666cf8e98a986480b6adb56f3a4906d86e27d5ee0cdec7af223ca3e3efec79ed9743c08d824bba2ddb163c8e03ef3afa669b8e77c8933b93c7d5ede99416a9826ee603bed5b3773f94216c8ab5ad70ef68ebcfd7e'
        ]
    }
];


describe('gsm frames', () => {
    const testGsmFrames = ( {frames, parameters}: IGsmFrameTestData ) => {
        const bytes = frames.map(getBytesFromHex);
        const blocks = bytes.map(gsmBlocks.fromFrame);
        const collector = new Collector();
        const actualParameters = gsmBlocks.collect(collector, blocks);

        expect(actualParameters).toStrictEqual(parameters);
    };

    test('test gsm frames', () => testsData.forEach(testGsmFrames));
});
