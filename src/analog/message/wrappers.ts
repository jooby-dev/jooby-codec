/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */

import {TBytes} from '../../types.js';
import {IMessage, IInvalidMessage} from './types.js';
import {TCommand, ICommandConfig} from '../utils/command.js';
import * as header from '../utils/header.js';
import calculateLrc from '../../utils/calculateLrc.js';


const HEADER_MAX_SIZE = 3;


export const getFromBytes = ( fromBytesMap, nameMap ) => ( bytes: TBytes = [], config?: ICommandConfig ): IMessage | IInvalidMessage => {
    const commands: Array<TCommand> = [];
    const message: IMessage = {
        commands,
        bytes,
        lrc: {received: undefined, calculated: 0}
    };
    let processedBytes = 0;
    let receivedLrc: number;
    let calculatedLrc: number;

    if ( !bytes.length ) {
        return message;
    }

    // process the data except the last byte
    do {
        const headerInfo = header.fromBytes(bytes.slice(processedBytes, processedBytes + HEADER_MAX_SIZE));
        const headerData = bytes.slice(processedBytes, processedBytes + headerInfo.headerSize);
        const bodyData = bytes.slice(processedBytes + headerInfo.headerSize, processedBytes + headerInfo.headerSize + headerInfo.commandSize);
        const command: TCommand = {
            id: headerInfo.commandId,
            name: nameMap[headerInfo.commandId],
            headerSize: headerInfo.headerSize,
            bytes: [...headerData, ...bodyData]
        };

        // shift
        processedBytes = processedBytes + headerInfo.headerSize + headerInfo.commandSize;

        if ( config ) {
            command.config = config;
        }

        try {
            if ( !fromBytesMap[headerInfo.commandId] ) {
                throw new Error(`Unsupported command id: ${headerInfo.commandId}!`);
            }

            command.parameters = fromBytesMap[headerInfo.commandId](bodyData, config);
            commands.push(command);
        } catch ( error ) {
            commands.push({
                command,
                error: error.message
            });
        }
    } while ( processedBytes < bytes.length - 1 );

    // check the last byte left unprocessed
    if ( bytes.length - processedBytes === 1 ) {
        // LRC is present
        receivedLrc = bytes[bytes.length - 1];
        calculatedLrc = calculateLrc(bytes.slice(0, -1));
    } else {
        // LRC is absent
        calculatedLrc = calculateLrc(bytes);
    }

    message.lrc.calculated = calculatedLrc;
    message.lrc.received = receivedLrc;

    if ( receivedLrc === calculatedLrc ) {
        return message;
    }

    return {
        message,
        error: 'Mismatch LRC.'
    };
};

export const getToBytes = toBytesMap => ( commands: Array<TCommand> ): TBytes => {
    const commandBytes = commands.map(command => {
        // valid command
        if ( 'id' in command ) {
            return toBytesMap[command.id](command.parameters || {}, command.config);
        }

        // invalid command
        if ( 'command' in command ) {
            return command.command.bytes;
        }

        // everything else
        throw new Error('wrong command format');
    });
    const body = [].concat(...commandBytes);

    return [...body, calculateLrc(body)];
};

export const getToMessage = toBytesMap => ( commands: Array<TCommand> ): IMessage => {
    const commandsWithBytes = commands.map(command => {
        // valid command
        if ( 'parameters' in command ) {
            return Object.assign({}, command, {
                bytes: toBytesMap[command.id](command.parameters, command.config)
            });
        }

        // everything else
        throw new Error('wrong command format');
    });
    const commandBytes = commandsWithBytes.map(({bytes}) => bytes);
    const body = [].concat(...commandBytes);
    const lrc = calculateLrc(body);

    return {
        commands: commandsWithBytes,
        bytes: [...body, lrc],
        lrc: {
            received: lrc,
            calculated: lrc
        }
    };
};
