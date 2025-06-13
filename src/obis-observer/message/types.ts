import {TBytes} from '../../types.js';
import {TCommand} from '../utils/command.js';


/**
 * @example single getArchiveState command
 * ```js
 * {
 *     bytes: [0x10, 0x0d, 0x02, 0x00, 0x00, 0x00, 0x51, 0x2c, 0x2d, 0xea, 0xae, 0x2c, 0x2f, 0x0a, 0xf6],
 *     commands: [
 *         {
 *             id: 16,
 *             name: 'getArchiveState',
 *             headerSize: 2,
 *             bytes: [
 *                 16, 13, 2, 0, 0, 0, 81, 44, 45, 234, 174, 44, 47, 10, 246
 *             ],
 *             parameters: {
 *                 requestId: 2,
 *                 archiveRecordsNumber: 81,
 *                 eldestTime2000: 741206702,
 *                 newestTime2000: 741280502
 *             }
 *         }
 *     ]
 * }
 * ```
 */
export interface IMessage {
    commands: Array<TCommand>,
    bytes: TBytes
}

/**
 * @example single getArchiveState command
 * ```js
 * {
 *    message: {
 *        bytes: [16, 13, 2, 0, 0, 0, 81, 44, 45, 234, 174, 44, 47, 10, 246],
 *        commands: [
 *            {
 *                id: 16,
 *                name: 'getArchiveState',
 *                headerSize: 2,
 *                bytes: [
 *                    16, 13, 2, 0, 0, 0, 81, 44, 45, 234, 174, 44, 47, 10, 246
 *                ],
 *                parameters: {
 *                    requestId: 2,
 *                    archiveRecordsNumber: 81,
 *                    eldestTime2000: 741206702,
 *                    newestTime2000: 741280502
 *                }
 *            }
 *        ]
 *    },
 *    error: 'Wrong buffer size: 50.'
 *}
 * ```
 */
export interface IInvalidMessage {
    message: IMessage,
    error: string
}

type TExampleName = string;
export type TMessageExamples = Record<TExampleName, IMessage | IInvalidMessage>;
