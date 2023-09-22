import BinaryBuffer from '../utils/BinaryBuffer.js';
import * as bitSet from '../utils/bitSet.js';
import getHexFromBytes from '../utils/getHexFromBytes.js';
import getBytesFromHex from '../utils/getBytesFromHex.js';
import roundNumber from '../utils/roundNumber.js';

export interface ICommandParameters {
    requestId: number
}

export interface IObis {
    /**
     * The `A` group specifies the medium
     * (`0` - abstract objects, `1` - electricity, `6` - heat, `7` - gas, `8` - water ...).
     */
    a?: number,
    /**
     * The `B` group specifies the channel.
     * Each device with multiple channels generating measurement results, can separate the results into the channels.
     */
    b?: number,
    /**
     * The `C` group specifies the physical value (current, voltage, energy, level, temperature, ...).
     */
    c: number,
    /**
     * The `D` group specifies the quantity computation result of specific algorithm.
     */
    d: number,
    /**
     * The `E` group specifies the measurement type defined by groups `A` to `D` into individual measurements (e.g. switching ranges).
     */
    e?: number,
    /**
     * The `F` group separates the results partly defined by groups `A` to `E`.
     * The typical usage is the specification of individual time ranges.
     */
    f?: number
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
    capturePeriod: number,
    /** sending period in minutes */
    sendingPeriod: number,
    sendingCounter: number,
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
    major: number,
    minor: number
}


export const REQUEST_ID_SIZE = 1;
export const OBIS_PROFILE_SIZE = 6;
export const DATE_TIME_SIZE = 4;
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


/**
 * Command specific byte array manipulation.
 */
class CommandBinaryBuffer extends BinaryBuffer {
    constructor ( dataOrLength: Uint8Array | number | string ) {
        // force BE for all numbers
        super(dataOrLength, false);
    }

    static getObisSize ( obis: IObis ) {
        const keys = Object.keys(obis) as Array<keyof IObis>;

        return keys.filter(key => obis[key] !== undefined).length + 1;
    }

    static getObisContentSize ( obisValue: IObisValueFloat | IObisValueString ) {
        if ( typeof obisValue.content === 'number' ) {
            // IObisValueFloat, 1 byte obis id code + 4 byte float value
            return 5;
        }

        // 1 byte for obis id code + 1 byte of string size + string bytes
        return 1 + obisValue.content.length + 1;
    }

    getObis (): IObis {
        const obis = {
            c: 0,
            d: 0
        } as IObis;

        const flags = bitSet.toObject(obisBitMask, this.getUint8());

        if ( flags.a ) {
            obis.a = this.getUint8();
        }

        if ( flags.b ) {
            obis.b = this.getUint8();
        }

        obis.c = this.getUint8();
        obis.d = this.getUint8();

        if ( flags.e ) {
            obis.e = this.getUint8();
        }

        if ( flags.f ) {
            obis.f = this.getUint8();
        }

        return obis;
    }

    setObis ( obis: IObis ): void {
        const flags = {
            a: obis.a !== undefined,
            b: obis.b !== undefined,
            e: obis.e !== undefined,
            f: obis.f !== undefined
        };

        this.setUint8(bitSet.fromObject(obisBitMask, flags));

        if ( obis.a ) {
            this.setUint8(obis.a);
        }

        if ( obis.b ) {
            this.setUint8(obis.b);
        }

        this.setUint8(obis.c);
        this.setUint8(obis.d);

        if ( obis.e ) {
            this.setUint8(obis.e);
        }

        if ( obis.f ) {
            this.setUint8(obis.f);
        }
    }

    getObisProfile (): IObisProfile {
        const profile = {
            capturePeriod: this.getUint16(),
            sendingPeriod: this.getUint16(),
            sendingCounter: this.getUint8(),
            flags: {
                contentType: 0,
                sendOnChange: false,
                archive1: false,
                archive2: false
            }
        } as IObisProfile;

        const flags = this.getUint8();

        profile.flags.contentType = bitSet.extractBits(flags, contentTypeBitsNumber, contentTypeBitStartIndex);
        profile.flags.sendOnChange = !!bitSet.extractBits(flags, sendingOnlyIfChangeBitsNumber, sendingOnlyIfChangeBitStartIndex);
        profile.flags.archive1 = !!bitSet.extractBits(flags, archiveBitsNumber, archive1BitStartIndex);
        profile.flags.archive2 = !!bitSet.extractBits(flags, archiveBitsNumber, archive2BitStartIndex);

        return profile;
    }

    setObisProfile ( profile: IObisProfile ): void {
        this.setUint16(profile.capturePeriod);
        this.setUint16(profile.sendingPeriod);
        this.setUint8(profile.sendingCounter);

        let flags = 0;

        flags = bitSet.fillBits(flags, contentTypeBitsNumber, contentTypeBitStartIndex, profile.flags.contentType );
        flags = bitSet.fillBits(flags, sendingOnlyIfChangeBitsNumber, sendingOnlyIfChangeBitStartIndex, +profile.flags.sendOnChange);
        flags = bitSet.fillBits(flags, archiveBitsNumber, archive1BitStartIndex, +profile.flags.archive1);
        flags = bitSet.fillBits(flags, archiveBitsNumber, archive2BitStartIndex, +profile.flags.archive2);

        this.setUint8(flags);
    }

    getObisValueString (): IObisValueString {
        return {code: this.getUint8(), content: this.getString()};
    }

    setObisValueString ( obisValue: IObisValueString ) {
        this.setUint8(obisValue.code);
        this.setString(obisValue.content);
    }

    getObisValueFloat (): IObisValueFloat {
        return {code: this.getUint8(), content: roundNumber(this.getFloat32())};
    }

    setObisValueFloat ( obisValue: IObisValueFloat ) {
        this.setUint8(obisValue.code);
        this.setFloat32(roundNumber(obisValue.content));
    }

    getSerialPortFlags () {
        const flags = this.getUint8();

        return {
            fixed: !!bitSet.extractBits(flags, 1, 3),
            parity: bitSet.extractBits(flags, 2, 1)
        };
    }

    setSerialPortFlags ( {fixed, parity}: {fixed: boolean, parity: number} ) {
        let flags = 0;

        flags = bitSet.fillBits(flags, 1, 3, +fixed);
        flags = bitSet.fillBits(flags, 2, 1, parity);

        this.setUint8(flags);
    }

    getVersion (): IVersion {
        return {
            major: this.getUint8(),
            minor: this.getUint8()
        };
    }

    setVersion ( version: IVersion ): void {
        this.setUint8(version.major);
        this.setUint8(version.minor);
    }

    getEUI (): string {
        const bytes = [];

        for ( let i = 0; i < EUI_SIZE; ++i ) {
            bytes.push(this.getUint8());
        }

        return getHexFromBytes(new Uint8Array(bytes));
    }

    setEUI ( eui: string ): void {
        const bytes = getBytesFromHex(eui);

        bytes.forEach(byte => this.setUint8(byte));
    }
}


export default CommandBinaryBuffer;
