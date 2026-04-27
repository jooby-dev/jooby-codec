/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */

import {TBytes, TCommandId} from '../../types.js';
import {TMessage, IMessage} from './types.js';
import {TCommand} from '../utils/command.js';
import * as resultCodes from '../constants/resultCodes.js';
import resultNames from '../constants/resultNames.js';
import {uplinkById} from '../commands/index.js';
import getHexFromBytes from '../../utils/getHexFromBytes.js';


const HEADER_SIZE = 3;
const SEPARATOR = [0xff, 0xff];
const COMMON_ERROR_SIZE = 4;


export const getFromBytes = ( fromBytesMap, nameMap ) => ( bytes: TBytes = [] ): TMessage => {
    const commands: Array<TCommand> = [];
    const message: IMessage = {
        commands,
        bytes
    };
    let processedBytes = 0;

    if ( bytes.length === 0 ) {
        return message;
    }

    do {
        // skip 0xffff separator
        if ( bytes[processedBytes] === SEPARATOR[0] && bytes[processedBytes + 1] === SEPARATOR[1] ) {
            processedBytes += 2;

            // eslint-disable-next-line no-continue
            continue;
        }

        // total command size (includes size byte itself)
        const size = bytes[processedBytes];
        // command id
        const id = bytes[processedBytes + 2] | (bytes[processedBytes + 1] << 8);
        // complete command data (header + body)
        const commandData = bytes.slice(processedBytes, processedBytes + size);
        // everything after size + id bytes is optional body
        const bodyData = bytes.slice(processedBytes + HEADER_SIZE, processedBytes + size);

        // shift
        processedBytes = processedBytes + HEADER_SIZE + size - 1;

        // id is not a known command id and it looks like an error response
        if ( !uplinkById[id] && size === COMMON_ERROR_SIZE ) {
            const [, maskedFunctionCode, attribute, resultCode] = commandData;
            const functionCode = maskedFunctionCode & ~0x80;
            const commandId: TCommandId = (functionCode << 8) | attribute;
            const commandIdHex = getHexFromBytes([functionCode]) + getHexFromBytes([attribute]);
            const commandImplementation = uplinkById[commandId];
            const command = {
                id: commandId,
                name: commandImplementation?.name,
                headerSize: HEADER_SIZE,
                bytes: commandData
            };
            const error = {
                code: resultCode,
                name: resultNames[resultCode],
                message: `Error response for command 0x${commandIdHex} (${command.name}): ${resultCode} (${resultNames[resultCode]})!`
            };

            commands.push({command, error});

            // eslint-disable-next-line no-continue
            continue;
        }

        const command: TCommand = {
            id,
            name: nameMap[id],
            headerSize: HEADER_SIZE,
            bytes: commandData
        };

        // converter from command bytes to parameters
        const fromBytes = fromBytesMap[id];

        if ( fromBytes ) {
            try {
                command.parameters = fromBytes(bodyData);
                commands.push(command);
            } catch ( error ) {
                commands.push({
                    command,
                    error: {
                        code: resultCodes.DECODE_ERROR,
                        name: resultNames[resultCodes.DECODE_ERROR],
                        message: error.message
                    }
                });
            }
        } else {
            commands.push({
                command,
                error: {
                    code: resultCodes.UNKNOWN_COMMAND,
                    name: resultNames[resultCodes.UNKNOWN_COMMAND],
                    message: `Unsupported command id: ${id}!`
                }
            });
        }
    } while ( processedBytes < bytes.length - 1 );

    return message;
};

export const getToBytes = toBytesMap => ( commands: Array<TCommand> ): TBytes => {
    const commandBytes = commands.map(command => {
        // valid command
        if ( 'id' in command ) {
            return toBytesMap[command.id](command.parameters || {});
        }

        // invalid command
        if ( 'command' in command ) {
            return command.command.bytes;
        }

        // everything else
        throw new Error('wrong command format');
    });

    const body = commandBytes.reduce(
        (accumulator, bytes, index) => {
            if ( index === 0 ) {
                return bytes;
            }

            return [...accumulator, ...SEPARATOR, ...bytes];
        },
        []
    );

    return body;
};
