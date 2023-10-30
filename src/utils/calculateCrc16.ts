export const calculateX25 = ( data: Uint8Array ) => {
    let crc = 0xFFFF;

    for ( let index = 0; index < data.length; index++ ) {
        // Compute combined value.
        let value = data[index] ^ (crc & 0xFF);

        value ^= (value << 4) & 0xFF;

        crc = (value << 3) ^ (value << 8) ^ (crc >> 8) ^ (value >> 4);
    }

    return ((crc & 0xFF00) ^ 0xFF00) | ((crc & 0xFF) ^ 0xFF);
};

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

export const calculateCrc16 = ( crc16type: Crc16Type, data: Uint8Array ) => {
    if ( crc16type === Crc16Type.X25 ) return calculateX25(data);

    throw new Error('unknown CRC16 type');
};
