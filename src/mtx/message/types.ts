import {TBytes} from '../../types.js';
import {TCommand} from '../utils/command.js';


export interface IMessage {
    commands: Array<TCommand>,
    bytes: TBytes
}

export interface IInvalidMessage {
    message: IMessage,
    error: string,
}

type TExampleName = string;
export type TMessageExamples = Record<TExampleName, IMessage | IInvalidMessage>;
