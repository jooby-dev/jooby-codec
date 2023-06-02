import invertObject from '../../utils/invertObject.js';

export const valueToRate = {
    0: 300,
    1: 600,
    2: 1200,
    3: 2400,
    4: 4800,
    5: 9600,
    6: 14440,
    7: 19200,
    8: 28800,
    9: 38400,
    10: 56000,
    11: 57600,
    12: 115200
};

export const rateToValue = invertObject(valueToRate);
