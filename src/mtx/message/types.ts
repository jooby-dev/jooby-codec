import {TBytes, TAccessLevel} from '../types.js';
import {TCommand} from '../utils/command.js';


/**
 * @example single setDisplayParam command
 * ```js
 * {
 *     bytes: [0x5d, 0x05, 0x08, 0x04, 0x05, 0x06, 0x07, 0xfe],
 *     commands: [
 *         {
 *             id: 0x5d,
 *             headerSize: 2,
 *             parameters: {displayMode: 8, order: [4, 5, 6, 7]},
 *             bytes: [0x5d, 0x05, 0x08, 0x04, 0x05, 0x06, 0x07]
 *         }
 *     ],
 *     lrc: {
 *         expected: 0xfe,
 *         actual: 0xfe
 *     }
 * }
 * ```
 */
export interface IMessage {
    commands: Array<TCommand>,
    messageId: number,
    accessLevel: TAccessLevel,
    bytes: TBytes,
    lrc: {
        expected: number,
        actual: number
    }
}

/**
 * @example single setDisplayParam command
 * ```js
 * {
 *    message: {
 *        bytes: [0x5d, 0x05, 0x08, 0x04, 0x05, 0x06, 0x07, 0x00],
 *        commands: [
 *            {
 *                id: 0x5d,
 *                headerSize: 2,
 *                parameters: {displayMode: 8, order: [4, 5, 6, 7]},
 *                bytes: [0x5d, 0x05, 0x08, 0x04, 0x05, 0x06, 0x07]
 *            }
 *        ],
 *        lrc: {
 *            expected: 0,
 *            actual: 0xfe
 *        }
 *    },
 *    error: 'Mismatch LRC.'
 *}
 * ```
 */
export interface IInvalidMessage {
    message: IMessage,
    error: string,
}

type TExampleName = string;
export type TMessageExamples = Record<TExampleName, IMessage | IInvalidMessage>;
