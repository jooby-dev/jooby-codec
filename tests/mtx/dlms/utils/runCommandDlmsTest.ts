/* eslint-disable */

interface IDlmsCommandExample {
    name: string,
    parameters: object,
    dlms: object
}


const testCommand = ( command: any, {parameters, dlms}: IDlmsCommandExample ) => {
    const json = command.toJson(parameters, {dlms: true});

    expect(dlms).toStrictEqual(JSON.parse(json));
};


export const runCommandDlmsTest = ( command: any, examples: Array<IDlmsCommandExample> ) => {
    describe(`${command.name} dlms tests`, () => {
        examples.forEach(example => test(`${example.name}`, () => testCommand(command, example)));
    });
};
