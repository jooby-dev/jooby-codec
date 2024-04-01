import * as header from '../../src/analog/utils/header.js';
import getBytesFromHex from '../../src/utils/getBytesFromHex.js';


interface ICommand {
    id: number,
    size: number,
    hex: string
}

type TCommandList = Array<ICommand>;


const downlinkCommands: TCommandList = [
    {
        // SET_TIME_2000
        id: 0x02,
        size: 5,
        hex: '02 05'
    },
    {
        // GET_LMIC_VERSION
        id: 0x021F,
        size: 8,
        hex: '1f 02 08'
    }
];

const uplinkCommands: TCommandList = [
    {
        // DATA_DAY
        id: 0x20,
        size: 5,
        hex: '25'
    },
    {
        // GET_CURRENT
        id: 0x07,
        size: 8,
        hex: '07 08'
    }
];


const checkHeader = ( {id, size, hex}: ICommand ) => {
    const headerData = header.toBytes(id, size);
    const sampleData = getBytesFromHex(hex);
    const headerInfo = header.fromBytes(headerData);

    expect(headerData).toBeInstanceOf(Array);
    expect(headerData).toStrictEqual(sampleData);
    expect(headerInfo.headerSize).toBe(headerData.length);
    expect(headerInfo.commandId).toBe(id);
    expect(headerInfo.commandSize).toBe(size);
    expect(headerData).toStrictEqual(header.toBytes(headerInfo.commandId, headerInfo.commandSize));
};


describe('downlink commands', () => {
    downlinkCommands.forEach((command, index) => {
        test(`test case #${index}`, () => {
            checkHeader(command);
        });
    });
});

describe('uplink commands', () => {
    uplinkCommands.forEach((command, index) => {
        test(`test case #${index}`, () => {
            checkHeader(command);
        });
    });
});
