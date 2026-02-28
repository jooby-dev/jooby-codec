import {TUint8, TBytes} from '../../types.js';
import * as bitSet from '../../utils/bitSet.js';
import getBytesFromHex from '../../utils/getBytesFromHex.js';


export interface IMtx1DeviceTypeDescriptor extends bitSet.TBooleanObject {
    typeMeterG: boolean;
    downgradedToA: boolean;
    supportMeterInfo: boolean;
}

export interface IMtx3DeviceTypeDescriptor extends bitSet.TBooleanObject {
    typeMeterTransformer: boolean,
    typeMeterG: boolean,
    downgradedToR: boolean,

    /** shows if additional command `getMeterInfo` is supported */
    supportMeterInfo: boolean,
    reactiveByQuadrants: boolean
}

export type IMtxDeviceTypeDescriptor = ({meterType: 'mtx1'} & IMtx1DeviceTypeDescriptor) | ({meterType: 'mtx3'} & IMtx3DeviceTypeDescriptor);

export interface IDeviceType {
    /**
     * Device type.
     *
     * @example
     * 'MTX 1A10.DG.2L5-LD4'
     */
    type: string,

    /**
     * Device revision.
     *
     * @example
     * 0x0b
     */
    revision?: TUint8,

    descriptor?: IMtxDeviceTypeDescriptor
}

const DEVICE_TYPE_SIZE = 8;
const DEVICE_TYPE_INVALID_CHAR = 'x';
const nibbles1 = ['.', '1', '3', 'R', 'M'];
const nibbles2 = ['.', 'A', 'G', 'R', 'T', 'D'];
const nibbles3 = ['.', '0', '1', '2', '3', '4', '5'];
const nibbles4 = ['.', 'A', 'B', 'C', 'D', 'E', 'F'];
const nibbles5 = ['.', 'A', 'B', 'C', 'D', 'E', 'F', 'H', 'K', 'G'];
const nibbles6 = ['.', '1', '2', '3', '4'];
const nibbles7 = ['.', 'L', 'M', 'Z', 'K'];
const nibbles8 = ['.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const nibbles9 = ['.', 'D', 'B', 'C', 'E', 'P', 'R', 'O', 'L', 'F', 'S', 'M', 'Y', 'G', 'N', 'U'];
const nibbles10 = ['.', '0', '1', '2', '3', '4', '5', '6', 'P', 'R', 'L', 'E', 'G', '-', '/'];
const nibbles11 = ['.', 'H', 'A', 'T', '0', '0', '0', '0', '0', '1', '2', '3', '4', '0', '0', '0'];
const nibbles12 = ['.', '0', '1', '2', '3', '4', '5', '6', '7', '8', 'I', 'X', 'G', 'W', 'M', '-'];

const mtx1DeviceTypeDescriptorMask = {
    typeMeterG: 1 << 0,
    downgradedToA: 1 << 4,
    supportMeterInfo: 1 << 6
};

const mtx3DeviceTypeDescriptorMask = {
    typeMeterTransformer: 1 << 0,
    downgradedToR: 1 << 3,
    typeMeterG: 1 << 4,
    supportMeterInfo: 1 << 6,
    reactiveByQuadrants: 1 << 7
};

const mtx1DeviceTypeDescriptorFromByte = ( byte: number ): IMtxDeviceTypeDescriptor => ({
    meterType: 'mtx1',
    ...bitSet.toObject(mtx1DeviceTypeDescriptorMask, byte)
} as IMtxDeviceTypeDescriptor);

const mtx1DeviceTypeDescriptorToByte = ( descriptor: IMtx1DeviceTypeDescriptor ): number => (
    bitSet.fromObject(mtx1DeviceTypeDescriptorMask, descriptor)
);

// In the MTX1 protocol, the meter is of type G when the corresponding bit is set to 1.
// In the MTX3 protocol, the meter is of type G when the corresponding bit is set to 0.
// To use the same field name across both protocols, the bit must be inverted for MTX3.
const mtx3DeviceTypeDescriptorFromByte = ( byte: number ): IMtxDeviceTypeDescriptor => {
    const descriptor: IMtx3DeviceTypeDescriptor = bitSet.toObject(mtx3DeviceTypeDescriptorMask, byte) as IMtx3DeviceTypeDescriptor;

    return {
        meterType: 'mtx3',
        ...descriptor,
        typeMeterG: !descriptor.typeMeterG
    } as IMtxDeviceTypeDescriptor;
};

// In the MTX1 protocol, the meter is of type G when the corresponding bit is set to 1.
// In the MTX3 protocol, the meter is of type G when the corresponding bit is set to 0.
// To use the same field name across both protocols, the bit must be inverted for MTX3.
const mtx3DeviceTypeDescriptorToByte = ( descriptor: IMtx3DeviceTypeDescriptor ): number => (
    bitSet.fromObject(mtx3DeviceTypeDescriptorMask, {
        ...descriptor,
        typeMeterG: !descriptor.typeMeterG
    })
);

const splitByte = ( byte: number ): Array<number> => [
    byte >> 4,
    byte & 0x0F
];

const splitToNibbles = ( data: TBytes ): TBytes => {
    const result: TBytes = new Array(data.length * 2).fill(0);

    data.forEach( ( byte, index ) => {
        const [high, low] = splitByte(byte);

        result[index * 2] = high;
        result[index * 2 + 1] = low;
    });

    return result;
};

const joinNibbles = ( nibbles: TBytes | Array<number> ): TBytes => {
    const hex: Array<string> = [];

    nibbles.forEach(nibble => hex.push(nibble.toString(16)));

    if ( nibbles.length & 1 ) {
        hex.push('0');
    }

    return getBytesFromHex(hex.join(''));
};

const fromBytesMtx = ( nibbles: TBytes ): IDeviceType => {
    if ( nibbles.length !== 14 && nibbles.length !== 16 ) {
        throw new Error('Device type bytes wrong size');
    }

    const type = ['MTX '];

    // 1: 1100.00.000-0000
    type.push(nibbles1[nibbles[0]] ?? DEVICE_TYPE_INVALID_CHAR);
    type.push(nibbles2[nibbles[1]] ?? DEVICE_TYPE_INVALID_CHAR);

    // 2: 0011.00.000-0000
    type.push(nibbles3[nibbles[2]] ?? DEVICE_TYPE_INVALID_CHAR);
    type.push(nibbles3[nibbles[3]] ?? DEVICE_TYPE_INVALID_CHAR);

    type.push('.');

    // 3: 0000.11.000-0000
    type.push(nibbles4[nibbles[4]] ?? DEVICE_TYPE_INVALID_CHAR);
    type.push(nibbles5[nibbles[5]] ?? DEVICE_TYPE_INVALID_CHAR);

    type.push('.');

    // 4: 0000.00.110-0000
    type.push(nibbles6[nibbles[6]] ?? DEVICE_TYPE_INVALID_CHAR);
    type.push(nibbles7[nibbles[7]] ?? DEVICE_TYPE_INVALID_CHAR);

    // 5: 0000.00.001-0000
    const revision = nibbles[8];
    type.push(nibbles8[nibbles[9]] ?? DEVICE_TYPE_INVALID_CHAR);

    type.push('-');

    // 6, 7 - some variants
    let deviceProtocolIndex: number;

    if ( nibbles.length < 14 || ( nibbles[12] === 0 && nibbles[13] === 0 ) ) {
        // 0000.00.000-11
        type.push(nibbles9[nibbles[10]] ?? DEVICE_TYPE_INVALID_CHAR);
        deviceProtocolIndex = 11;
    } else if ( nibbles[13] === 0 ) {
        // 0000.00.000-111
        type.push(nibbles9[nibbles[10]] ?? DEVICE_TYPE_INVALID_CHAR);
        type.push(nibbles9[nibbles[11]] ?? DEVICE_TYPE_INVALID_CHAR);
        deviceProtocolIndex = 12;
    } else {
        // 0000.00.000-1111
        type.push(nibbles9[nibbles[10]] ?? DEVICE_TYPE_INVALID_CHAR);
        type.push(nibbles9[nibbles[11]] ?? DEVICE_TYPE_INVALID_CHAR);
        type.push(nibbles9[nibbles[12]] ?? DEVICE_TYPE_INVALID_CHAR);
        deviceProtocolIndex = 13;
    }

    const deviceProtocolNibble = nibbles[deviceProtocolIndex];

    if ( deviceProtocolNibble && deviceProtocolNibble !== 0 ) {
        type.push(nibbles11[deviceProtocolNibble] ?? DEVICE_TYPE_INVALID_CHAR);
    }

    return {
        type: type.join(''),
        revision
    };
};

const toBytesMtx = ( type: string, prefix?: number, revision?: number ): TBytes => {
    const nibbles = [];

    if ( type.length < 11 ) {
        throw new Error('Wrong format');
    }

    // 1: 1100.00.000-0000
    nibbles.push(nibbles1.indexOf(type[0]));
    nibbles.push(nibbles2.indexOf(type[1]));

    // 2: 0011.00.000-0000
    nibbles.push(nibbles3.indexOf(type[2]));
    nibbles.push(nibbles3.indexOf(type[3]));

    if ( type[4] !== '.' ) {
        throw new Error('Wrong format');
    }

    // 3: 0000.11.000-0000
    nibbles.push(nibbles4.indexOf(type[5]));
    nibbles.push(nibbles5.indexOf(type[6]));

    if ( type[7] !== '.' ) {
        throw new Error('Wrong format');
    }

    // 4: 0000.00.110-0000
    nibbles.push(nibbles6.indexOf(type[8]));
    nibbles.push(nibbles7.indexOf(type[9]));

    nibbles.push(revision ?? 0);

    // 5: 0000.00.001-0000
    nibbles.push(nibbles8.indexOf(type[10]));

    if ( type[11] !== '-' ) {
        throw new Error('Wrong format');
    }

    // 6: 0000.00.000-1111
    const deviceProtocolIndex = type.length > 13 ? type.length - 1 : type.length;
    for ( let index = 12; index < deviceProtocolIndex; index++ ) {
        nibbles.push(nibbles9.indexOf(type[index]));
    }

    if ( deviceProtocolIndex < type.length ) {
        nibbles.push(nibbles11.indexOf(type[deviceProtocolIndex]));
    }

    const bytes = joinNibbles(nibbles);

    if ( bytes.length >= DEVICE_TYPE_SIZE ) {
        return bytes;
    }

    const padLength = DEVICE_TYPE_SIZE - bytes.length;

    return [
        prefix ?? 0,
        ...bytes,
        ...new Array(padLength).fill(0)
    ] as TBytes;
};

const fromBytesMtx2 = ( nibbles: TBytes ): IDeviceType => {
    if ( nibbles.length < 14 ) {
        throw new Error('The buffer is too small');
    }

    const type = ['MTX '];
    const separator = nibbles[1] === 5 ? '-' : ' ';

    type.push(nibbles1[nibbles[0]] ?? DEVICE_TYPE_INVALID_CHAR);
    type.push(nibbles2[nibbles[1]] ?? DEVICE_TYPE_INVALID_CHAR);
    type.push(separator);


    for ( let index = 2; index < nibbles.length; index++ ) {
        if ( nibbles[index] !== 0 ) {
            type.push(nibbles10[nibbles[index]] ?? DEVICE_TYPE_INVALID_CHAR);
        }
    }

    return {type: type.join('')};
};

const toBytesMtx2 = ( type: string ): TBytes => {
    if ( type.length < 3 ) {
        throw new Error('Wrong format');
    }

    const nibbles = [];

    nibbles.push(nibbles1.indexOf(type[0]));
    nibbles.push(nibbles2.indexOf(type[1]));

    for ( let index = 3; index < type.length; index++ ) {
        nibbles.push(nibbles10.indexOf(type[index]));
    }

    const bytes = joinNibbles(nibbles);

    if ( bytes.length === 8 ) {
        return bytes;
    }

    if ( bytes.length > 8 ) {
        throw new Error('Wrong format');
    }

    const result: TBytes = new Array(8).fill(0);

    for ( let index = 0; index < bytes.length; index++ ) {
        result[index] = bytes[index];
    }

    return result;
};

const fromBytesM = ( nibbles: TBytes ): IDeviceType => {
    if ( nibbles.length < 14 ) {
        throw new Error('The buffer is too small');
    }

    const type = [];

    type.push(nibbles1[nibbles[0]] ?? DEVICE_TYPE_INVALID_CHAR);

    for ( let index = 1; index < nibbles.length; index++ ) {
        if ( nibbles[index] !== 0 ) {
            type.push(nibbles12[nibbles[index]] ?? DEVICE_TYPE_INVALID_CHAR);
        }
    }

    return {type: type.join('')};
};

const toBytesM = ( type: string ): TBytes => {
    if ( type.length < 1 ) {
        throw new Error('Wrong format');
    }

    const nibbles = [];

    nibbles.push(nibbles1.indexOf(type[0]));

    for ( let index = 1; index < type.length; index++ ) {
        nibbles.push(nibbles12.indexOf(type[index]));
    }

    const bytes = joinNibbles(nibbles);
    const result: TBytes = new Array(8).fill(0);

    for ( let index = 0; index < bytes.length && index < 8; index++ ) {
        result[index] = bytes[index];
    }

    return result;
};

export const fromBytes = ( bytes: TBytes ): IDeviceType => {
    if ( bytes.length < 8 ) {
        throw new Error('The buffer is too small');
    }

    let result: IDeviceType;
    const reserve = [0x00, 0x05, 0x06, 0x07, 0x09, 0x7f, 0xef];
    const position = reserve.indexOf(bytes[0]) !== -1 ? 2 : 0;
    const nibbles = splitToNibbles(bytes.slice(0, 8));
    const deviceTypeNibble = nibbles[position];
    const deviceType = nibbles1[deviceTypeNibble];

    if ( deviceType === '1' || deviceType === '3' ) {
        let descriptor: IMtxDeviceTypeDescriptor | undefined;

        if ( bytes.length > DEVICE_TYPE_SIZE ) {
            descriptor = deviceType === '3'
                ? mtx3DeviceTypeDescriptorFromByte(bytes[8])
                : mtx1DeviceTypeDescriptorFromByte(bytes[8]);
        }

        result = {
            ...fromBytesMtx(nibbles.slice(position)),
            ...(descriptor != null && {descriptor})
        };
    } else {
        result = deviceType === 'M'
            ? fromBytesM(nibbles)
            : fromBytesMtx2(nibbles);
    }

    return result;
};

export const toBytes = ( {type, revision, descriptor}: IDeviceType, prefix?: number ): TBytes => {
    if ( !type.startsWith('MTX ') ) {
        throw new Error('Wrong format');
    }

    let result: TBytes;
    const content = type.substring(4);
    const deviceTypeSymbol = type[4];

    if ( deviceTypeSymbol === '1' || deviceTypeSymbol === '3' ) {
        result = toBytesMtx(content, prefix, revision);
    } else {
        result = deviceTypeSymbol === 'M'
            ? toBytesM(content)
            : toBytesMtx2(content);
    }

    if ( descriptor == null ) {
        return result.slice(0, 8);
    }

    if ( descriptor?.meterType ) {
        result[8] = descriptor.meterType === 'mtx1'
            ? mtx1DeviceTypeDescriptorToByte(descriptor)
            : mtx3DeviceTypeDescriptorToByte(descriptor);
    } else {
        result[8] = 0;
    }

    return result;
};
