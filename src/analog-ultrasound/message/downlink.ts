/**
 * Process messages to send to devices.
 *
 * @example
 * ```js
 * import * as message from 'jooby-codec/analog-ultrasound/message/downlink';
 * import * as downlinkCommands from 'jooby-codec/analog-ultrasound/commands/downlink';
 * import getHexFromBytes from 'jooby-codec/utils/getHexFromBytes.js';
 *
 * const commands = [
 *     {
 *         id: downlinkCommands.setDepassivationConfig.id,
 *         parameters: {resistanceStartThreshold: 24000, resistanceStopThreshold: 20000}
 *     }
 * ];
 * const bytes = message.toBytes(commands);
 *
 * console.log('message encoded:', JSON.stringify(bytes));
 * // output:
 * '[7, 34, 25, 192, 93, 32, 78]'
 *
 * console.log('message encoded in HEX:', getHexFromBytes(bytes));
 * // output:
 * '07 22 19 b8 88 a8 61'
 * ```
 *
 * @packageDocumentation
 */

import * as commands from '../commands/downlink/index.js';
import * as wrappers from './wrappers.js';
import downlinkNames from '../constants/downlinkNames.js';


export const toBytesMap = {};
export const fromBytesMap = {};
export const nameMap = downlinkNames;

export const fromBytes = wrappers.getFromBytes(fromBytesMap, nameMap);
export const toBytes = wrappers.getToBytes(toBytesMap);


// fill maps
// iteration should not be used
toBytesMap[commands.getDepassivationConfig.id] = commands.getDepassivationConfig.toBytes;
toBytesMap[commands.setDepassivationConfig.id] = commands.setDepassivationConfig.toBytes;


// because of webpack/rollup processing!
fromBytesMap[commands.getDepassivationConfig.id] = commands.getDepassivationConfig.fromBytes;
fromBytesMap[commands.setDepassivationConfig.id] = commands.setDepassivationConfig.fromBytes;
