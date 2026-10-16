/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import * as demandTypes from '../constants/demandTypes.js';


const ADDITIONAL_HOUR = 25;
const DEFAULT_DEMAND_PERIOD = 30;
const NO_DEMAND_VALUE = 0xffff;

/** Maximum number of demand records in one request or response. */
export const MAX_DEMANDS_COUNT = 48;

/** Demand record range used to calculate positions and encoded size. */
export interface IDemandRange {
    firstIndex: number,
    count: number,
    period: number
}

export type TDemandValueType = 'energy' | 'voltage' | 'number';

export interface IDemand {
    tariff?: number,
    energy?: number,
    voltage?: number,

    /** The number of the additional hour that occurs during the transition to winter time. */
    lastSummerHour?: number
}

export type TDemandValue = IDemand | null;

type TLastSummerHourValue = {
    lastSummerHour: number
};

/** Converts the wire alias `0` to its effective 30-minute period. */
export const normalizeDemandPeriod = ( periodMin: number ): number => (
    periodMin === 0 ? DEFAULT_DEMAND_PERIOD : periodMin
);

export const getRecordTime = ( index: number, periodMin ) => {
    const normalizedPeriod = normalizeDemandPeriod(periodMin);
    const periodsInHour = 60 / normalizedPeriod;
    const hours = Math.trunc(index / periodsInHour);
    const minutes = (index % periodsInHour) * normalizedPeriod;

    return `${hours.toString(10)}:${minutes === 0 ? '00' : minutes.toString(10)}`;
};

export const getRecordIndex = ( hours, minutes, periodMin ) => (
    Math.trunc(((hours * 60) + minutes) / normalizeDemandPeriod(periodMin))
);

export const getLastSummerHourIndex = periodMin => getRecordIndex(ADDITIONAL_HOUR, 0, periodMin);

/** Checks whether an absolute record index is the additional DST hour. */
export const isLastSummerHourIndex = ( index: number, periodMin: number ): boolean => (
    index === getLastSummerHourIndex(periodMin)
);

/** Checks whether a half-open demand range contains the additional DST hour. */
export const hasLastSummerHour = ( {firstIndex, count, period}: IDemandRange ): boolean => {
    const lastSummerHourIndex = getLastSummerHourIndex(period);

    return firstIndex <= lastSummerHourIndex && lastSummerHourIndex < firstIndex + count;
};

/** Calculates the encoded byte length of the records in a demand range. */
export const getDemandValuesSize = (
    range: IDemandRange,
    valueSize: number,
    lastSummerHourValueSize = valueSize
): number => range.count * valueSize
    - (hasLastSummerHour(range) ? valueSize - lastSummerHourValueSize : 0);

/** Requires a demand record count supported by the wire protocol. */
export const validateDemandCount = ( count: number ): void => {
    if ( !Number.isInteger(count) || count < 0 || count > MAX_DEMANDS_COUNT ) {
        throw new Error(`Invalid demand count: expected 0..${MAX_DEMANDS_COUNT}, actual ${count}.`);
    }
};

const isLastSummerHourValue = ( value: unknown ): value is TLastSummerHourValue => (
    typeof value === 'object'
    && value !== null
    && 'lastSummerHour' in value
    && value.lastSummerHour != null
);

/** Requires one correctly shaped value for every record declared by the command. */
export const validateDemandValues = (
    values: Array<unknown> | null | undefined,
    range: IDemandRange,
    valueType?: TDemandValueType
): void => {
    validateDemandCount(range.count);

    if ( !Array.isArray(values) ) {
        throw new Error('Invalid demands: array expected.');
    }

    const actualCount = values.length;

    if ( actualCount !== range.count ) {
        throw new Error(`Invalid demand count: expected ${range.count}, actual ${actualCount}.`);
    }

    values.forEach((value, index) => {
        if ( value == null ) {
            return;
        }

        const absoluteIndex = range.firstIndex + index;
        const isLastSummerHourIndexValue = isLastSummerHourIndex(absoluteIndex, range.period);
        const isLastSummerHourDemandValue = isLastSummerHourValue(value);

        if ( isLastSummerHourIndexValue && !isLastSummerHourDemandValue ) {
            throw new Error('Invalid demand value: lastSummerHour expected. '
                + `First index: ${range.firstIndex}, index: ${index}, absolute index: ${absoluteIndex}`);
        }

        if ( !isLastSummerHourIndexValue && isLastSummerHourDemandValue ) {
            throw new Error('Invalid demand value: lastSummerHour is only valid at the last summer hour index. '
                + `First index: ${range.firstIndex}, index: ${index}, absolute index: ${absoluteIndex}`);
        }

        if ( !isLastSummerHourIndexValue && valueType ) {
            const isExpectedValue = valueType === 'number'
                ? typeof value === 'number'
                : typeof value === 'object' && valueType in value && value[valueType] != null;

            if ( !isExpectedValue ) {
                throw new Error(`Invalid demand value: ${valueType} expected. `
                    + `First index: ${range.firstIndex}, index: ${index}, absolute index: ${absoluteIndex}`);
            }
        }
    });
};

/** Checks whether an MTX1 demand type contains energy rather than voltage. */
export const isEnergyDemandType = ( demandType: number ): boolean => (
    demandType === demandTypes.A_PLUS || demandType === demandTypes.A_MINUS
);

const energyFromWord = ( word, index, periodMin ) => {
    if ( word === NO_DEMAND_VALUE ) {
        return null;
    }

    const indexLastSummerRecord = getLastSummerHourIndex(periodMin);

    if ( index === indexLastSummerRecord ) {
        return {
            lastSummerHour: ((word >> 8) & 0xff)
        };
    }

    return periodMin === 60
        ? {energy: word}
        : {tariff: ((word >> 14) & 0x03), energy: (word & 0x3fff)};
};

export const energyToWord = data => {
    if ( data == null ) {
        return NO_DEMAND_VALUE;
    }

    const {energy, tariff, lastSummerHour} = data;

    if ( lastSummerHour != null ) {
        return (lastSummerHour << 8) | 0xff;
    }

    return tariff
        ? (tariff << 14) | (energy & 0x3fff)
        : energy;
};

export const energyFromBinary = ( bytes, offset, periodMin = 30 ) => bytes.reduce(
    (collector, value, index) => {
        collector.push(energyFromWord(value, (offset ?? 0) + index, periodMin));

        return collector;
    },
    []
);

export const energyToBinary = energies => energies.reduce(
    (collector, value) => {
        collector.push(energyToWord(value));

        return collector;
    },
    []
);

const voltageFromWord = ( word, index, periodMin ) => {
    if ( word === NO_DEMAND_VALUE ) {
        return null;
    }

    const indexLastSummerRecord = getLastSummerHourIndex(periodMin);

    return ( index === indexLastSummerRecord )
        ? {lastSummerHour: ((word >> 8) & 0xff)}
        : {voltage: word};
};

export const voltageToWord = data => {
    if ( data == null ) {
        return NO_DEMAND_VALUE;
    }

    const {voltage, lastSummerHour} = data;

    if ( lastSummerHour != null ) {
        return (lastSummerHour << 8) | 0xff;
    }

    return voltage;
};

export const voltageFromBinary = ( bytes, offset, periodMin = 30 ) => bytes.reduce(
    (collector, value, index) => {
        collector.push(voltageFromWord(value, (offset ?? 0) + index, periodMin));

        return collector;
    },
    []
);

export const voltageToBinary = energies => energies.reduce(
    (collector, value) => {
        collector.push(voltageToWord(value));

        return collector;
    },
    []
);

export const validOnly = demands => demands.filter(value => value != null);
