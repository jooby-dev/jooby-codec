/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import {TBytes} from '../../types.js';
import {IMessage, IInvalidMessage} from './types.js';
import {TCommand} from '../utils/command.js';


const COMMAND_HEADER_SIZE = 2;


export const getFromBytes = ( fromBytesMap, nameMap ) => ( bytes: TBytes = [] ): IMessage | IInvalidMessage => {
    const commands: Array<TCommand> = [];
    const result: IMessage = {
        commands,
        bytes
    };

    let position = 0;

    do {
        const commandId = bytes[position];
        const commandSize = bytes[position + 1];
        const command: TCommand = {
            id: commandId,
            name: nameMap[commandId],
            headerSize: COMMAND_HEADER_SIZE,
            bytes: bytes.slice(position, position + COMMAND_HEADER_SIZE + commandSize)
        };

        position += 2;

        try {
            command.parameters = fromBytesMap[commandId](bytes.slice(position, position + commandSize));
            commands.push(command);
        } catch ( error ) {
            commands.push({
                command,
                error: error.message
            });
        }

        position += commandSize;
    } while ( position < bytes.length );

    return result;
};

export const getToBytes = toBytesMap => ( commands: Array<TCommand> ): TBytes => {
    const commandBytes = commands.map(command => {
        // valid command
        if ( 'parameters' in command ) {
            return toBytesMap[command.id](command.parameters);
        }

        // invalid command
        if ( 'command' in command ) {
            return command.command.bytes;
        }

        // everything else
        throw new Error('wrong command format');
    });

    return [].concat(...commandBytes);
};
