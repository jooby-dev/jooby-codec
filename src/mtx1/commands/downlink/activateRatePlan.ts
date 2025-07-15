/**
 * Downlink command to provide the date and parameters of tariff plan activation.
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as activateRatePlan from 'jooby-codec/mtx1/commands/downlink/activateRatePlan.js';
 *
 * const parameters = {
 *     tariffTable: 8,
 *     tariffPlan: {
 *         id: 1,
 *         tariffSet: 2,
 *         activateYear: 3,
 *         activateMonth: 4,
 *         activateDay: 5,
 *         specialProfilesArraySize: 6,
 *         seasonProfilesArraySize: 7,
 *         dayProfilesArraySize: 8
 *     }
 * };
 *
 * const bytes = activateRatePlan.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [19, 12, 8, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/ActivateRatePlan.md#request)
 */

import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {
    ITariffPlan,
    TARIFF_PLAN_SIZE,
    getTariffPlan,
    setTariffPlan
} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';
import {READ_WRITE} from '../../constants/accessLevels.js';
import {activateRatePlan as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


interface IActivateRatePlanParameters {
    /**
     * tariff table identifier
     *
     * `0` – table `A+`, `1` – table `A-` (for `MTX1`)</br>
     * `0` – table `A+`, `1` – table `P+`, `2` – table `A-` (for `MTX3`)
     */
    tariffTable: types.TUint8,

    tariffPlan: ITariffPlan
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 1 + TARIFF_PLAN_SIZE;
export const accessLevel: types.TAccessLevel = READ_WRITE;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'set rate plan request': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            tariffTable: 0,
            tariffPlan: {
                id: 1,
                tariffSet: 2,
                activateYear: 3,
                activateMonth: 4,
                activateDay: 5,
                specialProfilesArraySize: 6,
                seasonProfilesArraySize: 7,
                dayProfilesArraySize: 8
            }
        },
        bytes: [
            0x13, 0x0c,
            0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IActivateRatePlanParameters => {
    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return {
        tariffTable: buffer.getUint8(),
        tariffPlan: getTariffPlan(buffer)
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IActivateRatePlanParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    // body
    buffer.setUint8(parameters.tariffTable);
    setTariffPlan(buffer, parameters.tariffPlan);

    return command.toBytes(id, buffer.data);
};
