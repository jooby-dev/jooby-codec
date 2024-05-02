/**
 * Downlink command for instant activation of the passive tariff plan.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as runTariffPlan from 'jooby-codec/mtx/commands/downlink/runTariffPlan.js';
 *
 * const parameters = {
 *     tariffTable: 5
 * };
 * const bytes = runTariffPlan.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [6, 1, 5]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/RunTariffPlan.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import {READ_WRITE} from '../../constants/accessLevels.js';


interface IRunTariffPlanParameters {
    /**
     * tariff table identifier
     * (`0` - table `A+`, `1` – table `A-`)
     */
    tariffTable: types.TUint8;
}


export const id: types.TCommandId = 0x06;
export const name: types.TCommandName = 'runTariffPlan';
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
            0x06, 0x01,
            0x05
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = (bytes: types.TBytes): IRunTariffPlanParameters => ({tariffTable: bytes[0]});

/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = (parameters: IRunTariffPlanParameters): types.TBytes => (
    command.toBytes(id, [parameters.tariffTable])
);
