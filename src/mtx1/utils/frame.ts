import {TBytes} from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../utils/binary/BinaryBuffer.js';
import * as frame from '../../utils/frame.js';
import {
    IFrameHeader,
    defaultFrameHeader,
    frameHeaderSize,
    getFrameHeader,
    setFrameHeader
} from './binary/buffer.js';


export interface IMtxFrame extends frame.IFrame {
    header?: IFrameHeader
}

export interface IInvalidMtxFrame {
    frame: IMtxFrame,
    error: string
}

export type TMtxFrame = IMtxFrame | IInvalidMtxFrame;


export const toBytes = ( message: TBytes, frameHeader: IFrameHeader = defaultFrameHeader ): TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(frameHeaderSize, false);

    setFrameHeader(buffer, frameHeader);

    return frame.toBytes(buffer.data.concat(message));
};

export const fromBytes = ( bytes: TBytes ): TMtxFrame => {
    const parsedFrame = frame.fromBytes(bytes);
    let header: IFrameHeader;

    if ( 'payload' in parsedFrame ) {
        const buffer: IBinaryBuffer = new BinaryBuffer(parsedFrame.payload, false);
        header = getFrameHeader(buffer);

        // payload is all except header
        parsedFrame.payload = parsedFrame.payload.slice(frameHeaderSize);

        return {
            ...parsedFrame,
            header
        };
    }

    return parsedFrame;
};
