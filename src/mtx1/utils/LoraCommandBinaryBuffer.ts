/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

// import * as types from '../../types.js';
import {IBinaryBuffer} from '../../utils/BinaryBuffer.js';
import * as bitSet from '../../utils/bitSet.js';
import {IDate} from '../../types.js';


export interface IEnergies<T = number> {
    'A+'?: T,
    'A+R+'?: T,
    'A+R-'?: T,
    'A-'?: T,
    'A-R+'?: T,
    'A-R-'?: T
}

interface IPowerMax {
    hours: number,
    minutes: number,
    power: number
}


export type TEnergiesFlags = IEnergies<boolean>;

type THalfHourEnergy1 = Array<{tariff: number; energy: number} | undefined>;
type THalfHourEnergy3 = Array<number | undefined>;

export type THalfHourEnergies1 = IEnergies<THalfHourEnergy1>;
export type THalfHourEnergies3 = IEnergies<THalfHourEnergy3>;

export type TTariffsEnergies = Array<IEnergies>;

export type TTariffsPowerMax = Array<IEnergies<IPowerMax>>;

export const TARIFF_NUMBER = 4;

const ENERGY_NAMES = ['A+', 'A+R+', 'A+R-', 'A-', 'A-R+', 'A-R-'];


const UNDEFINED_ENERGY_VALUE = 0xffffffff;

const energiesMask = {
    'A+': 0x01,
    'A+R+': 0x02,
    'A+R-': 0x04,
    'A-': 0x08,
    'A-R+': 0x10,
    'A-R-': 0x20
};

const getEnergiesFlagsLocal = <T>( energies: IEnergies<T> ): number => {
    const booleanObject = {};

    Object.keys(energies).forEach(name => {
        booleanObject[name] = !!energies[name];
    });

    return bitSet.fromObject(energiesMask, (booleanObject as unknown) as bitSet.TBooleanObject);
};

const getAPlusTariffBit = ( tariff: number ) => (tariff < TARIFF_NUMBER ? (1 << tariff) : 0);

const getAMinusTariffBit = ( tariff: number ) => (tariff < TARIFF_NUMBER ? ((1 << tariff) << 4) : 0);

const getTariffEnergiesFlag = <T>( tariff: number, energies: IEnergies<T> ): number => {
    let flag = 0;

    if ( tariff < TARIFF_NUMBER ) {
        if ( energies['A+'] || energies['A+R+'] || energies['A+R-'] ) {
            flag |= getAPlusTariffBit(tariff);
        }

        if ( energies['A-'] || energies['A-R+'] || energies['A-R-'] ) {
            flag |= getAMinusTariffBit(tariff);
        }
    }

    return flag;
};


/* export interface ICommandBinaryBuffer extends IBinaryBuffer {
    // instance methods
    // getDate (): IDate,
    // setDate ( {year, month, date}: IDate ),

    // getEnergiesFlags (): TEnergiesFlags,
    // setEnergiesFlags <T>( energies: IEnergies<T> ),

    // getHalfHourEnergy1 ( halfhoursNumber: number ): THalfHourEnergy1,
    // setHalfHourEnergy1 ( halfhours: THalfHourEnergy1 | undefined ),

    // getHalfHourEnergy3 ( halfhoursNumber: number ): THalfHourEnergy3,
    // setHalfHourEnergy3 ( halfhours: THalfHourEnergy3 | undefined ),

    // getHalfHourEnergies1 ( energiesFlags: TEnergiesFlags, halfhoursNumber: number ): THalfHourEnergies1,
    // setHalfHourEnergies1 ( energies: THalfHourEnergies1 ),

    // getHalfHourEnergies3 ( energiesFlags: TEnergiesFlags, halfhoursNumber: number ): THalfHourEnergies3,
    // setHalfHourEnergies3 ( energies: THalfHourEnergies3 ),

    // getAPlusTariffEnergies ( energyFlags: number ): IEnergies,
    // setAPlusTariffEnergies ( energies: IEnergies | undefined ),

    // getAMinusTariffEnergies ( energyFlags: number ): IEnergies,
    // setAMinusTariffEnergies ( energies: IEnergies | undefined ),

    // getTariffsEnergies (): TTariffsEnergies,
    // setTariffsEnergies ( tariffs: TTariffsEnergies ),

    // getPowerMax (): IPowerMax,
    // setPowerMax ( value: IPowerMax | undefined ),
    // getAPlusTariffPowerMax ( energyFlags: number ): IEnergies<IPowerMax>,
    // setAPlusTariffPowerMax ( energies: IEnergies<IPowerMax> | undefined ),

    // getAMinusTariffPowerMax ( energyFlags: number ): IEnergies<IPowerMax>,
    // setAMinusTariffPowerMax ( energies: IEnergies<IPowerMax> | undefined ),
    // getTariffsPowerMax (): TTariffsPowerMax,
    // setTariffsPowerMax ( tariffs: TTariffsPowerMax )
} */

/**
 * Command specific byte array manipulation.
 */
// function CommandBinaryBuffer ( this: ICommandBinaryBuffer, dataOrLength: types.TBytes | number, isLittleEndian = false ) {
//     BinaryBuffer.call(this, dataOrLength, isLittleEndian);
// }

// extending
// CommandBinaryBuffer.prototype = Object.create(BinaryBuffer.prototype);
// CommandBinaryBuffer.prototype.constructor = CommandBinaryBuffer;


export const getDate = function ( buffer: IBinaryBuffer ): IDate {
    const date0 = buffer.getUint8();
    const date1 = buffer.getUint8();

    return {
        year: date0 >> 1,
        month: ((date0 << 3) & 0x0f) | (date1 >> 5),
        date: date1 & 0x1f
    };
};

export const setDate = function ( buffer: IBinaryBuffer, {year, month, date}: IDate ) {
    const date0 = (year << 1) | ((month >> 3) & 0x01);
    const date1 = ((month << 5) & 0xe0) | (date & 0x1f);

    buffer.setUint8(date0);
    buffer.setUint8(date1);
};

export const getEnergiesFlags = function ( buffer: IBinaryBuffer ): TEnergiesFlags {
    const byte = buffer.getUint8();

    return (bitSet.toObject(energiesMask, byte) as unknown) as TEnergiesFlags;
};

export const setEnergiesFlags = function <T>( buffer: IBinaryBuffer, energies: IEnergies<T> ) {
    buffer.setUint8(
        getEnergiesFlagsLocal(energies)
    );
};

export const getHalfHourEnergy1 = function ( buffer: IBinaryBuffer, halfhoursNumber: number ): THalfHourEnergy1 {
    const halfhours = [];

    for ( let index = 0; index < halfhoursNumber; index++ ) {
        const value = buffer.getUint16();

        // extract the top 2 bits (shift right by 14 positions)
        const tariff = (value >> 14) & 0b11;

        // extract the remaining 14 bits (0x3FFF as mask)
        const energy = value & 0b00111111_11111111;

        halfhours.push(value === UNDEFINED_ENERGY_VALUE ? undefined : {tariff, energy});
    }

    return halfhours;
};

export const setHalfHourEnergy1 = function ( buffer: IBinaryBuffer, halfhours: THalfHourEnergy1 | undefined ) {
    if ( halfhours ) {
        for ( let index = 0; index < halfhours.length; index++ ) {
            const {tariff, energy} = halfhours[index];

            // combine the parts into a single uint16
            // - shift tariff left by 14 positions
            // - use bitwise OR to combine with energy
            const value = (tariff << 14) | energy;

            buffer.setUint16(value === undefined ? UNDEFINED_ENERGY_VALUE : value);
        }
    }
};

export const getHalfHourEnergy3 = function ( buffer: IBinaryBuffer, halfhoursNumber: number ): THalfHourEnergy3 {
    const halfhours = [];

    for ( let index = 0; index < halfhoursNumber; index++ ) {
        const value = buffer.getUint16();

        halfhours.push(value === UNDEFINED_ENERGY_VALUE ? undefined : value);
    }

    return halfhours;
};

export const setHalfHourEnergy3 = function ( buffer: IBinaryBuffer, halfhours: THalfHourEnergy3 | undefined ) {
    if ( halfhours ) {
        for ( let index = 0; index < halfhours.length; index++ ) {
            const value = halfhours[index];

            buffer.setUint16(value === undefined ? UNDEFINED_ENERGY_VALUE : value);
        }
    }
};

export const getHalfHourEnergies1 = function ( buffer: IBinaryBuffer, energiesFlags: TEnergiesFlags, halfhoursNumber: number ): THalfHourEnergies1 {
    const energies: THalfHourEnergies1 = {};

    ENERGY_NAMES.forEach(energyName => {
        if ( energiesFlags[energyName] ) {
            energies[energyName] = getHalfHourEnergy1(buffer, halfhoursNumber);
        }
    });

    return energies;
};

export const getHalfHourEnergies3 = function ( buffer: IBinaryBuffer, energiesFlags: TEnergiesFlags, halfhoursNumber: number ): THalfHourEnergies3 {
    const energies: THalfHourEnergies3 = {};

    ENERGY_NAMES.forEach(energyName => {
        if ( energiesFlags[energyName] ) {
            energies[energyName] = getHalfHourEnergy3(buffer, halfhoursNumber);
        }
    });

    return energies;
};

export const setHalfHourEnergies1 = function ( buffer: IBinaryBuffer, energies: THalfHourEnergies1 ) {
    ENERGY_NAMES.forEach(energyName => {
        setHalfHourEnergy1(buffer, energies[energyName]);
    });
};

export const setHalfHourEnergies3 = function ( buffer: IBinaryBuffer, energies: THalfHourEnergies3 ) {
    ENERGY_NAMES.forEach(energyName => {
        setHalfHourEnergy3(buffer, energies[energyName]);
    });
};

export const getAPlusTariffEnergies = function ( buffer: IBinaryBuffer, energyFlags: number ): IEnergies {
    const energies: IEnergies = {};

    if ( energyFlags & energiesMask['A+'] ) {
        energies['A+'] = buffer.getUint32();
    }

    if ( energyFlags & energiesMask['A+R+'] ) {
        energies['A+R+'] = buffer.getUint32();
    }

    if ( energyFlags & energiesMask['A+R-'] ) {
        energies['A+R-'] = buffer.getUint32();
    }

    return energies;
};

export const setAPlusTariffEnergies = function ( buffer: IBinaryBuffer, energies: IEnergies | undefined ) {
    if ( energies ) {
        if ( energies['A+'] ) {
            buffer.setUint32(energies['A+']);
        }

        if ( energies['A+R+'] ) {
            buffer.setUint32(energies['A+R+']);
        }

        if ( energies['A+R-'] ) {
            buffer.setUint32(energies['A+R-']);
        }
    }
};

export const getAMinusTariffEnergies = function ( buffer: IBinaryBuffer, energyFlags: number ): IEnergies {
    const energies: IEnergies = {};

    if ( energyFlags & energiesMask['A-'] ) {
        energies['A-'] = buffer.getUint32();
    }

    if ( energyFlags & energiesMask['A-R+'] ) {
        energies['A-R+'] = buffer.getUint32();
    }

    if ( energyFlags & energiesMask['A-R-'] ) {
        energies['A-R-'] = buffer.getUint32();
    }

    return energies;
};

export const setAMinusTariffEnergies = function ( buffer: IBinaryBuffer, energies: IEnergies | undefined ) {
    if ( energies ) {
        if ( energies['A-'] ) {
            buffer.setUint32(energies['A-']);
        }

        if ( energies['A-R+'] ) {
            buffer.setUint32(energies['A-R+']);
        }

        if ( energies['A-R-'] ) {
            buffer.setUint32(energies['A-R-']);
        }
    }
};

export const getTariffsEnergies = function ( buffer: IBinaryBuffer ): TTariffsEnergies {
    const energyFlags = buffer.getUint8();
    const tariffFlags = buffer.getUint8();
    const tariffs: TTariffsEnergies = new Array(TARIFF_NUMBER).fill(null);

    for ( let index = 0; index < TARIFF_NUMBER; index++ ) {
        if ( tariffFlags & getAPlusTariffBit(index) ) {
            tariffs[index] = getAPlusTariffEnergies(buffer, energyFlags);
        }
    }

    for ( let index = 0; index < TARIFF_NUMBER; index++ ) {
        if ( tariffFlags & getAMinusTariffBit(index) ) {
            tariffs[index] = {...tariffs[index], ...getAMinusTariffEnergies(buffer, energyFlags)};
        }
    }

    return tariffs;
};

export const setTariffsEnergies = function ( buffer: IBinaryBuffer, tariffs: TTariffsEnergies ) {
    let energiesFlags = 0;
    let tariffsFlags = 0;

    tariffs.forEach((tariff, index) => {
        if ( tariff ) {
            energiesFlags |= getEnergiesFlagsLocal(tariff);
            tariffsFlags |= getTariffEnergiesFlag(index, tariff);
        }
    });

    buffer.setUint8(energiesFlags);
    buffer.setUint8(tariffsFlags);

    tariffs.forEach(tariff => setAPlusTariffEnergies(buffer, tariff));
    tariffs.forEach(tariff => setAMinusTariffEnergies(buffer, tariff));
};

export const getPowerMax = function ( buffer: IBinaryBuffer ): IPowerMax {
    return {
        hours: buffer.getUint8(),
        minutes: buffer.getUint8(),
        power: buffer.getUint32()
    };
};

export const setPowerMax = function ( buffer: IBinaryBuffer, value: IPowerMax | undefined ) {
    if ( value ) {
        const {hours, minutes, power} = value;

        buffer.setUint8(hours);
        buffer.setUint8(minutes);
        buffer.setUint32(power);
    }
};

export const getAPlusTariffPowerMax = function ( buffer: IBinaryBuffer, energyFlags: number ): IEnergies<IPowerMax> {
    const energies: IEnergies<IPowerMax> = {};

    if ( energyFlags & energiesMask['A+'] ) {
        energies['A+'] = getPowerMax(buffer);
    }

    if ( energyFlags & energiesMask['A+R+'] ) {
        energies['A+R+'] = getPowerMax(buffer);
    }

    if ( energyFlags & energiesMask['A+R-'] ) {
        energies['A+R-'] = getPowerMax(buffer);
    }

    return energies;
};

export const setAPlusTariffPowerMax = function ( buffer: IBinaryBuffer, energies: IEnergies<IPowerMax> | undefined ) {
    if ( energies ) {
        setPowerMax(buffer, energies['A+']);
        setPowerMax(buffer, energies['A+R+']);
        setPowerMax(buffer, energies['A+R+']);
    }
};

export const getAMinusTariffPowerMax = function ( buffer: IBinaryBuffer, energyFlags: number ): IEnergies<IPowerMax> {
    const energies: IEnergies<IPowerMax> = {};

    if ( energyFlags & energiesMask['A-'] ) {
        energies['A-'] = getPowerMax(buffer);
    }

    if ( energyFlags & energiesMask['A-R+'] ) {
        energies['A-R+'] = getPowerMax(buffer);
    }

    if ( energyFlags & energiesMask['A-R-'] ) {
        energies['A-R-'] = getPowerMax(buffer);
    }

    return energies;
};

export const setAMinusTariffPowerMax = function ( buffer: IBinaryBuffer, energies: IEnergies<IPowerMax> | undefined ) {
    if ( energies ) {
        setPowerMax(buffer, energies['A-']);
        setPowerMax(buffer, energies['A-R+']);
        setPowerMax(buffer, energies['A-R-']);
    }
};

export const getTariffsPowerMax = function ( buffer: IBinaryBuffer ): TTariffsPowerMax {
    const energyFlags = buffer.getUint8();
    const tariffFlags = buffer.getUint8();
    const tariffs: TTariffsPowerMax = new Array(TARIFF_NUMBER).fill(null);

    for ( let index = 0; index < TARIFF_NUMBER; index++ ) {
        if ( tariffFlags & getAPlusTariffBit(index) ) {
            tariffs[index] = getAPlusTariffPowerMax(buffer, energyFlags);
        }
    }

    for ( let index = 0; index < TARIFF_NUMBER; index++ ) {
        if ( tariffFlags & getAMinusTariffBit(index) ) {
            tariffs[index] = {...tariffs[index], ...getAMinusTariffPowerMax(buffer, energyFlags)};
        }
    }

    return tariffs;
};

export const setTariffsPowerMax = function ( buffer: IBinaryBuffer, tariffs: TTariffsPowerMax ) {
    let energiesFlags = 0;
    let tariffsFlags = 0;

    tariffs.forEach( (tariff, index) => {
        if ( tariff ) {
            energiesFlags |= getEnergiesFlagsLocal(tariff);
            tariffsFlags |= getTariffEnergiesFlag(index, tariff);
        }
    });

    buffer.setUint8(energiesFlags);
    buffer.setUint8(tariffsFlags);

    tariffs.forEach(tariff => setAPlusTariffPowerMax(buffer, tariff));
    tariffs.forEach(tariff => setAMinusTariffPowerMax(buffer, tariff));
};


// export default CommandBinaryBuffer;
