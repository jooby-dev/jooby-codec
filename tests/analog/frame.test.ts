import * as frame from '../../src/analog/utils/frame.js';
import * as downlinkMessage from '../../src/analog/message/downlink.js';
import * as downlinkCommands from '../../src/analog/commands/downlink/index.js';
import getHexFromBytes from '../../src/utils/getHexFromBytes.js';
import getBytesFromHex from '../../src/utils/getBytesFromHex.js';


const command1 = {
    bytes: [0x02, 0x05, 0x4e, 0x2b, 0xbd, 0x98, 0xad],
    headerSize: 2,
    id: downlinkCommands.setTime2000.id,
    name: 'setTime2000',
    parameters: {sequenceNumber: 78, seconds: 733845677}
};
const command2 = {
    bytes: [0x03, 0x07, 0x0a, 0x00, 0x64, 0x0c, 0x96, 0x00, 0xe9],
    id: 0x03,
    headerSize: 2,
    name: 'setParameter',
    parameters: {
        id: 10,
        name: 'BATTERY_DEPASSIVATION_INFO',
        data: {
            loadTime: 100,
            internalResistance: 3222,
            lowVoltage: 233
        }
    }
};


describe('frame validation', () => {
    test('test valid frame', () => {
        const messageBytes = downlinkMessage.toBytes([command1, command2]);
        expect(getHexFromBytes(messageBytes)).toBe('02 05 4e 2b bd 98 ad 03 07 0a 00 64 0c 96 00 e9 a6');

        const frameBytes = frame.toBytes(messageBytes);
        expect(getHexFromBytes(frameBytes)).toBe('7e 02 05 4e 2b bd 98 ad 03 07 0a 00 64 0c 96 00 e9 a6 8a 94 7e');
    });

    test('test invalid frame', () => {
        const frameBytes = getBytesFromHex('7e 02 05 4e 2b bd 98 ab 03 07 0a 00 64 0c 96 00 e9 a6 8a 94 7e');
        const parsedFrame = frame.fromBytes(frameBytes);

        if ( 'error' in parsedFrame ) {
            expect(parsedFrame.error).toBe('Mismatch CRC.');
        } else {
            throw new Error('Field error should be present!');
        }
    });
});

describe('getCommands', () => {
    test('test valid input', () => {
        const frameBytes = getBytesFromHex('7e 02 05 4e 2b bd 98 ad 03 07 0a 00 64 0c 96 00 e9 a6 8a 94 7e');
        const parsedFrame = frame.fromBytes(frameBytes);

        if ( 'payload' in parsedFrame ) {
            const parsedMessage = downlinkMessage.fromBytes(parsedFrame.payload);

            if ( 'error' in parsedMessage ) {
                throw new Error('Field error should be missing!');
            } else {
                expect(getHexFromBytes(parsedMessage.bytes)).toBe('02 05 4e 2b bd 98 ad 03 07 0a 00 64 0c 96 00 e9 a6');
                expect(parsedMessage.commands).toStrictEqual([command1, command2]);
            }
        } else {
            throw new Error('Field bytes should be present!');
        }
    });
});
