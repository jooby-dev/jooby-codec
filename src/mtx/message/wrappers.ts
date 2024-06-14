/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {TBytes} from '../../types.js';
import {IMessage, IInvalidMessage} from './types.js';
import {TCommand} from '../utils/command.js';
import {aes} from '../utils/crypto.js';
import * as accessLevels from '../constants/accessLevels.js';
import calculateLrc from '../../utils/calculateLrc.js';


// to serialize IMessage to bytes
export interface IToBytesOptions {
    messageId: number,
    accessLevel?: number,
    aesKey?: TBytes
}

// to build IMessage from bytes
export interface IFromBytesOptions {
    aesKey?: TBytes
}

// bitmask to extract/apply access level
const ACCESS_LEVEL_MASK = 0x03;

const MESSAGE_HEADER_SIZE = 2;
const BLOCK_SIZE = 16;

// should be places at the end of all command bodies
const COMMANDS_END_MARK = [0];

const COMMAND_HEADER_SIZE = 2;


export const getFromBytes = ( fromBytesMap, nameMap ) => ( bytes: TBytes = [], config: IFromBytesOptions = {} ): IMessage | IInvalidMessage => {
    const aesKey = config?.aesKey;
    const commands: Array<TCommand> = [];
    const [messageId, maskedAccessLevel] = bytes;
    const accessLevel = maskedAccessLevel & ACCESS_LEVEL_MASK;
    const message: IMessage = {
        messageId,
        accessLevel,
        commands,
        bytes,
        lrc: {expected: undefined, actual: 0}
    };
    let messageBody = bytes.slice(MESSAGE_HEADER_SIZE);
    let error;

    if ( aesKey && accessLevel !== accessLevels.UNENCRYPTED ) {
        messageBody = [...aes.decrypt(aesKey, messageBody)];
    }

    // take from the end
    const expectedLrc = messageBody[messageBody.length - 1];

    // remove lrc from message
    messageBody = messageBody.slice(0, -1);
    const actualLrc = calculateLrc(messageBody);

    if ( accessLevel !== accessLevels.UNENCRYPTED || expectedLrc !== 0 ) {
        if ( expectedLrc !== actualLrc ) {
            error = 'Mismatch LRC.';
        }
    }

    const accessLevel2 = messageBody[0] & ACCESS_LEVEL_MASK;
    const commandsData = messageBody.slice(1);

    if ( accessLevel !== accessLevel2 ) {
        error = 'Mismatch access levels.';
    }

    let position = 0;

    do {
        const commandId = commandsData[position];
        const commandBodySize = commandsData[position + 1];
        const commandSize = COMMAND_HEADER_SIZE + commandBodySize;
        const commandBody = commandsData.slice(
            position + COMMAND_HEADER_SIZE,
            position + commandSize
        );
        const command: TCommand = {
            id: commandId,
            name: nameMap[commandId],
            headerSize: COMMAND_HEADER_SIZE,
            bytes: commandsData.slice(position, position + commandSize)
        };

        // invalid command or padding zeros after decryption
        if ( !commandId ) {
            break;
        }

        try {
            if ( !fromBytesMap[commandId] ) {
                throw new Error(`Unsupported command id: ${commandId}!`);
            }

            command.parameters = fromBytesMap[commandId](commandBody, config);
            commands.push(command);
        } catch ( exception ) {
            commands.push({
                command,
                error: exception.message
            });
        }

        position += commandSize;
    } while ( position <= commandsData.length );

    message.lrc.actual = actualLrc;
    message.lrc.expected = expectedLrc;

    if ( error ) {
        return {
            message,
            error
        };
    }

    return message;
};


export const getToBytes = toBytesMap => ( commands: Array<TCommand>, {messageId, accessLevel = accessLevels.UNENCRYPTED, aesKey}: IToBytesOptions ): TBytes => {
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

    const maskedAccessLevel = accessLevel | 0x10;

    // always unencrypted header
    const header = [messageId, maskedAccessLevel];
    // accessLevel + all commands (can be encrypted) + 0 as commands end mark
    let body = [].concat(maskedAccessLevel, ...commandBytes, COMMANDS_END_MARK);

    if ( accessLevel !== accessLevels.UNENCRYPTED ) {
        const padding = (body.length + 1) % BLOCK_SIZE;

        if ( padding ) {
            body = body.concat(new Array(BLOCK_SIZE - padding).fill(0));
        }
    }

    body = body.concat(calculateLrc(body));

    if ( aesKey && accessLevel !== accessLevels.UNENCRYPTED ) {
        body = [...aes.encrypt(aesKey, body)];
    }

    return header.concat(body);
};


// TODO: add implementation
//export const getToMessage = toBytesMap => ( commands: Array<TCommand> ) => {};
