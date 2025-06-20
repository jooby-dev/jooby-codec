import {TBytes} from '../../types.js';
import {TCommand} from '../utils/command.js';


/**
 * @example single correctTime2000 command
 * ```js
 * {
 *     bytes: [0x0c, 0x02, 0x2d, 0x88, 0xfe],
 *     commands: [
 *         {
 *             id: 12,
 *             headerSize: 2,
 *             parameters: {sequenceNumber: 45, seconds: -120},
 *             bytes: [0x0c, 0x02, 0x2d, 0x88]
 *         }
 *     ],
 *     lrc: {
 *         received: 0xfe,
 *         calculated: 0xfe
 *     }
 * }
 * ```
 */
export interface IMessage {
    commands: Array<TCommand>,
    bytes: TBytes,
    lrc: {
        received: number,
        calculated: number
    }
}

/**
 * @example single correctTime2000 command
 * ```js
 * {
 *    message: {
 *        bytes: [0x0c, 0x02, 0x2d, 0x88, 0x00],
 *        commands: [
 *            {
 *                id: 12,
 *                headerSize: 2,
 *                parameters: {sequenceNumber: 45, seconds: -120},
 *                bytes: [0x0c, 0x02, 0x2d, 0x88]
 *            }
 *        ],
 *        lrc: {
 *            received: 0,
 *            calculated: 0xfe
 *        }
 *    },
 *    error: 'Mismatch LRC.'
 *}
 * ```
 */
export interface IInvalidMessage {
    message: IMessage,
    error: string
}

type TExampleName = string;
export type TMessageExamples = Record<TExampleName, IMessage | IInvalidMessage>;
