/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */

import {TBytes} from '../../types.js';
import {IMessage, IInvalidMessage} from './types.js';
import {TCommand, ICommandConfig} from '../utils/command.js';
// import * as downlinkCommands from '../commands/downlink/index.js';
//import * as uplinkCommands from '../commands/uplink/index.js';

//import Command, {ICommandBinary} from '../../.src/analog/Command.js';
//import UnknownCommand from '../../.src/analog/UnknownCommand.js';
//import {requestById, responseById} from '../../.src/analog/constants/commandRelations.js';

//import * as directionTypes from '../../.src/constants/directions.js';
//import {AUTO, DOWNLINK, UPLINK} from '../../.src/constants/directions.js';

import * as header from '../utils/header.js';
//import {IHexFormatOptions} from '../config.js';
import calculateLrc from '../../utils/calculateLrc.js';
// import getBytesFromHex from '../utils/getBytesFromHex.js';
// import getBytesFromBase64 from '../utils/getBytesFromBase64.js';
// import getHexFromBytes from '../utils/getHexFromBytes.js';
// import getBase64FromBytes from '../utils/getBase64FromBytes.js';
//import mergeUint8Arrays from '../../.src/utils/mergeUint8Arrays.js';


// interface IMessageCommand {
//     data: ICommandBinary;
//     command: Command;
// }

// export interface IMessage {
//     commands: Array<IMessageCommand>,
//     lrc: {
//         expected: number | undefined,
//         actual: number
//     },
//     bytes: TBytes,
//     isValid: boolean
// }

// export interface IMessageConfig {
//     /** It is highly recommended to use a specific direction. */
//     //direction?: number,
//     hardwareType?: number
// }


const HEADER_MAX_SIZE = 3;

// export const downlinkCommandToBytes = {};
// export const downlinkCommandFromBytes = {};

// export const uplinkCommandToBytes = {};
// export const uplinkCommandFromBytes = {};

// all allowed types
//const directionTypeIds: Set<number> = new Set<number>(Object.values(directionTypes));


// const getCommand = ( id: number, data: TBytes, direction = AUTO, hardwareType?: number ): Command => {
//     if ( !directionTypeIds.has(direction) ) {
//         throw new Error('wrong direction type');
//     }

//     const downlinkCommand = requestById.get(id);
//     const uplinkCommand = responseById.get(id);

//     // check command availability
//     if (
//         (!downlinkCommand && !uplinkCommand)
//         || (direction === DOWNLINK && !downlinkCommand)
//         || (direction === UPLINK && !uplinkCommand)
//     ) {
//         // missing command implementation
//         return new UnknownCommand({id, data});
//     }

//     try {
//         // the specific direction
//         if ( direction === DOWNLINK || direction === UPLINK ) {
//             const command = direction === UPLINK ? uplinkCommand : downlinkCommand;

//             return command!.fromBytes(data, {hardwareType}) as Command;
//         }

//         // direction autodetect
//         try {
//             // uplink should be more often
//             return uplinkCommand!.fromBytes(data, {hardwareType}) as Command;
//         } catch {
//             return downlinkCommand!.fromBytes(data) as Command;
//         }
//     } catch {
//         // something wrong with command
//         return new UnknownCommand({id, data});
//     }
// };

// export const getCommands = ( message: IMessage, isStrict: boolean = false ): Array<Command> => {
//     if ( isStrict && !message.isValid ) {
//         return [];
//     }

//     return message.commands.map(({command}) => command);
// };

// export const fromBytes = ( data: TBytes, config?: ICommandConfig ): IMessage => {
//     const direction = config?.direction ?? AUTO;
//     const hardwareType = config?.hardwareType;
//     const commands: Array<IMessageCommand> = [];
//     const result: IMessage = {
//         commands,
//         lrc: {expected: undefined, actual: 0},
//         isValid: false,
//         bytes: data
//     };
//     let processedBytes = 0;
//     let expectedLrc;
//     let actualLrc;

//     // process the data except the last byte
//     do {
//         const headerInfo = header.fromBytes(data.slice(processedBytes, processedBytes + HEADER_MAX_SIZE));
//         const headerData = data.slice(processedBytes, processedBytes + headerInfo.headerSize);
//         const bodyData = data.slice(processedBytes + headerInfo.headerSize, processedBytes + headerInfo.headerSize + headerInfo.commandSize);
//         let command: Command;

//         // shift
//         processedBytes = processedBytes + headerInfo.headerSize + headerInfo.commandSize;

//         try {
//             command = getCommand(headerInfo.commandId, bodyData, direction, hardwareType);
//         } catch ( error ) {
//             command = UnknownCommand.fromBytes(bodyData, headerInfo.commandId);
//         }

//         commands.push({
//             data: {
//                 header: headerData,
//                 body: bodyData,
//                 bytes: [...headerData, ...bodyData]
//             },
//             command
//         });
//     } while ( processedBytes < data.length - 1 );

//     // check the last byte left unprocessed
//     if ( data.length - processedBytes === 1 ) {
//         // LRC is present
//         expectedLrc = data.at(-1);
//         actualLrc = calculateLrc(data.slice(0, -1));
//     } else {
//         // LRC is absent
//         actualLrc = calculateLrc(data);
//     }

//     result.lrc.actual = actualLrc;
//     result.lrc.expected = expectedLrc;
//     result.isValid = expectedLrc === actualLrc;

//     return result;
// };

// export const fromHex = ( data: string, config?: ICommandConfig ) => (
//     fromBytes(getBytesFromHex(data), config)
// );

// export const fromBase64 = ( data: string, config?: ICommandConfig ) => (
//     fromBytes(getBytesFromBase64(data), config)
// );

// export const toMessage = ( commands: Array<Command> ): IMessage => {
//     const commandsBinary = commands.map(command => ({
//         command,
//         data: command.toBinary()
//     }));

//     const body = commandsBinary.flatMap(({data: {bytes}}) => Array.from(bytes));
//     const actualLrc = calculateLrc(body);

//     return {
//         commands: commandsBinary,
//         lrc: {
//             expected: actualLrc,
//             actual: actualLrc
//         },
//         bytes: [...body, actualLrc],
//         isValid: true
//     };
// };

// export const toBytes = ( commands: Array<ICommand> ): TBytes => {
//     const commandBytes = commands.map(command => command.toBytes());
//     const body = [...commandBytes];

//     return [...body, calculateLrc(body)];
// };

// export const toHex = ( commands: Array<Command>, options: IHexFormatOptions = {} ): string => getHexFromBytes(toBytes(commands), options);

// export const toBase64 = ( commands: Array<Command> ): string => getBase64FromBytes(toBytes(commands));


export const getFromBytes = ( fromBytesMap, nameMap ) => ( data: TBytes = [], config?: ICommandConfig ): IMessage | IInvalidMessage => {
    //const hardwareType = config?.hardwareType;
    const commands: Array<TCommand> = [];
    const message: IMessage = {
        commands,
        bytes: data,
        lrc: {expected: undefined, actual: 0}
    };
    let processedBytes = 0;
    let expectedLrc: number;
    let actualLrc: number;

    // process the data except the last byte
    do {
        const headerInfo = header.fromBytes(data.slice(processedBytes, processedBytes + HEADER_MAX_SIZE));
        const headerData = data.slice(processedBytes, processedBytes + headerInfo.headerSize);
        const bodyData = data.slice(processedBytes + headerInfo.headerSize, processedBytes + headerInfo.headerSize + headerInfo.commandSize);
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
            // command = {
            //     id: headerInfo.commandId,
            //     parameters: uplinkCommandFromBytes[headerInfo.commandId](bodyData, config),
            //     config,
            //     bytes: bodyData
            // };
            //command = getCommand(headerInfo.commandId, bodyData, direction, hardwareType);
            command.parameters = fromBytesMap[headerInfo.commandId](bodyData, config);
            commands.push(command);
        } catch ( error ) {
            //command = UnknownCommand.fromBytes(bodyData, headerInfo.commandId);
            // command = {
            //     id: headerInfo.commandId,
            //     bytes: bodyData
            // };
            commands.push({
                command,
                error: error.message
            });
        }

        // commands.push({
        //     data: {
        //         header: headerData,
        //         body: bodyData,
        //         bytes: [...headerData, ...bodyData]
        //     },
        //     command
        // });
    } while ( processedBytes < data.length - 1 );

    // check the last byte left unprocessed
    if ( data.length - processedBytes === 1 ) {
        // LRC is present
        expectedLrc = data[data.length - 1];
        actualLrc = calculateLrc(data.slice(0, -1));
    } else {
        // LRC is absent
        actualLrc = calculateLrc(data);
    }

    message.lrc.actual = actualLrc;
    message.lrc.expected = expectedLrc;
    //result.isValid = expectedLrc === actualLrc;

    if ( expectedLrc === actualLrc ) {
        return message;
    }

    return {
        message,
        error: 'mismatch LRC'
    };
};

export const getToBytes = toBytesMap => ( commands: Array<TCommand> ): TBytes => {
    const commandBytes = commands.map(command => {
        // valid command
        if ( 'parameters' in command ) {
            return toBytesMap[command.id](command.parameters, command.config);
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

        // try {
        //     const bytes = uplinkCommandToBytes[command.id](command.parameters, command.config);
        // } catch ( error ) {
        //     console.error(error);
        // }

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
            expected: lrc,
            actual: lrc
        }
    };
};

// export const downlink = {
//     fromBytes: getFromBytes(downlinkCommandFromBytes),
//     toBytes: getToBytes(downlinkCommandToBytes),
//     toMessage: getToMessage(downlinkCommandToBytes)
// };

// export const uplink = {
//     fromBytes: getFromBytes(uplinkCommandFromBytes),
//     toBytes: getToBytes(uplinkCommandToBytes),
//     toMessage: getToMessage(uplinkCommandToBytes)
// };


// for ( const commandName in uplinkCommands ) {
//     uplinkCommands[]
// }

// // fill maps
// // iteration should not be used because of webpack/rollup processing!
// downlinkCommandToBytes[downlinkCommands.correctTime2000.id] = downlinkCommands.correctTime2000.toBytes;

// uplinkCommandToBytes[uplinkCommands.correctTime2000.id] = uplinkCommands.correctTime2000.toBytes;

//downlinkCommandFromBytes[downlinkCommands.correctTime2000.id] = downlinkCommands.correctTime2000.fromBytes;

// uplinkCommandFromBytes[uplinkCommands.correctTime2000.id] = uplinkCommands.correctTime2000.fromBytes;
