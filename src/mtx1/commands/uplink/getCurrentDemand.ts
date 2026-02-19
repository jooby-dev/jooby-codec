/**
 * Uplink command to read current demand data (load and voltage graphs).
 *
 * **This command can be transmitted only via LoRaWAN.**
 *
 * Supported only for: HARDWARE_VERSION - 3 (Silergy)
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getCurrentDemand from 'jooby-codec/mtx1/commands/uplink/getCurrentDemand.js';
 * import * as demandTypes from 'jooby-codec/mtx1/constants/demandTypes.js';
 *
 * // response to getCurrentDemand downlink command
 * const bytes = [0x34, 0x34, 0x00, 0x45, 0x03, 0x0a, 0x40, 0x08, 0x6f, 0x08, 0x47, 0x08, 0x6e];
 *
 * // decoded payload
 * const parameters = getCurrentDemand.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     date: {
 *         year: 26,
 *         month: 1,
 *         date: 20
 *     },
 *     firstIndex: 69,
 *     count: 3,
 *     period: 10,
 *     demands: [
 *         {
 *             energyType: demandTypes.VOLTAGE,
 *             values: [
 *                 {voltage: 2159},
 *                 {voltage: 2119},
 *                 {voltage: 2158}
 *             ]
 *         }
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetCurrentDemand.md#response)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {UNENCRYPTED} from '../../constants/accessLevels.js';
import {getCurrentDemand as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';
import * as demandTypes from '../../constants/demandTypes.js';
import * as demandsUtils from '../../utils/demands.js';
import {getDate, setDate} from '../../utils/LoraCommandBinaryBuffer.js';
import {validateRangeCommandPayload} from '../../../utils/validateCommandPayload.js';


export interface IGetCurrentDemandResponseParameters extends IGetCurrentDemandParameters {
    demands: Array<IGetCurrentDemandValues>
}

export interface IGetCurrentDemandValues {
    /**
     * Possible value is one of {@link demandTypes}.
     */
    demandType: types.TUint8,
    /**
     * Load or voltage data.
     */
    values: Array<{
        tariff?: types.TUint8,
        energy?: types.TUint8,
        voltage?: types.TUint8,

        /** The number of the additional hour that occurs during the transition to winter time. */
        lastSummerHour?: types.TUint8
    }>
}

export interface IGetCurrentDemandParameters {
    /**
     * Packed date.
     */
    date: types.IDate,

    /**
     * Starting block number of requested data.
     * Depends on the `ten` parameter in {@link IOperatorParameters}.
     *
     * Possible values:
     *
     * | Ten   | Value range |
     * | ----- | ----------- |
     * | `1`   | `0`..`1440` |
     * | `3`   | `0`..`480`  |
     * | `5`   | `0`..`288`  |
     * | `10`  | `0`..`144`  |
     * | `15`  | `0`..`96`   |
     * | `30`  | `0`..`48`   |
     * | `60`  | `0`..`24`   |
     */
    firstIndex: types.TUint16,

    /**
     * Number of requested blocks.
     * No more than `48` blocks in a single request.
     */
    count: types.TUint8,

    /**
     * Accumulation period.
     *
     * Can be `1`, `3`, `5`, `10`, `15`, `30`, `60` minutes.
     * Value `0` is also `30` minutes.
     */
    period: types.TUint8
}

// command id + command size + demandParameters + demandValues
const MIN_COMMAND_SIZE = 1 + 1 + 6 + 3;
const MAX_COMMAND_SIZE = 0xfc;

export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = MAX_COMMAND_SIZE;
export const accessLevel: types.TAccessLevel = UNENCRYPTED;
export const isLoraOnly = true;

export const examples: command.TCommandExamples = {
    'get current demand': {
        id,
        headerSize,
        name,
        maxSize,
        parameters: {
            date: {
                year: 26,
                month: 2,
                date: 1
            },
            firstIndex: 1,
            count: 2,
            period: 15,
            demands: [
                {
                    demandType: demandTypes.A_PLUS,
                    values: [
                        {tariff: 2, energy: 64},
                        {tariff: 2, energy: 32}
                    ]
                },
                {
                    demandType: demandTypes.A_MINUS,
                    values: [
                        {tariff: 1, energy: 0},
                        {tariff: 2, energy: 100}
                    ]
                },
                {
                    demandType: demandTypes.VOLTAGE,
                    values: [
                        {voltage: 2201},
                        {voltage: 2159}
                    ]
                }
            ]
        },
        bytes: [
            // command id and command size
            0x7b, 0x15,
            // demandParameters
            0x34, 0x41, 0x00, 0x01, 0x02, 0x0f,
            // A_PLUS
            0x01, 0x80, 0x40, 0x80, 0x20,
            // A_MINUS
            0x02, 0x40, 0x00, 0x80, 0x64,
            // VOLTAGE
            0xa0, 0x08, 0x99, 0x08, 0x6f
        ]
    }
};

const getCurrentDemandParameters = ( buffer: IBinaryBuffer ): IGetCurrentDemandParameters => ({
    date: getDate(buffer),
    firstIndex: buffer.getUint16(),
    count: buffer.getUint8(),
    period: buffer.getUint8()
});

const getCurrentDemandValues = ( buffer: IBinaryBuffer, parameters: IGetCurrentDemandParameters ): Array<IGetCurrentDemandValues> => {
    // demandTypeByteSize + parameters.count + demandSingleValueSize
    const demandChunkSize = 1 + parameters.count * 2;
    const demandParametersSize = Math.floor(buffer.bytesLeft / demandChunkSize);
    const demands: Array<IGetCurrentDemandValues> = [];

    for ( let demandParameterIndex = 0; demandParameterIndex < demandParametersSize; demandParameterIndex++ ) {
        const demandType = buffer.getUint8();
        const isEnergiesDemand = demandType === demandTypes.A_PLUS || demandType === demandTypes.A_MINUS;
        const demandsBytes = new Array(parameters.count).fill(0).map(() => buffer.getUint16());

        const values = isEnergiesDemand
            ? demandsUtils.energyFromBinary(demandsBytes, parameters.firstIndex, parameters.period)
            : demandsUtils.voltageFromBinary(demandsBytes, parameters.firstIndex, parameters.period);

        demands.push({demandType, values});
    }

    return demands;
};

const setCurrentDemandParameters = ( buffer: IBinaryBuffer, parameters: IGetCurrentDemandParameters ): void => {
    const {firstIndex, count, period} = parameters;

    buffer.setUint16(firstIndex);
    buffer.setUint8(count);
    buffer.setUint8(period);
};

const setCurrentDemandValues = ( buffer: IBinaryBuffer, demands: Array<IGetCurrentDemandValues> ): void => {
    demands.forEach(demand => {
        const {demandType, values} = demand;
        const isEnergiesDemand = demandType === demandTypes.A_PLUS || demandType === demandTypes.A_MINUS;

        buffer.setUint8(demandType);

        const binaryValues: Array<number> = isEnergiesDemand
            ? demandsUtils.energyToBinary(values)
            : demandsUtils.voltageToBinary(values);

        binaryValues.forEach((value: number) => buffer.setUint16(value));
    });
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetCurrentDemandResponseParameters => {
    validateRangeCommandPayload(name, bytes, {min: MIN_COMMAND_SIZE, max: MAX_COMMAND_SIZE});

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);
    const parameters: IGetCurrentDemandParameters = getCurrentDemandParameters(buffer);
    const demands = getCurrentDemandValues(buffer, parameters);

    return {
        ...parameters,
        demands
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - parameters to encode
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetCurrentDemandResponseParameters ): types.TBytes => {
    const {demands, ...demandParameters} = parameters;
    // demandTypeByteSize + parameters.count + demandSingleValueSize
    const demandChunkSize = 1 + demandParameters.count * 2;
    // demandParametersSize + (demands.length * demandChunkSize)
    const bufferSize = 6 + (demands.length * demandChunkSize);
    const buffer: IBinaryBuffer = new BinaryBuffer(bufferSize, false);

    setDate(buffer, parameters.date);
    setCurrentDemandParameters(buffer, demandParameters);
    setCurrentDemandValues(buffer, demands);

    return command.toBytes(id, buffer.getBytesToOffset());
};
