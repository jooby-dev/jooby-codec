import BinaryBuffer from '../utils/BinaryBuffer.js';
import * as bitSet from '../utils/bitSet.js';
import roundNumber from '../utils/roundNumber.js';

export interface ICommandParameters {
    requestId: number
}

export interface IObis {
    a?: number,
    b?: number,
    c: number,
    d: number,
    e?: number,
    f?: number
}

export interface IObisProfileFlags {
    contentType: number,
    sendOnlyOnChange: number,
    archiveType: number
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

export interface IShortNameFloat {
    code: number,
    content: number
}

export interface IShortNameString {
    code: number,
    content: string
}

export const REQUEST_ID_SIZE = 1;
export const OBIS_PROFILE_SIZE = 6;
export const DATE_TIME_SIZE = 4;


const obisBitMask = {
    f: 2 ** 0,
    e: 2 ** 1,
    b: 2 ** 2,
    a: 2 ** 3
};

const obisProfileFlags = {
    contentTypeBitsNumber: 2,
    contentTypeBitStartIndex: 1,
    sendingOnlyIfChangeBitsNumber: 1,
    sendingOnlyIfChangeBitStartIndex: 3,
    archiveTypeBitsNumber: 2,
    archiveTypeBitStartIndex: 4
};


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

    static getShortNameContentSize ( shortName: IShortNameFloat | IShortNameString ) {
        if ( typeof shortName.content === 'number' ) {
            // IShortNameFloat, 1 byte short name code + 4 byte float value
            return 5;
        }

        // 1 byte for short name code + 1 byte of string size + string bytes
        return 1 + shortName.content.length + 1;
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
                sendOnlyOnChange: 0,
                archiveType: 0
            }
        } as IObisProfile;

        const flags = this.getUint8();

        const {
            contentTypeBitsNumber,
            contentTypeBitStartIndex,
            sendingOnlyIfChangeBitsNumber,
            sendingOnlyIfChangeBitStartIndex,
            archiveTypeBitsNumber,
            archiveTypeBitStartIndex
        } = obisProfileFlags;

        profile.flags.contentType = bitSet.extractBits(flags, contentTypeBitsNumber, contentTypeBitStartIndex);
        profile.flags.sendOnlyOnChange = bitSet.extractBits(flags, sendingOnlyIfChangeBitsNumber, sendingOnlyIfChangeBitStartIndex);
        profile.flags.archiveType = bitSet.extractBits(flags, archiveTypeBitsNumber, archiveTypeBitStartIndex);

        return profile;
    }

    setObisProfile ( profile: IObisProfile ): void {
        this.setUint16(profile.capturePeriod);
        this.setUint16(profile.sendingPeriod);
        this.setUint8(profile.sendingCounter);

        const {
            contentTypeBitsNumber,
            contentTypeBitStartIndex,
            sendingOnlyIfChangeBitsNumber,
            sendingOnlyIfChangeBitStartIndex,
            archiveTypeBitsNumber,
            archiveTypeBitStartIndex
        } = obisProfileFlags;

        let flags = 0;

        flags = bitSet.fillBits(flags, contentTypeBitsNumber, contentTypeBitStartIndex, profile.flags.contentType );
        flags = bitSet.fillBits(flags, sendingOnlyIfChangeBitsNumber, sendingOnlyIfChangeBitStartIndex, profile.flags.sendOnlyOnChange);
        flags = bitSet.fillBits(flags, archiveTypeBitsNumber, archiveTypeBitStartIndex, profile.flags.archiveType);

        this.setUint8(flags);
    }

    getShortNameString (): IShortNameString {
        return {code: this.getUint8(), content: this.getString()};
    }

    setShortNameString ( shortName: IShortNameString ) {
        this.setUint8(shortName.code);
        this.setString(shortName.content);
    }

    getShortNameFloat (): IShortNameFloat {
        return {code: this.getUint8(), content: roundNumber(this.getFloat32())};
    }

    setShortNameFloat ( shortName: IShortNameFloat ) {
        this.setUint8(shortName.code);
        this.setFloat32(roundNumber(shortName.content));
    }

    getSerialPortFlags () {
        const flags = this.getUint8();

        return {
            fixed: bitSet.extractBits(flags, 1, 3),
            parity: bitSet.extractBits(flags, 2, 1)
        };
    }

    setSerialPortFlags ( {fixed, parity}: {fixed: number, parity: number} ) {
        let flags = 0;

        flags = bitSet.fillBits(flags, 1, 3, fixed);
        flags = bitSet.fillBits(flags, 2, 1, parity);

        this.setUint8(flags);
    }
}


export default CommandBinaryBuffer;
