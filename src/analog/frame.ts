import Command from './Command.js';
import * as Frame from '../utils/frame.js';
import * as Message from './message.js';


interface IAnalogFrame {
    frame: Frame.IFrame,
    message: Message.IMessage
}


export const toFrame = ( commands: Array<Command> ): IAnalogFrame => {
    const message = Message.toMessage(commands);

    return {
        message,
        frame: Frame.toFrame(message.bytes)
    };
};

export const fromBytes = ( data: Uint8Array, config: Message.IMessageConfig ): IAnalogFrame => {
    const frame = Frame.fromBytes(data);
    const message = Message.fromBytes(frame.content, config);

    return {frame, message};
};

export const fromFrames = ( frames: Array<Frame.IFrame>, config: Message.IMessageConfig ): Array<IAnalogFrame> => frames.reduce(
    (accumulator, {buffer}) => {
        const analogFrame = fromBytes(buffer, config);

        return [...accumulator, analogFrame];
    },
    [] as Array<IAnalogFrame>
);
