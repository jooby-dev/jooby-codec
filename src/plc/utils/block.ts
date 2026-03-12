import * as types from '../types.js';
import {TMessage} from '../../mtx1/message/types.js';
import {UNENCRYPTED} from '../../mtx1/constants/accessLevels.js';
import BinaryBuffer, {IBinaryBuffer} from '../../utils/binary/BinaryBuffer.js';
import {validateRangeCommandPayload} from '../../utils/validateCommandPayload.js';


// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as subsystemIds from '../constants/subsystemIds.js';


export interface IBlockHeaderBase {
    id: types.TUint16,
    isDownlink: boolean,
    shortAddress: types.TUint16,
    hop: types.TUint8,
    isEndDevice: boolean,
}

export interface IPingBlockHeader extends IBlockHeaderBase {
    kind: 'ping'
}

export interface ISubsystemBlock extends IBlockHeaderBase {
    kind: 'subsystem',
    /** One of the {@link subsystemIds | subsystem IDs}. */
    subsystemId: types.TUint8,
    dataAttributes: types.TUint8,
    accessLevel: types.TAccessLevel,
    messageId: types.TUint8,
    payload: types.TBytes,
    message?: TMessage
}

export interface IShortAddressBlock extends ISubsystemBlock {
    subsystemId: Exclude<types.TUint8, typeof subsystemIds.LONG_ADDRESS | typeof subsystemIds.MTX_REPORT>
}

export interface IMtxReportBlock extends IShortAddressBlock {
    subsystemId: typeof subsystemIds.MTX_EVENT,
    panTimestamp: types.TUint32
}

export interface ILongAddressBlock extends ISubsystemBlock {
    subsystemId: typeof subsystemIds.LONG_ADDRESS,
    longAddress: types.TBytes,
    /** One of the {@link subsystemIds | subsystem IDs}. */
    commandsSubsystemId: types.TUint8
}

export type IBlock =
    | IPingBlockHeader
    | IShortAddressBlock
    | IMtxReportBlock
    | ILongAddressBlock;


const minimalBlockHeaderSize = 6;


export const fromBytes = ( bytes: types.TBytes ): IBlock => {
    validateRangeCommandPayload('plcBlock', bytes, {min: minimalBlockHeaderSize});

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    const id = buffer.getUint16();
    const shortAddressBytes = buffer.getBytes(2);
    const isDownlink = (shortAddressBytes[0] & 0x80) !== 0;
    const shortAddress = ((shortAddressBytes[0] & 0x7f) << 4) | (shortAddressBytes[1] >> 4);
    const hop = shortAddressBytes[1] & 0x0f;
    const sizeByte = buffer.getUint8();
    const isEndDevice = (sizeByte & 0x80) !== 0;
    let size = (sizeByte & 0x7f);

    const blockHeader = {
        id,
        isDownlink,
        shortAddress,
        hop,
        isEndDevice
    };

    if ( size === 0 ) {
        return {kind: 'ping', ...blockHeader};
    }

    if ( size < 2 ) {
        throw new Error(`Invalid block: expected payload size ${size} does not match actual payload size ${buffer.bytesLeft}`);
    }

    const isSizeCorrupted: boolean = size > buffer.bytesLeft;
    const subsystemByte = buffer.getUint8();
    const messageIdByte = buffer.getUint8();

    size -= 2; // remove subsystem byte and messageId byte from size

    const result = {
        kind: 'subsystem',
        ...blockHeader,
        subsystemId: subsystemByte >> 4,
        dataAttributes: subsystemByte & 0x0f,
        accessLevel: (messageIdByte >> 6) & 0x03,
        messageId: messageIdByte & 0x3f
    };

    if ( isSizeCorrupted ) {
        if ( !(result.subsystemId === subsystemIds.LONG_ADDRESS && result.accessLevel === UNENCRYPTED) ) {
            throw new Error(`Invalid block: expected payload size ${size} does not match actual payload size ${buffer.bytesLeft}`);
        }

        // NOTE: workaround for legacy devices (bug):
        // older firmware drops blocks whose length matches exactly.
    }

    switch ( result.subsystemId ) {
        case subsystemIds.MTX_REPORT: {
            const panTimestamp = buffer.getUint32();

            return {
                ...result,
                panTimestamp,
                payload: buffer.getBytes(size - 4) // 4 bytes for pan timestamp
            } as IMtxReportBlock;
        }

        case subsystemIds.LONG_ADDRESS: {
            const longAddress = buffer.getBytes(8);
            const commandsSubsystemId = buffer.getUint8();
            let payload: types.TBytes;

            if ( result.accessLevel === UNENCRYPTED) {
                payload = buffer.getBytesLeft();
            } else {
                payload = buffer.getBytes(size - 9); // 8 bytes for long address, 1 byte for commands subsystem id
            }

            return {
                ...result,
                longAddress,
                commandsSubsystemId,
                payload
            } as ILongAddressBlock;
        }

        default:
            return {
                ...result,
                payload: buffer.getBytes(size)
            } as IShortAddressBlock;
    }
};

const baseBlockHeaderToBytes = ( parameters: IBlockHeaderBase, payloadSize: types.TUint8 = 0 ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(minimalBlockHeaderSize, false);

    buffer.setUint16(parameters.id);
    buffer.setUint8((parameters.isDownlink ? 0x80 : 0x00) | ((parameters.shortAddress >> 4) & 0x7f));
    buffer.setUint8(((parameters.shortAddress & 0x0f) << 4) | (parameters.hop & 0x0f));
    buffer.setUint8((parameters.isEndDevice ? 0x80 : 0x00) | (payloadSize & 0x7f));

    return buffer.getBytesToOffset();
};


export const toBytes = ( parameters: IBlock ): types.TBytes => {
    if ( parameters.kind === 'ping' ) {
        return baseBlockHeaderToBytes(parameters);
    }

    const buffer: IBinaryBuffer = new BinaryBuffer(minimalBlockHeaderSize, false);
    let corruptedBlockSize = 0;

    buffer.setUint8((parameters.subsystemId << 4) | (parameters.dataAttributes & 0x0f));
    buffer.setUint8(((parameters.accessLevel & 0x03) << 6) | (parameters.messageId & 0x3f));

    if ( parameters.subsystemId === subsystemIds.MTX_REPORT ) {
        buffer.setUint32((parameters as IMtxReportBlock).panTimestamp);
    } else if ( parameters.subsystemId === subsystemIds.LONG_ADDRESS ) {
        if ( parameters.isDownlink && parameters.accessLevel === UNENCRYPTED ) {
            // NOTE: workaround for legacy devices (bug):
            // older firmware drops blocks whose length matches exactly.
            const longAddressAndSubsystemSize = 8 + 1;
            const suitableBlockSize = 33;

            corruptedBlockSize = longAddressAndSubsystemSize + suitableBlockSize;
        }
        buffer.setBytes((parameters as ILongAddressBlock).longAddress);
        buffer.setUint8((parameters as ILongAddressBlock).commandsSubsystemId & 0x0f);
    }

    buffer.setBytes(parameters.payload);

    return [
        ...baseBlockHeaderToBytes(
            parameters,
            corruptedBlockSize === 0 ? buffer.data.length : corruptedBlockSize
        ),
        ...buffer.getBytesToOffset()
    ];
};
