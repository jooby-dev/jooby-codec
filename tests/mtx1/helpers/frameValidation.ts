import {TMtxFrame, IMtxFrame} from '../../../src/mtx1/utils/frame.js';
import {TMessage, IMessage} from '../../../src/mtx1/message/types.js';
import {TCommand, ICommand} from '../../../src/mtx1/utils/command.js';


export const isValidFrame = ( value: TMtxFrame ): IMtxFrame => {
    expect(value).toHaveProperty('header');

    return value as IMtxFrame;
};

export const isValidMessage = ( value: TMessage ): IMessage => {
    expect(value).toHaveProperty('messageId');

    return value as IMessage;
};

export const isValidCommand = ( value: TCommand ): ICommand => {
    expect(value).toHaveProperty('id');

    return value as ICommand;
};
