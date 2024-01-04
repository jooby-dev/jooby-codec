import MtxCommandBase from '../../MtxCommandBase.js';
import CommandBinaryBuffer from '../../CommandBinaryBuffer.js';
import {UPLINK} from '../../../constants/directions.js';


/**
 * Uplink command.
 *
 * @example
 * ```js
 * import MtxCommand from 'jooby-codec/mtxLora/commands/uplink/MtxCommand.js';
 *
 * const commandBody = new Uint8Array([
 *     0x1e, 0x07, 0x02, 0x53, 0x00, 0x01, 0x02, 0x03, 0x04
 * ]);
 * const command = MtxCommand.fromBytes(commandBody);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     sequence: 2,
 *     last: false,
 *     fragmentsNumber: 5,
 *     fragmentIndex: 3,
 *     data: Uint8Array(3) [0, 1, 2, 3, 4, buffer: ...
 * }
 * ```
 *
 */
export default class MtxCommand extends MtxCommandBase {
    static readonly directionType = UPLINK;

    // data - only body (without header)
    static fromBytes ( data: Uint8Array ) {
        const buffer = new CommandBinaryBuffer(data);

        return new MtxCommand(buffer.getMtxCommand());
    }
}
