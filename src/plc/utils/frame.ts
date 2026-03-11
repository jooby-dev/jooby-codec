import * as types from '../../types.js';
import {START_BYTE, STOP_BYTE} from '../../constants/frameAttributes.js';
import * as frame from '../../utils/frame.js';
import * as hashCrc16 from '../../utils/hashCrc16.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as phaseIds from '../constants/phaseIds.js';


export interface IPlcFrame extends frame.IFrame {
    type: 'plc',
    payload: types.TBytes
}

export interface IDownlinkControllerFrame extends frame.IFrame {
    type: 'downlinkController',
    pri: boolean,
    payload: types.TBytes
}

export interface IUplinkControllerFrame extends frame.IFrame {
    type: 'uplinkController',
    /** One of the {@link phaseIds | phase IDs}. */
    phase: types.TUint8,
    payload: types.TBytes
}

export interface IInvalidFrame {
    type: 'invalid',
    frame: frame.IFrame,
    error: string
}

export type TPlcFrame = IPlcFrame | IDownlinkControllerFrame | IUplinkControllerFrame | IInvalidFrame;


const minimalFrameSize = 4; // start byte, phase byte, length, crc (2 bytes), stop byte


const makeDownlinkControllerFrameContent = ( {pri, payload}: IDownlinkControllerFrame ) => [
    pri ? 0x01 : 0x00,
    payload.length + 2, // blocksBytes + crc
    ...payload
];

const makeUplinkControllerFrameContent = ( {phase, payload}: IUplinkControllerFrame ) => [
    1 + payload.length + 2, // phase + blocksBytes + crc
    phase,
    ...payload
];

const makeFrameContent = ( plcFrame: TPlcFrame ) => {
    switch ( plcFrame.type ) {
        case 'plc':
            return plcFrame.payload;

        case 'downlinkController':
            return makeDownlinkControllerFrameContent(plcFrame);

        case 'uplinkController':
            return makeUplinkControllerFrameContent(plcFrame);

        default:
            return [];
    }
};


export const toBytes = ( plcFrame: TPlcFrame ): types.TBytes => {
    const content = makeFrameContent(plcFrame);

    return content.length > 0
        ? [START_BYTE, ...frame.arrayStuff(hashCrc16.appendCrc(content)), STOP_BYTE]
        : [];
};

export const fromBytes = (
    type: 'plc' | 'downlinkController' | 'uplinkController',
    bytes: types.TBytes
): TPlcFrame => {
    if ( bytes.length < minimalFrameSize || bytes[0] !== START_BYTE || bytes[bytes.length - 1] !== STOP_BYTE ) {
        return {
            type: 'invalid',
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

    const unstuffed = frame.arrayUnstuff(bytes.slice(1, bytes.length - 1));

    let contentLength: types.TUint8;
    let pri: types.TUint8 | undefined;
    let phase: types.TUint8 | undefined;
    let rest: types.TBytes;
    let isContentLengthValid: boolean;

    if ( type === 'downlinkController' ) {
        [pri, contentLength, ...rest] = unstuffed;
        isContentLengthValid = contentLength === rest.length;
    } else if ( type === 'uplinkController' ) {
        [contentLength, phase, ...rest] = unstuffed;
        isContentLengthValid = contentLength === rest.length + 1; // phase byte is part of content
    } else if ( type === 'plc' ) {
        [contentLength, ...rest] = unstuffed;
        isContentLengthValid = contentLength === rest.length;
    }

    if ( !isContentLengthValid ) {
        return {
            type: 'invalid',
            frame: {
                bytes,
                payload: [],
                crc: {
                    calculated: 0,
                    received: undefined
                }
            },
            error: 'Invalid content length.'
        };
    }

    const payload = hashCrc16.parse(unstuffed);
    const baseFrame = {
        bytes,
        ...payload
    };

    if ( payload.crc.calculated !== payload.crc.received ) {
        return {
            type: 'invalid',
            frame: baseFrame,
            error: 'Mismatch CRC.'
        };
    }

    return {
        type,
        ...(type === 'downlinkController' ? {pri: pri === 0x01} : {}),
        ...(type === 'uplinkController' ? {phase} : {}),
        ...baseFrame,
        payload: rest.slice(0, -2) // remove crc from blocksBytes
    } as TPlcFrame;
};
