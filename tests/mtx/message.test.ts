/* eslint-disable object-curly-newline */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as message from '../../src/mtx/message.js';
import Command from '../../src/mtx/Command.js';
import * as downlinkCommands from '../../src/mtx/commands/downlink/index.js';
import * as uplinkCommands from '../../src/mtx/commands/uplink/index.js';
import getHexFromBytes from '../../src/utils/getHexFromBytes.js';
import getBytesFromHex from '../../src/utils/getBytesFromHex.js';
import * as accessLevels from '../../src/mtx/constants/accessLevels.js';
import * as frameTypes from '../../src/mtx/constants/frameTypes.js';
import * as directions from '../../src/mtx/constants/directions.js';


interface IMessage {
    name: string,
    hex: string,
    frameHex: string,
    messageId: number,
    accessLevel: number,
    direction: number,
    commands: Array<Command>,
    lrc: number,
    frameType: number,
    source: Uint8Array,
    destination: Uint8Array,
    crc: Uint8Array
}

type TMessageList = Array<IMessage>;

const aesKey = new Uint8Array([...Array(16).keys()]);

const downlinkMessages: TMessageList = [
    {
        name: 'one read-only encrypted command',
        hex: '0a 13 d0 90 cc 73 5e 80 e4 35 0e 0a a6 40 0e 3e 63 7c',
        frameHex: '7e 50 aa aa ff ff 0a 7d 33 d0 90 cc 73 5e 80 e4 35 0e 0a a6 40 0e 3e 63 7c 38 1f 7e',
        messageId: 10,
        accessLevel: accessLevels.READ_ONLY,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.TurnRelayOn()
        ],
        lrc: 0x5e,
        crc: new Uint8Array([0x38, 0x1f]),
        frameType: frameTypes.DATA_REQUEST,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'two read-only encrypted commands',
        hex: '0a 13 66 82 dd f1 e5 58 9b 25 8f c4 dc 28 fc 87 ed 14',
        frameHex: '7e 50 a1 a1 f1 f1 0a 7d 33 66 82 dd f1 e5 58 9b 25 8f c4 dc 28 fc 87 ed 14 62 d8 7e',
        messageId: 10,
        accessLevel: accessLevels.READ_ONLY,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.TurnRelayOn(),
            new downlinkCommands.TurnRelayOff()
        ],
        lrc: 0x47,
        crc: new Uint8Array([0x62, 0xd8]),
        frameType: frameTypes.DATA_REQUEST,
        source: new Uint8Array([0xf1, 0xf1]),
        destination: new Uint8Array([0xa1, 0xa1])
    },
    {
        name: 'many read-only encrypted commands',
        hex: '0a 13 40 3c 61 2c e6 56 3e d5 b8 f1 26 62 2a a7 e1 66 be 89 ba 1c 74 fa 1d 50 af eb 39 5f fe 24 27 bd',
        frameHex: '7e 50 a1 a1 f1 f1 0a 7d 33 40 3c 61 2c e6 56 3e d5 b8 f1 26 62 2a a7 e1 66 be 89 ba 1c 74 fa 1d 50 af eb 39 5f fe 24 27 bd fc 35 7e',
        messageId: 10,
        accessLevel: accessLevels.READ_ONLY,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.TurnRelayOn(),
            new downlinkCommands.TurnRelayOn(),
            new downlinkCommands.TurnRelayOn(),
            new downlinkCommands.TurnRelayOn(),
            new downlinkCommands.TurnRelayOn(),
            new downlinkCommands.TurnRelayOn(),
            new downlinkCommands.TurnRelayOn()
        ],
        lrc: 0x5e,
        crc: new Uint8Array([0xfc, 0x35]),
        frameType: frameTypes.DATA_REQUEST,
        source: new Uint8Array([0xf1, 0xf1]),
        destination: new Uint8Array([0xa1, 0xa1])
    },
    {
        name: 'one unencrypted command',
        hex: '0b 10 10 18 00 00 5d',
        frameHex: '7e 50 a2 a3 f2 f3 0b 10 10 18 00 00 5d 3c d4 7e',
        messageId: 11,
        accessLevel: accessLevels.UNENCRYPTED,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.TurnRelayOn()
        ],
        lrc: 0x5d,
        crc: new Uint8Array([0x3c, 0xd4]),
        frameType: frameTypes.DATA_REQUEST,
        source: new Uint8Array([0xf2, 0xf3]),
        destination: new Uint8Array([0xa2, 0xa3])
    },
    {
        name: 'two unencrypted commands',
        hex: '0b 10 10 18 00 19 00 00 44',
        frameHex: '7e 50 a3 a4 f3 f4 0b 10 10 18 00 19 00 00 44 c3 d4 7e',
        messageId: 11,
        accessLevel: accessLevels.UNENCRYPTED,
        direction: directions.DOWNLINK,
        commands: [
            new downlinkCommands.TurnRelayOn(),
            new downlinkCommands.TurnRelayOff()
        ],
        lrc: 0x44,
        crc: new Uint8Array([0xc3, 0xd4]),
        frameType: frameTypes.DATA_REQUEST,
        source: new Uint8Array([0xf3, 0xf4]),
        destination: new Uint8Array([0xa3, 0xa4])
    }
];

const uplinkMessages: TMessageList = [
    {
        name: 'one read-only encrypted command',
        hex: '0a 13 d0 90 cc 73 5e 80 e4 35 0e 0a a6 40 0e 3e 63 7c',
        frameHex: '7e 51 aa aa ff ff 0a 7d 33 d0 90 cc 73 5e 80 e4 35 0e 0a a6 40 0e 3e 63 7c f1 96 7e',
        messageId: 10,
        accessLevel: accessLevels.READ_ONLY,
        direction: directions.UPLINK,
        commands: [
            new uplinkCommands.TurnRelayOnResponse()
        ],
        lrc: 0x5e,
        crc: new Uint8Array([0xf1, 0x96]),
        frameType: frameTypes.DATA_RESPONSE,
        source: new Uint8Array([0xff, 0xff]),
        destination: new Uint8Array([0xaa, 0xaa])
    },
    {
        name: 'two unencrypted commands',
        hex: '0b 10 10 18 00 18 00 00 45',
        frameHex: '7e 51 a3 a4 f3 f4 0b 10 10 18 00 18 00 00 45 1b a7 7e',
        messageId: 11,
        accessLevel: accessLevels.UNENCRYPTED,
        direction: directions.UPLINK,
        commands: [
            new uplinkCommands.TurnRelayOnResponse(),
            new uplinkCommands.TurnRelayOnResponse()
        ],
        lrc: 0x45,
        crc: new Uint8Array([0x1b, 0xa7]),
        frameType: frameTypes.DATA_RESPONSE,
        source: new Uint8Array([0xf3, 0xf4]),
        destination: new Uint8Array([0xa3, 0xa4])
    },
    {
        name: 'many unencrypted commands',
        hex: '0c 10 10 18 00 18 00 18 00 18 00 18 00 18 00 18 00 18 00 00 45',
        frameHex: '7e 51 a3 a4 f3 f4 0c 10 10 18 00 18 00 18 00 18 00 18 00 18 00 18 00 18 00 00 45 38 67 7e',
        messageId: 12,
        accessLevel: accessLevels.UNENCRYPTED,
        direction: directions.UPLINK,
        commands: [
            new uplinkCommands.TurnRelayOnResponse(),
            new uplinkCommands.TurnRelayOnResponse(),
            new uplinkCommands.TurnRelayOnResponse(),
            new uplinkCommands.TurnRelayOnResponse(),
            new uplinkCommands.TurnRelayOnResponse(),
            new uplinkCommands.TurnRelayOnResponse(),
            new uplinkCommands.TurnRelayOnResponse(),
            new uplinkCommands.TurnRelayOnResponse()
        ],
        lrc: 0x45,
        crc: new Uint8Array([0x38, 0x67]),
        frameType: frameTypes.DATA_RESPONSE,
        source: new Uint8Array([0xf3, 0xf4]),
        destination: new Uint8Array([0xa3, 0xa4])
    }
];


const checkMessage = ( messageParams: IMessage ) => {
    const {hex, messageId, accessLevel, direction, commands, lrc} = messageParams;
    const {frameHex, frameType, source, destination, crc} = messageParams;
    const messageBytes = message.toBytes(commands, {messageId, aesKey, accessLevel});
    const messageData = message.fromHex(hex, {aesKey, direction});
    const frame = message.toFrame(messageBytes, {frameType, source, destination});
    const frameMessageData = message.fromFrame(getBytesFromHex(frameHex), {aesKey});

    expect(getHexFromBytes(messageBytes)).toEqual(hex);
    expect(messageData.lrc).toEqual(lrc);
    expect(messageData.messageId).toEqual(messageId);
    expect(messageData.accessLevel).toEqual(accessLevel);
    expect(messageData.commands.map(item => item.command)).toStrictEqual(commands);
    expect(getHexFromBytes(frame)).toEqual(frameHex);
    expect(frameMessageData.crc).toStrictEqual(crc);
    expect(frameMessageData.source).toStrictEqual(source);
    expect(frameMessageData.destination).toStrictEqual(destination);
    expect(frameMessageData.frameType).toStrictEqual(frameType);
    expect(messageData.commands).toStrictEqual(frameMessageData.commands);
};


describe('downlink messages', () => {
    downlinkMessages.forEach(messageData => {
        test(messageData.name, () => {
            checkMessage(messageData);
        });
    });
});

describe('uplink messages', () => {
    uplinkMessages.forEach(messageData => {
        test(messageData.name, () => {
            checkMessage(messageData);
        });
    });
});
