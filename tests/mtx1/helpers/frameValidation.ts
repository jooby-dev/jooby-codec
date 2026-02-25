import {TMtxFrame, IMtxFrame} from '../../../src/mtx1/utils/frame.js';
import {TMessage, IMessage} from '../../../src/mtx1/message/types.js';
import {TCommand, ICommand} from '../../../src/mtx1/utils/command.js';


export const isValidFrame = ( value: TMtxFrame ): IMtxFrame => {
    expect(value).toHaveProperty('header');

    if ( !('header' in value) ) {
        fail();
    }

    return value;
};

export const isValidMessage = ( value: TMessage ): IMessage => {
    expect(value).toHaveProperty('messageId');

    if ( !('messageId' in value) ) {
        fail();
    }

    return value;
};

export const isValidCommand = ( value: TCommand ): ICommand => {
    expect(value).toHaveProperty('id');

    if ( !('id' in value) ) {
        fail();
    }

    return value;
};
