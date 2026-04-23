import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../utils/binary/BinaryBuffer.js';
// import {uplinkById} from '../commands/index.js';
import resultNames from '../constants/resultNames.js';


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
    commandId: types.TCommandId,
    error: {
        code: number,
        name: string
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


/**
 * Extract error information from command bytes.
 *
 * Wrong request: `0x032401`
 * Response with error: `0x04a40103`
 * (a4 = (24 | 80), 01 - repeat function code from request, 03 - FUNCTION_NOT_FOUND)
 *
 * @todo: for /Get_LogRecord it's possible to get 5 bytes error response
 *
 * @param bytes - 4 or 5 bytes response with error information
 * @returns {command, error} or null if not error
 */
export const getErrorInfo = ( bytes: types.TBytes = [] ): IInvalidCommand => {
    if ( bytes.length === 0 || bytes.length !== 4 ) {
        return null;
    }

    const [, maskedFunctionCode, attribute, resultCode] = bytes;
    const functionCode = maskedFunctionCode & ~0x80;
    const commandId: types.TCommandId = (functionCode << 8) | attribute;

    return {
        // command: uplinkById[commandId] || {id: commandId, name: 'unknown command'},
        commandId,
        error: {
            code: resultCode,
            name: resultNames[resultCode]
        }
    };
};
