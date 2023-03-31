import * as header from '../src/utils/header.js';
import getBytesFromHex from '../src/utils/getBytesFromHex.js';


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
    const headerDataHex = header.toHex(id, size);
    const headerInfo = header.fromBytes(headerData);
    const headerInfoFromHex = header.fromHex(headerDataHex);

    expect(headerData).toBeInstanceOf(Uint8Array);
    expect(headerData).toStrictEqual(getBytesFromHex(hex));
    expect(headerDataHex).toStrictEqual(hex);
    expect(headerInfo.headerSize).toBe(headerData.length);
    expect(headerInfo.commandId).toBe(id);
    expect(headerInfo.commandSize).toBe(size);
    expect(headerInfo).toStrictEqual(headerInfoFromHex);
};


describe('encode/decode command headers', () => {
    test('downlink commands', () => {
        downlinkCommands.forEach(checkHeader);
    });

    test('uplink commands', () => {
        uplinkCommands.forEach(checkHeader);
    });
});
