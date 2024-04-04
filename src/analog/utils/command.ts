import * as types from '../../types.js';

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
    id: types.TCommandId,
    name?: types.TCommandName,
    headerSize?: number,
    parameters?: object,
    config?: ICommandConfig,
    bytes?: types.TBytes
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
    id: types.TCommandId,
    name: types.TCommandName,
    headerSize: number,
    examples: TCommandExamples,

    fromBytes ( data: types.TBytes, config?: ICommandConfig ): ICommandParameters,
    toBytes ( parameters?: object, config?: ICommandConfig ): types.TBytes
}


// export const wrapFromBytes = ( commandBodySize: number, callback: function ): object => {

// };

export const toBytes = ( commandId: number, commandData: types.TBytes = [] ): types.TBytes => {
    const headerData = header.toBytes(commandId, commandData.length);

    return [...headerData, ...commandData];
};


// export const toJson = ( commandId: number, parameters: object ): object => {

// };
