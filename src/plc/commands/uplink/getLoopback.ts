/**
 * Uplink command Returns the received data exactly as it was sent,
 * confirming that the communication link is functioning correctly.
 *
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getLoopback from 'jooby-codec/plc/commands/uplink/getLoopback.js';
 *
 * const parameters = {
 *     data: [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f]
 * };
 *
 * const bytes = [8, 16, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
 *
 * // decoded payload
 * const parameters = getLoopback.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
 * }
 * ```
 */

export * from '../downlink/getLoopback.js';
