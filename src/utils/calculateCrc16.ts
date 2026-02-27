import {TBytes} from '../types.js';


export const updateX25 = ( startValue: number, data: TBytes ) => {
    let crc = 0xFFFF;

    for ( let index = 0; index < data.length; index++ ) {
        // Compute combined value.
        let value = data[index] ^ (crc & 0xFF);

        value ^= (value << 4) & 0xFF;

        crc = (value << 3) ^ (value << 8) ^ (crc >> 8) ^ (value >> 4);
    }

    return crc;
};

const digestX25 = ( value: number ) => ((value & 0xFF00) ^ 0xFF00) | ((value & 0xFF) ^ 0xFF);

export enum Crc16Type {
    X25 = 0
}

/**
 * Calculate CRC16
 *
 * @param crc16Type - type of CRC16 algorithm
 * @param data - byte array
 *
 * @return CRC32
 */
export default ( data: TBytes, crc16type: Crc16Type = Crc16Type.X25 ) => {
    if ( crc16type === Crc16Type.X25 ) {
        const crc = updateX25(0xFFFF, data);

        return digestX25(crc);
    }

    throw new Error('unknown CRC16 type');
};
