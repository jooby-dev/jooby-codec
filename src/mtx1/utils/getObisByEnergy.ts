import {A_MINUS} from '../constants/energyTypes.js';


export default ( energy: number | undefined, tariff: number = 0 ): string => {
    const obis = energy === A_MINUS ? '2.8.x' : '1.8.x';

    return obis.replace('x', tariff.toString(10));
};
