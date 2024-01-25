import DataSegmentBase from '../DataSegmentBase.js';
import {DOWNLINK} from '../../../constants/directions.js';


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import DataSegment from 'jooby-codec/analog/commands/downlink/DataSegment.js';
 *
 * const command = new DataSegment({
 *     segmentationSessionId: 2,
 *     last: false,
 *     segmentsNumber: 5,
 *     segmentIndex: 3,
 *     data: getBytesFromHex('00 01 02 03 04')
 * });
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 1e 07 02 53 00 01 02 03 04
 * ```
 */
export default class DataSegment extends DataSegmentBase {
    static readonly directionType = DOWNLINK;
}
