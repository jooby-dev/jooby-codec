export default ( value: number, decimalPlaces = 4 ) => {
    const places = Math.pow(10, decimalPlaces);

    return Math.round((value * places) * (1 + Number.EPSILON)) / places;
};
