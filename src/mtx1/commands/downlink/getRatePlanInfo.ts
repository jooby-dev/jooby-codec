/**
 * Downlink command to get device rate plan information.
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getRatePlanInfo from 'jooby-codec/mtx1/commands/downlink/getRatePlanInfo.js';
 *
 * const parameters = {tariffTable: 5};
 * const bytes = getRatePlanInfo.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [44, 1, 5]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetRatePlanInfo.md#request)
 */

import * as types from '../../types.js';
import * as command from '../../utils/command.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {getRatePlanInfo as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


interface IGetRatePlanInfoParameters {
    /**
     * tariff table identifier
     *
     * `0` – table `A+`, `1` – table `A-` (for `MTX1`)</br>
     * `0` – table `A+`, `1` – table `P+`, `2` – table `A-` (for `MTX3`)
     */
    tariffTable: types.TUint8;
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 1;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'request for table A-': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            tariffTable: 1
        },
        bytes: [
            0x2c, 0x01,
            0x01
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetRatePlanInfoParameters => {
    validateCommandPayload(name, bytes, maxSize);

    return {tariffTable: bytes[0]};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetRatePlanInfoParameters ): types.TBytes => (
    command.toBytes(id, [parameters.tariffTable])
);
