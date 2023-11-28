import getBytesFromHex from '../../utils/getBytesFromHex.js';


export interface IDeviceType {
    type: string,
    revision?: number
    meterType: number
}


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

const splitByte = ( byte: number ): Array<number> => [
    byte >> 4,
    byte & 0x0F
];

const splitToNibbles = ( data: Uint8Array ): Uint8Array => {
    const result = new Uint8Array(data.length * 2);

    data.forEach( ( byte, index ) => {
        const [high, low] = splitByte(byte);

        result[index * 2] = high;
        result[index * 2 + 1] = low;
    });

    return result;
};

const joinNibbles = ( nibbles: Uint8Array | Array<number> ): Uint8Array => {
    const hex: Array<string> = [];

    nibbles.forEach(nibble => hex.push(nibble.toString(16)));

    if ( nibbles.length & 1 ) {
        hex.push('0');
    }

    return getBytesFromHex(hex.join(''));
};

const fromBytesMtx = ( nibbles: Uint8Array ): IDeviceType => {
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
    let deviceProtocolIndex;

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
        revision,
        meterType: 0
    };
};

const toBytesMtx = ( type: string, prefix?: number, revision?: number ): Uint8Array => {
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
    const result = new Uint8Array(9);

    result[0] = prefix ?? 0;
    result.set( bytes, bytes.length < 8 ? 1 : 0);

    return result;
};

const fromBytesMtx2 = ( nibbles: Uint8Array ): IDeviceType => {
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

    return {
        type: type.join(''),
        meterType: 0
    };
};

const toBytesMtx2 = ( type: string ): Uint8Array => {
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

    const result = new Uint8Array(8);

    result.set(bytes, 0);

    return result;
};

const fromBytesM = ( nibbles: Uint8Array ): IDeviceType => {
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

    return {
        type: type.join(''),
        meterType: 0
    };
};

const toBytesM = ( type: string ): Uint8Array => {
    if ( type.length < 1 ) {
        throw new Error('Wrong format');
    }

    const nibbles = [];

    nibbles.push(nibbles1.indexOf(type[0]));

    for ( let index = 1; index < type.length; index++ ) {
        nibbles.push(nibbles12.indexOf(type[index]));
    }

    const bytes = joinNibbles(nibbles);
    const result = new Uint8Array(8);

    result.set( bytes, 0);

    return result;
};

export const fromBytes = ( bytes: Uint8Array ): IDeviceType => {
    if ( bytes.length !== 9 ) {
        throw new Error('The buffer is too small');
    }

    let result;
    const reserve = [0x00, 0x05, 0x06, 0x07, 0x09, 0x7f, 0xef];
    const position = reserve.includes(bytes[0]) ? 2 : 0;
    const nibbles = splitToNibbles(bytes.slice(0, 8));
    const deviceTypeNibble = nibbles[position];
    const deviceType = nibbles1[deviceTypeNibble];

    if ( deviceType === '1' || deviceType === '3' ) {
        result = fromBytesMtx(nibbles.slice(position));
    } else {
        result = deviceType === 'M'
            ? fromBytesM(nibbles)
            : fromBytesMtx2(nibbles);
    }

    // eslint-disable-next-line prefer-destructuring
    result.meterType = bytes[8];

    return result;
};

export const toBytes = ( {type, revision, meterType}: IDeviceType, prefix?: number ): Uint8Array => {
    if ( !type.startsWith('MTX ') ) {
        throw new Error('Wrong format');
    }

    let result;
    const content = type.substring(4);
    const deviceTypeSymbol = type[4];

    if ( deviceTypeSymbol === '1' || deviceTypeSymbol === '3' ) {
        result = toBytesMtx(content, prefix, revision);
    } else {
        result = deviceTypeSymbol === 'M'
            ? toBytesM(content)
            : toBytesMtx2(content);
    }

    result[8] = meterType;

    return result;
};
