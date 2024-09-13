interface IDlmsCommandExample {
    name: string,
    parameters: object,
    dlms: object,
    isGreen?: boolean
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const testCommand = ( command: any, {parameters, dlms, isGreen}: IDlmsCommandExample ) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const json = command.toJson(parameters, {dlms: true, isGreen: isGreen ?? false});

    expect(dlms).toStrictEqual(JSON.parse(json as string));
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const runCommandDlmsTest = ( command: any, examples: Array<IDlmsCommandExample> ) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    describe(`${command.name} dlms tests`, () => {
        examples.forEach(example => test(`${example.name}`, () => testCommand(command, example)));
    });
};
