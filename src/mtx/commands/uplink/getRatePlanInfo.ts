/**
 * Uplink command to get device rate plan information.
 *
 * The corresponding downlink command: `getRatePlanInfo`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getRatePlanInfo from 'jooby-codec/mtx/commands/uplink/getRatePlanInfo.js';
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
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetRatePlanInfo.md#response)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, ITariffPlan, TARIFF_PLAN_SIZE} from '../../utils/CommandBinaryBuffer.js';


export interface IGetRatePlanInfoResponseParameters {
    tariffTable: types.TUint8;
    activePlan: ITariffPlan;
    passivePlan: ITariffPlan;
}


export const id: types.TCommandId = 0x2c;
export const name: types.TCommandName = 'getRatePlanInfo';
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
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( bytes: types.TBytes ): IGetRatePlanInfoResponseParameters => {
    if ( bytes.length !== maxSize ) {
        throw new Error('Invalid getRatePlanInfo data size.');
    }

    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    return {
        tariffTable: buffer.getUint8(),
        activePlan: buffer.getTariffPlan(),
        passivePlan: buffer.getTariffPlan()
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetRatePlanInfoResponseParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    buffer.setUint8(parameters.tariffTable);
    buffer.setTariffPlan(parameters.activePlan);
    buffer.setTariffPlan(parameters.passivePlan);

    return command.toBytes(id, buffer.data);
};
