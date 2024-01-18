import DataSegmentBase from '../DataSegmentBase.js';
import {UPLINK} from '../../../constants/directions.js';


/**
 * Uplink command.
 *
 * @example
 * ```js
 * import DataSegment from 'jooby-codec/mtxLora/commands/uplink/DataSegment.js';
 *
 * const commandBody = new Uint8Array([
 *     0x1e, 0x07, 0x02, 0x53, 0x00, 0x01, 0x02, 0x03, 0x04
 * ]);
 * const command = DataSegment.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     segmentationSessionId: 2,
 *     last: false,
 *     segmentsNumber: 5,
 *     segmentIndex: 3,
 *     data: Uint8Array(3) [0, 1, 2, 3, 4, buffer: ...
 * }
 * ```
 */
export default class DataSegment extends DataSegmentBase {
    static readonly directionType = UPLINK;
}
