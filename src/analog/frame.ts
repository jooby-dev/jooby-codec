import Command from './Command.js';
import * as baseFrame from '../utils/frame.js';
import * as analogMessage from './message.js';
import getBytesFromBase64 from '../utils/getBytesFromBase64.js';
import getBytesFromHex from '../utils/getBytesFromHex.js';


interface IAnalogFrame {
    frame: baseFrame.IFrame,
    message: analogMessage.IMessage
}


export const getCommands = ( {frame, message}: IAnalogFrame, isStrict: boolean = false ): Array<Command> => {
    if ( isStrict && !frame.isValid ) {
        return [];
    }

    return analogMessage.getCommands(message, isStrict);
};

export const toFrame = ( commands: Array<Command> ): IAnalogFrame => {
    const message = analogMessage.toMessage(commands);

    return {
        message,
        frame: baseFrame.toFrame(message.bytes)
    };
};

export const fromBytes = ( bytes: Uint8Array, config?: analogMessage.IMessageConfig ): IAnalogFrame => {
    const frame = baseFrame.fromBytes(bytes);
    const message = analogMessage.fromBytes(frame.content, config);

    return {frame, message};
};

export const fromHex = ( hex: string, config?: analogMessage.IMessageConfig ) => (
    fromBytes(getBytesFromHex(hex), config)
);

export const fromBase64 = ( base64: string, config?: analogMessage.IMessageConfig ) => (
    fromBytes(getBytesFromBase64(base64), config)
);

export const fromFrames = ( frames: Array<baseFrame.IFrame>, config?: analogMessage.IMessageConfig ): Array<IAnalogFrame> => frames.map(frame => {
    const message = analogMessage.fromBytes(frame.content, config);

    return {frame, message};
});
