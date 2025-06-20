/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../utils/BinaryBuffer.js';
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

const getEnergiesFlags = <T>( energies: IEnergies<T> ): number => {
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


export interface ICommandBinaryBuffer extends IBinaryBuffer {
    // instance methods
    getDate (): IDate,
    setDate ( {year, month, date}: IDate ),

    getEnergiesFlags (): TEnergiesFlags,
    setEnergiesFlags <T>( energies: IEnergies<T> ),

    getHalfHourEnergy1 ( halfhoursNumber: number ): THalfHourEnergy1,
    setHalfHourEnergy1 ( halfhours: THalfHourEnergy1 | undefined ),

    getHalfHourEnergy3 ( halfhoursNumber: number ): THalfHourEnergy3,
    setHalfHourEnergy3 ( halfhours: THalfHourEnergy3 | undefined ),

    getHalfHourEnergies1 ( energiesFlags: TEnergiesFlags, halfhoursNumber: number ): THalfHourEnergies1,
    setHalfHourEnergies1 ( energies: THalfHourEnergies1 ),

    getHalfHourEnergies3 ( energiesFlags: TEnergiesFlags, halfhoursNumber: number ): THalfHourEnergies3,
    setHalfHourEnergies3 ( energies: THalfHourEnergies3 ),

    getAPlusTariffEnergies ( energyFlags: number ): IEnergies,
    setAPlusTariffEnergies ( energies: IEnergies | undefined ),

    getAMinusTariffEnergies ( energyFlags: number ): IEnergies,
    setAMinusTariffEnergies ( energies: IEnergies | undefined ),

    getTariffsEnergies (): TTariffsEnergies,
    setTariffsEnergies ( tariffs: TTariffsEnergies ),

    getPowerMax (): IPowerMax,
    setPowerMax ( value: IPowerMax | undefined ),
    getAPlusTariffPowerMax ( energyFlags: number ): IEnergies<IPowerMax>,
    setAPlusTariffPowerMax ( energies: IEnergies<IPowerMax> | undefined ),

    getAMinusTariffPowerMax ( energyFlags: number ): IEnergies<IPowerMax>,
    setAMinusTariffPowerMax ( energies: IEnergies<IPowerMax> | undefined ),
    getTariffsPowerMax (): TTariffsPowerMax,
    setTariffsPowerMax ( tariffs: TTariffsPowerMax )
}

/**
 * Command specific byte array manipulation.
 */
function CommandBinaryBuffer ( this: ICommandBinaryBuffer, dataOrLength: types.TBytes | number, isLittleEndian = false ) {
    BinaryBuffer.call(this, dataOrLength, isLittleEndian);
}

// extending
CommandBinaryBuffer.prototype = Object.create(BinaryBuffer.prototype);
CommandBinaryBuffer.prototype.constructor = CommandBinaryBuffer;


CommandBinaryBuffer.prototype.getDate = function (): IDate {
    const date0 = this.getUint8();
    const date1 = this.getUint8();

    return {
        year: date0 >> 1,
        month: ((date0 << 3) & 0x0f) | (date1 >> 5),
        date: date1 & 0x1f
    };
};

CommandBinaryBuffer.prototype.setDate = function ( {year, month, date}: IDate ) {
    const date0 = (year << 1) | ((month >> 3) & 0x01);
    const date1 = ((month << 5) & 0xe0) | (date & 0x1f);

    this.setUint8(date0);
    this.setUint8(date1);
};

CommandBinaryBuffer.prototype.getEnergiesFlags = function (): TEnergiesFlags {
    const byte = this.getUint8();

    return (bitSet.toObject(energiesMask, byte) as unknown) as TEnergiesFlags;
};

CommandBinaryBuffer.prototype.setEnergiesFlags = function <T>( energies: IEnergies<T> ) {
    this.setUint8(
        getEnergiesFlags(energies)
    );
};

CommandBinaryBuffer.prototype.getHalfHourEnergy1 = function ( halfhoursNumber: number ): THalfHourEnergy1 {
    const halfhours = [];

    for ( let index = 0; index < halfhoursNumber; index++ ) {
        const value = this.getUint16();

        // extract the top 2 bits (shift right by 14 positions)
        const tariff = (value >> 14) & 0b11;

        // extract the remaining 14 bits (0x3FFF as mask)
        const energy = value & 0b00111111_11111111;

        halfhours.push(value === UNDEFINED_ENERGY_VALUE ? undefined : {tariff, energy});
    }

    return halfhours;
};

CommandBinaryBuffer.prototype.setHalfHourEnergy1 = function ( halfhours: THalfHourEnergy1 | undefined ) {
    if ( halfhours ) {
        for ( let index = 0; index < halfhours.length; index++ ) {
            const {tariff, energy} = halfhours[index];

            // combine the parts into a single uint16
            // - shift tariff left by 14 positions
            // - use bitwise OR to combine with energy
            const value = (tariff << 14) | energy;

            this.setUint16(value === undefined ? UNDEFINED_ENERGY_VALUE : value);
        }
    }
};

CommandBinaryBuffer.prototype.getHalfHourEnergy3 = function ( halfhoursNumber: number ): THalfHourEnergy3 {
    const halfhours = [];

    for ( let index = 0; index < halfhoursNumber; index++ ) {
        const value = this.getUint16();

        halfhours.push(value === UNDEFINED_ENERGY_VALUE ? undefined : value);
    }

    return halfhours;
};

CommandBinaryBuffer.prototype.setHalfHourEnergy3 = function ( halfhours: THalfHourEnergy3 | undefined ) {
    if ( halfhours ) {
        for ( let index = 0; index < halfhours.length; index++ ) {
            const value = halfhours[index];

            this.setUint16(value === undefined ? UNDEFINED_ENERGY_VALUE : value);
        }
    }
};

CommandBinaryBuffer.prototype.getHalfHourEnergies1 = function ( energiesFlags: TEnergiesFlags, halfhoursNumber: number ): THalfHourEnergies1 {
    const energies: THalfHourEnergies1 = {};

    ENERGY_NAMES.forEach(energyName => {
        if ( energiesFlags[energyName] ) {
            energies[energyName] = this.getHalfHourEnergy1(halfhoursNumber);
        }
    });

    return energies;
};

CommandBinaryBuffer.prototype.getHalfHourEnergies3 = function ( energiesFlags: TEnergiesFlags, halfhoursNumber: number ): THalfHourEnergies3 {
    const energies: THalfHourEnergies3 = {};

    ENERGY_NAMES.forEach(energyName => {
        if ( energiesFlags[energyName] ) {
            energies[energyName] = this.getHalfHourEnergy3(halfhoursNumber);
        }
    });

    return energies;
};

CommandBinaryBuffer.prototype.setHalfHourEnergies1 = function ( energies: THalfHourEnergies1 ) {
    ENERGY_NAMES.forEach(energyName => {
        this.setHalfHourEnergy1(energies[energyName]);
    });
};

CommandBinaryBuffer.prototype.setHalfHourEnergies3 = function ( energies: THalfHourEnergies3 ) {
    ENERGY_NAMES.forEach(energyName => {
        this.setHalfHourEnergy3(energies[energyName]);
    });
};

CommandBinaryBuffer.prototype.getAPlusTariffEnergies = function ( energyFlags: number ): IEnergies {
    const energies: IEnergies = {};

    if ( energyFlags & energiesMask['A+'] ) {
        energies['A+'] = this.getUint32();
    }

    if ( energyFlags & energiesMask['A+R+'] ) {
        energies['A+R+'] = this.getUint32();
    }

    if ( energyFlags & energiesMask['A+R-'] ) {
        energies['A+R-'] = this.getUint32();
    }

    return energies;
};

CommandBinaryBuffer.prototype.setAPlusTariffEnergies = function ( energies: IEnergies | undefined ) {
    if ( energies ) {
        if ( energies['A+'] ) {
            this.setUint32(energies['A+']);
        }

        if ( energies['A+R+'] ) {
            this.setUint32(energies['A+R+']);
        }

        if ( energies['A+R-'] ) {
            this.setUint32(energies['A+R-']);
        }
    }
};

CommandBinaryBuffer.prototype.getAMinusTariffEnergies = function ( energyFlags: number ): IEnergies {
    const energies: IEnergies = {};

    if ( energyFlags & energiesMask['A-'] ) {
        energies['A-'] = this.getUint32();
    }

    if ( energyFlags & energiesMask['A-R+'] ) {
        energies['A-R+'] = this.getUint32();
    }

    if ( energyFlags & energiesMask['A-R-'] ) {
        energies['A-R-'] = this.getUint32();
    }

    return energies;
};

CommandBinaryBuffer.prototype.setAMinusTariffEnergies = function ( energies: IEnergies | undefined ) {
    if ( energies ) {
        if ( energies['A-'] ) {
            this.setUint32(energies['A-']);
        }

        if ( energies['A-R+'] ) {
            this.setUint32(energies['A-R+']);
        }

        if ( energies['A-R-'] ) {
            this.setUint32(energies['A-R-']);
        }
    }
};

CommandBinaryBuffer.prototype.getTariffsEnergies = function (): TTariffsEnergies {
    const energyFlags = this.getUint8();
    const tariffFlags = this.getUint8();
    const tariffs: TTariffsEnergies = new Array(TARIFF_NUMBER).fill(null);

    for ( let index = 0; index < TARIFF_NUMBER; index++ ) {
        if ( tariffFlags & getAPlusTariffBit(index) ) {
            tariffs[index] = this.getAPlusTariffEnergies(energyFlags);
        }
    }

    for ( let index = 0; index < TARIFF_NUMBER; index++ ) {
        if ( tariffFlags & getAMinusTariffBit(index) ) {
            tariffs[index] = {...tariffs[index], ...this.getAMinusTariffEnergies(energyFlags)};
        }
    }

    return tariffs;
};

CommandBinaryBuffer.prototype.setTariffsEnergies = function ( tariffs: TTariffsEnergies ) {
    let energiesFlags = 0;
    let tariffsFlags = 0;

    tariffs.forEach((tariff, index) => {
        if ( tariff ) {
            energiesFlags |= getEnergiesFlags(tariff);
            tariffsFlags |= getTariffEnergiesFlag(index, tariff);
        }
    });

    this.setUint8(energiesFlags);
    this.setUint8(tariffsFlags);

    tariffs.forEach(tariff => this.setAPlusTariffEnergies(tariff));
    tariffs.forEach(tariff => this.setAMinusTariffEnergies(tariff));
};

CommandBinaryBuffer.prototype.getPowerMax = function (): IPowerMax {
    return {
        hours: this.getUint8(),
        minutes: this.getUint8(),
        power: this.getUint32()
    };
};

CommandBinaryBuffer.prototype.setPowerMax = function ( value: IPowerMax | undefined ) {
    if ( value ) {
        const {hours, minutes, power} = value;

        this.setUint8(hours);
        this.setUint8(minutes);
        this.setUint32(power);
    }
};

CommandBinaryBuffer.prototype.getAPlusTariffPowerMax = function ( energyFlags: number ): IEnergies<IPowerMax> {
    const energies: IEnergies<IPowerMax> = {};

    if ( energyFlags & energiesMask['A+'] ) {
        energies['A+'] = this.getPowerMax();
    }

    if ( energyFlags & energiesMask['A+R+'] ) {
        energies['A+R+'] = this.getPowerMax();
    }

    if ( energyFlags & energiesMask['A+R-'] ) {
        energies['A+R-'] = this.getPowerMax();
    }

    return energies;
};

CommandBinaryBuffer.prototype.setAPlusTariffPowerMax = function ( energies: IEnergies<IPowerMax> | undefined ) {
    if ( energies ) {
        this.setPowerMax(energies['A+']);
        this.setPowerMax(energies['A+R+']);
        this.setPowerMax(energies['A+R+']);
    }
};

CommandBinaryBuffer.prototype.getAMinusTariffPowerMax = function ( energyFlags: number ): IEnergies<IPowerMax> {
    const energies: IEnergies<IPowerMax> = {};

    if ( energyFlags & energiesMask['A-'] ) {
        energies['A-'] = this.getPowerMax();
    }

    if ( energyFlags & energiesMask['A-R+'] ) {
        energies['A-R+'] = this.getPowerMax();
    }

    if ( energyFlags & energiesMask['A-R-'] ) {
        energies['A-R-'] = this.getPowerMax();
    }

    return energies;
};

CommandBinaryBuffer.prototype.setAMinusTariffPowerMax = function ( energies: IEnergies<IPowerMax> | undefined ) {
    if ( energies ) {
        this.setPowerMax(energies['A-']);
        this.setPowerMax(energies['A-R+']);
        this.setPowerMax(energies['A-R-']);
    }
};

CommandBinaryBuffer.prototype.getTariffsPowerMax = function (): TTariffsPowerMax {
    const energyFlags = this.getUint8();
    const tariffFlags = this.getUint8();
    const tariffs: TTariffsPowerMax = new Array(TARIFF_NUMBER).fill(null);

    for ( let index = 0; index < TARIFF_NUMBER; index++ ) {
        if ( tariffFlags & getAPlusTariffBit(index) ) {
            tariffs[index] = this.getAPlusTariffPowerMax(energyFlags);
        }
    }

    for ( let index = 0; index < TARIFF_NUMBER; index++ ) {
        if ( tariffFlags & getAMinusTariffBit(index) ) {
            tariffs[index] = {...tariffs[index], ...this.getAMinusTariffPowerMax(energyFlags)};
        }
    }

    return tariffs;
};

CommandBinaryBuffer.prototype.setTariffsPowerMax = function ( tariffs: TTariffsPowerMax ) {
    let energiesFlags = 0;
    let tariffsFlags = 0;

    tariffs.forEach( (tariff, index) => {
        if ( tariff ) {
            energiesFlags |= getEnergiesFlags(tariff);
            tariffsFlags |= getTariffEnergiesFlag(index, tariff);
        }
    });

    this.setUint8(energiesFlags);
    this.setUint8(tariffsFlags);

    tariffs.forEach(tariff => this.setAPlusTariffPowerMax(tariff));
    tariffs.forEach(tariff => this.setAMinusTariffPowerMax(tariff));
};


export default CommandBinaryBuffer;
