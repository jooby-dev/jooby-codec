import BinaryBuffer from '../utils/BinaryBuffer.js';
import {extractBits, fillBits} from '../utils/bitSet.js';


export interface IMtxCommand {
    sequence: number,
    fragmentIndex: number,
    fragmentsNumber: number,
    last: boolean,
    data: Uint8Array
}


/**
 * Command specific byte array manipulation.
 */
class CommandBinaryBuffer extends BinaryBuffer {
    constructor ( dataOrLength: Uint8Array | number | string ) {
        // force BE for all numbers
        super(dataOrLength, false);
    }

    getMtxCommand (): IMtxCommand {
        const sequence = this.getUint8();
        const flag = this.getUint8();

        return {
            sequence,
            fragmentIndex: extractBits(flag, 3, 1),
            fragmentsNumber: extractBits(flag, 3, 5),
            last: Boolean(extractBits(flag, 1, 8)),
            data: this.getBytesLeft()
        };
    }

    setMtxCommand ( value: IMtxCommand ) {
        let flag = fillBits(0, 3, 1, value.fragmentIndex);
        flag = fillBits(flag, 3, 5, value.fragmentsNumber);
        flag = fillBits(flag, 1, 8, +value.last);

        this.setUint8(value.sequence);
        this.setUint8(flag);
        this.setBytes(value.data);
    }
}


export default CommandBinaryBuffer;
