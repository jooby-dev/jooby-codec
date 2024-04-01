import {TBytes} from '../../types.js';
import {TCommand} from '../utils/command.js';


export interface IMessage {
    commands: Array<TCommand>,
    bytes: TBytes,
    lrc: {
        expected: number,
        actual: number
    }
}

export interface IInvalidMessage {
    message: IMessage,
    error: string,
}

type TExampleName = string;
export type TMessageExamples = Record<TExampleName, IMessage | IInvalidMessage>;
