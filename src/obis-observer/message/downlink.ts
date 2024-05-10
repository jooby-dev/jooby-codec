/**
 * SHOULD BE REWORKED!
 *
 * Process messages to send to devices.
 *
 * @example
 * ```js
 * import * as message from 'jooby-codec/mtx/message/downlink';
 * import * as downlinkCommands from 'jooby-codec/mtx/commands/downlink';
 * import getHexFromBytes from 'jooby-codec/utils/getHexFromBytes.js';
 * import * as frameTypes from 'jooby-codec/mtx/constants/frameTypes.js';
 *
 * const aesKey = [...Array(16).keys()];
 * const messageId = 10;
 *
 * const commands = [
 *     {
 *         id: downlinkCommands.setDateTime.id,
 *         parameters: {
 *             isSummerTime: false,
 *             seconds: 55,
 *             minutes: 31,
 *             hours: 18,
 *             day: 2,
 *             date: 19,
 *             month: 2,
 *             year: 24
 *         }
 *     }
 * ];
 * const bytes = message.toBytes(
 *     commands,
 *     {
 *         messageId,
 *         accessLevel: downlinkCommands.setDateTime.accessLevel,
 *         aesKey
 *     }
 * );
 *
 * console.log('message encoded:', JSON.stringify(bytes));
 * // output:
 * [10,19,237,116,10,174,74,186,200,66,196,27,231,245,13,60,40,132]
 *
 * console.log('message encoded in HEX:', getHexFromBytes(bytes));
 * // output:
 * '0a 13 ed 74 0a ae 4a ba c8 42 c4 1b e7 f5 0d 3c 28 84'
 *
 *
 * const frameBytes = message.toFrame(
 *     bytes,
 *     {
 *         type: frameTypes.DATA_REQUEST,
 *         source: 0xffff,
 *         destination: 0xaaaa
 *     }
 * );
 *
 * console.log('frame encoded:', frameBytes);
 * // output:
 * [126,80,170,170,255,255,10,125,51,237,116,10,174,74,186,200,66,196,27,231,245,13,60,40,132,97,187,126]
 *
 * console.log('frame encoded in HEX:', getHexFromBytes(frameBytes));
 * // output:
 * '7e 50 aa aa ff ff 0a 7d 33 ed 74 0a ae 4a ba c8 42 c4 1b e7 f5 0d 3c 28 84 61 bb 7e'
 *
 *
 * // decode message back from bytes
 * const parsedMessage = message.fromBytes(bytes, {aesKey});
 *
 * console.log('parsed message:', parsedMessage);
 * // output:
 * {
 *     messageId: 3,
 *     accessLevel: 3,
 *     commands: [
 *       {
 *         id: 8,
 *         name: 'setDateTime',
 *         headerSize: 2,
 *         bytes: [Array],
 *         parameters: [Object]
 *       }
 *     ],
 *     bytes: [
 *         3,  19, 237, 116,  10, 174,
 *        74, 186, 200,  66, 196,  27,
 *       231, 245,  13,  60,  40, 132
 *     ],
 *     lrc: { expected: 119, actual: 119 }
 * }
 *
 * // decode message back from frame
 * const parsedFrame = message.fromFrame(frameBytes, {aesKey});
 *
 * console.log('parsed frame:', parsedFrame);
 * // output:
 * {
 *     type: 80,
 *     destination: 43690,
 *     source: 65535,
 *     messageId: 10,
 *     accessLevel: 3,
 *     commands: [
 *       {
 *         id: 8,
 *         name: 'setDateTime',
 *         headerSize: 2,
 *         bytes: [Array],
 *         parameters: [Object]
 *       }
 *     ],
 *     bytes: [
 *        10,  19, 237, 116,  10, 174,
 *        74, 186, 200,  66, 196,  27,
 *       231, 245,  13,  60,  40, 132
 *     ],
 *     lrc: { expected: 119, actual: 119 },
 *     crc: 25019
 * }
 * ```
 *
 * @packageDocumentation
 */

import * as commands from '../commands/downlink/index.js';
import * as wrappers from './wrappers.js';


export const toBytesMap = {};
export const fromBytesMap = {};
export const nameMap = {};

export const fromBytes = wrappers.getFromBytes(fromBytesMap, nameMap);
export const toBytes = wrappers.getToBytes(toBytesMap);

// fill maps
// iteration should not be used
toBytesMap[commands.getArchiveState.id] = commands.getArchiveState.toBytes;
toBytesMap[commands.getLorawanInfo.id] = commands.getLorawanInfo.toBytes;
toBytesMap[commands.getLorawanState.id] = commands.getLorawanState.toBytes;
toBytesMap[commands.getMeterDate.id] = commands.getMeterDate.toBytes;
toBytesMap[commands.getMeterId.id] = commands.getMeterId.toBytes;
toBytesMap[commands.getMeterIdList.id] = commands.getMeterIdList.toBytes;
toBytesMap[commands.setupObis.id] = commands.setupObis.toBytes;

// because of webpack/rollup processing!
fromBytesMap[commands.getArchiveState.id] = commands.getArchiveState.fromBytes;
fromBytesMap[commands.getLorawanInfo.id] = commands.getLorawanInfo.fromBytes;
fromBytesMap[commands.getLorawanState.id] = commands.getLorawanState.fromBytes;
fromBytesMap[commands.getMeterDate.id] = commands.getMeterDate.fromBytes;
fromBytesMap[commands.getMeterId.id] = commands.getMeterId.fromBytes;
fromBytesMap[commands.getMeterIdList.id] = commands.getMeterIdList.fromBytes;
fromBytesMap[commands.setupObis.id] = commands.setupObis.fromBytes;

nameMap[commands.getArchiveState.id] = commands.getArchiveState.name;
nameMap[commands.getLorawanInfo.id] = commands.getLorawanInfo.name;
nameMap[commands.getLorawanState.id] = commands.getLorawanState.name;
nameMap[commands.getMeterDate.id] = commands.getMeterDate.name;
nameMap[commands.getMeterId.id] = commands.getMeterId.name;
nameMap[commands.getMeterIdList.id] = commands.getMeterIdList.name;
nameMap[commands.setupObis.id] = commands.setupObis.name;
