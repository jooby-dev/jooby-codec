import * as types from '../../types.js';


/**
 * Command general properties.
 */
export interface ICommand {
    id: types.TCommandId,
    name?: types.TCommandName,
    headerSize?: number,
    parameters?: object,
    //config?: ICommandConfig,
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

    fromBytes ( data: types.TBytes ),
    toBytes ( parameters?: object ): types.TBytes
}


export const toBytes = ( commandId: number, commandData: types.TBytes = [] ): types.TBytes => {
    const commandLength = commandData.length || 0;
    const headerData = [commandId, commandLength];

    if ( commandData && commandLength ) {
        return headerData.concat(commandData);
    }

    // simple command without body
    return headerData;

    // return [commandId, commandBytes.length, ...commandBytes]
};
