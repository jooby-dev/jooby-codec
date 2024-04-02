/**
 * Process messages received from devices.
 *
 * @example
 * ```js
 * import * as message from 'jooby-codec/analog/message/uplink';
 *
 * // binary data received from a device
 * const bytes = [0x0c, 0x01, 0x00, 0x58];
 *
 * // decode it
 * const payload = message.fromBytes(bytes);
 *
 * if ( 'error' in payload ) {
 *     console.log('decode failure:', payload.error, payload.message);
 * } else {
 *     console.log('message decoded:', payload.commands);
 *     // [
 *     //     {
 *     //         id: 12,
 *     //         headerSize: 2,
 *     //         bytes: [ 12, 1, 0 ],
 *     //         parameters: { status: 0 }
 *     //     }
 *     // ]
 * }
 * ```
 *
 * @packageDocumentation
 */

import * as commands from '../commands/uplink/index.js';
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
