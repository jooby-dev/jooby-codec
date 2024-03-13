import BinaryBuffer from '../utils/BinaryBuffer.js';
import * as bitSet from '../utils/bitSet.js';


export interface IDate {
    year: number,
    month: number,
    day: number
}

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

type THalfhoursEnergy = Array<number | undefined>;

export type THalfhoursEnergies = IEnergies<THalfhoursEnergy>;

export type TTariffsEnergies = Array<IEnergies>;

export type TTariffsPowerMax = Array<IEnergies<IPowerMax>>;

export const TARIFF_NUMBER = 4;


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
    const booleanObject = Object.fromEntries(Object.entries(energies).map(([name, value]) => [name, !!value]));

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


/**
 * Command specific byte array manipulation.
 */
class CommandBinaryBuffer extends BinaryBuffer {
    constructor ( dataOrLength: Uint8Array | number | string ) {
        // force BE for all numbers
        super(dataOrLength, false);
    }

    getDate (): IDate {
        const datePart1 = this.getUint8();
        const datePart2 = this.getUint8();

        return {
            year: datePart1 >> 1,
            month: ((datePart1 & 1) << 4) | (datePart2 >> 5),
            day: datePart2 & 0x1f
        };
    }

    setDate ( {year, month, day}: IDate ) {
        const date1 = (year << 1) | (month >> 3);
        const date2 = ((month & 0x03) << 5) | (day & 0x1f);

        this.setUint8(date1);
        this.setUint8(date2);
    }

    getEnergiesFlags (): TEnergiesFlags {
        const byte = this.getUint8();

        return (bitSet.toObject(energiesMask, byte) as unknown) as TEnergiesFlags;
    }

    setEnergiesFlags <T>( energies: IEnergies<T> ) {
        this.setUint8(
            getEnergiesFlags(energies)
        );
    }

    getHalfhoursEnergy ( halfhoursNumber: number ): THalfhoursEnergy {
        const halfhours = [];

        for ( let index = 0; index < halfhoursNumber; index++ ) {
            const value = this.getUint16();

            halfhours.push(value === UNDEFINED_ENERGY_VALUE ? undefined : value);
        }

        return halfhours;
    }

    setHalfhoursEnergy ( halfhours: THalfhoursEnergy | undefined ) {
        if ( halfhours ) {
            for ( let index = 0; index < halfhours.length; index++ ) {
                const value = halfhours[index];

                this.setUint16(value === undefined ? UNDEFINED_ENERGY_VALUE : value);
            }
        }
    }

    getHalfhoursEnergies ( energiesFlags: TEnergiesFlags, halfhoursNumber: number ): THalfhoursEnergies {
        const energies: THalfhoursEnergies = {};

        if ( energiesFlags['A+'] ) {
            energies['A+'] = this.getHalfhoursEnergy(halfhoursNumber);
        }

        if ( energiesFlags['A+R+'] ) {
            energies['A+R+'] = this.getHalfhoursEnergy(halfhoursNumber);
        }

        if ( energiesFlags['A+R-'] ) {
            energies['A+R-'] = this.getHalfhoursEnergy(halfhoursNumber);
        }

        if ( energiesFlags['A-'] ) {
            energies['A-'] = this.getHalfhoursEnergy(halfhoursNumber);
        }

        if ( energiesFlags['A-R+'] ) {
            energies['A-R+'] = this.getHalfhoursEnergy(halfhoursNumber);
        }

        if ( energiesFlags['A-R-'] ) {
            energies['A-R-'] = this.getHalfhoursEnergy(halfhoursNumber);
        }

        return energies;
    }

    setHalfhoursEnergies ( energies: THalfhoursEnergies ) {
        this.setHalfhoursEnergy(energies['A+']);
        this.setHalfhoursEnergy(energies['A+R+']);
        this.setHalfhoursEnergy(energies['A+R-']);
        this.setHalfhoursEnergy(energies['A-']);
        this.setHalfhoursEnergy(energies['A-R+']);
        this.setHalfhoursEnergy(energies['A-R-']);
    }

    getAPlusTariffEnergies ( energyFlags: number ): IEnergies {
        const energies: IEnergies = {};

        if ( energyFlags & energiesMask['A+'] ) {
            energies['A+'] = this.getUint16();
        }

        if ( energyFlags & energiesMask['A+R+'] ) {
            energies['A+R+'] = this.getUint16();
        }

        if ( energyFlags & energiesMask['A+R-'] ) {
            energies['A+R-'] = this.getUint16();
        }

        return energies;
    }

    setAPlusTariffEnergies ( energies: IEnergies | undefined ) {
        if ( energies ) {
            if ( energies['A+'] ) {
                this.setUint16(energies['A+']);
            }

            if ( energies['A+R+'] ) {
                this.setUint16(energies['A+R+']);
            }

            if ( energies['A+R-'] ) {
                this.setUint16(energies['A+R-']);
            }
        }
    }

    getAMinusTariffEnergies ( energyFlags: number ): IEnergies {
        const energies: IEnergies = {};

        if ( energyFlags & energiesMask['A-'] ) {
            energies['A-'] = this.getUint16();
        }

        if ( energyFlags & energiesMask['A-R+'] ) {
            energies['A-R+'] = this.getUint16();
        }

        if ( energyFlags & energiesMask['A-R-'] ) {
            energies['A-R-'] = this.getUint16();
        }

        return energies;
    }

    setAMinusTariffEnergies ( energies: IEnergies | undefined ) {
        if ( energies ) {
            if ( energies['A-'] ) {
                this.setUint16(energies['A-']);
            }

            if ( energies['A-R+'] ) {
                this.setUint16(energies['A-R+']);
            }

            if ( energies['A-R-'] ) {
                this.setUint16(energies['A-R-']);
            }
        }
    }

    getTariffsEnergies (): TTariffsEnergies {
        const energyFlags = this.getUint8();
        const tariffFlags = this.getUint8();
        const tariffs: TTariffsEnergies = [];

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
    }

    setTariffsEnergies ( tariffs: TTariffsEnergies ) {
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
    }

    getPowerMax (): IPowerMax {
        return {
            hours: this.getUint8(),
            minutes: this.getUint8(),
            power: this.getUint32()
        };
    }

    setPowerMax ( value: IPowerMax | undefined ) {
        if ( value ) {
            const {hours, minutes, power} = value;

            this.setUint8(hours);
            this.setUint8(minutes);
            this.setUint32(power);
        }
    }

    getAPlusTariffPowerMax ( energyFlags: number ): IEnergies<IPowerMax> {
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
    }

    setAPlusTariffPowerMax ( energies: IEnergies<IPowerMax> | undefined ) {
        if ( energies ) {
            this.setPowerMax(energies['A+']);
            this.setPowerMax(energies['A+R+']);
            this.setPowerMax(energies['A+R+']);
        }
    }

    getAMinusTariffPowerMax ( energyFlags: number ): IEnergies<IPowerMax> {
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
    }

    setAMinusTariffPowerMax ( energies: IEnergies<IPowerMax> | undefined ) {
        if ( energies ) {
            this.setPowerMax(energies['A-']);
            this.setPowerMax(energies['A-R+']);
            this.setPowerMax(energies['A-R-']);
        }
    }

    getTariffsPowerMax (): TTariffsPowerMax {
        const energyFlags = this.getUint8();
        const tariffFlags = this.getUint8();
        const tariffs: TTariffsPowerMax = [];

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
    }

    setTariffsPowerMax ( tariffs: TTariffsPowerMax ) {
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
    }
}


export default CommandBinaryBuffer;
