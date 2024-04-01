import {TBytes} from '../../types.js';

import * as header from './header.js';

// export const fromBytes = ( data: Uint8Array ) => {

// };

/**
 * Optional additional parameters to a command.
 */
export interface ICommandConfig {
    hardwareType?: number
}

export interface ICommand {
    id: number,
    headerSize?: number,
    parameters?: object,
    config?: ICommandConfig,
    bytes?: TBytes
}

export interface ICommandParameters {}

export interface IInvalidCommand {
    command: ICommand,
    error: string
}

// export interface ICommandExample {
//     name: string,
//     parameters?: object,
//     config?: ICommandConfig,
//     hex: {
//         header: string,
//         body: string
//     }
// }

export type TCommand = ICommand | IInvalidCommand;

//export type TCommandExampleList = Array<ICommandExample>;

type TExampleName = string;
export type TCommandExamples = Record<TExampleName, TCommand>;

export interface ICommandImplementation {
    id: number,
    headerSize: number,
    examples: TCommandExamples,

    fromBytes ( data: TBytes, config?: ICommandConfig ): ICommandParameters,
    toBytes ( parameters?: object, config?: ICommandConfig ): TBytes
}


// export const wrapFromBytes = ( commandBodySize: number, callback: function ): object => {

// };

export const toBytes = ( commandId: number, commandData: TBytes = [] ): TBytes => {
    const headerData = header.toBytes(commandId, commandData.length);

    return [...headerData, ...commandData];
};


// export const toJson = ( commandId: number, parameters: object ): object => {

// };
