import {TEnergyType} from '../types.js';
import {IEnergies} from './binary/buffer.js';
import {A_MINUS_R_PLUS_R_MINUS, A_PLUS_R_PLUS_R_MINUS} from '../constants/energyTypes.js';


interface IObisBase {
    gType: string;
    rType?: string;
}


const OBIS_BASES: Record<string, Record<number, IObisBase>> = {
    wh: {
        [A_PLUS_R_PLUS_R_MINUS]: {gType: '1.8', rType: '1.8'},
        [A_MINUS_R_PLUS_R_MINUS]: {gType: '2.8'}
    },
    vari: {
        [A_PLUS_R_PLUS_R_MINUS]: {gType: '5.8', rType: '3.8'},
        [A_MINUS_R_PLUS_R_MINUS]: {gType: '6.8'}
    },
    vare: {
        [A_PLUS_R_PLUS_R_MINUS]: {gType: '8.8', rType: '4.8'},
        [A_MINUS_R_PLUS_R_MINUS]: {gType: '7.8'}
    }
};


export default ( energies: IEnergies, isGreen: boolean, energyType: TEnergyType ) => {
    const result: Record<string, number> = {};

    Object.keys(energies).forEach(energyCategory => {
        const obisBase = isGreen ? OBIS_BASES[energyCategory][energyType].gType : OBIS_BASES[energyCategory][energyType].rType;

        energies[energyCategory as keyof IEnergies].forEach((energy, index) => {
            if ( energy !== null && energy !== undefined ) {
                result[`${obisBase}.${index + 1}`] = energy;
            }
        });
    });

    return result;
};
