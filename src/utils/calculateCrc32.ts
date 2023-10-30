const updateCrc32 = ( startValue: number, data: Uint8Array ) => {
    let crc = BigInt(startValue);

    for ( let index = 0; index < data.byteLength; index++ ) {
        crc ^= BigInt(data[index]);

        for ( let bit = 0; bit < 8; bit++ ) {
            if ( crc & 1n ) {
                crc = (crc >> 1n) ^ 0xEDB88320n;
            } else {
                crc >>= 1n;
            }
        }
    }

    return Number(crc);
};

const digestCrc32 = ( value: number ) => ~value >>> 0;


export enum Crc32Type {
    IEEE_8023 = 0
}

/**
 * Calculate CRC32
 *
 * @param crc32Type - type of CRC32 algorithm
 * @param data - byte array
 *
 * @return CRC32
 */

export const calculateCrc32 = ( crc32type: Crc32Type, data: Uint8Array ) => {
    if ( crc32type === Crc32Type.IEEE_8023) {
        const crc = updateCrc32(0xffffffff, data);

        return digestCrc32(crc);
    }

    throw new Error('unknown CRC32 type');
};
