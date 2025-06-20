import {TBytes} from '../../types.js';


const shortCommandMask = 0xe0;
const extraCommandMask = 0x1f;


export const fromBytes = ( bytes: TBytes ) => {
    if ( bytes.length === 0 ) {
        throw new Error('Invalid buffer size');
    }

    const header = {
        shortCode: bytes[0] & shortCommandMask,
        extraCode: bytes[0] & extraCommandMask
    };

    if ( header.shortCode !== 0 ) {
        // short header
        return {
            headerSize: 1,
            commandId: bytes[0] & (~header.extraCode),
            commandSize: header.extraCode
        };
    }

    if ( header.extraCode === extraCommandMask ) {
        // extra command
        if ( bytes.length < 3 ) {
            throw new Error('Invalid buffer size');
        }
        return {
            headerSize: 3,
            commandId: (bytes[1] << 8) | extraCommandMask,
            commandSize: bytes[2]
        };
    }

    if ( bytes.length < 2 ) {
        throw new Error('Invalid buffer size');
    }

    return {
        headerSize: 2,
        commandId: header.extraCode,
        commandSize: bytes[1]
    };
};

export const toBytes = ( commandId: number, commandSize: number ): TBytes => {
    if ( (commandId & extraCommandMask) === 0 ) {
        if ( commandSize > extraCommandMask ) {
            throw new Error(`Wrong command id/size. Id: ${commandId}, size: ${commandSize}.`);
        }

        return [commandId | commandSize];
    }

    if ( commandId > extraCommandMask ) {
        return [
            extraCommandMask,
            (commandId >> 8),
            commandSize
        ];
    }

    return [
        commandId,
        commandSize
    ];
};
