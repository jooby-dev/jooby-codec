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


const obisBitMask = {
    f: 2 ** 0,
    e: 2 ** 1,
    b: 2 ** 2,
    a: 2 ** 3
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
}


export default CommandBinaryBuffer;
