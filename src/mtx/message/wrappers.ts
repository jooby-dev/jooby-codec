/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/default-param-last */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */

import {TBytes} from '../../types.js';
import {IMessage, IInvalidMessage} from './types.js';
import {TCommand} from '../utils/command.js';


const HEADER_MAX_SIZE = 2;

// to build IMessage from bytes
export interface IFromBytesOptions {
    withMtxLora?: boolean,
    aesKey?: Uint8Array
}


export const getFromBytes = ( fromBytesMap, nameMap ) => ( data: TBytes = [], config: IFromBytesOptions ) => {
    // TODO: add implementation
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


export const getToMessage = toBytesMap => ( commands: Array<TCommand> ) => {
    // TODO: add implementation
};
