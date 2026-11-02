/// <reference types="node" />

import path from 'path';
import ts from 'typescript';
import {expect, test} from '@jest/globals';


// Check the emitted public declarations with strict null checking, without changing
// the repository's compiler settings or applying strict checking to implementation files.
test('only archive readings accept null in the public API', () => {
    const projectRoot = path.resolve(__dirname, '../..');
    const virtualRoot = path.join(projectRoot, 'tests/analog/typecheck');
    const commands = [
        'current', 'currentMc', 'hour', 'hourMc', 'hourMcEx',
        'getArchiveDays', 'getArchiveHours', 'getArchiveDaysMc',
        'getExAbsArchiveDaysMc', 'getArchiveHoursMc', 'getExAbsArchiveHoursMc', 'getArchiveHoursMcEx'
    ];
    const files = new Map<string, string>();
    const emitProgram = ts.createProgram(
        commands.map(name => path.join(projectRoot, `src/analog/commands/uplink/${name}.ts`)),
        {
            target: ts.ScriptTarget.ES2020,
            module: ts.ModuleKind.NodeNext,
            moduleResolution: ts.ModuleResolutionKind.NodeNext,
            declaration: true,
            emitDeclarationOnly: true,
            strict: false,
            skipLibCheck: true,
            esModuleInterop: true,
            rootDir: path.join(projectRoot, 'src'),
            outDir: path.join(virtualRoot, 'dist')
        }
    );
    const emitted = emitProgram.emit(undefined, (fileName, text) => files.set(path.normalize(fileName), text));

    expect(ts.getPreEmitDiagnostics(emitProgram).concat(emitted.diagnostics)).toEqual([]);

    const consumer = path.join(virtualRoot, 'consumer.mts');
    const imports = commands.map(name => `import * as ${name} from './dist/analog/commands/uplink/${name}.js';`);
    const assertions: Array<string> = [];
    const readingFields: Record<string, string> = {
        current: 'value',
        hour: 'counter.value',
        getArchiveDays: 'dayList[0].value',
        getArchiveHours: 'counter.value',
        getArchiveDaysMc: 'channelList[0].dayList[0]',
        getExAbsArchiveDaysMc: 'channelList[0].dayList[0]'
    };

    for ( const name of ['current', 'currentMc', 'hour', 'hourMc', 'hourMcEx'] ) {
        const field = readingFields[name] || 'channelList[0].value';

        assertions.push(`const ${name}Value: number = ${name}.fromBytes([]).${field};`);
        assertions.push(`const ${name}Input = ${name}.fromBytes([]);`);
        assertions.push(`// @ts-expect-error live readings cannot be null
${name}Input.${field} = null;`);
    }

    for ( const name of commands.filter(command => command.startsWith('get')) ) {
        const field = readingFields[name] || 'channelList[0].value';

        assertions.push(`const ${name}Input: Parameters<typeof ${name}.toBytes>[0] = ${name}.fromBytes([]);`);
        assertions.push(`${name}Input.${field} = null;`);
        assertions.push(`${name}Input.${field} = 0;`);
        assertions.push(`const ${name}Value: number | null = ${name}.fromBytes([]).${field};`);
        assertions.push(`// @ts-expect-error archive readings may be null
const ${name}Number: number = ${name}.fromBytes([]).${field};`);
    }

    for ( const name of ['hour', 'getArchiveHours', 'hourMc', 'hourMcEx', 'getArchiveHoursMc', 'getExAbsArchiveHoursMc', 'getArchiveHoursMcEx'] ) {
        const field = name === 'hour' || name === 'getArchiveHours' ? 'diff[0].value' : 'channelList[0].diff[0]';

        assertions.push(`const ${name}Diff: number = ${name}.fromBytes([]).${field};`);
        assertions.push(`// @ts-expect-error differences cannot be null
${name}.fromBytes([]).${field} = null;`);
    }

    assertions.push(`
import type {IBinaryBuffer} from './dist/utils/binary/BinaryBuffer.js';
import * as binary from './dist/analog/utils/binary/buffer.js';
declare const buffer: IBinaryBuffer;
const missing = {isMagneticInfluence: false, value: null};
binary.setLegacyCounter(buffer, missing, 0, true);
// @ts-expect-error the default helper mode only accepts numeric readings
binary.setLegacyCounter(buffer, missing);
// @ts-expect-error selecting archive types requires an explicit archive flag
binary.setLegacyCounter<true>(buffer, missing);
// @ts-expect-error explicit live mode only accepts numeric readings
binary.setLegacyCounter(buffer, missing, 0, false);
const live: number = binary.getLegacyCounter(buffer).value;
const absent: number | null = binary.getLegacyCounter(buffer, 0, true).value;
// @ts-expect-error archive mode returns a nullable reading
const invalid: number = binary.getLegacyCounter(buffer, 0, true).value;
`);
    assertions.push(`
declare const archiveMode: boolean;
const numeric = {isMagneticInfluence: false, value: 0};
const missingChannel = {index: 1, value: null, diff: [0]};
const numericChannel = {index: 1, value: 0, diff: [0]};
const missingHour = {startTime2000: 756604800, counter: missing, diff: [numeric]};
const numericHour = {startTime2000: 756604800, counter: numeric, diff: [numeric]};
const missingExtended = {startTime2000: 756604800, hour: 0, hours: 1, channelList: [missingChannel]};
const numericExtended = {startTime2000: 756604800, hour: 0, hours: 1, channelList: [numericChannel]};
`);

    const setters = [
        {name: 'setLegacyCounter', prefix: 'buffer, ', missing: 'missing, 0', numeric: 'numeric, 0'},
        {name: 'setLegacyHourCounterWithDiff', prefix: 'buffer, ', missing: 'missingHour', numeric: 'numericHour'},
        {name: 'setChannelsValuesWithHourDiff', prefix: 'buffer, 1, 756604800, ', missing: '[missingChannel]', numeric: '[numericChannel]'},
        {name: 'setChannelsValuesWithHourDiffExtended', prefix: 'buffer, ', missing: 'missingExtended', numeric: 'numericExtended'}
    ];

    for ( const {name, prefix, missing, numeric} of setters ) {
        assertions.push(`binary.${name}(${prefix}${missing}, true);`);
        assertions.push(`binary.${name}(${prefix}${numeric}, archiveMode);`);
        assertions.push(`if (archiveMode) { binary.${name}(${prefix}${missing}, archiveMode); }`);

        for ( const flag of ['', ', false', ', archiveMode'] ) {
            assertions.push(`// @ts-expect-error nullable data requires a definitely true archive flag
binary.${name}(${prefix}${missing}${flag});`);
        }
    }

    assertions.push(`
// @ts-expect-error archive hourly differences remain numeric
binary.setLegacyHourCounterWithDiff(buffer, {...missingHour, diff: [missing]}, true);
// @ts-expect-error archive multichannel differences remain numeric
binary.setChannelsValuesWithHourDiff(buffer, 1, 756604800, [{...missingChannel, diff: [null]}], true);
// @ts-expect-error extended archive differences remain numeric
binary.setChannelsValuesWithHourDiffExtended(buffer, {...missingExtended, channelList: [{...missingChannel, diff: [null]}]}, true);
const uncertainLegacy: number | null = binary.getLegacyCounter(buffer, 0, archiveMode).value;
const uncertainHour: number | null = binary.getLegacyHourCounterWithDiff(buffer, archiveMode).counter.value;
const uncertainChannels: number | null = binary.getChannelsValuesWithHourDiff(buffer, archiveMode).channelList[0].value;
const uncertainExtended: number | null = binary.getChannelsValuesWithHourDiffExtended(buffer, archiveMode).channelList[0].value;
// @ts-expect-error unknown mode may return a missing reading
const uncertainNumber: number = binary.getLegacyCounter(buffer, 0, archiveMode).value;
`);
    files.set(consumer, imports.concat(assertions).join('\n'));

    const options: ts.CompilerOptions = {
        target: ts.ScriptTarget.ES2020,
        module: ts.ModuleKind.NodeNext,
        moduleResolution: ts.ModuleResolutionKind.NodeNext,
        strictNullChecks: true,
        skipLibCheck: true,
        noEmit: true,
        types: []
    };
    const host = ts.createCompilerHost(options);
    const {readFile, fileExists, directoryExists} = host;

    host.readFile = fileName => files.get(path.normalize(fileName)) ?? readFile(fileName);
    host.fileExists = fileName => files.has(path.normalize(fileName)) || fileExists(fileName);
    host.directoryExists = directory => [...files.keys()].some(fileName => fileName.startsWith(`${path.normalize(directory)}${path.sep}`))
        || !!directoryExists?.(directory);

    const program = ts.createProgram([consumer], options, host);
    const diagnostics = ts.getPreEmitDiagnostics(program).map(diagnostic => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));

    expect(diagnostics).toEqual([]);
}, 30000);
