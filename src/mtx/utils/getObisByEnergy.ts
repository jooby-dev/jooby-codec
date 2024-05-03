import {A_MINUS_ENERGY_TYPE} from './CommandBinaryBuffer.js';

export default ( energy: number | undefined, tariff: number = 0 ): string => {
    const obis = energy === A_MINUS_ENERGY_TYPE ? '2.8.x' : '1.8.x';

    return obis.replace('x', tariff.toString(10));
};
