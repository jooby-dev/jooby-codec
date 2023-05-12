import BinaryBuffer from './BinaryBuffer.js';
import * as bitSet from './utils/bitSet.js';


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
    sendingOnlyIfChange: number,
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
    static getObisSize ( obis: IObis ) {
        const keys = Object.keys(obis) as Array<keyof IObis>;

        return keys.filter(key => obis[key] !== undefined).length + 1;
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
                sendingOnlyIfChange: 0,
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

        profile.flags.contentType = bitSet.extractBitsFromNumber(flags, contentTypeBitsNumber, contentTypeBitStartIndex);
        profile.flags.sendingOnlyIfChange = bitSet.extractBitsFromNumber(flags, sendingOnlyIfChangeBitsNumber, sendingOnlyIfChangeBitStartIndex);
        profile.flags.archiveType = bitSet.extractBitsFromNumber(flags, archiveTypeBitsNumber, archiveTypeBitStartIndex);

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

        flags = bitSet.setBitsToNumber(flags, contentTypeBitsNumber, contentTypeBitStartIndex, profile.flags.contentType );
        flags = bitSet.setBitsToNumber(flags, sendingOnlyIfChangeBitsNumber, sendingOnlyIfChangeBitStartIndex, profile.flags.sendingOnlyIfChange);
        flags = bitSet.setBitsToNumber(flags, archiveTypeBitsNumber, archiveTypeBitStartIndex, profile.flags.archiveType);

        this.setUint8(flags);
    }
}


export default CommandBinaryBuffer;
