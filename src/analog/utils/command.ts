import * as types from '../../types.js';
import * as header from './header.js';


/**
 * Optional additional parameters to a command.
 */
export interface ICommandConfig {
    hardwareType?: number
}

/**
 * Command general properties.
 */
export interface ICommand {
    id: types.TCommandId,
    name?: types.TCommandName,
    headerSize?: number,
    parameters?: object,
    config?: ICommandConfig,
    bytes?: types.TBytes
}

/**
 * There are no parameters here.
 */
export interface IEmptyCommandParameters {}

/**
 * In case of an error wraps all command data with error message.
 */
export interface IInvalidCommand {
    command: ICommand,
    error: string
}

export type TCommand = ICommand | IInvalidCommand;

type TExampleName = string;

/**
 * Named command example data.
 */
export type TCommandExamples = Record<TExampleName, TCommand>;

/**
 * Command public interface exported from its module.
 */
export interface ICommandImplementation {
    id: types.TCommandId,
    name: types.TCommandName,
    headerSize: number,
    examples: TCommandExamples,

    fromBytes ( data: types.TBytes, config?: ICommandConfig ),
    toBytes ( parameters?: object, config?: ICommandConfig ): types.TBytes
}


export const toBytes = ( commandId: number, commandData: types.TBytes = [] ): types.TBytes => {
    const headerData = header.toBytes(commandId, commandData.length);

    return [...headerData, ...commandData];
};
