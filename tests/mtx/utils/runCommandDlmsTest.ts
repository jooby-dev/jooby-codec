/* eslint-disable */

interface IDlmsCommandExample {
    name: string,
    parameters: object,
    dlms: object
}


const testCommand = ( constructor: any, {parameters, dlms}: IDlmsCommandExample ) => {
    const command = new constructor(parameters);
    const json = command.toJson({dlms: true});

    expect(dlms).toStrictEqual(JSON.parse(json));
};


export const runCommandDlmsTest = ( constructor: any, examples: Array<IDlmsCommandExample> ) => {
    describe(`${constructor.name} dlms tests`, () => {
        examples.forEach(example => test(`${example.name}`, () => testCommand(constructor, example)));
    });
};
