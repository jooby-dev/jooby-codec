import BinaryBuffer from './BinaryBuffer.js';
import * as bitSet from './utils/bitSet.js';


export interface IObis {
    groupA?: number,
    groupB?: number,
    groupC: number,
    groupD: number,
    groupE?: number,
    groupF?: number
}


const obisBitMask = {
    groupF: 2 ** 0,
    groupE: 2 ** 1,
    groupB: 2 ** 2,
    groupA: 2 ** 3
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
            groupC: 0,
            groupD: 0
        } as IObis;

        const flags = bitSet.toObject(obisBitMask, this.getUint8());

        if ( flags.groupA ) {
            obis.groupA = this.getUint8();
        }

        if ( flags.groupB ) {
            obis.groupB = this.getUint8();
        }

        obis.groupC = this.getUint8();
        obis.groupD = this.getUint8();

        if ( flags.groupE ) {
            obis.groupE = this.getUint8();
        }

        if ( flags.groupF ) {
            obis.groupF = this.getUint8();
        }

        return obis;
    }

    setObis ( obis: IObis ): void {
        const flags = {
            groupA: obis.groupA !== undefined,
            groupB: obis.groupB !== undefined,
            groupE: obis.groupE !== undefined,
            groupF: obis.groupF !== undefined
        };

        this.setUint8(bitSet.fromObject(obisBitMask, flags));

        if ( obis.groupA ) {
            this.setUint8(obis.groupA);
        }

        if ( obis.groupB ) {
            this.setUint8(obis.groupB);
        }

        this.setUint8(obis.groupC);
        this.setUint8(obis.groupD);

        if ( obis.groupE ) {
            this.setUint8(obis.groupE);
        }

        if ( obis.groupF ) {
            this.setUint8(obis.groupF);
        }
    }
}


export default CommandBinaryBuffer;
