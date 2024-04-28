/**
 * Downlink command to provide the date and parameters of tariff plan activation.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as activateRatePlan from 'jooby-codec/mtx/commands/downlink/activateRatePlan.js';
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
 * []
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/ActivateRatePlan.md#request)
 */

import * as types from '../../../types.js';
import CommandBinaryBuffer, {ITariffPlan, TARIFF_PLAN_SIZE} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';


interface IActivateRatePlanParameters {
    /**
     * tariff table identifier
     * (`0` - table `A+`, `1` – table `A-`)
     */
    tariffTable: types.TUint8,

    tariffPlan: ITariffPlan
}


export const id: types.TCommandId = 0x13;
export const name: types.TCommandName = 'activateRatePlan';
export const headerSize = 2;

const COMMAND_BODY_SIZE = 1 + TARIFF_PLAN_SIZE;

export const examples: command.TCommandExamples = {
    'set rate plan request': {
        id,
        name,
        headerSize,
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
 * @param data - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): IActivateRatePlanParameters => {};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IActivateRatePlanParameters ): types.TBytes => {};
