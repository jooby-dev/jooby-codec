/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

/**
 * Uplink command to read load and voltage graphs.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getDemand from 'jooby-codec/mtx/commands/uplink/getDemand.js';
 *
 * // response to getDemand downlink command
 * const bytes = [0x31, 0x42, 0xa0, 0x00, 0x19, 0x01, 0x3c, 0x04, 0xff];
 *
 * // decoded payload
 * const parameters = getDemand.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
*     date: { year: 24, month: 10, date: 2 },
*     energyType: 160,
*     firstIndex: 25,
*     count: 1,
*     period: 60,
*     demands: [ { lastSummerHour: 4 } ]
* }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetDemand.md#response)
 */

/** eslint-disable */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, IGetDemandParameters} from '../../utils/CommandBinaryBuffer.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import * as getDemand from '../downlink/getDemand.js';
import * as demandTypes from '../../constants/demandTypes.js';
import * as demands from '../../utils/demands.js';


export interface IGetDemandResponseParameters extends IGetDemandParameters {
    /**
     * Load or voltage data.
     */
    demands?: Array<{
        tariff?: number,
        energy?: number,
        voltage?: number

        /** The number of the additional hour that occurs during the transition to winter time. */
        lastSummerHour?: number,
    }>,
}


export const id: types.TCommandId = 0x76;
export const name: types.TCommandName = 'getDemand';
export const headerSize = 2;
export const maxSize = getDemand.maxSize + 48;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'response for A+': {
        id,
        name,
        headerSize,
        maxSize,
        parameters: {
            date: {
                year: 24,
                month: 10,
                date: 2
            },
            energyType: demandTypes.A_PLUS,
            firstIndex: 0,
            count: 48,
            period: 5,
            demands: [
                {tariff: 0, energy: 177},
                {tariff: 0, energy: 177},
                {tariff: 0, energy: 176},
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                {tariff: 0, energy: 178},
                {tariff: 0, energy: 175},
                {tariff: 0, energy: 177},
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                {tariff: 0, energy: 178},
                {tariff: 0, energy: 178},
                {tariff: 0, energy: 178},
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                {tariff: 0, energy: 177},
                null,
                {tariff: 0, energy: 99},
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null
            ]
        },
        bytes: [
            0x76, 0x67,
            0x31, 0x42, 0x01, 0x00, 0x00, 0x30, 0x05,
            0x00, 0xb1,
            0x00, 0xb1,
            0x00, 0xb0,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0x00, 0xb2,
            0x00, 0xaf,
            0x00, 0xb1,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0x00, 0xb2,
            0x00, 0xb2,
            0x00, 0xb2,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0x00, 0xb1,
            0xff, 0xff,
            0x00, 0x63,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff
        ]
    },

    'response for A+ (period: 60, no tariff)': {
        id,
        name,
        headerSize,
        maxSize,
        parameters: {
            date: {
                year: 24,
                month: 10,
                date: 2
            },
            energyType: demandTypes.A_PLUS,
            firstIndex: 0,
            count: 24,
            period: 60,
            demands: [
                {energy: 177},
                {energy: 177},
                {energy: 176},
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                {energy: 178},
                {energy: 175},
                {energy: 177},
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null
            ]
        },
        bytes: [
            0x76, 0x37,
            0x31, 0x42, 0x01, 0x00, 0x00, 0x18, 0x3c,
            0x00, 0xb1,
            0x00, 0xb1,
            0x00, 0xb0,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0x00, 0xb2,
            0x00, 0xaf,
            0x00, 0xb1,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff,
            0xff, 0xff
        ]
    },

    'response for A+ (lastSummerHour)': {
        id,
        name,
        headerSize,
        maxSize,
        parameters: {
            date: {
                year: 24,
                month: 10,
                date: 2
            },
            energyType: demandTypes.A_PLUS,
            firstIndex: 25,
            count: 1,
            period: 60,
            demands: [
                {lastSummerHour: 4}
            ]
        },
        bytes: [
            0x76, 0x09,
            0x31, 0x42, 0x01, 0x00, 0x19, 0x01, 0x3c,
            0x04, 0xff
        ]
    },

    'response for voltage (period: 60, no tariff)': {
        id,
        name,
        headerSize,
        maxSize,
        parameters: {
            date: {
                year: 24,
                month: 10,
                date: 2
            },
            energyType: demandTypes.VOLTAGE,
            firstIndex: 0,
            count: 1,
            period: 60,
            demands: [
                {voltage: 1026}
            ]
        },
        bytes: [
            0x76, 0x09,
            0x31, 0x42, 0xa0, 0x00, 0x00, 0x01, 0x3c,
            0x04, 0x02
        ]
    },

    'response for voltage (lastSummerHour)': {
        id,
        name,
        headerSize,
        maxSize,
        parameters: {
            date: {
                year: 24,
                month: 10,
                date: 2
            },
            energyType: demandTypes.VOLTAGE,
            firstIndex: 25,
            count: 1,
            period: 60,
            demands: [
                {lastSummerHour: 4}
            ]
        },
        bytes: [
            0x76, 0x09,
            0x31, 0x42, 0xa0, 0x00, 0x19, 0x01, 0x3c,
            0x04, 0xff
        ]
    }
};


/**
  * Decode command parameters.
  *
  * @param bytes - command body bytes
  * @returns decoded parameters
  */
export const fromBytes = ( bytes: types.TBytes ): IGetDemandResponseParameters => {
    if ( !bytes || bytes.length < getDemand.maxSize ) {
        throw new Error('Invalid uplink GetDemand byte length.');
    }

    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);
    const parameters: IGetDemandResponseParameters = buffer.getDemandParameters();

    if ( bytes.length !== getDemand.maxSize + (2 * parameters.count) ) {
        throw new Error('Invalid uplink GetDemand demands byte length.');
    }

    const demandsBytes = Array.from({length: parameters.count}, () => buffer.getUint16());
    const isEnergiesDemand = parameters.energyType === demandTypes.A_PLUS || parameters.energyType === demandTypes.A_MINUS;

    parameters.demands = isEnergiesDemand
        ? demands.energyFromBinary(demandsBytes, parameters.firstIndex, parameters.period)
        : demands.voltageFromBinary(demandsBytes, parameters.firstIndex, parameters.period);

    return parameters;
};


/**
  * Encode command parameters.
  *
  * @param parameters - command payload
  * @returns full message (header with body)
  */
export const toBytes = ( parameters: IGetDemandResponseParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(getDemand.maxSize + parameters.count * 2);

    buffer.setDemandParameters(parameters);

    if ( parameters.energyType === demandTypes.A_PLUS || parameters.energyType === demandTypes.A_MINUS ) {
        demands.energyToBinary(parameters.demands).forEach((value: number) => buffer.setUint16(value));
    } else {
        demands.voltageToBinary(parameters.demands).forEach((value: number) => buffer.setUint16(value));
    }

    return command.toBytes(id, buffer.data);
};
