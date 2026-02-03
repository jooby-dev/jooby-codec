/**
 * Downlink command for instant activation of the passive tariff plan.
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as runTariffPlan from 'jooby-codec/mtx1/commands/downlink/runTariffPlan.js';
 *
 * const parameters = {tariffTable: 5};
 * const bytes = runTariffPlan.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [70, 1, 5]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/RunTariffPlan.md#request)
 */

import * as types from '../../types.js';
import * as command from '../../utils/command.js';
import {READ_WRITE} from '../../constants/accessLevels.js';
import {runTariffPlan as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


interface IRunTariffPlanParameters {
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
export const accessLevel: types.TAccessLevel = READ_WRITE;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'simple request': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {tariffTable: 5},
        bytes: [
            0x46, 0x01,
            0x05
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IRunTariffPlanParameters => ({tariffTable: bytes[0]});


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IRunTariffPlanParameters ): types.TBytes => (
    command.toBytes(id, [parameters.tariffTable])
);
