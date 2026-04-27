import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../utils/binary/BinaryBuffer.js';


/**
 * Command general properties.
 */
export interface ICommand {
    id: types.TCommandId,
    name?: types.TCommandName,
    headerSize?: number,
    parameters?: object,
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
    error: {
        code: number,
        name: string,
        message?: string
    }
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

    fromBytes ( bytes: types.TBytes ),
    toBytes ( parameters?: object ): types.TBytes
}


export const toBytes = ( commandId: types.TCommandId, commandBytes: types.TBytes = [] ): types.TBytes => {
    // length byte + header size (2 bytes) + body size
    const size = 1 + 2 + commandBytes.length;
    const buffer: IBinaryBuffer = new BinaryBuffer(size, false);

    buffer.setUint8(size);
    buffer.setUint16(commandId as number);

    if ( commandBytes.length ) {
        buffer.setBytes(commandBytes);
    }

    return buffer.data;
};
