/**
 * Process messages to send to devices.
 *
 * @example
 * ```js
 * import * as message from 'jooby-codec/analog/message/downlink';
 * import * as downlinkCommands from 'jooby-codec/analog/commands/downlink';
 * import getHexFromBytes from 'jooby-codec/utils/getHexFromBytes.js';
 *
 * const commands = [
 *     {
 *         id: downlinkCommands.correctTime2000.id,
 *         parameters: {sequenceNumber: 45, seconds: -120}
 *     }
 * ];
 * const bytes = message.toBytes(commands);
 *
 * console.log('message encoded:', JSON.stringify(bytes));
 * // [12,2,45,136,254]
 *
 * console.log('message encoded in HEX:', getHexFromBytes(bytes));
 * // 0c 02 2d 88 fe
 * ```
 *
 * @packageDocumentation
 */

import * as commands from '../commands/downlink/index.js';
import * as wrappers from './wrappers.js';


export const toBytesMap = {};
export const fromBytesMap = {};

export const fromBytes = wrappers.getFromBytes(fromBytesMap);
export const toBytes = wrappers.getToBytes(toBytesMap);
export const toMessage = wrappers.getToMessage(toBytesMap);


// fill maps
// iteration should not be used
toBytesMap[commands.correctTime2000.id] = commands.correctTime2000.toBytes;

// because of webpack/rollup processing!
fromBytesMap[commands.correctTime2000.id] = commands.correctTime2000.fromBytes;
