/**
 * Process messages received from devices.
 *
 * @example
 * ```js
 * import * as message from 'jooby-codec/analog-ultrasound/message/uplink';
 *
 * // binary data received from a device
 * const bytes = [0x07, 0x22, 0x18, 0xc0, 0x5d, 0x20, 0x4e];
 *
 * // decode it
 * const payload = message.fromBytes(bytes);
 *
 * if ( 'error' in payload ) {
 *     console.log('decode failure:', payload.error, payload.message);
 * } else {
 *     console.log('message decoded:', payload.commands);
 *     // output:
 *     [
 *         {
 *             id: 8728,
 *             name: "getDepassivationConfig",
 *             headerSize: 3,
 *             bytes: [ 7, 34, 24, 192, 93, 32, 78 ],
 *             parameters: { resistanceStartThreshold: 24000, resistanceStopThreshold: 20000 }
 *         }
 *     ]
 * }
 * ```
 *
 * @packageDocumentation
 */

import * as commands from '../commands/uplink/index.js';
import * as wrappers from './wrappers.js';
import uplinkNames from '../constants/uplinkNames.js';


export const toBytesMap = {};
export const fromBytesMap = {};
export const nameMap = uplinkNames;

export const fromBytes = wrappers.getFromBytes(fromBytesMap, nameMap);
export const toBytes = wrappers.getToBytes(toBytesMap);


// fill maps
// iteration should not be used
toBytesMap[commands.getDepassivationConfig.id] = commands.getDepassivationConfig.toBytes;
toBytesMap[commands.setDepassivationConfig.id] = commands.setDepassivationConfig.toBytes;

// because of webpack/rollup processing!
fromBytesMap[commands.getDepassivationConfig.id] = commands.getDepassivationConfig.fromBytes;
fromBytesMap[commands.setDepassivationConfig.id] = commands.setDepassivationConfig.fromBytes;
