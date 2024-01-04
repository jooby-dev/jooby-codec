import MtxCommandBase from '../../MtxCommandBase.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {DOWNLINK} from '../../../constants/directions.js';


/**
 * Downlink command.
 *
 * @example
 * ```js
 * import MtxCommand from 'jooby-codec/mtxLora/commands/downlink/MtxCommand.js';
 *
 * const command = new MtxCommand({
 *     sequence: 2,
 *     last: false,
 *     fragmentsNumber: 5,
 *     fragmentIndex: 3,
 *     data: getBytesFromHex('00 01 02 03 04')
 * });
 *
 * // output command binary in hex representation
 * console.log(command.toHex());
 * // 1e 07 02 53 00 01 02 03 04
 * ```
 *
 */
export default class MtxCommand extends MtxCommandBase {
    static readonly directionType = DOWNLINK;

    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new MtxCommand(buffer.getMtxCommand());
    }
}
