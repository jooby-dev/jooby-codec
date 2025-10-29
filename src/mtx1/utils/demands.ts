/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */


const ADDITIONAL_HOUR = 25;


export const getRecordTime = ( index: number, periodMin ) => {
    const periodsInHour = 60 / periodMin;
    const hours = Math.trunc(index / periodsInHour);
    const minutes = (index % periodsInHour) * periodMin;

    return `${hours.toString(10)}:${minutes === 0 ? '00' : minutes.toString(10)}`;
};

export const getRecordIndex = ( hours, minutes, periodMin ) => Math.trunc(((hours * 60) + minutes) / periodMin);

const getLastSummerHourIndex = periodMin => getRecordIndex(ADDITIONAL_HOUR, 0, periodMin);

const energyFromWord = ( word, index, periodMin ) => {
    if ( word === 0xffff) {
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
    if ( data === null ) {
        return 0xffff;
    }

    const {energy, tariff, lastSummerHour} = data;

    if ( lastSummerHour ) {
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
    if ( word === 0xffff) {
        return 0xffff;
    }

    const indexLastSummerRecord = getLastSummerHourIndex(periodMin);

    return ( index === indexLastSummerRecord )
        ? {lastSummerHour: ((word >> 8) & 0xff)}
        : {voltage: word};
};

export const voltageToWord = ( {voltage, lastSummerHour} ) => {
    if ( lastSummerHour ) {
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

export const validOnly = demands => demands.filter(value => value !== 0xffff);
