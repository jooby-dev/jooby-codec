/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import * as types from '../../types.js';
import {IBinaryBuffer} from '../../utils/BinaryBuffer.js';
import * as bitSet from '../../utils/bitSet.js';
import getHexFromBytes from '../../utils/getHexFromBytes.js';
import getBytesFromHex from '../../utils/getBytesFromHex.js';
import roundNumber from '../../utils/roundNumber.js';

export interface ICommandParameters {
    requestId: types.TUint8
}

export interface IObis {
    /**
     * The `A` group specifies the medium
     * (`0` - abstract objects, `1` - electricity, `6` - heat, `7` - gas, `8` - water ...).
     */
    a?: types.TUint8,
    /**
     * The `B` group specifies the channel.
     * Each device with multiple channels generating measurement results, can separate the results into the channels.
     */
    b?: types.TUint8,
    /**
     * The `C` group specifies the physical value (current, voltage, energy, level, temperature, ...).
     */
    c: types.TUint8,
    /**
     * The `D` group specifies the quantity computation result of specific algorithm.
     */
    d: types.TUint8,
    /**
     * The `E` group specifies the measurement type defined by groups `A` to `D` into individual measurements (e.g. switching ranges).
     */
    e?: types.TUint8,
    /**
     * The `F` group separates the results partly defined by groups `A` to `E`.
     * The typical usage is the specification of individual time ranges.
     */
    f?: types.TUint8
}

export interface IObisProfileFlags {
    contentType: number,
    sendOnChange: boolean,
    archive1: boolean,
    archive2: boolean
}

export interface IObisProfile {
    /**
     * Capture period in minutes.
     * This determines how often the OBIS observer will read the value of the OBIS code from the metering device.
     */
    capturePeriod: types.TUint16,
    /** sending period in minutes */
    sendingPeriod: types.TUint16,
    sendingCounter: types.TUint8,
    flags: IObisProfileFlags
}

export interface IObisValueFloat {
    code: number,
    content: number
}

export interface IObisValueString {
    code: number,
    content: string
}

export interface IVersion {
    major: types.TUint8,
    minor: types.TUint8
}

export interface ISerialPortParameters {
    baudRate: types.TUint8,
    dataBits: types.TUint8,
    parity: types.TUint8
}


export const REQUEST_ID_SIZE = 1;
export const OBIS_PROFILE_SIZE = 6;
export const DATE_TIME_SIZE = 4;
export const METER_ID_SIZE = 4;
export const EUI_SIZE = 8;


const obisBitMask = {
    f: 2 ** 0,
    e: 2 ** 1,
    b: 2 ** 2,
    a: 2 ** 3
};

// sizes
const archiveBitsNumber = 1;
const sendingOnlyIfChangeBitsNumber = 1;
const contentTypeBitsNumber = 2;

// positions
const archive1BitStartIndex = 1;
const archive2BitStartIndex = 2;
const sendingOnlyIfChangeBitStartIndex = 3;
const contentTypeBitStartIndex = 4;


/* export interface ICommandBinaryBuffer extends IBinaryBuffer {
    // static methods
    // getObisSize ( obis: IObis ): number,
    // getObisContentSize ( obis: IObis ): number,

    // instance methods
    // getObisProfile (): IObisProfile,
    // setObisProfile ( obisProfile: IObisProfile ),

    // getObis (): IObis,
    // setObis ( obisProfile: IObis ),

    // getEUI (): string,
    // setEUI ( eui: string ),

    // getObisValueString (): IObisValueString,
    // setObisValueString ( obisValue: IObisValueString),

    // getObisValueFloat (): IObisValueFloat,
    // setObisValueFloat ( obisValue: IObisValueFloat),

    // getVersion (): IVersion,
    // setVersion ( version: IVersion ),

    // getSerialPortParameters (): ISerialPortParameters,
    // setSerialPortParameters ( parameters: ISerialPortParameters )
} */

// function CommandBinaryBuffer ( this: ICommandBinaryBuffer, dataOrLength: types.TBytes | number, isLittleEndian = false ) {
//     // force BE for all numbers
//     BinaryBuffer.call(this, dataOrLength, isLittleEndian);
// }

// extending
// CommandBinaryBuffer.prototype = Object.create(BinaryBuffer.prototype);
// CommandBinaryBuffer.prototype.constructor = CommandBinaryBuffer;

export const getObisSize = ( obis: IObis ): number => {
    const keys = Object.keys(obis) as Array<keyof IObis>;

    return keys.filter(key => obis[key] !== undefined).length + 1;
};

export const getObisContentSize = ( obisValue: IObisValueFloat | IObisValueString ) => {
    if ( typeof obisValue.content === 'number' ) {
        // IObisValueFloat, 1 byte obis id code + 4 byte float value
        return 5;
    }

    // 1 byte for obis id code + 1 byte of string size + string bytes
    return 1 + obisValue.content.length + 1;
};


export const getObis = function ( buffer: IBinaryBuffer ): IObis {
    const obis = {
        c: 0,
        d: 0
    } as IObis;

    const flags = bitSet.toObject(obisBitMask, buffer.getUint8());

    if ( flags.a ) {
        obis.a = buffer.getUint8();
    }

    if ( flags.b ) {
        obis.b = buffer.getUint8();
    }

    obis.c = buffer.getUint8();
    obis.d = buffer.getUint8();

    if ( flags.e ) {
        obis.e = buffer.getUint8();
    }

    if ( flags.f ) {
        obis.f = buffer.getUint8();
    }

    return obis;
};

export const setObis = function ( buffer: IBinaryBuffer, obis: IObis ) {
    const flags = {
        a: obis.a !== undefined,
        b: obis.b !== undefined,
        e: obis.e !== undefined,
        f: obis.f !== undefined
    };

    buffer.setUint8(bitSet.fromObject(obisBitMask, flags));

    if ( obis.a !== undefined ) {
        buffer.setUint8(obis.a);
    }

    if ( obis.b !== undefined ) {
        buffer.setUint8(obis.b);
    }

    buffer.setUint8(obis.c);
    buffer.setUint8(obis.d);

    if ( obis.e !== undefined ) {
        buffer.setUint8(obis.e);
    }

    if ( obis.f !== undefined ) {
        buffer.setUint8(obis.f);
    }
};

export const getObisProfile = function ( buffer: IBinaryBuffer ): IObisProfile {
    const profile = {
        capturePeriod: buffer.getUint16(),
        sendingPeriod: buffer.getUint16(),
        sendingCounter: buffer.getUint8(),
        flags: {
            contentType: 0,
            sendOnChange: false,
            archive1: false,
            archive2: false
        }
    } as IObisProfile;

    const flags = buffer.getUint8();

    profile.flags.contentType = bitSet.extractBits(flags, contentTypeBitsNumber, contentTypeBitStartIndex);
    profile.flags.sendOnChange = !!bitSet.extractBits(flags, sendingOnlyIfChangeBitsNumber, sendingOnlyIfChangeBitStartIndex);
    profile.flags.archive1 = !!bitSet.extractBits(flags, archiveBitsNumber, archive1BitStartIndex);
    profile.flags.archive2 = !!bitSet.extractBits(flags, archiveBitsNumber, archive2BitStartIndex);

    return profile;
};

export const setObisProfile = function ( buffer: IBinaryBuffer, profile: IObisProfile ) {
    buffer.setUint16(profile.capturePeriod);
    buffer.setUint16(profile.sendingPeriod);
    buffer.setUint8(profile.sendingCounter);

    let flags = 0;

    flags = bitSet.fillBits(flags, contentTypeBitsNumber, contentTypeBitStartIndex, profile.flags.contentType );
    flags = bitSet.fillBits(flags, sendingOnlyIfChangeBitsNumber, sendingOnlyIfChangeBitStartIndex, +profile.flags.sendOnChange);
    flags = bitSet.fillBits(flags, archiveBitsNumber, archive1BitStartIndex, +profile.flags.archive1);
    flags = bitSet.fillBits(flags, archiveBitsNumber, archive2BitStartIndex, +profile.flags.archive2);

    buffer.setUint8(flags);
};

export const getEUI = function ( buffer: IBinaryBuffer ): string {
    const bytes = [];

    for ( let i = 0; i < EUI_SIZE; ++i ) {
        bytes.push(buffer.getUint8());
    }

    return getHexFromBytes(bytes);
};

export const setEUI = function ( buffer: IBinaryBuffer, eui: string ) {
    const bytes = getBytesFromHex(eui);

    bytes.forEach(byte => buffer.setUint8(byte));
};


export const getObisValueString = function ( buffer: IBinaryBuffer ): IObisValueString {
    return {code: buffer.getUint8(), content: buffer.getString()};
};

export const setObisValueString = function ( buffer: IBinaryBuffer, obisValue: IObisValueString ) {
    buffer.setUint8(obisValue.code);
    buffer.setString(obisValue.content);
};

export const getObisValueFloat = function ( buffer: IBinaryBuffer ): IObisValueFloat {
    return {code: buffer.getUint8(), content: roundNumber(buffer.getFloat32())};
};

export const setObisValueFloat = function ( buffer: IBinaryBuffer, obisValue: IObisValueFloat ) {
    buffer.setUint8(obisValue.code);
    buffer.setFloat32(roundNumber(obisValue.content));
};

export const getVersion = function ( buffer: IBinaryBuffer ): IVersion {
    return {
        major: buffer.getUint8(),
        minor: buffer.getUint8()
    };
};

export const setVersion = function ( buffer: IBinaryBuffer, version: IVersion ) {
    buffer.setUint8(version.major);
    buffer.setUint8(version.minor);
};

export const getSerialPortParameters = function ( buffer: IBinaryBuffer ): ISerialPortParameters {
    return {
        baudRate: buffer.getUint8(),
        dataBits: buffer.getUint8(),
        parity: bitSet.extractBits(buffer.getUint8(), 2, 1)
    };
};

export const setSerialPortParameters = function ( buffer: IBinaryBuffer, parameters: ISerialPortParameters ) {
    const {
        baudRate,
        dataBits,
        parity
    } = parameters;
    const flags = bitSet.fillBits(0, 2, 1, parity);

    buffer.setUint8(baudRate);
    buffer.setUint8(dataBits);
    buffer.setUint8(flags);
};


// export default CommandBinaryBuffer;
