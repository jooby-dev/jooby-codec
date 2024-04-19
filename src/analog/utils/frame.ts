/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {TBytes} from '../../types.js';
import {ICommandConfig, TCommand} from './command.js';
import * as Frame from '../../utils/frame.js';
import {IMessage, IInvalidMessage} from '../message/types.js';
import getBytesFromBase64 from '../../utils/getBytesFromBase64.js';
import getBytesFromHex from '../../utils/getBytesFromHex.js';


interface IAnalogFrame {
    frame: Frame.IFrame,
    message: IMessage | IInvalidMessage
}


export const toFrame = ( messageImplementation, commands: Array<TCommand> ): IAnalogFrame => {
    const message: IMessage = messageImplementation.toMessage(commands);

    return {
        message,
        frame: Frame.toFrame(message.bytes)
    };
};

export const fromBytes = ( messageImplementation, bytes: TBytes, config?: ICommandConfig ): IAnalogFrame => {
    const frame = Frame.fromBytes(bytes);
    const message = messageImplementation.fromBytes(frame.content, config);

    return {frame, message};
};

export const fromHex = ( messageImplementation, hex: string, config?: ICommandConfig ) => (
    fromBytes(messageImplementation, getBytesFromHex(hex), config)
);

export const fromBase64 = ( messageImplementation, base64: string, config?: ICommandConfig ) => (
    fromBytes(messageImplementation, getBytesFromBase64(base64), config)
);

export const fromFrames = ( messageImplementation, frames: Array<Frame.IFrame>, config?: ICommandConfig ): Array<IAnalogFrame> => frames.map(frame => {
    const message = messageImplementation.fromBytes(frame.content, config);

    return {frame, message};
});
