/**
 * Uplink command to get device rate plan information.
 *
 * The corresponding downlink command: `getRatePlanInfo`.
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getRatePlanInfo from 'jooby-codec/mtx1/commands/uplink/getRatePlanInfo.js';
 *
 * // response to getRatePlanInfo downlink command
 * const bytes = [
 *     0x08, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
 *     0x00, 0x00, 0x00, 0x0a, 0x14, 0x1e, 0x28, 0x32, 0x3c, 0x46, 0x50
 * ];
 *
 * // decoded payload
 * const parameters = getRatePlanInfo.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     tariffTable: 8,
 *     activePlan: {
 *         id: 1,
 *         tariffSet: 2,
 *         activateYear: 3,
 *         activateMonth: 4,
 *         activateDay: 5,
 *         specialProfilesArraySize: 6,
 *         seasonProfilesArraySize: 7,
 *         dayProfilesArraySize: 8
 *     },
 *     passivePlan: {
 *         id: 10,
 *         tariffSet: 20,
 *         activateYear: 30,
 *         activateMonth: 40,
 *         activateDay: 50,
 *         specialProfilesArraySize: 60,
 *         seasonProfilesArraySize: 70,
 *         dayProfilesArraySize: 80
 *     }
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetRatePlanInfo.md#response)
 */

import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import * as command from '../../utils/command.js';
import {
    ITariffPlan,
    TARIFF_PLAN_SIZE,
    getTariffPlan,
    setTariffPlan
} from '../../utils/binary/buffer.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {getRatePlanInfo as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export interface IGetRatePlanInfoResponseParameters {
    /**
     * tariff table identifier
     *
     * `0` – table `A+`, `1` – table `A-` (for `MTX1`)</br>
     * `0` – table `A+`, `1` – table `P+`, `2` – table `A-` (for `MTX3`)
     */
    tariffTable: types.TUint8;

    activePlan: ITariffPlan;

    passivePlan: ITariffPlan;
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 1 + TARIFF_PLAN_SIZE * 2;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'rate plan info response for A- table': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            tariffTable: 1,
            activePlan: {
                id: 1,
                tariffSet: 2,
                activateYear: 3,
                activateMonth: 4,
                activateDay: 5,
                specialProfilesArraySize: 6,
                seasonProfilesArraySize: 7,
                dayProfilesArraySize: 8
            },
            passivePlan: {
                id: 10,
                tariffSet: 20,
                activateYear: 30,
                activateMonth: 40,
                activateDay: 50,
                specialProfilesArraySize: 60,
                seasonProfilesArraySize: 70,
                dayProfilesArraySize: 80
            }
        },
        bytes: [
            0x2c, 0x17,
            0x01, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x00, 0x00, 0x00,
            0x0a, 0x14, 0x1e, 0x28, 0x32, 0x3c, 0x46, 0x50
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetRatePlanInfoResponseParameters => {
    validateCommandPayload(name, bytes, maxSize);

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return {
        tariffTable: buffer.getUint8(),
        activePlan: getTariffPlan(buffer),
        passivePlan: getTariffPlan(buffer)
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetRatePlanInfoResponseParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    buffer.setUint8(parameters.tariffTable);
    setTariffPlan(buffer, parameters.activePlan);
    setTariffPlan(buffer, parameters.passivePlan);

    return command.toBytes(id, buffer.data);
};
