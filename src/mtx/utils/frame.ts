import {TBytes} from '../../types.js';
import * as frame from '../../utils/frame.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, IFrameHeader, defaultFrameHeader, frameHeaderSize} from './CommandBinaryBuffer.js';


export interface IMtxFrame extends frame.IFrame {
    header?: IFrameHeader
}

export interface IInvalidMtxFrame {
    frame: IMtxFrame,
    error: string,
}

export type TMtxFrame = IMtxFrame | IInvalidMtxFrame;


export const toBytes = ( message: TBytes, frameHeader: IFrameHeader = defaultFrameHeader ): TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(frameHeaderSize);

    buffer.setFrameHeader(frameHeader);

    return frame.toBytes(buffer.data.concat(message));
};

export const fromBytes = ( bytes: TBytes ): TMtxFrame => {
    const parsedFrame = frame.fromBytes(bytes);
    let header: IFrameHeader;

    if ( 'bytes' in parsedFrame ) {
        const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(parsedFrame.bytes);
        header = buffer.getFrameHeader();

        // payload is all except header
        parsedFrame.bytes = parsedFrame.bytes.slice(5);

        return {
            ...parsedFrame,
            header
        };
    }

    return parsedFrame;
};
