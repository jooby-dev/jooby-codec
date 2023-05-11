import {IHexFormatOptions} from '../config.js';
import getHexFromBytes from './getHexFromBytes.js';


const UINT32_BYTE_SIZE = 4;

const getNumberByteSize = ( value: number ): number => {
    let byteSize = 1;

    while ( value >= 256 ** byteSize ) {
        byteSize++;
    }

    return byteSize;
};


/**
 * Convert number to hex string.
 *
 * @param value - input uint32 value to convert
 * @param options - formatting parameters
 *
 * @example
 * input: 123
 * output: '7b' or '0x7b'
 *
 * @example
 * input: 1234567
 * output: '12 d6 87' or '0x12 0xd6 0x87'
 */
export default ( value: number, options: IHexFormatOptions = {} ): string => {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    const byteSize = getNumberByteSize(value);

    if ( byteSize > UINT32_BYTE_SIZE ) {
        throw new Error(`Value ${value} takes more than ${UINT32_BYTE_SIZE} bytes.`);
    }

    view.setUint32(0, value);

    return getHexFromBytes(
        new Uint8Array(buffer).slice(UINT32_BYTE_SIZE - byteSize),
        options
    );
};
