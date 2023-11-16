/* eslint-disable no-multi-spaces */
import CommandBinaryBuffer from '../../src/mtx/CommandBinaryBuffer.js';


const deviceTypes = [
    {type: 'MTX 1A10.DF.2L0-B4',   revision: 0x08, meterType: 1, hex: '00 11 21 46 21 81 2c 00 01'},
    {type: 'MTX 1A10.DF.2L0-BD4',  revision: 0x0a, meterType: 0, hex: '00 11 21 46 21 a1 21 c0 00'},
    {type: 'MTX 1A10.DF.2L0-C4',   revision: 0x08, meterType: 0, hex: '00 11 21 46 21 81 3c 00 00'},
    {type: 'MTX 1A10.DF.2L0-CD4',  revision: 0x07, meterType: 0, hex: '00 11 21 46 21 71 31 c0 00'},
    {type: 'MTX 1A10.DF.2L0-CD4',  revision: 0x0b, meterType: 0, hex: '00 11 21 46 21 b1 31 c0 00'},
    {type: 'MTX 1A10.DF.2L0-CO4',  revision: 0x06, meterType: 0, hex: '00 11 21 46 21 61 37 c0 00'},
    {type: 'MTX 1A10.DF.2L0-CO4',  revision: 0x08, meterType: 0, hex: '00 11 21 46 21 81 37 c0 00'},
    {type: 'MTX 1A10.DF.2L0-F4',   revision: 0x08, meterType: 0, hex: '00 11 21 46 21 81 9c 00 00'},
    {type: 'MTX 1A10.DF.2L0-FD4',  revision: 0x07, meterType: 0, hex: '00 11 21 46 21 71 91 c0 00'},
    {type: 'MTX 1A10.DF.2L0-FD4',  revision: 0x0b, meterType: 0, hex: '00 11 21 46 21 b1 91 c0 00'},
    {type: 'MTX 1A10.DF.2L0-O4',   revision: 0x0a, meterType: 0, hex: '00 11 21 46 21 a1 7c 00 00'},
    {type: 'MTX 1A10.DF.2L0-P4',   revision: 0x08, meterType: 0, hex: '00 11 21 46 21 81 5c 00 00'},
    {type: 'MTX 1A10.DF.2L0-PD4',  revision: 0x07, meterType: 0, hex: '00 11 21 46 21 71 51 c0 00'},
    {type: 'MTX 1A10.DF.2L0-PD4',  revision: 0x0a, meterType: 0, hex: '00 11 21 46 21 a1 51 c0 00'},
    {type: 'MTX 1A10.DF.2L0-PD4',  revision: 0x0b, meterType: 0, hex: '00 11 21 46 21 b1 51 c0 00'},
    {type: 'MTX 1A10.DF.2L0-PO4',  revision: 0x06, meterType: 0, hex: '00 11 21 46 21 61 57 c0 00'},
    {type: 'MTX 1A10.DF.2L0-PO4',  revision: 0x07, meterType: 0, hex: '00 11 21 46 21 71 57 c0 00'},
    {type: 'MTX 1A10.DF.2L0-PO4',  revision: 0x08, meterType: 0, hex: '00 11 21 46 21 81 57 c0 00'},
    {type: 'MTX 1A10.DF.2L0-PO4',  revision: 0x09, meterType: 0, hex: '00 11 21 46 21 91 57 c0 00'},
    {type: 'MTX 1A10.DF.2L0-Y4',   revision: 0x08, meterType: 0, hex: '00 11 21 46 21 81 cc 00 00'},
    {type: 'MTX 1A10.DF.2L0-YBD4', revision: 0x0a, meterType: 0, hex: '00 11 21 46 21 a1 c2 1c 00'},
    {type: 'MTX 1A10.DF.2L0-YD4',  revision: 0x07, meterType: 0, hex: '00 11 21 46 21 71 c1 c0 00'},
    {type: 'MTX 1A10.DF.2L0-YD4',  revision: 0x0a, meterType: 0, hex: '00 11 21 46 21 a1 c1 c0 00'},
    {type: 'MTX 1A10.DF.2L0-YD4',  revision: 0x0b, meterType: 0, hex: '00 11 21 46 21 b1 c1 c0 00'},
    {type: 'MTX 1A10.DF.2L0-YO4',  revision: 0x06, meterType: 0, hex: '00 11 21 46 21 61 c7 c0 00'},
    {type: 'MTX 1A10.DF.2L0-YO4',  revision: 0x07, meterType: 0, hex: '00 11 21 46 21 71 c7 c0 00'},
    {type: 'MTX 1A10.DF.2L0-YO4',  revision: 0x08, meterType: 0, hex: '00 11 21 46 21 81 c7 c0 00'},
    {type: 'MTX 1A10.DF.2L2-BO4',  revision: 0x05, meterType: 0, hex: '00 11 21 46 21 53 27 c0 00'},
    {type: 'MTX 1A10.DF.2L2-CO4',  revision: 0x05, meterType: 0, hex: '00 11 21 46 21 53 37 c0 00'},
    {type: 'MTX 1A10.DF.2L2-G4',   revision: 0x05, meterType: 0, hex: '00 11 21 46 21 53 dc 00 00'},
    {type: 'MTX 1A10.DF.2L2-GO4',  revision: 0x05, meterType: 0, hex: '00 11 21 46 21 53 d7 c0 00'},
    {type: 'MTX 1A10.DF.2L2-OF4',  revision: 0x05, meterType: 0, hex: '00 11 21 46 21 53 79 c0 00'},
    {type: 'MTX 1A10.DF.2L2-OG4',  revision: 0x05, meterType: 0, hex: '00 11 21 46 21 53 7d c0 00'},
    {type: 'MTX 1A10.DF.2L2-P',    revision: 0x05, meterType: 0, hex: '00 11 21 46 21 53 50 00 00'},
    {type: 'MTX 1A10.DF.2L2-P4',   revision: 0x05, meterType: 0, hex: '00 11 21 46 21 53 5c 00 00'},
    {type: 'MTX 1A10.DF.2L2-PO4',  revision: 0x05, meterType: 0, hex: '00 11 21 46 21 53 57 c0 00'},
    {type: 'MTX 1A10.DF.2L2-RO4',  revision: 0x05, meterType: 0, hex: '00 11 21 46 21 53 67 c0 00'},
    {type: 'MTX 1A10.DF.2L2-Y',    revision: 0x05, meterType: 0, hex: '00 11 21 46 21 53 c0 00 00'},
    {type: 'MTX 1A10.DF.2L2-Y4',   revision: 0x05, meterType: 0, hex: '00 11 21 46 21 53 cc 00 00'},
    {type: 'MTX 1A10.DF.2M2-Y4',   revision: 0x05, meterType: 0, hex: '00 11 21 46 22 53 cc 00 00'},
    {type: 'MTX 1A10.DF.2Z0-C4',   revision: 0x00, meterType: 0, hex: '00 11 21 46 23 01 3c 00 00'},
    {type: 'MTX 1A10.DF.2Z0-CD4',  revision: 0x07, meterType: 0, hex: '00 11 21 46 23 71 31 c0 00'},
    {type: 'MTX 1A10.DF.2Z0-CO4',  revision: 0x00, meterType: 0, hex: '00 11 21 46 23 01 37 c0 00'},
    {type: 'MTX 1A10.DF.2Z0-CO4',  revision: 0x06, meterType: 0, hex: '00 11 21 46 23 61 37 c0 00'},
    {type: 'MTX 1A10.DF.2Z0-Y4',   revision: 0x08, meterType: 0, hex: '00 11 21 46 23 81 cc 00 00'},
    {type: 'MTX 1A10.DF.2Z2-Y4',   revision: 0x05, meterType: 0, hex: '00 11 21 46 23 53 cc 00 00'},
    {type: 'MTX 1A10.DG.2L2-BO4',  revision: 0x05, meterType: 0, hex: '00 11 21 49 21 53 27 c0 00'},
    {type: 'MTX 1A10.DG.2L2-CO4',  revision: 0x05, meterType: 0, hex: '00 11 21 49 21 53 37 c0 00'},
    {type: 'MTX 1A10.DG.2L2-GO4',  revision: 0x05, meterType: 0, hex: '00 11 21 49 21 53 d7 c0 00'},
    {type: 'MTX 1A10.DG.2L2-OF4',  revision: 0x05, meterType: 0, hex: '00 11 21 49 21 53 79 c0 00'},
    {type: 'MTX 1A10.DG.2L2-OG4',  revision: 0x05, meterType: 0, hex: '00 11 21 49 21 53 7d c0 00'},
    {type: 'MTX 1A10.DG.2L2-P4',   revision: 0x05, meterType: 0, hex: '00 11 21 49 21 53 5c 00 00'},
    {type: 'MTX 1A10.DG.2L2-PO4',  revision: 0x05, meterType: 0, hex: '00 11 21 49 21 53 57 c0 00'},
    {type: 'MTX 1A10.DG.2L2-RO4',  revision: 0x05, meterType: 0, hex: '00 11 21 49 21 53 67 c0 00'},
    {type: 'MTX 1A10.DG.2L5-CD4',  revision: 0x0b, meterType: 0, hex: '00 11 21 49 21 b6 31 c0 00'},
    {type: 'MTX 1A10.DG.2L5-LD4',  revision: 0x0b, meterType: 0, hex: '00 11 21 49 21 b6 81 c0 00'},
    {type: 'MTX 1A10.DG.2L5-MD4',  revision: 0x0b, meterType: 0, hex: '00 11 21 49 21 b6 b1 c0 00'},
    {type: 'MTX 1A10.DG.2L5-ND1',  revision: 0x0b, meterType: 0, hex: '00 11 21 49 21 b6 e1 90 00'},
    {type: 'MTX 1A10.DG.2L5-PD4',  revision: 0x0b, meterType: 0, hex: '00 11 21 49 21 b6 51 c0 00'},
    {type: 'MTX 1A10.DG.2L5-YD4',  revision: 0x0b, meterType: 0, hex: '00 11 21 49 21 b6 c1 c0 00'},
    {type: 'MTX 1A10.DG.2L5-YMD4', revision: 0x0b, meterType: 0, hex: '00 11 21 49 21 b6 cb 1c 00'},
    {type: 'MTX 1A10.DG.2Z5-CD4',  revision: 0x0b, meterType: 0, hex: '00 11 21 49 23 b6 31 c0 00'},
    {type: 'MTX 1A10.DH.2L0-BD4',  revision: 0x0a, meterType: 0, hex: '00 11 21 47 21 a1 21 c0 00'},
    {type: 'MTX 1A10.DH.2L0-CD4',  revision: 0x07, meterType: 0, hex: '00 11 21 47 21 71 31 c0 00'},
    {type: 'MTX 1A10.DH.2L0-CD4',  revision: 0x0b, meterType: 0, hex: '00 11 21 47 21 b1 31 c0 00'},
    {type: 'MTX 1A10.DH.2L0-CO4',  revision: 0x06, meterType: 0, hex: '00 11 21 47 21 61 37 c0 00'},
    {type: 'MTX 1A10.DH.2L0-CO4',  revision: 0x08, meterType: 0, hex: '00 11 21 47 21 81 37 c0 00'},
    {type: 'MTX 1A10.DH.2L0-FD4',  revision: 0x0b, meterType: 0, hex: '00 11 21 47 21 b1 91 c0 00'},
    {type: 'MTX 1A10.DH.2L0-P4',   revision: 0x08, meterType: 0, hex: '00 11 21 47 21 81 5c 00 00'},
    {type: 'MTX 1A10.DH.2L0-PD4',  revision: 0x07, meterType: 0, hex: '00 11 21 47 21 71 51 c0 00'},
    {type: 'MTX 1A10.DH.2L0-PD4',  revision: 0x0b, meterType: 0, hex: '00 11 21 47 21 b1 51 c0 00'},
    {type: 'MTX 1A10.DH.2L0-PO4',  revision: 0x06, meterType: 0, hex: '00 11 21 47 21 61 57 c0 00'},
    {type: 'MTX 1A10.DH.2L0-PO4',  revision: 0x07, meterType: 0, hex: '00 11 21 47 21 71 57 c0 00'},
    {type: 'MTX 1A10.DH.2L0-PO4',  revision: 0x08, meterType: 0, hex: '00 11 21 47 21 81 57 c0 00'},
    {type: 'MTX 1A10.DH.2L0-Y4',   revision: 0x08, meterType: 0, hex: '00 11 21 47 21 81 cc 00 00'},
    {type: 'MTX 1A10.DH.2L0-YBD4', revision: 0x0a, meterType: 0, hex: '00 11 21 47 21 a1 c2 1c 00'},
    {type: 'MTX 1A10.DH.2L0-YD4',  revision: 0x07, meterType: 0, hex: '00 11 21 47 21 71 c1 c0 00'},
    {type: 'MTX 1A10.DH.2L0-YD4',  revision: 0x0a, meterType: 0, hex: '00 11 21 47 21 a1 c1 c0 00'},
    {type: 'MTX 1A10.DH.2L0-YD4',  revision: 0x0b, meterType: 0, hex: '00 11 21 47 21 b1 c1 c0 00'},
    {type: 'MTX 1A10.DH.2L0-YO4',  revision: 0x06, meterType: 0, hex: '00 11 21 47 21 61 c7 c0 00'},
    {type: 'MTX 1A10.DH.2L0-YO4',  revision: 0x07, meterType: 0, hex: '00 11 21 47 21 71 c7 c0 00'},
    {type: 'MTX 1A10.DH.2L0-YO4',  revision: 0x08, meterType: 0, hex: '00 11 21 47 21 81 c7 c0 00'},
    {type: 'MTX 1A10.DH.2L2-CO4',  revision: 0x05, meterType: 0, hex: '00 11 21 47 21 53 37 c0 00'},
    {type: 'MTX 1A10.DH.2L2-G4',   revision: 0x05, meterType: 0, hex: '00 11 21 47 21 53 dc 00 00'},
    {type: 'MTX 1A10.DH.2L2-GO4',  revision: 0x05, meterType: 0, hex: '00 11 21 47 21 53 d7 c0 00'},
    {type: 'MTX 1A10.DH.2L2-OE4',  revision: 0x05, meterType: 0, hex: '00 11 21 47 21 53 74 c0 00'},
    {type: 'MTX 1A10.DH.2L2-OF4',  revision: 0x05, meterType: 0, hex: '00 11 21 47 21 53 79 c0 00'},
    {type: 'MTX 1A10.DH.2L2-OG4',  revision: 0x05, meterType: 0, hex: '00 11 21 47 21 53 7d c0 00'},
    {type: 'MTX 1A10.DH.2L2-P',    revision: 0x05, meterType: 0, hex: '00 11 21 47 21 53 50 00 00'},
    {type: 'MTX 1A10.DH.2L2-P4',   revision: 0x05, meterType: 0, hex: '00 11 21 47 21 53 5c 00 00'},
    {type: 'MTX 1A10.DH.2L2-PO4',  revision: 0x05, meterType: 0, hex: '00 11 21 47 21 53 57 c0 00'},
    {type: 'MTX 1A10.DH.2L2-RO4',  revision: 0x05, meterType: 0, hex: '00 11 21 47 21 53 67 c0 00'},
    {type: 'MTX 1A10.DH.2L2-Y',    revision: 0x05, meterType: 0, hex: '00 11 21 47 21 53 c0 00 00'},
    {type: 'MTX 1A10.DH.2L2-Y4',   revision: 0x05, meterType: 0, hex: '00 11 21 47 21 53 cc 00 00'},
    {type: 'MTX 1A10.DH.2Z0-C4',   revision: 0x00, meterType: 0, hex: '00 11 21 47 23 01 3c 00 00'},
    {type: 'MTX 1A10.DH.2Z0-CO4',  revision: 0x00, meterType: 0, hex: '00 11 21 47 23 01 37 c0 00'},
    {type: 'MTX 1G05.DH.2L2-DOB4', revision: 0x0b, meterType: 0, hex: '00 12 16 47 21 b3 17 2c 00'},
    {type: 'MTX 1G10.DG.2L5-YMD4', revision: 0x0b, meterType: 0, hex: '00 12 21 49 21 b6 cb 1c 00'},
    {type: 'MTX 1G10.DH.2L2-DOB4', revision: 0x0b, meterType: 0, hex: '00 12 21 47 21 b3 17 2c 00'},
    {type: 'MTX 1G10.DH.2L2-DOG4', revision: 0x0b, meterType: 0, hex: '00 12 21 47 21 b3 17 dc 00'},
    {type: 'MTX 1G10.DH.2L2-OB4',  revision: 0x05, meterType: 0, hex: '00 12 21 47 21 53 72 c0 00'},
    {type: 'MTX 1G10.DH.2L2-OE4',  revision: 0x05, meterType: 0, hex: '00 12 21 47 21 53 74 c0 00'},
    {type: 'MTX 1G10.DH.2L2-OG4',  revision: 0x05, meterType: 0, hex: '00 12 21 47 21 53 7d c0 00'},
    {type: 'MTX 1G10.DH.2L2-OGD4', revision: 0x05, meterType: 1, hex: '00 12 21 47 21 53 7d 1c 01'}
];


describe(`MTX device types (${deviceTypes.length})`, () => {
    deviceTypes.forEach(({type, revision, meterType, hex}) => {
        test(type, () => {
            let buffer = new CommandBinaryBuffer(hex);
            const deviceType = buffer.getDeviceType();

            expect(deviceType.type).toBe(type);
            expect(deviceType.revision).toBe(revision);

            // reverse
            buffer = new CommandBinaryBuffer(9);
            buffer.setDeviceType({type, revision, meterType});

            expect(buffer.toHex()).toBe(hex);
        });
    });
});
