import invertObject from '../../utils/invertObject.js';


export const RATE_2400 = 2400;
export const RATE_9600 = 9600;

export const valueToRate = {
    rs485orTwi: {
        0: RATE_9600,
        2: RATE_2400,
        4: RATE_9600
    },
    optoport: {
        0: RATE_2400,
        2: RATE_2400,
        4: RATE_9600
    }
};

export const rateToValue = {
    rs485orTwi: invertObject(valueToRate.rs485orTwi),
    optoport: invertObject(valueToRate.optoport)
};
