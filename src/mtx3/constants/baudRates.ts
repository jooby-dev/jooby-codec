import invertObject from '../../utils/invertObject.js';


export const RATE_2400 = 2400;
export const RATE_9600 = 9600;

export const valueToRate = {
    plc: {
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
    plc: invertObject(valueToRate.plc),
    optoport: invertObject(valueToRate.optoport)
};
