import {START_BYTE, STOP_BYTE} from '../constants/frameAttributes.js';
import {TBytes} from '../types.js';
import invertObject from './invertObject.js';
import * as payloadCrc16 from './payloadCrc16.js';


export interface IFrame {
    /** original data before any processing */
    bytes: TBytes,
    /** payload after processing (unstuffing, crc check ...) */
    payload: TBytes,
    crc: {
        received: number,
        calculated: number
    }
}

export interface IInvalidFrame {
    frame: IFrame,
    error: string
}

export type TFrame = IFrame | IInvalidFrame;
export type TDataBits = 7 | 8;

const STUFFING_8BIT_BYTE = 0x7c;
const STUFFING_BYTE = 0x7d;

const byteStuffMap: Record<number, number> = {0x13: 0x33, 0x11: 0x31, 0x7d: 0x5d, 0x7e: 0x5e};
const byteUnstuffMap: Record<number, number> = invertObject(byteStuffMap) as Record<number, number>;

const byteStuffMap7thBitSize: Record<number, number> = {...byteStuffMap, 0x7c: 0x5c, 0xfe: 0x5f};
const byteUnstuffMap7thBitSize: Record<number, number> = invertObject(byteStuffMap7thBitSize) as Record<number, number>;

const byteStuff = ( stuffingMap: Record<number, number>, byte: number ): number => +stuffingMap[byte] || byte;


export const arrayStuff = ( data: TBytes, dataBits: TDataBits = 8 ): TBytes => {
    const stuffingMap = dataBits === 7 ? byteStuffMap7thBitSize : byteStuffMap;
    const result: Array<number> = [];

    data.forEach(byte => {
        const stuff = byteStuff(stuffingMap, byte & 0xff);

        if ( stuff === byte ) {
            if ( dataBits === 7 && byte & 0x80 ) {
                result.push(STUFFING_8BIT_BYTE);
                result.push(byte & 0x7f);
            } else {
                result.push(byte);
            }
        } else {
            result.push(STUFFING_BYTE);
            result.push(stuff);
        }
    });

    return result;
};

export const arrayUnstuff = ( data: TBytes, dataBits: TDataBits = 8 ): TBytes => {
    const unStuffingMap = dataBits === 7 ? byteUnstuffMap7thBitSize : byteUnstuffMap;
    const result: Array<number> = [];
    let position = 0;
    let prevStuffingByte = 0;

    data.forEach(value => {
        const byte = value & 0xff;

        if ( prevStuffingByte === STUFFING_BYTE) {
            prevStuffingByte = 0;
            result[position++] = byteStuff(unStuffingMap, byte);
        } else if ( dataBits === 7 && prevStuffingByte === STUFFING_8BIT_BYTE) {
            prevStuffingByte = 0;
            result[position++] = byte | 0x80;
        } else if ( byte === STUFFING_BYTE ) {
            prevStuffingByte = STUFFING_BYTE;
        } else if ( dataBits === 7 && byte === STUFFING_8BIT_BYTE ) {
            prevStuffingByte = STUFFING_8BIT_BYTE;
        } else {
            result[position++] = byte;
        }
    });

    return result;
};

export const toBytes = ( content: TBytes, dataBits: TDataBits = 8 ): TBytes => {
    const stuffed = content.length === 0 ? [] : arrayStuff(payloadCrc16.appendCrc(content), dataBits);
    const bytes = content.length === 0 ? [] : [0x7e, ...stuffed, 0x7e];

    return bytes;
};

export const fromBytes = ( bytes: TBytes, dataBits: TDataBits = 8 ): TFrame => {
    // input doesn't look like frame
    if ( bytes[0] !== START_BYTE || bytes[bytes.length - 1] !== STOP_BYTE ) {
        return {
            frame: {
                bytes,
                payload: [],
                crc: {
                    calculated: 0,
                    received: undefined
                }
            },
            error: 'Not a frame.'
        };
    }

    const unstuffed = arrayUnstuff(bytes.slice(1, bytes.length - 1), dataBits);
    const payload = payloadCrc16.parse(unstuffed);
    const frame = {
        bytes,
        ...payload
    };

    if ( frame.crc.calculated !== frame.crc.received ) {
        return {
            frame,
            error: 'Mismatch CRC.'
        };
    }

    return frame;
};
