import {TBytes} from '../types.js';
import BinaryBuffer, {IBinaryBuffer} from './binary/BinaryBuffer.js';
import calculateCrc16 from './calculateCrc16.js';


const getBytesCrc = ( bytes: TBytes ): number | undefined => {
    if ( bytes.length >= 2 ) {
        const crcBuffer: IBinaryBuffer = new BinaryBuffer(bytes.slice(-2));

        return crcBuffer.getUint16();
    }

    return undefined;
};

export const convertCrcToBytes = ( crc: number ) : TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(2);

    buffer.setUint16(crc);

    return buffer.toUint8Array();
};


export const parse = ( bytes: TBytes ) => {
    const receivedCrc = getBytesCrc(bytes);
    const payload = bytes.slice(0, bytes.length - 2);
    const calculatedCrc = calculateCrc16(payload);

    return {
        payload,
        crc: {
            calculated: calculatedCrc,
            received: receivedCrc
        }
    };
};

export const appendCrc = ( payload: TBytes ) => {
    if ( payload.length === 0 ) return [];

    const crc = calculateCrc16(payload);
    const crcBytes = convertCrcToBytes(crc);

    return [...payload, ...crcBytes];
};
