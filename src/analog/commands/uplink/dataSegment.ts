/**
 * Transfer data by breaking it into segments.
 *
 * This command is currently used only in module with hardware type MTXLora.
 * This command could be used as uplink or downlink command.
 * The module can send DataSegment command as the response to the request or without any request.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as dataSegment from 'jooby-codec/analog/commands/uplink/dataSegment.js';
 *
 * // 4 first channels
 * const bytes = [0x02, 0x53, 0x00, 0x01, 0x02, 0x03, 0x04];
 *
 * // decoded payload
 * const parameters = dataSegment.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     segmentationSessionId: 2,
 *     segmentIndex: 3,
 *     segmentsNumber: 5,
 *     isLast: false,
 *     data: [0x00, 0x01, 0x02, 0x03, 0x04]
 * };
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/DataSegment.md#response)
 */

export * from '../downlink/dataSegment.js';
